import React, { useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import Button from "../../components/ui/Button";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/userSlice";
import axios from "axios";
import Cookies from "js-cookie";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async () => {

        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            //@ts-ignore 

            Cookies.set('jwt', response.data?.token, { expires: 14 }, { HTMLOptionElement: true }); // expires in 7 days

            //@ts-ignore
            dispatch(loginSuccess(response.data?.user));

            //@ts-ignore
            if (response.data?.user.type == "brand") {
                router('/brand/home');

            } else {
                router('/home');
            }

        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white shadow-lg shadow-purple-500 rounded-xl border-2 border-purple-500 p-8 max-w-md w-full text-center">

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
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Enter your email"
                                className="bg-transparent outline-none w-full text-gray-700"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="text-left mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Password</label>
                        <div className="flex items-center border rounded-lg p-3 bg-gray-100">
                            <FaLock className="text-gray-500 mr-2" />
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Enter your password"
                                className="bg-transparent outline-none w-full text-gray-700"
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <Button onClick={handleLogin}> Login </Button>

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
