import cv2
import numpy as np
from deepface import DeepFace

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def extract_face(image_path):
    """ Extracts a face from an Aadhaar card image. """
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)


    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    for (x, y, w, h) in faces:
        face_img = image[y:y+h, x:x+w]
        cv2.imwrite("aadhaar_face.jpg", face_img)  
        cv2.imshow("Extracted Face", face_img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        break  
    return "aadhaar_face.jpg"

def capture_live_image():
    cap = cv2.VideoCapture(0)
    cap.set(3,640)
    cap.set(4,490)
    # while True:
    #     ret, frame = cap.read()
    #     cv2.imshow("Video",frame)
    #     if cv2.waitKey(1)==ord('q'):
    #         break
    cap = cv2.VideoCapture(0)
    frame = cap.read()

    cap.release()
    
    for (x, y, w, h) in frame:
        imagelive = frame[y:y+h, x:x+w]
        cv2.imwrite("imagelive",imagelive)
        cv2.imshow("imagelive",imagelive)
        cv2.destroyAllWindows()
    return frame
    

def compare_faces(img1, img2):
    
    try:
        result = DeepFace.verify(img1, img2)
        return result["verified"]
    except Exception as e:
        print(f"Error during face verification: {e}")
        return False

if __name__ == "__main__":
    aadhaar_image_path = "aadhar.png"  
    extracted_face_path = extract_face(aadhaar_image_path)

    if extracted_face_path:
        live_image_path = capture_live_image()
        
        if live_image_path:
            match = compare_faces(extracted_face_path, live_image_path)
            
            if match:
                print("✅ Face Matched")
            else:
                print("Face Mismatch")
