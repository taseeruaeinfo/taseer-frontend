"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  Lock,
  FileText,
  Crown,
  Phone,
  BookOpen,
  Flag,
  HelpCircle,
  Trash,
  Camera,
} from "lucide-react";
import DashboardLayout from "../../components/main/DashBoardLayout";
import BrandLayout from "../components/BrandLayout";

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactElement;
}

const menuItems: MenuItem[] = [
  { key: "profile", label: "Profile", icon: <User /> },
  { key: "changePassword", label: "Change Password", icon: <Lock /> },
  { key: "terms", label: "Terms of Service", icon: <FileText /> },
  { key: "subscription", label: "Subscription", icon: <Crown /> },
  { key: "sales", label: "Talk to Sales", icon: <Phone /> },
  { key: "tutorial", label: "Request Tutorial", icon: <BookOpen /> },
  { key: "report", label: "Report Content", icon: <Flag /> },
  { key: "help", label: "Help", icon: <HelpCircle /> },
];

interface BrandData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  website?: string;
  profilePic: string;
  brandMeta?: {
    companyName: string;
    representativeName: string;
    representativeDesignation: string;
    representativeEmail?: string;
    representativePhone?: string;
  };
  brandSettings?: {
    companyLogo?: string;
    subscriptionPlan: string;
    notificationPreferences: any;
    privacySettings: any;
  };
}

export default function BrandSettings() {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [loading, setLoading] = useState(false);
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [companyLogo, setCompanyLogo] = useState<string>(
    "/placeholder.svg?height=120&width=120"
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    company: "",
    position: "",
    companyLogo: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [salesForm, setSalesForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    bestTimeToCall: "Morning (9AM - 12PM)",
    message: "",
  });

  const [tutorialForm, setTutorialForm] = useState({
    fullName: "",
    email: "",
    participants: "1 person",
    format: "live",
    topics: "",
  });

  const [reportForm, setReportForm] = useState({
    username: "",
    contentType: "Profile",
    reason: "Harassment or Bullying",
    description: "",
  });

  const [helpForm, setHelpForm] = useState({
    question: "",
    email: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    cardholderName: "",
  });

  // Fetch brand data on component mount
  useEffect(() => {
    fetchBrandData();
  }, []);

  const fetchBrandData = async () => {
    try {
      setLoading(true);
      const userId = "current-user-id"; // Replace with actual user ID
      const response = await fetch(
        `http://localhost:5000/api/settings/profile/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch brand data");
      }

      const data = await response.json();
      setBrandData(data);

      // Populate form data
      setFormData({
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email || "",
        phoneNumber: data.phone || "",
        company: data.brandMeta?.companyName || "",
        position: data.brandMeta?.representativeDesignation || "",
        companyLogo: data.brandSettings?.companyLogo || "",
      });

      setCompanyLogo(
        data.brandSettings?.companyLogo ||
          "/placeholder.svg?height=120&width=120"
      );
    } catch (error) {
      console.error("Error fetching brand data:", error);
      toast.error("Failed to load brand data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const userId = brandData?.id || "current-user-id";

      // Update basic profile
      const profileResponse = await fetch(
        `http://localhost:5000/api/settings/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.fullName.split(" ")[0],
            lastName: formData.fullName.split(" ").slice(1).join(" "),
            email: formData.email,
            phone: formData.phoneNumber,
            profilePic: companyLogo,
          }),
        }
      );

      if (!profileResponse.ok) {
        throw new Error("Failed to update profile");
      }

      // Update brand settings
      const brandResponse = await fetch(
        `http://localhost:5000/api/settings/brand-settings/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyLogo,
            notificationPreferences: {},
            privacySettings: {},
            subscriptionPlan: "free",
            paymentMethod: {},
          }),
        }
      );

      if (!brandResponse.ok) {
        throw new Error("Failed to update brand settings");
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const userId = brandData?.id || "current-user-id";

      const response = await fetch(
        `http://localhost:5000/api/settings/change-password/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change password");
      }

      toast.success("Password updated successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setCompanyLogo(result);
          setFormData({ ...formData, companyLogo: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (formType: string, formData: any) => {
    toast.success(`${formType} submitted successfully!`);

    // Reset form based on type
    switch (formType) {
      case "Sales Request":
        setSalesForm({
          fullName: "",
          phoneNumber: "",
          email: "",
          bestTimeToCall: "Morning (9AM - 12PM)",
          message: "",
        });
        break;
      case "Tutorial Request":
        setTutorialForm({
          fullName: "",
          email: "",
          participants: "1 person",
          format: "live",
          topics: "",
        });
        break;
      case "Report":
        setReportForm({
          username: "",
          contentType: "Profile",
          reason: "Harassment or Bullying",
          description: "",
        });
        break;
      case "Help Question":
        setHelpForm({
          question: "",
          email: "",
        });
        break;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">
              Profile Information
            </h2>

            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src={companyLogo || "/placeholder.svg"}
                  alt="Company Logo"
                  className="w-32 h-32 rounded-full border-4 border-violet-200 object-cover"
                />
                <label
                  htmlFor="logo-upload"
                  className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full hover:bg-violet-700 cursor-pointer transition"
                >
                  <Camera size={16} />
                  <input
                    id="logo-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleProfileUpdate}
                disabled={loading}
                className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <div className="mt-12 border-t pt-6">
              <h3 className="text-xl font-semibold text-red-600 mb-4">
                Account Actions
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() =>
                    toast.warning(
                      "Account deactivation is disabled in demo mode"
                    )
                  }
                  className="flex items-center space-x-2 px-4 py-2 border border-orange-400 text-orange-600 rounded hover:bg-orange-50 transition"
                >
                  <span>Deactivate Account</span>
                </button>
                <button
                  onClick={() =>
                    toast.error("Account deletion is disabled in demo mode")
                  }
                  className="flex items-center space-x-2 px-4 py-2 border border-red-400 text-red-600 rounded hover:bg-red-50 transition"
                >
                  <Trash size={16} />
                  <span>Delete Account Permanently</span>
                </button>
              </div>
            </div>
          </motion.div>
        );

      case "changePassword":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">
              Change Password
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </motion.div>
        );

      case "subscription":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">
              Subscription
            </h2>

            <div className="bg-violet-50 border border-violet-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-violet-800 mb-4">
                Premium Features
              </h3>
              <ul className="space-y-2">
                {[
                  "Advanced analytics and reporting",
                  "Custom branding options",
                  "Priority customer support",
                  "Unlimited user accounts",
                  "Advanced security features",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-6 w-6 text-violet-600 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-4">Request a Call</h3>
                <p className="text-gray-600 mb-4">
                  Want to learn more about our premium features? Schedule a call
                  with our team for a personalized demo.
                </p>
                <button
                  onClick={() =>
                    toast.info("Call scheduling feature coming soon")
                  }
                  className="w-full bg-violet-100 text-violet-700 font-medium py-2 rounded hover:bg-violet-200 transition"
                >
                  Schedule a Call
                </button>
              </div>

              <div className="border border-violet-200 rounded-lg p-6 bg-white hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-4">Upgrade Now</h3>
                <p className="text-gray-600 mb-4">
                  Ready to unlock premium features? Choose your subscription
                  plan below.
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Premium Plan</span>
                  <span className="text-xl font-bold">$49.99/month</span>
                </div>
                <button
                  onClick={() => toast.info("Subscription upgrade coming soon")}
                  className="w-full bg-violet-600 text-white font-medium py-2 rounded hover:bg-violet-700 transition"
                >
                  Subscribe Now
                </button>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentForm.cardNumber}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        cardNumber: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentForm.expiryDate}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          expiryDate: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={paymentForm.cvc}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, cvc: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    value={paymentForm.cardholderName}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        cardholderName: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "sales":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">
              Talk to Sales
            </h2>

            <p className="text-gray-600 mb-6">
              Have questions about our services or need a custom solution? Our
              sales team is here to help.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={salesForm.fullName}
                  onChange={(e) =>
                    setSalesForm({ ...salesForm, fullName: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={salesForm.phoneNumber}
                  onChange={(e) =>
                    setSalesForm({ ...salesForm, phoneNumber: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={salesForm.email}
                  onChange={(e) =>
                    setSalesForm({ ...salesForm, email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Best Time to Call
                </label>
                <select
                  value={salesForm.bestTimeToCall}
                  onChange={(e) =>
                    setSalesForm({
                      ...salesForm,
                      bestTimeToCall: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                >
                  <option>Morning (9AM - 12PM)</option>
                  <option>Afternoon (12PM - 5PM)</option>
                  <option>Evening (5PM - 8PM)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={salesForm.message}
                  onChange={(e) =>
                    setSalesForm({ ...salesForm, message: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                  placeholder="Please briefly describe what you'd like to discuss..."
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleFormSubmit("Sales Request", salesForm)}
                  className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </motion.div>
        );

      // Add other cases for tutorial, report, help, and terms...
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Content for {activeTab} coming soon...
            </p>
          </div>
        );
    }
  };

  if (loading && !brandData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <BrandLayout>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow w-full md:w-1/4"
        >
          <h3 className="text-lg font-semibold mb-6 text-violet-700">
            Account Settings
          </h3>
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <motion.li
                key={item.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition duration-200 ${
                  activeTab === item.key
                    ? "bg-violet-100 text-violet-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Content */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrandLayout>
  );
}
