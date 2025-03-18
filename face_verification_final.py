import cv2
import torch
import numpy as np
from torchvision import transforms
from facenet_pytorch import InceptionResnetV1, MTCNN

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = InceptionResnetV1(pretrained="vggface2").eval().to(device)


mtcnn = MTCNN(image_size=160, margin=20, device=device)


def preprocess_image(image_path):
    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(f"Error: Image at {image_path} could not be loaded!")

   
    face_img = mtcnn(image)

    if face_img is None:
        raise ValueError(f"No face detected in {image_path}!")

    return face_img.unsqueeze(0).to(device)  

def extract_embedding(image_path):
    with torch.no_grad():
        return model(preprocess_image(image_path)).cpu().numpy()

def verify_faces(img1_path, img2_path, threshold=0.8):
    images = torch.cat([preprocess_image(img1_path), preprocess_image(img2_path)])

    with torch.no_grad():
        embeddings = model(images).cpu().numpy()

    
    distance = np.linalg.norm(embeddings[0] - embeddings[1])

    print(f"Distance Score: {distance:.4f}")
    
    return distance < threshold  

if __name__ == "__main__":
    img1_path = "WhatsApp Image 2025-03-18 at 10.25.45_e14fdc7b.jpg"  
    img2_path = "WIN_20250318_10_35_00_Pro.jpg"

    is_same_person = verify_faces(img1_path, img2_path)
    print(f"Same Person: {is_same_person}")
