"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Download, FileText } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface ContractProps {
  campaignId: string;
  contractId: string;
  title: string;
  description: string;
  compensation: string;
  deliverables: string;
  timeline: string;
  terms: string;
  onApprove: () => void;
  onReject: () => void;
}

export default function ContractApproval({
  campaignId,
  contractId,
  title,
  description,
  compensation,
  deliverables,
  timeline,
  terms,
  onApprove,
  onReject,
}: ContractProps) {
  const [loading, setLoading] = useState(false);
  const [showFullContract, setShowFullContract] = useState(false);

  const handleApprove = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("jwt");
      await axios.post(
        `https://api.taseer.app/api/campaigns/${campaignId}/contracts/${contractId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Contract approved successfully");
      onApprove();
    } catch (error) {
      console.error("Error approving contract:", error);
      toast.error("Failed to approve contract");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("jwt");
      await axios.post(
        `https://api.taseer.app/api/campaigns/${campaignId}/contracts/${contractId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Contract rejected");
      onReject();
    } catch (error) {
      console.error("Error rejecting contract:", error);
      toast.error("Failed to reject contract");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Create a text version of the contract
    const contractText = `
${title}

${description}

COMPENSATION:
${compensation}

DELIVERABLES:
${deliverables}

TIMELINE:
${timeline}

TERMS AND CONDITIONS:
${terms}
    `;

    // Create a blob and download it
    const blob = new Blob([contractText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
    >
      <div className="bg-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText size={20} className="text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
          >
            <Download size={16} className="mr-1" /> Download
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-gray-600">{description}</p>
          </div>

          <div
            className={
              showFullContract ? "" : "max-h-60 overflow-hidden relative"
            }
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Compensation
                </h4>
                <p className="mt-1 text-sm text-gray-600">{compensation}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Deliverables
                </h4>
                <p className="mt-1 text-sm text-gray-600">{deliverables}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">Timeline</h4>
                <p className="mt-1 text-sm text-gray-600">{timeline}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Terms and Conditions
                </h4>
                <p className="mt-1 text-sm text-gray-600">{terms}</p>
              </div>
            </div>

            {!showFullContract && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </div>

          {!showFullContract && (
            <button
              onClick={() => setShowFullContract(true)}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              Read full contract
            </button>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleReject}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <X size={16} className="mr-1" /> Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <Check size={16} className="mr-1" /> Approve Contract
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
