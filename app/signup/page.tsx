"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(username);
        console.log(password);
        
    }


    return (

        <div className="flex flex-col items-center justify-center h-screen w-full">
            <div className="flex flex-col p-16 gap-4 bg-gray-600 rounded-lg shadow-md">
                <h1 className="flex flex-col text-2xl font-bold text-black items-center">Sign Up</h1>
                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                    <input 
                        type="text" 
                        className="p-2 rounded-md bg-gray-400 text-black" 
                        placeholder="Username" 
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        type="password" 
                        className="p-2 rounded-md bg-gray-400 text-black" 
                        placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="p-2 rounded-md bg-blue-400 text-black">Submit</button>
                    <p>Don&apos;t have an account? <Link href="/register">Register</Link></p>
                </form>
            </div>
        </div>
    )
}