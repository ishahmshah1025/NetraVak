import React, { useRef } from "react";
import { Button } from "../components/Buttons";
import { Input } from "../components/Input";
import { useNavigate } from 'react-router-dom';

export function LoginPage(){
    const emailRef = useRef();
    const navigate = useNavigate();

    function register() {
        navigate('/register');
        console.log("hello from register Button");
    }

    function login(){
        console.log("hello from login button")

    }

    return (
        <div className="h-screen w-screen bg-seasalt flex justify-center items-center">
            <div className="h-3/5 w-1/3 flex flex-col justify-center items-center bg-cyan p-10 
            shadow-2xl shadow-black animate-custom-animation-reverse inset-shadow-jet inset-shadow-sm">
                <div className="text-2xl font-opensans mb-2 text-jet">
                    Login to NetraVak
                </div>
                <div className="">
                    <Input placeholder="Enter your email" type="text" ref={emailRef}/>
                </div>
                <div className="tracking-tighter flex flex-col justify-center items-center">
                    <div className="flex justify-center items-center my-1">
                        <div className="bg-black w-20 h-0.5"></div>
                        <div className="mx-3">OR</div>
                        <div className="bg-black w-20 h-0.5"></div>
                    </div>
                    <Input placeholder="Enter your username" type="text" ref={emailRef}/>
                </div>
                <div className="mt-3">
                    <Button text="Login" size="lg" onClick={login} disable={false} variant="primary"/>    
                </div>
            </div>
            <div className=" h-3/5 w-1/3 bg-jet shadow-black shadow-2xl flex flex-col justify-center 
            items-center animate-custom-animation duration-500">
                <div className="text-4xl mx-3 font-opensans text-center leading-9 text-cyan">
                    Welcome Back!!
                </div>
                <div className="text-center mx-3 text-lg my-4 leading-5.5 text-seasalt mb-">
                    Revolutionizing Recognition – One Eye, One Voice at a Time.
                </div>
                <div>
                    <Button text="Register" size="lg" onClick={register} disable={false} variant="secondary"/> 
                </div>
            </div>
        </div>
    );
}