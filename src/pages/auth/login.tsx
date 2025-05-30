"use client";

import type React from "react";
import { useState } from "react";
import { FaRegEnvelope, FaLock } from "react-icons/fa";
import { Shield, ArrowLeft } from "lucide-react";
import Button from "../../components/ui/Button";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/userSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";

const Login: React.FC = () => {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useNavigate();
  const dispatch = useDispatch();

  const handleCredentialsSubmit = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://taseer-b.onrender.com/api/auth/login",
        {
          email,
          password,
          step: "credentials",
        }
      );
      //@ts-expect-error-as
      if (response.data.success && response.data.nextStep === "otp") {
        //@ts-expect-error-as

        setUserId(response.data.userId);
        setStep("otp");
        toast.success("Verification code sent to your email!");
      }
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://taseer-b.onrender.com/api/auth/login",
        {
          step: "otp",
          otp,
          userId,
        }
      );
      //@ts-expect-error-as

      if (response.data.success) {
        //@ts-expect-error-as

        Cookies.set("jwt", response.data.token, { expires: 14 });
        //@ts-expect-error-as

        dispatch(loginSuccess(response.data.user));

        toast.success("Login successful!");

        setTimeout(() => {
          //@ts-expect-error-as

          if (response.data.user.type === "brand") {
            router("/brand/home");
          } else {
            router("/home");
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error(error);
      const message =
        error.response?.data?.message || "Invalid verification code";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCredentials = () => {
    setStep("credentials");
    setOtp("");
    setUserId("");
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://taseer-b.onrender.com/api/auth/login",
        {
          email,
          password,
          step: "credentials",
        }
      );
      //@ts-expect-error-as

      if (response.data.success && response.data.nextStep === "otp") {
        //@ts-expect-error-as

        setUserId(response.data.userId);
        toast.success("New verification code sent!");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to resend code";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg shadow-purple-500 rounded-xl border-2 border-purple-500 p-8 max-w-md w-full text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <img src="/logo.svg" alt="logo" />
          </div>

          {step === "credentials" ? (
            <>
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900">
                Creators Log in
              </h2>
              <p className="text-gray-600 mt-1 mb-4">Welcome back, friend</p>

              {/* Email Input */}
              <div className="text-left mb-4">
                <label className="block text-gray-700 font-semibold mb-1">
                  Email
                </label>
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
              <div className="text-left mb-6">
                <label className="block text-gray-700 font-semibold mb-1">
                  Password
                </label>
                <div className="flex items-center border rounded-lg p-3 bg-gray-100">
                  <FaLock className="text-gray-500 mr-2" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter your password"
                    className="bg-transparent outline-none w-full text-gray-700"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleCredentialsSubmit()
                    }
                  />
                </div>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleCredentialsSubmit}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Verifying..." : "Continue"}
              </Button>
            </>
          ) : (
            <>
              {/* Back Button */}
              <button
                onClick={handleBackToCredentials}
                className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back
              </button>

              {/* Title */}
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-purple-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Verify Your Identity
              </h2>
              <p className="text-gray-600 mt-1 mb-6">
                Enter the 6-digit code sent to <br />
                <span className="font-semibold">{email}</span>
              </p>

              {/* OTP Input */}
              <div className="mb-6">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  className="w-full text-center text-2xl font-mono border rounded-lg p-4 bg-gray-50 tracking-widest"
                  maxLength={6}
                  onKeyPress={(e) =>
                    e.key === "Enter" && otp.length === 6 && handleOtpSubmit()
                  }
                />
              </div>

              {/* Verify Button */}
              <Button
                onClick={handleOtpSubmit}
                disabled={loading || otp.length !== 6}
                className="w-full mb-4"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>

              {/* Resend Button */}
              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium disabled:text-gray-400"
              >
                Didn't receive the code? Resend
              </button>
            </>
          )}

          {/* Terms & Conditions */}
          <p className="text-xs text-gray-500 mt-6">
            By continuing, you acknowledge that you have read and agree to our{" "}
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
            <span className="cursor-pointer hover:underline">
              Privacy Policy
            </span>
            <span className="cursor-pointer hover:underline">Get Help</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
