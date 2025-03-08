import React, { useRef } from "react";
import { Button } from "../components/Buttons";
import { Input } from "../components/Input";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const emailRef = useRef();
    const navigate = useNavigate();

    function register() {
        console.log("hello from register Button");
    }

    function login(){
        console.log("hello from login button")
        navigate('/login')
    }

    return (
        <div className="h-screen w-screen bg-seasalt flex justify-center items-center">
            <div className=" h-3/5 w-1/3 bg-jet shadow-black
            shadow-2xl flex flex-col justify-center items-center animate-custom-animation-reverse">
                <div className="text-4xl font-bold mx-3 font-opensans text-center leading-9 text-cyan">
                    Welcome to NetraVak
                </div>
                <div className="text-center mx-3 text-lg my-4 leading-5.5 text-slate-200 mb-3">
                    🔍 Revolutionizing Recognition – One Face, One Voice at a Time.
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className="text-slate-300 text-lg mb-1">🔑 Already a member?</div>
                    <Button text="Login" size="lg" onClick={login} disable={false} variant="secondary"/> 
                </div>
            </div>
            <div className="h-3/5 w-1/3 flex flex-col justify-center items-center bg-cyan p-10 
            shadow-2xl shadow-black inset-shadow-jet inset-shadow-sm animate-custom-animation">
                <div className="font-opensans text-md mb-2 text-jet flex flex-col justify-center items-center text-center">
                    <div className="text-2xl font-extrabold mb-2">Join NetraVak Today</div>
                    <div className="mt-2 text-slate-700">Register now to access cutting-edge biometric verification</div>
                </div>
                <div className="mb-3">
                    <Input placeholder="Enter your email" type="text" ref={emailRef}/>
                </div>
                <div>
                    <Button text="Register" size="lg" onClick={register} disable={false} variant="primary"/>    
                </div>
                {/* <div className="tracking-tighter mt-3 flex-col justify-center items-center">
                    <div className="flex justify-center items-center">
                        <div className="bg-black w-24 h-0.5"></div>
                        <div className="mx-3">OR</div>
                        <div className="bg-black w-24 h-0.5"></div>
                    </div>
                    <div className="flex justify-center items-center text-lg">
                        <span className="mr-2 ">Already have an account ?</span> <Button text="Log in" variant="textonly"></Button>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Register;
