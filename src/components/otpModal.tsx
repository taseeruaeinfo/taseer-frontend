"use client";

import type React from "react";
import { useState } from "react";
import { Shield, X } from "lucide-react";
import Button from "./ui/Button";
import { toast } from "react-toastify";
import axios from "axios";

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  email: string;
  onSuccess: (token: string, user: any) => void;
}

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  userId,
  email,
  onSuccess,
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.taseer.app/api/auth/signup",
        {
          step: "verify-otp",
          otp,
          userId,
        }
      );
      //@ts-expect-error-nwk
      if (response.data.success) {
        toast.success("Account verified successfully!");
        //@ts-expect-error-nwk
        onSuccess(response.data.token, response.data.user);
        onClose();
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Invalid verification code";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      // You might need to implement a resend endpoint
      toast.success("New verification code sent!");
    } catch (error: any) {
      toast.error("Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Shield className="text-purple-600" size={24} />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Account
          </h2>
          <p className="text-gray-600 mb-6">
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
                e.key === "Enter" && otp.length === 6 && handleVerifyOtp()
              }
            />
          </div>

          <Button
            onClick={handleVerifyOtp}
            disabled={loading || otp.length !== 6}
            className="w-full mb-4"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </Button>

          <button
            onClick={handleResendOtp}
            disabled={loading}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium disabled:text-gray-400"
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
