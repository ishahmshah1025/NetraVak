import React, { useRef } from "react";
import { Button } from "../components/Buttons";
import { Input } from "../components/Input";

const Register = () => {
    const emailRef = useRef();

    function register() {
        console.log("hello from Submit Button");
    }

    return (
        <div className="h-screen w-screen bg-seasalt flex justify-center items-center">
            <div className=" h-3/5 w-1/3 bg-jet rounded-l-2xl shadow-black 
            shadow-2xl flex flex-col justify-center items-center ">
                <div className="text-4xl mx-3 font-opensans text-center leading-9 text-cyan">
                    Welcome to NetraVak
                </div>
                <div className="text-center mx-3 text-lg mt-4 leading-5.5 text-seasalt">
                    Revolutionizing Recognition – One Eye, One Voice at a Time.
                </div>
            </div>
            <div className="h-3/5 w-1/3 flex flex-col justify-center items-center bg-cyan p-10 rounded-r-2xl shadow-2xl shadow-black">
                <div className="text-2xl font-opensans mb-2 text-jet">
                    Login to NetraVak
                </div>
                <div className="mb-3">
                    <Input placeholder="Enter your email" type="text" ref={emailRef}/>
                </div>
                <div>
                    <Button text="Register" size="lg" onClick={register} disable={false} variant="primary"/>    
                </div>
                <div className="tracking-tighter mt-3 flex-col justify-center items-center">
                    <div className="flex justify-center items-center">
                        <div className="bg-black w-24 h-0.5"></div>
                        <div className="mx-3">OR</div>
                        <div className="bg-black w-24 h-0.5"></div>
                    </div>
                    <div className="flex justify-center items-center text-lg">
                        <span className="mr-2 ">Already have an account ?</span> <Button text="Log in" variant="textonly"></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
