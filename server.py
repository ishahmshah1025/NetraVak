from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse, Response
import cv2
import uvicorn
import numpy as np 
from io import BytesIO
import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel

app = FastAPI()

# Load CLIP model and processor
device = "cuda" if torch.cuda.is_available() else "cpu"
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Load Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

@app.post("/extract")
async def extract_face(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        npimg = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        if image is None:
            return JSONResponse(content={"error": "Invalid image format"}, status_code=400)
        
    except Exception as e :
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(50, 50))

    if len(faces) == 0:
        return {"Error": "No face detected"}

    # Extract first detected face
    x, y, w, h = faces[0]
    face = image[y:y+h, x:x+w]

    # Load Super-Resolution Model
    sr = cv2.dnn_superres.DnnSuperResImpl_create()
    sr.readModel("EDSR_x4.pb")
    sr.setModel("edsr", 4)

    # Apply Super-Resolution
    super_res = sr.upsample(face)

    # Apply Sharpening Filter
    sharpen_kernel = np.array([[-1, -1, -1],
                               [-1,  9, -1],
                               [-1, -1, -1]])
    
    sharpened = cv2.filter2D(super_res, -1, sharpen_kernel)
    
    # Convert face to PIL Image
    face_pil = Image.fromarray(cv2.cvtColor(sharpened, cv2.COLOR_BGR2RGB))
    # Preprocess with CLIP
    inputs = processor(images=face_pil, return_tensors="pt").to(device)

    # Get image embeddings
    with torch.no_grad():
        embeddings = model.get_image_features(**inputs)
    
    print(embeddings)
    return JSONResponse(content={"embeddings": embeddings.cpu().numpy().tolist()}, status_code=200)


# Run FastAPI Server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    print("Listening to port")
