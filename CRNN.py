import librosa
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models

# Load audio
y, sr = librosa.load('audio_sample.wav')

# Extract Log-Mel Spectrogram
mel_spec = librosa.feature.melspectrogram(y=y, sr=sr)
log_mel_spec = librosa.power_to_db(mel_spec)

# Extract MFCC
mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)

# Normalize features for better training
log_mel_spec = (log_mel_spec - np.mean(log_mel_spec)) / (np.std(log_mel_spec) + 1e-7)
mfcc = (mfcc - np.mean(mfcc)) / (np.std(mfcc) + 1e-7)

# Combine features (stack along a new axis)
combined_features = np.stack([log_mel_spec, mfcc], axis=-1)
print("Combined Feature Shape:", combined_features.shape)

# Ensure the features are in the right shape for the CNN
input_shape = (combined_features.shape[0], combined_features.shape[1], combined_features.shape[2])

# Define the CRNN Model for Embedding Extraction
model = models.Sequential([
    # CNN Layers
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=input_shape),
    layers.MaxPooling2D((2, 2)),

    # Flatten and Recurrent Layer
    layers.Reshape((combined_features.shape[0], -1)),
    layers.LSTM(64, return_sequences=False),

    # Dense Embedding Layer
    layers.Dense(128, activation='relu', name='embedding_layer')  # Embedding layer
])

# Extract embeddings
audio_embedding = model.predict(np.expand_dims(combined_features, axis=0))
print("Audio Embedding Shape:", audio_embedding.shape)
