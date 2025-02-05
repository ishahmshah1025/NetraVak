import cv2


image = cv2.imread("aadhar.png")

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

for (x, y, w, h) in faces:
    face_img = image[y:y+h, x:x+w]
    cv2.imwrite("extracted_face.jpg", face_img)  
    cv2.imshow("Extracted Face", face_img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    break  
