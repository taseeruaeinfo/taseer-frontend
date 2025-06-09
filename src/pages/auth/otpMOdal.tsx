"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X, Mail, Shield } from "lucide-react";
import Button from "../../components/ui/Button";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const OtpModal: React.FC<OtpModalProps> = ({ isOpen, onClose, userEmail }) => {
  const [step, setStep] = useState<"send" | "verify">("send");
  const [email, setEmail] = useState(userEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const getAuthHeaders = () => {
    const token = Cookies.get("jwt");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.taseer.app/api/otp/send",
        { email },
        getAuthHeaders()
      );
      //@ts-expect-error - nnetwork
      if (response.data.success) {
        toast.success("OTP sent to your email!");
        setStep("verify");
        setTimeLeft(180); // 3 minutes countdown
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to send OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.taseer.app/api/otp/verify",
        { otp },
        getAuthHeaders()
      );
      //@ts-expect-error - asd
      if (response.data.success) {
        toast.success("OTP verified successfully!");
        onClose();
        setStep("send");
        setOtp("");
        setTimeLeft(0);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtp("");
    setStep("send");
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <ToastContainer />
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            {step === "send" ? (
              <Mail className="text-purple-600" size={24} />
            ) : (
              <Shield className="text-purple-600" size={24} />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {step === "send" ? "Send OTP" : "Verify OTP"}
          </h2>
          <p className="text-gray-600 mt-1">
            {step === "send"
              ? "Enter your email to receive a verification code"
              : "Enter the 6-digit code sent to your email"}
          </p>
        </div>

        {step === "send" ? (
          <>
            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Email Address
              </label>
              <div className="flex items-center border rounded-lg p-3 bg-gray-50">
                <Mail className="text-gray-500 mr-2" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-transparent outline-none w-full text-gray-700"
                />
              </div>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </>
        ) : (
          <>
            {/* OTP Input */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="w-full text-center text-2xl font-mono border rounded-lg p-4 bg-gray-50 tracking-widest"
                maxLength={6}
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Code sent to {email}
              </p>
            </div>

            {/* Timer */}
            {timeLeft > 0 && (
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  Code expires in{" "}
                  <span className="font-semibold text-purple-600">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              </div>
            )}

            {/* Verify Button */}
            <Button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full mb-3"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            {/* Resend Button */}
            <button
              onClick={handleResendOtp}
              disabled={timeLeft > 0}
              className="w-full text-purple-600 hover:text-purple-700 text-sm font-medium disabled:text-gray-400"
            >
              {timeLeft > 0
                ? `Resend in ${formatTime(timeLeft)}`
                : "Resend OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OtpModal;
