import { Button } from "../components/Buttons"
import VideoCapture from "../components/CameraCapture"
import { useState } from "react";

export function FacePage(){
    const [capturedImage, setCapturedImage] = useState(null);

    const handleCapturedImage = (imageData) => {
        setCapturedImage(imageData)
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <VideoCapture onImageCapture={handleCapturedImage}/>
            <div className="my-3">
                {capturedImage ? (
                    <>
                        <Button text="Verify Face" size="xl" variant="primary" onClick={handleCapturedImage}/>
                    </> 
                ) : (<></>)}
            </div>
        </div>
    )
}