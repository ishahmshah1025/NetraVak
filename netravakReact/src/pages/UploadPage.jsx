import { useNavigate } from "react-router-dom";
import { Button } from "../components/Buttons";
import FileUploader from "../components/FileUploader";
import { useState, useEffect } from "react";

export function UploadPage() {
    const [file, setFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null); // ✅ Store preview URL
    const navigate = useNavigate();

    // Automatically update preview when file changes
    useEffect(() => {
        if (file) {
            setImageSrc(URL.createObjectURL(file));
        }
    }, [file]);

    function extractImage(){
        navigate("/face/verify")
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center bg-seasalt">
            <div className="flex flex-col justify-center items-center">
                <div className="text-2xl font-opensans font-extrabold rounded-4xl border-charcoal-dark border-4 text-jet px-4 py-2 my-3">
                    Upload an image of your Aadhar Card
                </div>
                <div className="text-lg font-opensans font-light">
                    Make sure the image is clear and well-lit
                </div>
                <FileUploader setFile={setFile} />
                <div className="my-4 flex flex-col justify-center items-center">
                    {imageSrc && (
                        <div className="my-1 font-opensans font-light">Please check your image before submiting</div>
                    )}
                    <Button text="Submit" variant="primary" size="xl" onClick={extractImage}/> 
                </div>
            </div>
            {/* ✅ Show preview automatically if image is uploaded */}
            {imageSrc && (
                <div className="ml-16 flex flex-col justify-center items-center">
                    <div className="text-lg font-opensans font-bold border-4 border-charcoal-dark rounded-4xl text-jet px-2 py-1 my-0">Preview of Aadhar Card</div>
                    <img src={imageSrc} alt="Uploaded Preview" className="w-56 h-4/5 object-cover mt-2" />
                </div>
            )}
        </div>
    );
}
