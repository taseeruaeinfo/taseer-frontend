"use client";

import type React from "react";
import { useState } from "react";
import { FaRegEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { Shield } from "lucide-react";
import Button from "../../components/ui/Button";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/userSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useNavigate();
  const dispatch = useDispatch();

  const handleEmailSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.taseer.app/api/auth/forgot-password",
        { email, step: "email" }
      );
      //@ts-expect-error-nnwk
      if (response.data.success) {
        //@ts-expect-error-nnwk
        setUserId(response.data.userId);
        setStep("otp");
        toast.success("Reset code sent to your email!");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.taseer.app/api/auth/forgot-password",
        {
          step: "verify-otp",
          otp,
          userId,
        }
      );
      //@ts-expect-error-nnwk
      if (response.data.success) {
        setStep("password");
        toast.success("Code verified! Set your new password");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid code";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.taseer.app/api/auth/forgot-password",
        {
          step: "reset-password",
          userId,
          newPassword,
        }
      );
      //@ts-expect-error-nnwk
      if (response.data.success) {
        // Auto login after password reset
        //@ts-expect-error-nnwk
        Cookies.set("jwt", response.data.token, { expires: 14 });
        //@ts-expect-error-nnwk
        dispatch(loginSuccess(response.data.user));

        toast.success("Password reset successful! Logging you in...");

        setTimeout(() => {
          //@ts-expect-error-nnwk
          if (response.data.user.type === "brand") {
            router("/brand/home");
          } else {
            router("/home");
          }
        }, 1000);
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to reset password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.taseer.app/api/auth/forgot-password",
        { email, step: "email" }
      );
      //@ts-expect-error-nnwk
      if (response.data.success) {
        toast.success("New reset code sent!");
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg shadow-purple-300 rounded-xl border-2 border-purple-300 p-8 max-w-md w-full text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <img src="/logo.svg" alt="logo" />
          </div>

          {step === "email" && (
            <>
              <h2 className="text-3xl font-bold text-gray-900">
                Reset Password
              </h2>
              <p className="text-gray-500 mt-1 mb-4">
                Enter your email to receive a reset code
              </p>

              <div className="text-left mb-6">
                <label className="block text-gray-700 text-lg font-semibold mb-1">
                  Email
                </label>
                <div className="flex items-center border rounded-lg p-3 bg-transparent outline-purple-100">
                  <FaRegEnvelope className="text-gray-500 mr-2" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                    className="bg-transparent outline-none w-full text-gray-700"
                    onKeyPress={(e) => e.key === "Enter" && handleEmailSubmit()}
                  />
                </div>
              </div>

              <Button
                onClick={handleEmailSubmit}
                disabled={loading}
                className="w-full mb-4"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </Button>

              <button
                onClick={() => router("/login")}
                className="flex items-center justify-center text-purple-600 hover:text-purple-700 mx-auto"
              >
                <FaArrowLeft className="mr-1" />
                Back to Login
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <button
                onClick={() => setStep("email")}
                className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
              >
                <FaArrowLeft size={16} className="mr-1" />
                Back
              </button>

              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-purple-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Enter Reset Code
              </h2>
              <p className="text-gray-600 mt-1 mb-6">
                Enter the 6-digit code sent to <br />
                <span className="font-semibold">{email}</span>
              </p>

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

              <Button
                onClick={handleOtpSubmit}
                disabled={loading || otp.length !== 6}
                className="w-full mb-4"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>

              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium disabled:text-gray-400"
              >
                Didn't receive the code? Resend
              </button>
            </>
          )}

          {step === "password" && (
            <>
              <button
                onClick={() => setStep("otp")}
                className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
              >
                <FaArrowLeft size={16} className="mr-1" />
                Back
              </button>

              <h2 className="text-2xl font-bold text-gray-900">
                Set New Password
              </h2>
              <p className="text-gray-600 mt-1 mb-6">
                Create a strong password for your account
              </p>

              <div className="text-left mb-4">
                <label className="block text-gray-700 text-lg font-semibold mb-1">
                  New Password
                </label>
                <div className="flex items-center border rounded-lg p-3 bg-transparent outline-purple-300">
                  <FaLock className="text-gray-500 mr-2" />
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    placeholder="Enter new password"
                    className="bg-transparent outline-none w-full text-gray-500"
                  />
                </div>
              </div>

              <div className="text-left mb-6">
                <label className="block text-gray-700 text-lg font-semibold mb-1">
                  Confirm Password
                </label>
                <div className="flex items-center border rounded-lg p-3 bg-transparent outline-purple-300">
                  <FaLock className="text-gray-500 mr-2" />
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="Confirm new password"
                    className="bg-transparent outline-none w-full text-gray-500"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handlePasswordReset()
                    }
                  />
                </div>
              </div>

              <Button
                onClick={handlePasswordReset}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Resetting..." : "Reset Password & Login"}
              </Button>
            </>
          )}

          <p className="text-xs text-gray-500 mt-6">
            By continuing, you acknowledge that you have read and agree to our{" "}
            <span className="text-purple-600 cursor-pointer hover:underline">
              Terms and Conditions of Service
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
