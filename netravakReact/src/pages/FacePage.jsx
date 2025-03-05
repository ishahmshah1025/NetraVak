import VideoCapture from "../components/CameraCapture"

export function FacePage(){
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <VideoCapture/>
        </div>
    )
}