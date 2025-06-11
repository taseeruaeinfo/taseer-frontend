"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
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
  Loader,
  Shield,
  Settings,
} from "lucide-react";
import BrandLayout from "../components/BrandLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import axios from "axios";

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
  { key: "settings", label: "Account Settings", icon: <Settings /> },
  { key: "security", label: "Security & Privacy", icon: <Shield /> },
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
    paymentMethod: any;
  };
}

const API_BASE_URL = "https://api.taseer.app/api";

export default function BrandSettings() {
  const token = Cookies.get("jwt");
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [companyLogo, setCompanyLogo] = useState<string>(
    "/placeholder.svg?height=120&width=120"
  );
  const user = useSelector((state: RootState) => state.user);

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

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    inAppAlerts: true,
    pushNotifications: false,
    campaignNotifications: true,
    marketingNotifications: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    dataCollection: true,
    thirdPartySharing: false,
    showCompanyInfo: true,
  });

  const fetchBrandData = useCallback(async () => {
    try {
      setLoading(true);
      const userId = user.id;

      const response = await axios.get(
        `${API_BASE_URL}/settings/profile/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;

      // @ts-expect-error -nwk
      setBrandData(data);

      setFormData({
        // @ts-expect-error -nwk
        fullName: `${data.firstName} ${data.lastName}`,
        // @ts-expect-error -nwk
        email: data.email || "",
        // @ts-expect-error -nwk
        phoneNumber: data.phone || "",
        // @ts-expect-error -nwk
        company: data.brandMeta?.companyName || "",
        // @ts-expect-error -nwk
        position: data.brandMeta?.representativeDesignation || "",
        // @ts-expect-error -nwk
        companyLogo: data.brandSettings?.companyLogo || "",
      });

      setCompanyLogo(
        // @ts-expect-error -nwk
        data.profilePic ||
""      );
      //@ts-expect-error -nwk
      if (data.brandSettings) {
        setNotificationSettings(
          // @ts-expect-error -nwk
          data.brandSettings.notificationPreferences || notificationSettings
        );
        setPrivacySettings(
          // @ts-expect-error -nwk
          data.brandSettings.privacySettings || privacySettings
        );
        // @ts-expect-error -nwk
        setPaymentForm(data.brandSettings.paymentMethod || paymentForm);
      }
    } catch (error) {
      console.error("Error fetching brand data:", error);
      toast.error("Failed to load brand data");
    } finally {
      setLoading(false);
    }
  }, [user.id, token, notificationSettings, privacySettings, paymentForm]); // Include all dependencies here

  // Fetch brand data on component mount
  useEffect(() => {
    fetchBrandData();
  }, [fetchBrandData]);

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
      setSubmitting(true);
      const userId = brandData?.id || user.id;

      // Update basic profile
      await axios.put(
        `${API_BASE_URL}/settings/profile/${userId}`,
        {
          firstName: formData.fullName.split(" ")[0],
          lastName: formData.fullName.split(" ").slice(1).join(" "),
          email: formData.email,
          phone: formData.phoneNumber,
          profilePic: companyLogo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update brand meta data
      await axios.put(
        `${API_BASE_URL}/settings/brand-meta/${userId}`,
        {
          companyName: formData.company,
          representativeName: formData.fullName,
          representativeDesignation: formData.position,
          representativeEmail: formData.email,
          representativePhone: formData.phoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update brand settings
      await axios.put(
        `${API_BASE_URL}/settings/brand-settings/${userId}`,
        {
          companyLogo,
          notificationPreferences: notificationSettings,
          privacySettings,
          subscriptionPlan: "free",
          paymentMethod: paymentForm,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      const userId = brandData?.id || user.id;

      await axios.put(
        `${API_BASE_URL}/settings/change-password/${userId}`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      setSubmitting(false);
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

  const handleFormSubmit = async (formType: string, formData: any) => {
    try {
      setSubmitting(true);
      let endpoint = "";

      switch (formType) {
        case "Sales Request":
          endpoint = "/settings/sales-inquiry";
          break;
        case "Tutorial Request":
          endpoint = "/settings/tutorial-request";
          break;
        case "Report":
          endpoint = "/settings/report-content";
          break;
        case "Help Question":
          endpoint = "/settings/help-question";
          break;
        default:
          throw new Error("Unknown form type");
      }

      await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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
    } catch (error) {
      console.error(`Error submitting ${formType}:`, error);
      toast.error(`Failed to submit ${formType}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubscriptionUpdate = async (plan: string) => {
    try {
      setSubmitting(true);
      const userId = brandData?.id || user.id;

      await axios.put(
        `${API_BASE_URL}/settings/subscription/${userId}`,
        {
          subscriptionPlan: plan,
          paymentMethod: paymentForm,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Subscription updated successfully!");
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription");
    } finally {
      setSubmitting(false);
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
                disabled={submitting}
                className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
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
                  disabled={submitting}
                  className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    "Update Password"
                  )}
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
                  onClick={() => handleSubscriptionUpdate("premium")}
                  disabled={submitting}
                  className="w-full bg-violet-600 text-white font-medium py-2 rounded hover:bg-violet-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    "Subscribe Now"
                  )}
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

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleProfileUpdate}
                  disabled={submitting}
                  className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Payment Method"
                  )}
                </button>
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
                  disabled={submitting}
                  className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        );

      case "tutorial":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">
              Request Tutorial
            </h2>

            <p className="text-gray-600 mb-6">
              Need help getting started? Request a personalized tutorial session
              with our team.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={tutorialForm.fullName}
                  onChange={(e) =>
                    setTutorialForm({
                      ...tutorialForm,
                      fullName: e.target.value,
                    })
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
                  value={tutorialForm.email}
                  onChange={(e) =>
                    setTutorialForm({ ...tutorialForm, email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Participants
                </label>
                <select
                  value={tutorialForm.participants}
                  onChange={(e) =>
                    setTutorialForm({
                      ...tutorialForm,
                      participants: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                >
                  <option>1 person</option>
                  <option>2-5 people</option>
                  <option>6-10 people</option>
                  <option>More than 10 people</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Format
                </label>
                <select
                  value={tutorialForm.format}
                  onChange={(e) =>
                    setTutorialForm({ ...tutorialForm, format: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                >
                  <option value="live">Live Session</option>
                  <option value="recorded">Recorded Session</option>
                  <option value="documentation">Written Documentation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topics of Interest
                </label>
                <textarea
                  rows={4}
                  value={tutorialForm.topics}
                  onChange={(e) =>
                    setTutorialForm({ ...tutorialForm, topics: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                  placeholder="Please describe what topics you'd like to cover..."
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() =>
                    handleFormSubmit("Tutorial Request", tutorialForm)
                  }
                  disabled={submitting}
                  className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        );

      case "report":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">
              Report Content
            </h2>

            <p className="text-gray-600 mb-6">
              Help us maintain a safe and respectful community by reporting
              inappropriate content.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username or Profile
                </label>
                <input
                  type="text"
                  value={reportForm.username}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, username: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Type
                </label>
                <select
                  value={reportForm.contentType}
                  onChange={(e) =>
                    setReportForm({
                      ...reportForm,
                      contentType: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                >
                  <option>Profile</option>
                  <option>Post</option>
                  <option>Comment</option>
                  <option>Message</option>
                  <option>Campaign</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Report
                </label>
                <select
                  value={reportForm.reason}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, reason: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                >
                  <option>Harassment or Bullying</option>
                  <option>Spam or Scam</option>
                  <option>Inappropriate Content</option>
                  <option>Copyright Violation</option>
                  <option>Fake Profile</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={reportForm.description}
                  onChange={(e) =>
                    setReportForm({
                      ...reportForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                  placeholder="Please provide additional details about the issue..."
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleFormSubmit("Report", reportForm)}
                  disabled={submitting}
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        );

      case "help":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">
              Help & Support
            </h2>

            <p className="text-gray-600 mb-6">
              Have a question or need assistance? We're here to help!
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Question
                </label>
                <textarea
                  rows={6}
                  value={helpForm.question}
                  onChange={(e) =>
                    setHelpForm({ ...helpForm, question: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                  placeholder="Please describe your question or issue in detail..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={helpForm.email}
                  onChange={(e) =>
                    setHelpForm({ ...helpForm, email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                  placeholder="We'll respond to this email address"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleFormSubmit("Help Question", helpForm)}
                  disabled={submitting}
                  className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    "Submit Question"
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">
                    How do I create a campaign?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Navigate to the Campaigns section and click "Create New
                    Campaign". Fill in the required details and publish when
                    ready.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">How do I find creators?</h4>
                  <p className="text-gray-600 text-sm">
                    Use our Creator Discovery tool to search and filter creators
                    based on your requirements and campaign goals.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">
                    What payment methods do you accept?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We accept all major credit cards, PayPal, and bank transfers
                    for subscription payments.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "terms":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">
              Terms of Service
            </h2>

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-3">
                1. Acceptance of Terms
              </h3>
              <p className="text-gray-600 mb-4">
                By accessing and using this platform, you accept and agree to be
                bound by the terms and provision of this agreement.
              </p>

              <h3 className="text-lg font-semibold mb-3">2. Use License</h3>
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily download one copy of the
                materials on our platform for personal, non-commercial
                transitory viewing only.
              </p>

              <h3 className="text-lg font-semibold mb-3">3. Disclaimer</h3>
              <p className="text-gray-600 mb-4">
                The materials on our platform are provided on an 'as is' basis.
                We make no warranties, expressed or implied, and hereby disclaim
                and negate all other warranties.
              </p>

              <h3 className="text-lg font-semibold mb-3">4. Limitations</h3>
              <p className="text-gray-600 mb-4">
                In no event shall our company or its suppliers be liable for any
                damages arising out of the use or inability to use the materials
                on our platform.
              </p>

              <h3 className="text-lg font-semibold mb-3">5. Privacy Policy</h3>
              <p className="text-gray-600 mb-4">
                Your privacy is important to us. Our Privacy Policy explains how
                we collect, use, and protect your information when you use our
                platform.
              </p>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  For questions about these terms, please contact our support
                  team.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case "settings":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">
              Account Settings
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <label className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [key]: !value,
                          })
                        }
                        className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Language & Region</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500">
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+5:30 (IST)</option>
                      <option>UTC+8 (China Time)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleProfileUpdate}
                  disabled={submitting}
                  className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        );

      case "security":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">
              Security & Privacy
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  {Object.entries(privacySettings).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <label className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() =>
                          setPrivacySettings({
                            ...privacySettings,
                            [key]: !value,
                          })
                        }
                        className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Security Features</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-green-600">Enabled</p>
                    </div>
                    <button
                      onClick={() => toast.info("2FA settings coming soon")}
                      className="px-4 py-2 border border-violet-300 text-violet-600 rounded-md hover:bg-violet-50 transition"
                    >
                      Configure
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
                    <div>
                      <p className="font-medium">Login Alerts</p>
                      <p className="text-sm text-gray-500">
                        Get notified of new login attempts
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                    />
                  </div>

                  <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
                    <div>
                      <p className="font-medium">Session Management</p>
                      <p className="text-sm text-gray-500">
                        Manage active sessions across devices
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        toast.info("Session management coming soon")
                      }
                      className="px-4 py-2 border border-violet-300 text-violet-600 rounded-md hover:bg-violet-50 transition"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleProfileUpdate}
                  disabled={submitting}
                  className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Security Settings"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        );

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