import cv2
import torch
import numpy as np
from torchvision import transforms
from facenet_pytorch import InceptionResnetV1

# Load Pretrained FaceNet Model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = InceptionResnetV1(pretrained="vggface2").eval().to(device)

# Image Preprocessing Function
def preprocess_image(image_path):
    """Load, preprocess, and resize an image for FaceNet."""
    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(f"Error: Image at {image_path} could not be loaded!")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    for (x, y, w, h) in faces:
        face_img = image[y:y+h, x:x+w] 

    sr = cv2.dnn_superres.DnnSuperResImpl_create()

    sr.readModel("EDSR_x4.pb")
    sr.setModel("edsr", 4)

    super_res = sr.upsample(face_img)

    # sharpen_kernel = np.array([[-1, -1, -1],
    #                             [-1,  9, -1],
    #                             [-1, -1, -1]])

    # sharpened_img = cv2.filter2D(super_res, -1, sharpen_kernel)

    image = cv2.resize(super_res, (160, 160))  # ✅ Resize to FaceNet input size
    
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
    ])
    
    face_tensor = transform(image).unsqueeze(0).to(device)  # Add batch dim
    return face_tensor

# Extract Face Embeddings
def extract_embedding(image_path):
    """Extract embeddings from a face image."""
    face_tensor = preprocess_image(image_path)
    
    # ✅ Debugging Check
    print("Extracted Face Tensor Shape:", face_tensor.shape)  # Should be (1, 3, 160, 160)
    
    # Ensure correct shape
    if face_tensor.shape[2] == 0 or face_tensor.shape[3] == 0:
        raise ValueError("Invalid image dimensions after processing!")

    with torch.no_grad():
        embedding = model(face_tensor)

    # print(embedding.cpu().numpy())
    return embedding.cpu().numpy()

# Face Verification Function
def verify_faces(img1_path, img2_path, threshold=0.75):
    """Compare two face images and check if they belong to the same person."""
    emb1 = extract_embedding(img1_path)
    emb2 = extract_embedding(img2_path)
    
    # Compute Cosine Similarity
    similarity = np.dot(emb1, emb2.T) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
    
    # ✅ Print results
    print(f"Similarity Score: {similarity.item():.4f}")
    
    return similarity.item() > threshold  # True if same person

# Example Usage
if __name__ == "__main__":
    img1_path = "aadhar.png"  # Replace with actual image path
    img2_path = "id_card.jpeg"

    is_same_person = verify_faces(img1_path, img2_path)
    print(f"Same Person: {is_same_person}")
