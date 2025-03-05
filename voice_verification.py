# %%
# This Python 3 environment comes with many helpful analytics libraries installed
# It is defined by the kaggle/python Docker image: https://github.com/kaggle/docker-python
# For example, here's several helpful packages to load

import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)

# Input data files are available in the read-only "../input/" directory
# For example, running this (by clicking run or pressing Shift+Enter) will list all files under the input directory

import os
for dirname, _, filenames in os.walk('/kaggle/input'):
    for filename in filenames:
        print(os.path.join(dirname, filename))

# You can write up to 20GB to the current directory (/kaggle/working/) that gets preserved as output when you create a version using "Save & Run All" 
# You can also write temporary files to /kaggle/temp/, but they won't be saved outside of the current session

# %%
import torch
import torchaudio
import numpy as np
from torch import nn
from torch.utils.data import Dataset, DataLoader
from torchaudio.transforms import MelSpectrogram
import os
from sklearn.model_selection import train_test_split
from tqdm import tqdm
import shutil


class LibriSpeechDataset(Dataset):
    def __init__(self, root_dir, split='train-clean-100', segment_length=32000):  # 2 seconds at 16kHz
        self.root_dir = os.path.join(root_dir, split)
        self.samples = []
        self.speaker_ids = set()
        self.segment_length = segment_length
        
        for speaker_id in os.listdir(self.root_dir):
            speaker_path = os.path.join(self.root_dir, speaker_id)
            if os.path.isdir(speaker_path):
                self.speaker_ids.add(speaker_id)
                for chapter in os.listdir(speaker_path):
                    chapter_path = os.path.join(speaker_path, chapter)
                    if os.path.isdir(chapter_path):
                        for audio_file in os.listdir(chapter_path):
                            if audio_file.endswith('.flac'):
                                self.samples.append({
                                    'path': os.path.join(chapter_path, audio_file),
                                    'speaker_id': speaker_id
                                })
        
        self.speaker_to_idx = {spk: idx for idx, spk in enumerate(sorted(self.speaker_ids))}
        
   
        self.mel_transform = MelSpectrogram(
            sample_rate=16000,
            n_fft=1024,
            win_length=1024,
            hop_length=512,
            n_mels=80
        )

    def load_audio(self, audio_path):
        waveform, sample_rate = torchaudio.load(audio_path)
        
   
        if sample_rate != 16000:
            resampler = torchaudio.transforms.Resample(sample_rate, 16000)
            waveform = resampler(waveform)
        
      
        if waveform.shape[0] > 1:
           # waveform = torch.mean(waveform, dim=0, keepdim=True)
            waveform = waveform[0, :].unsqueeze(0)  # Select first channel instead of averaging channels
        
        return waveform

    def process_waveform(self, waveform):
      
        if waveform.shape[1] > self.segment_length:
           
            start = torch.randint(0, waveform.shape[1] - self.segment_length, (1,))
            waveform = waveform[:, start:start + self.segment_length]
        else:
            
            padding_length = self.segment_length - waveform.shape[1]
            waveform = torch.nn.functional.pad(waveform, (0, padding_length))
        
     
        mel_spec = self.mel_transform(waveform)
        return mel_spec

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        sample = self.samples[idx]
        
        waveform = self.load_audio(sample['path'])
        mel_spec = self.process_waveform(waveform)
        
        return {
            'spectrogram': mel_spec,
            'speaker_id': self.speaker_to_idx[sample['speaker_id']],
            'speaker_id_raw': sample['speaker_id']
        }

class CRNN(nn.Module):
    def __init__(self, embedding_dim=512):
        super(CRNN, self).__init__()
      
        self.conv = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2)
        )
        
   
        self.rnn = nn.GRU(
            input_size=128,
            hidden_size=256,
            num_layers=2,
            batch_first=True,
            bidirectional=True
        )
        
     
        self.embedding = nn.Sequential(
            nn.Linear(512, embedding_dim),
            nn.ReLU(),
            nn.Linear(embedding_dim, embedding_dim),
            nn.LayerNorm(embedding_dim)
        )

    def forward(self, x):
       
        x = self.conv(x)
        
        batch_size, channels, height, width = x.size()
        x = x.permute(0, 2, 3, 1)
        x = x.reshape(batch_size, height * width, channels)
       
        x, _ = self.rnn(x)
        
        x = x[:, -1, :]
        embedding = self.embedding(x)
        
        embedding = torch.nn.functional.normalize(embedding, p=2, dim=1)
        return embedding

def train_model(root_dir, batch_size=32, num_epochs=50, embedding_dim=512):

    dataset = LibriSpeechDataset(root_dir)
    
   
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = torch.utils.data.random_split(
        dataset, [train_size, val_size]
    )
    
   
    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=4
    )
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = CRNN(embedding_dim=embedding_dim).to(device)
    
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    
    best_loss = float('inf')
    for epoch in range(num_epochs):
        model.train()
        total_loss = 0
        
        progress_bar = tqdm(train_loader, desc=f'Epoch {epoch+1}/{num_epochs}')
        
        for batch in progress_bar:
            specs = batch['spectrogram'].to(device)
            speaker_ids = batch['speaker_id']
            
            embeddings = model(specs)
            
            loss = 0
            for i in range(len(speaker_ids)):
                pos_mask = speaker_ids == speaker_ids[i]
                neg_mask = speaker_ids != speaker_ids[i]
                
                if torch.sum(pos_mask) > 1 and torch.sum(neg_mask) > 0:
                    anchor = embeddings[i]
                    positive = embeddings[pos_mask][1]  
                    negative = embeddings[neg_mask][0] 
                    pos_dist = torch.sum((anchor - positive) ** 2)
                    neg_dist = torch.sum((anchor - negative) ** 2)
                    
                    loss += torch.max(torch.tensor(0.0).to(device),
                                    pos_dist - neg_dist + 0.2)
            
            if loss > 0:
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
                
                total_loss += loss.item()
                progress_bar.set_postfix({'loss': loss.item()})
        
        avg_loss = total_loss / len(train_loader)
        if avg_loss < best_loss:
            best_loss = avg_loss
            torch.save(model.state_dict(), 'best_voice_model.pth')
          

            shutil.move("best_voice_model.pth", "/kaggle/working/best_voice_model.pth")

            
        print(f'Epoch {epoch+1}, Average Loss: {avg_loss:.4f}')
    
    return model


   
if __name__ == "__main__":
    
    librispeech_path = "/kaggle/input/librispeech-training-data/LibriSpeech"
    
    print("Training model...")
    model = train_model(librispeech_path, num_epochs=10)  
   




# %%
class VoiceVerifier:
    def __init__(self, model_path, threshold=0.9):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = CRNN().to(self.device)
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.eval()
        self.threshold = threshold
        
        self.mel_transform = MelSpectrogram(
            sample_rate=16000,
            n_fft=1024,
            win_length=1024,
            hop_length=512,
            n_mels=80
        )
    
    def process_audio(self, audio_path):
        waveform, sample_rate = torchaudio.load(audio_path)
        
        if sample_rate != 16000:
            resampler = torchaudio.transforms.Resample(sample_rate, 16000)
            waveform = resampler(waveform)
        
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)
        
        mel_spec = self.mel_transform(waveform).unsqueeze(0)
        
       
        with torch.no_grad():
            embedding = self.model(mel_spec.to(self.device))
        
        return embedding.cpu()
    
    def verify_voice(self, voice1_path, voice2_path):
       
        embedding1 = self.process_audio("/kaggle/input/samplevoices/ishavoice1.flac")
        embedding2 = self.process_audio("/kaggle/input/samplevoices/ishavoice2.flac")
        
      
        similarity = torch.nn.functional.cosine_similarity(embedding1, embedding2)
        
        return {
            'similarity': similarity.item(),
            'is_same_person': similarity.item() > self.threshold,
            'embedding1':embedding1,
            'embedding2':embedding2
        }


if __name__ == "__main__":
     
    verifier = VoiceVerifier('best_voice_model.pth')
    
    result = verifier.verify_voice(
        'path/to/voice1.wav',
        'path/to/voice2.wav'
    )
    print(f"Embedding1: {result['embedding1'][:5]}...")  # Print first 5 values for brevity
    print(f"Embedding2: {result['embedding2'][:5]}...")
    print(f"Similarity Score: {result['similarity']:.4f}")
    print(f"Same Person: {result['is_same_person']}")

# %%
"""
**For linking with mongoDB use the code below:**
"""

# %%
import torch
import torchaudio
from torchaudio.transforms import MelSpectrogram
from pymongo import MongoClient
import numpy as np

class VoiceVerifier:
    def __init__(self, model_path, threshold=0.9):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = CRNN().to(self.device)
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.eval()
        self.threshold = threshold

        self.mel_transform = MelSpectrogram(
            sample_rate=16000,
            n_fft=1024,
            win_length=1024,
            hop_length=512,
            n_mels=80
        )

        # MongoDB Connection
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["voice_verification"]
        self.collection = self.db["voice_embeddings"]

    def process_audio(self, audio_path):
        waveform, sample_rate = torchaudio.load(audio_path)

        if sample_rate != 16000:
            resampler = torchaudio.transforms.Resample(sample_rate, 16000)
            waveform = resampler(waveform)

        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)

        mel_spec = self.mel_transform(waveform).unsqueeze(0)

        with torch.no_grad():
            embedding = self.model(mel_spec.to(self.device))

        return embedding.cpu().numpy().tolist()  # Convert tensor to list

    def verify_voice(self, voice1_path, voice2_path):
        embedding1 = self.process_audio(voice1_path)
        embedding2 = self.process_audio(voice2_path)

        similarity = torch.nn.functional.cosine_similarity(
            torch.tensor(embedding1), torch.tensor(embedding2)
        )

        #  similarity score -> float -> JSON storage
        similarity_score = similarity.item()

        # Store in MongoDB
        self.collection.insert_one({
            "voice1_path": voice1_path,
            "voice2_path": voice2_path,
            "embedding1": embedding1,
            "embedding2": embedding2,
            "similarity": similarity_score,
            "is_same_person": similarity_score > self.threshold
        })

        return {
            'similarity': similarity_score,
            'is_same_person': similarity_score > self.threshold,
            'embedding1': embedding1,
            'embedding2': embedding2
        }


if __name__ == "__main__":
    verifier = VoiceVerifier('/Users/nupursamrit/Desktop/PBL/NetraVak/models/best_voice_model.pth')

    result = verifier.verify_voice(
        'path/to/voice1.wav',
        'path/to/voice2.wav'
    )

    print(f"Embedding1: {result['embedding1'][:5]}...")  
    print(f"Embedding2: {result['embedding2'][:5]}...")
    print(f"Similarity Score: {result['similarity']:.4f}")
    print(f"Same Person: {result['is_same_person']}")


# %%
"""
**Add the following code before model to convert input file to flac from mp3:**

import torchaudio

def convert_mp3_to_flac(mp3_path, flac_path):
    waveform, sample_rate = torchaudio.load(mp3_path)
    torchaudio.save(flac_path, waveform, sample_rate, format="flac")

convert_mp3_to_flac("input.mp3", "output.flac")

"""

# %%
