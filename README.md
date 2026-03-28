# NetraVak  
### Multimodal Biometric Authentication System  

NetraVak is a **secure multimodal biometric authentication platform** that combines **face recognition, voice verification, liveness detection, and Aadhaar-based identity validation** to provide a highly secure and user-friendly authentication system.

The goal of NetraVak is to move beyond traditional password-based authentication and create a **privacy-preserving identity verification framework** using deep learning and computer vision.

---

## Problem Statement  

Traditional authentication methods such as passwords, OTPs, and PINs are vulnerable to:

- Password theft
- Credential leakage
- Device loss
- Phishing attacks
- Spoofing attempts

Single-biometric systems are also vulnerable to environmental noise and spoofing.

NetraVak solves this problem using **multiple biometric modalities**.

---

## Real-World Scenario  

Consider a situation where a person **loses their phone**, and with it, all their credentials, passwords, OTP access, and stored authentication tokens.

In traditional systems, recovering access can be slow, frustrating, and insecure.

With **NetraVak**, reconnecting becomes significantly easier.

The user can simply verify their identity using:

- **Aadhaar-based identity check**
- **Real-time face verification**
- **Voice authentication**
- **Liveness detection**

This enables secure account recovery **without depending entirely on passwords or the lost device**, making the authentication process both **resilient and user-friendly**.

---

## Key Features  

- **Face Verification using FaceNet**
- **Voice Authentication using CRNN**
- **Eye Blink Liveness Detection**
- **Aadhaar Card Face Extraction**
- **Super Resolution using EDSR**
- **FastAPI-based ML Backend**
- **React Frontend**
- **Secure Embedding Storage**
- **Privacy Preserving Authentication**

---

## Tech Stack  

### Machine Learning / AI
- PyTorch
- FaceNet
- CRNN
- OpenCV
- MTCNN
- EDSR Super Resolution
- Librosa
- NoiseReduce

### Backend
- FastAPI
- Python
- Node.js / Express (optional integration)

### Frontend
- React.js
- Tailwind CSS
- Axios

### Database
- MongoDB / PostgreSQL

---

## System Workflow  

### Registration Flow
1. User uploads Aadhaar card
2. Aadhaar verification performed
3. Face extracted from Aadhaar
4. Image enhanced using EDSR
5. Face embedding generated using FaceNet
6. Voice sample recorded
7. Voice embedding generated using CRNN
8. Secure embeddings stored in database

### Login Flow
1. User captures live face
2. Eye blink liveness detection performed
3. Face embedding generated
4. Voice sample captured
5. Voice embedding generated
6. Embeddings compared using similarity metrics
7. User authenticated

---

## Machine Learning Architecture  

### Face Recognition
- OpenCV Haar Cascade / MTCNN for face detection
- EDSR for image enhancement
- FaceNet for 128-dimensional embeddings
- Euclidean distance for similarity comparison

### Voice Recognition
- Audio → Mel Spectrogram
- CNN layers for feature extraction
- RNN layers for temporal learning
- CRNN embeddings
- Cosine similarity for verification

### Liveness Detection
- Real-time webcam frame capture
- Eye blink detection
- Spoof prevention

---

## Security & Privacy  

NetraVak does **not store raw face images or voice recordings**.

Instead, it stores **non-reversible embeddings**, which means:

- Original face cannot be reconstructed
- Original voice cannot be recreated
- Better privacy compliance
- Reduced risk during data breach

---

## Future Improvements  

- Aadhaar OCR automation
- Mobile deployment
- On-device inference
- Federated biometric learning
- Anti-deepfake detection

---

## Contributors  

- Nupur Samrit  
- Isha Shah  
- Maitreya Vaidya  
- Harshit Vora  

---

## Research Focus  

This project is designed as a **multimodal secure authentication framework** and can be extended for:

- Banking applications
- Government authentication
- Secure login systems
- Identity recovery platforms

---
