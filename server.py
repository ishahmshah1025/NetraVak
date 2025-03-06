from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import cv2
import uvicorn
import numpy as np 
from io import BytesIO
import torch
import dlib
from scipy.spatial import distance
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from voice_verification import VoiceVerifier
from fastapi.middleware.cors import CORSMiddleware
from facenet_pytorch import InceptionResnetV1
from face_verification import extract_embedding
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],  
)

# Load CLIP model and processor
device = "cuda" if torch.cuda.is_available() else "cpu"
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Load Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


#Load VoiceVerifier Model
verifier = VoiceVerifier('models/best_voice_model.pth')

# Load Pretrained FaceNet Model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = InceptionResnetV1(pretrained="vggface2").eval().to(device)

@app.post("/extract")
async def extract_face(file: UploadFile = File(...)):
    file1_path = f"temp/{file.filename}"
    with open(file1_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    embedding = extract_embedding(file1_path)

    os.remove(file1_path)
    return JSONResponse(content=embedding, status_code=200)

@app.post("/voice/verify")
async def verify_voices(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    os.makedirs("temp", exist_ok=True)
    # Save file1
    file1_path = f"temp/{file1.filename}"
    with open(file1_path, "wb") as buffer:
        shutil.copyfileobj(file1.file, buffer)

    # Save file2
    file2_path = f"temp/{file2.filename}"
    with open(file2_path, "wb") as buffer:
        shutil.copyfileobj(file2.file, buffer)

    # Pass file paths to the verifier
    result = verifier.verify_voice(file1_path, file2_path)

    # Clean up (Optional: Remove files after processing)
    os.remove(file1_path)
    os.remove(file2_path)

    return JSONResponse(content=result, status_code=200)

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("models/shape_predictor_68_face_landmarks.dat")

def eye_aspect_ratio(eye):
    A = distance.euclidean(eye[1], eye[5])  # Vertical distance 1
    B = distance.euclidean(eye[2], eye[4])  # Vertical distance 2
    C = distance.euclidean(eye[0], eye[3])  # Horizontal distance
    EAR = (A + B) / (2.0 * C)
    return EAR

@app.post("/detect-blink")
async def detect_blink(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        faces = detector(gray)

        if len(faces) == 0:
            return JSONResponse(content={"error": "No face detected"}, status_code=400)

        for face in faces:
            landmarks = predictor(gray, face)
            landmarks_np = np.array([(landmarks.part(n).x, landmarks.part(n).y) for n in range(68)])

            left_eye = landmarks_np[42:48]
            right_eye = landmarks_np[36:42]

            left_EAR = eye_aspect_ratio(left_eye)
            right_EAR = eye_aspect_ratio(right_eye)
            avg_EAR = (left_EAR + right_EAR) / 2.0

            if avg_EAR < 0.2:
                return {"status": "blink_detected"}
        
        return {"status": "no_blink"}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)



# Run FastAPI Server
if __name__ == "__main__":
    print("Listening to port")
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
