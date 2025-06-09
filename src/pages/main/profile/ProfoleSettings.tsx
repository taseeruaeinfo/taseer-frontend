"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  FolderOpen,
  Globe,
  Settings,
  Shield,
  Share,
  Plus,
  Trash,
  Power,
  MapPin,
  Camera,
  X,
  Copy,
  Loader,
} from "lucide-react";
import DashboardLayout from "../../../components/main/DashBoardLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import axios from "axios";

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactElement;
}

const menuItems: MenuItem[] = [
  { key: "profile", label: "Profile", icon: <User /> },
  // { key: "portfolio", label: "My Portfolio", icon: <FolderOpen /> },
  // { key: "my work", label: "My Work", icon: <Briefcase /> },
  { key: "social", label: "Social Networks", icon: <Globe /> },
  { key: "specialties", label: "Specialties", icon: <Plus /> },
  { key: "shipping", label: "Shipping Address", icon: <MapPin /> },
  { key: "settings", label: "Account Settings", icon: <Settings /> },
  { key: "security", label: "Security & Privacy", icon: <Shield /> },
];

interface PortfolioItem {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  city: string;
  website?: string;
  profilePic: string;
  creatorSettings?: {
    bio?: string;
    location?: string;
    skills?: string;
    specialties: string[];

    contentTypes: any;

    collaborationPreferences: any;
    notificationPreferences: any;
    privacySettings: any;
  };
  socialHandles?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  portfolioItems?: PortfolioItem[];
}

const API_BASE_URL = "https://api.taseer.app/api";

export default function CreatorSettings() {
  const token = Cookies.get("jwt");
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profilePicture, setProfilePicture] = useState<string>(
    "/placeholder.svg?height=150&width=150"
  );
  const [shareUrl, setShareUrl] = useState<string>("");
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showDeactivateDialog, setShowDeactivateDialog] =
    useState<boolean>(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phone: "",
    city: "",
    website: "",
    bio: "",
    location: "",
    skills: "",
  });

  const [socialForm, setSocialForm] = useState({
    instagram: "",
    youtube: "",
    twitter: "",
    linkedin: "",
    github: "",
    website: "",
  });

  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    deliveryNotes: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Switch states for content types and collaboration preferences
  const [contentTypes, setContentTypes] = useState({
    video: true,
    photo: true,
    written: true,
    audio: false,
  });

  const [collaborationPrefs, setCollaborationPrefs] = useState({
    sponsoredPosts: true,
    affiliateMarketing: true,
    barterCollabs: true,
    longTermPartnerships: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    dataCollection: true,
    thirdPartySharing: false,
    addressVisible: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    inAppAlerts: true,
    pushNotifications: false,
    collabNotifications: true,
    marketingNotifications: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
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
        //@ts-expect-error-asd
        setUserData(data);
        setProfileForm({
          //@ts-expect-error-asd
          firstName: data.firstName || "",
          //@ts-expect-error-asd
          lastName: data.lastName || "",
          //@ts-expect-error-asd
          fullName: data.fullName || `${data.firstName} ${data.lastName}`,
          //@ts-expect-error-asd
          email: data.email || "",
          //@ts-expect-error-asd
          phone: data.phone || "",
          //@ts-expect-error-asd
          city: data.city || "",

          //@ts-expect-error-asd
          website: data.website || "",
          //@ts-expect-error-asd
          bio: data.creatorSettings?.bio || "",
          //@ts-expect-error-asd
          location: data.creatorSettings?.location || "",
          //@ts-expect-error-asd
          skills: data.creatorSettings?.skills || "",
        });

        setSocialForm({
          //@ts-expect-error-asd
          instagram: data.socialHandles?.instagram || "",
          //@ts-expect-error-asd
          youtube: data.socialHandles?.youtube || "",
          //@ts-expect-error-asd
          twitter: data.socialHandles?.x || "",
          //@ts-expect-error-asd
          linkedin: data.socialHandles?.linkedin || "",
          //@ts-expect-error-asd
          github: data.socialHandles?.github || "",
          //@ts-expect-error-asd
          website: data.socialHandles?.website || "",
        });

        //@ts-expect-error-asd
        setPortfolioItems(data.portfolioItems || []);
        //@ts-expect-error-asd
        setSpecialties(data.creatorSettings?.specialties || []);
        setProfilePicture(
          //@ts-expect-error-asd
          data.profilePic || "/placeholder.svg?height=150&width=150"
        );
        //@ts-expect-error-asd
        if (data.creatorSettings) {
          //@ts-expect-error-asd
          setContentTypes(data.creatorSettings.contentTypes || []);
          setCollaborationPrefs(
            //@ts-expect-error-asd
            data.creatorSettings.collaborationPreferences || []
          );
          //@ts-expect-error-asd
          setPrivacySettings(data.creatorSettings.privacySettings || {});
          setNotificationSettings(
            //@ts-expect-error-asd
            data.creatorSettings.notificationPreferences || {}
          );
        }
        //@ts-expect-error-asd
        if (data.addressLine1) {
          setShippingForm({
            //@ts-expect-error-asd
            fullName: data.fullName || "",
            //@ts-expect-error-asd
            phone: data.phone || "",
            //@ts-expect-error-asd
            addressLine1: data.addressLine1 || "",
            //@ts-expect-error-asd
            addressLine2: data.addressLine2 || "",
            //@ts-expect-error-asd
            city: data.city || "",
            //@ts-expect-error-asd
            state: data.state || "",
            //@ts-expect-error-asd
            postalCode: data.postalCode || "",
            //@ts-expect-error-asd
            country: data.country || "",
            //@ts-expect-error-asd
            deliveryNotes: data.deliveryNotes || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.id, token]); // 🔥 keep dependencies minimal

  const handleProfileUpdate = async () => {
    try {
      setSubmitting(true);
      const userId = userData?.id || user.id;

      // Update basic profile
      await axios.put(
        `${API_BASE_URL}/settings/profile/${userId}`,
        {
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          fullName: profileForm.fullName,
          email: profileForm.email,
          phone: profileForm.phone,
          city: profileForm.city,
          website: profileForm.website,
          profilePic: profilePicture,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update creator settings
      await axios.put(
        `${API_BASE_URL}/settings/creator-settings/${userId}`,
        {
          bio: profileForm.bio,
          location: profileForm.location,
          skills: profileForm.skills,
          specialties,
          contentTypes,
          collaborationPreferences: collaborationPrefs,
          notificationPreferences: notificationSettings,
          privacySettings,
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

  const handleSocialUpdate = async () => {
    try {
      setSubmitting(true);
      const userId = userData?.id || user.id;

      await axios.put(
        `${API_BASE_URL}/settings/social-handles/${userId}`,
        {
          instagram: socialForm.instagram,
          youtube: socialForm.youtube,
          x: socialForm.twitter,
          linkedin: socialForm.linkedin,
          github: socialForm.github,
          website: socialForm.website,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Social handles updated successfully!");
    } catch (error) {
      console.error("Error updating social handles:", error);
      toast.error("Failed to update social handles");
    } finally {
      setSubmitting(false);
    }
  };

  const handleShippingUpdate = async () => {
    try {
      setSubmitting(true);
      const userId = userData?.id || user.id;

      await axios.put(
        `${API_BASE_URL}/settings/shipping-address/${userId}`,
        shippingForm,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Shipping address updated successfully!");
    } catch (error) {
      console.error("Error updating shipping address:", error);
      toast.error("Failed to update shipping address");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      setSubmitting(true);
      const userId = userData?.id || user.id;

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
      console.error("Error updating password:", error);
      toast.error("Check current passwordd");
    } finally {
      setSubmitting(false);
    }
  };

  const addPortfolioItem = async () => {
    try {
      setSubmitting(true);
      const userId = userData?.id || user.id;

      const response = await axios.post(
        `${API_BASE_URL}/settings/portfolio/${userId}`,
        {
          name: "New Project",
          description: "Project description",
          url: "https://example.com",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //@ts-expect-error - nwk

      setPortfolioItems([...portfolioItems, response.data.item]);
      toast.success("Portfolio item added successfully!");
    } catch (error) {
      console.error("Error adding portfolio item:", error);
      toast.error("Failed to add portfolio item");
    } finally {
      setSubmitting(false);
    }
  };

  const removePortfolioItem = async (id: string) => {
    try {
      setSubmitting(true);

      await axios.delete(`${API_BASE_URL}/settings/portfolio/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
      toast.success("Portfolio item deleted successfully!");
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      toast.error("Failed to delete portfolio item");
    } finally {
      setSubmitting(false);
    }
  };

  const updatePortfolioItem = async (
    id: string,
    data: Partial<PortfolioItem>
  ) => {
    try {
      setSubmitting(true);

      const response = await axios.put(
        `${API_BASE_URL}/settings/portfolio/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPortfolioItems(
        portfolioItems.map((item) =>
          //@ts-expect-error - nwk
          item.id === id ? response.data.item : item
        )
      );
      toast.success("Portfolio item updated successfully!");
    } catch (error) {
      console.error("Error updating portfolio item:", error);
      toast.error("Failed to update portfolio item");
    } finally {
      setSubmitting(false);
    }
  };

  const addSpecialty = () => {
    if (
      newSpecialty.trim() !== "" &&
      !specialties.includes(newSpecialty.trim())
    ) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((item) => item !== specialty));
  };

  const generateShareUrl = () => {
    const uniqueId = Math.random().toString(36).substring(2, 10);
    setShareUrl(
      `https://taseer.app/creator/${userData?.firstName}/${uniqueId}`
    );
    setShowShareDialog(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("URL copied to clipboard!");
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setProfilePicture(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      setSubmitting(true);
      const userId = userData?.id || user.id;

      await axios.put(
        `${API_BASE_URL}/settings/deactivate/${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Account deactivated successfully");
      setShowDeactivateDialog(false);
      // Redirect to logout or home page
      setTimeout(() => {
        window.location.href = "/logout";
      }, 2000);
    } catch (error) {
      console.error("Error deactivating account:", error);
      toast.error("Failed to deactivate account");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setSubmitting(true);
      const userId = userData?.id || user.id;

      await axios.delete(`${API_BASE_URL}/settings/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Account deleted successfully");
      setShowDeleteDialog(false);
      // Redirect to logout page
      setTimeout(() => {
        window.location.href = "/logout";
      }, 2000);
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
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
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-violet-200">
                  <img
                    src={profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full cursor-pointer hover:bg-violet-700 transition"
                >
                  <Camera size={16} />
                  <input
                    id="profile-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                </label>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold border-b pb-2 border-violet-200">
                    Basic Info
                  </h2>
                  <button
                    onClick={generateShareUrl}
                    className="flex items-center gap-2 px-4 py-2 border border-violet-300 text-violet-600 rounded-md hover:bg-violet-50 transition"
                  >
                    <Share size={16} />
                    Share Profile
                  </button>
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />

                  <input
                    type="tel"
                    placeholder="Phone"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />

                  <input
                    type="text"
                    placeholder="City"
                    value={profileForm.city}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />

                  <input
                    type="url"
                    placeholder="Website"
                    value={profileForm.website}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        website: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />

                  <textarea
                    placeholder="Bio"
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, bio: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[100px]"
                  />

                  <input
                    type="text"
                    placeholder="Location"
                    value={profileForm.location}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />

                  <input
                    type="text"
                    placeholder="Skills"
                    value={profileForm.skills}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, skills: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

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
            </div>
          </motion.div>
        );

      case "portfolio":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold border-b pb-2 border-violet-200">
                Projects
              </h2>
              <button
                onClick={addPortfolioItem}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 border border-violet-300 text-violet-600 rounded-md hover:bg-violet-50 transition disabled:opacity-50"
              >
                {submitting ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
                Add Project
              </button>
            </div>

            <div className="space-y-4">
              {portfolioItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p>No portfolio items yet. Add your first project!</p>
                </div>
              )}

              {portfolioItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border border-violet-200 rounded-md bg-violet-50 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updatePortfolioItem(item.id, { name: e.target.value })
                        }
                        className="font-semibold text-lg bg-transparent border-b border-transparent hover:border-violet-300 focus:border-violet-500 focus:outline-none w-full mb-2"
                      />
                      <textarea
                        value={item.description || ""}
                        onChange={(e) =>
                          updatePortfolioItem(item.id, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Add a description"
                        className="text-gray-600 mb-2 bg-transparent border border-transparent hover:border-violet-300 focus:border-violet-500 focus:outline-none w-full rounded p-1"
                      />
                      <input
                        type="url"
                        value={item.url || ""}
                        onChange={(e) =>
                          updatePortfolioItem(item.id, { url: e.target.value })
                        }
                        placeholder="https://example.com"
                        className="text-violet-600 hover:underline bg-transparent border-b border-transparent hover:border-violet-300 focus:border-violet-500 focus:outline-none w-full"
                      />
                    </div>
                    <button
                      onClick={() => removePortfolioItem(item.id)}
                      disabled={submitting}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <Trash size={16} />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case "social":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold border-b pb-2 border-violet-200">
              Social Links
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-pink-500 text-white p-2 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <input
                  type="url"
                  placeholder="Instagram URL"
                  value={socialForm.instagram}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, instagram: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-red-500 text-white p-2 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </div>
                <input
                  type="url"
                  placeholder="YouTube URL"
                  value={socialForm.youtube}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, youtube: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-black text-white p-2 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </div>
                <input
                  type="url"
                  placeholder="Twitter URL"
                  value={socialForm.twitter}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, twitter: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white p-2 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </div>
                <input
                  type="url"
                  placeholder="LinkedIn URL"
                  value={socialForm.linkedin}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, linkedin: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-gray-800 text-white p-2 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </div>
                <input
                  type="url"
                  placeholder="GitHub URL"
                  value={socialForm.github}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, github: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-violet-600 text-white p-2 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <input
                  type="url"
                  placeholder="Website URL"
                  value={socialForm.website}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, website: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <button
                onClick={handleSocialUpdate}
                disabled={submitting}
                className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Social Links"
                )}
              </button>
            </div>
          </motion.div>
        );

      case "specialties":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold border-b pb-2 border-violet-200">
              Specialties & Capabilities
            </h2>

            <div>
              <h3 className="text-lg font-medium mb-2">Your Specialties</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {specialties.length === 0 && (
                  <p className="text-gray-500 text-sm italic">
                    No specialties added yet
                  </p>
                )}

                {specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-800"
                  >
                    {specialty}
                    <button
                      onClick={() => removeSpecialty(specialty)}
                      className="ml-1 text-violet-500 hover:text-violet-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a new specialty"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSpecialty()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  onClick={addSpecialty}
                  className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Content Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(contentTypes).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() =>
                        setContentTypes({ ...contentTypes, [key]: !value })
                      }
                      className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                    />
                    <span className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">
                Collaboration Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(collaborationPrefs).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() =>
                        setCollaborationPrefs({
                          ...collaborationPrefs,
                          [key]: !value,
                        })
                      }
                      className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                    />
                    <span className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

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
                "Save Preferences"
              )}
            </button>
          </motion.div>
        );

      case "shipping":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold border-b pb-2 border-violet-200">
                Shipping Address
              </h2>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={privacySettings.addressVisible}
                  onChange={() =>
                    setPrivacySettings({
                      ...privacySettings,
                      addressVisible: !privacySettings.addressVisible,
                    })
                  }
                  className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                />
                <span className="text-sm">Visible to approved brands only</span>
              </label>
            </div>

            <p className="text-sm text-gray-500">
              This address will only be shared with brands for barter
              collaborations after your approval.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={shippingForm.fullName}
                onChange={(e) =>
                  setShippingForm({ ...shippingForm, fullName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={shippingForm.phone}
                onChange={(e) =>
                  setShippingForm({ ...shippingForm, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <input
              type="text"
              placeholder="Address Line 1"
              value={shippingForm.addressLine1}
              onChange={(e) =>
                setShippingForm({
                  ...shippingForm,
                  addressLine1: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <input
              type="text"
              placeholder="Address Line 2 (Optional)"
              value={shippingForm.addressLine2}
              onChange={(e) =>
                setShippingForm({
                  ...shippingForm,
                  addressLine2: e.target.value,
                })
              }
              className="w-full px-3 py-2  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City"
                value={shippingForm.city}
                onChange={(e) =>
                  setShippingForm({ ...shippingForm, city: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="text"
                placeholder="State"
                value={shippingForm.state}
                onChange={(e) =>
                  setShippingForm({ ...shippingForm, state: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={shippingForm.postalCode}
                onChange={(e) =>
                  setShippingForm({
                    ...shippingForm,
                    postalCode: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <input
              type="text"
              placeholder="Country"
              value={shippingForm.country}
              onChange={(e) =>
                setShippingForm({ ...shippingForm, country: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <textarea
              placeholder="Delivery Notes (Optional)"
              value={shippingForm.deliveryNotes}
              onChange={(e) =>
                setShippingForm({
                  ...shippingForm,
                  deliveryNotes: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[100px]"
            />

            <button
              onClick={handleShippingUpdate}
              disabled={submitting}
              className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Address"
              )}
            </button>
          </motion.div>
        );

      case "settings":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold border-b pb-2 border-violet-200">
              Account Settings
            </h2>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

              <input
                type="text"
                placeholder="Username"
                value={userData?.firstName || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />

              <input
                type="text"
                placeholder="Language"
                defaultValue="English (UK)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

              <input
                type="text"
                placeholder="Timezone"
                defaultValue="IST (GMT+5:30)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-red-600 mb-4">
                Account Management
              </h3>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowDeactivateDialog(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-yellow-500 text-yellow-600 rounded-md hover:bg-yellow-50 transition"
                >
                  <Power size={16} />
                  Deactivate Account
                </button>

                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition"
                >
                  <Trash size={16} />
                  Delete Account
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
            <h2 className="text-2xl font-semibold border-b pb-2 border-violet-200">
              Security & Privacy
            </h2>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-md">
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    onClick={handlePasswordUpdate}
                    disabled={submitting}
                    className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2"
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
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>

              <div className="space-y-4">
                {Object.entries(privacySettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
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

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">
                Notification Settings
              </h3>

              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
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
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (loading && !userData) {
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
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow w-full md:w-1/4"
        >
          <h3 className="text-lg font-semibold mb-6 text-violet-700">
            Personal Details
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

        {/* Share Profile Modal */}
        <AnimatePresence>
          {showShareDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  onClick={() => setShowShareDialog(false)}
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Share Your Creator Profile
                    </h3>
                    <p className="mb-4 text-gray-600">
                      Copy this unique URL to share your creator profile with
                      brands and followers.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition"
                      >
                        <Copy size={16} />
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      onClick={() => setShowShareDialog(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Account Modal */}
        <AnimatePresence>
          {showDeleteDialog && (
            <motion.div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <motion.div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Delete Your Account
                    </h3>
                    <p className="mb-4 text-red-600 font-medium">
                      This action cannot be undone. All your data will be
                      permanently removed.
                    </p>
                    <p className="font-medium mb-2">
                      Are you sure you want to delete your account?
                    </p>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={submitting}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        "Permanently Delete Account"
                      )}
                    </button>
                    <button
                      onClick={() => setShowDeleteDialog(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Deactivate Account Modal */}
        <AnimatePresence>
          {showDeactivateDialog && (
            <motion.div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  onClick={() => setShowDeactivateDialog(false)}
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <motion.div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Deactivate Your Account
                    </h3>
                    <p className="mb-4">
                      Your account will be temporarily deactivated. You can
                      reactivate it by logging in again.
                    </p>
                    <p className="font-medium mb-2">During deactivation:</p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                      <li>Your profile won't be visible to others</li>
                      <li>You won't receive notifications or messages</li>
                      <li>Your content will be temporarily hidden</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                    <button
                      onClick={handleDeactivateAccount}
                      disabled={submitting}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          <span>Deactivating...</span>
                        </>
                      ) : (
                        "Deactivate Account"
                      )}
                    </button>
                    <button
                      onClick={() => setShowDeactivateDialog(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
    </DashboardLayout>
  );
}
