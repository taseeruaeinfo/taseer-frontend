import React, { useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import Button from "../../components/ui/Button";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setemail] = useState("")
    const router = useNavigate()

    const handleLogin = () => {
        if (!email) {
            alert('please enter email')
        }
        else {
            router('/dashboard')
        }
    }
    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white shadow-lg shadow-purple-500  rounded-xl border-2 border-purple-500 p-8 max-w-md w-full text-center">
                    {/* Logo */}
                    <div className="flex items-center justify-center mb-4">
                        <img src="/logo.svg" alt="logo" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900">Creators Log in</h2>
                    <p className="text-gray-600 mt-1 mb-4">Welcome back, friend</p>

                    {/* Email Input */}
                    <div className="text-left mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Email</label>
                        <div className="flex items-center border rounded-lg p-3 bg-gray-100">
                            <FaRegEnvelope className="text-gray-500 mr-2" />
                            <input
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                                type="email"
                                placeholder="Enter your email"
                                className="bg-transparent outline-none w-full text-gray-700"
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <Button onClick={() => handleLogin()}> Login  </Button>

                    {/* Terms & Conditions */}
                    <p className="text-xs text-gray-500 mt-4">
                        By clicking Log in, you acknowledge that you have read and agree to our{" "}
                        <span className="text-purple-600 cursor-pointer hover:underline">
                            Creator Terms and Conditions of Service
                        </span>
                    </p>

                    {/* Signup & Links */}
                    <p className="mt-4 text-sm text-gray-700">
                        Don't have an account?{" "}
                        <span className="text-purple-600 cursor-pointer hover:underline">
                            Sign up
                        </span>
                    </p>
                    <div className="flex justify-center space-x-6 mt-2 text-xs text-gray-500">
                        <span className="cursor-pointer hover:underline">Privacy Policy</span>
                        <span className="cursor-pointer hover:underline">Get Help</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
