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
  Briefcase,
} from "lucide-react";
import DashboardLayout from "../../../components/main/DashBoardLayout";

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactElement;
}

const menuItems: MenuItem[] = [
  { key: "profile", label: "Profile", icon: <User /> },
  { key: "portfolio", label: "My Portfolio", icon: <FolderOpen /> },
  { key: "my work", label: "My Work", icon: <Briefcase /> },
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

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Replace with actual user ID from your auth system
      const userId = "current-user-id";
      const response = await fetch(
        `https://taseer-b.onrender.com/api/settings/profile/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData(data);

      // Populate form states
      setProfileForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        city: data.city || "",
        website: data.website || "",
        bio: data.creatorSettings?.bio || "",
        location: data.creatorSettings?.location || "",
        skills: data.creatorSettings?.skills || "",
      });

      setSocialForm({
        instagram: data.socialHandles?.instagram || "",
        youtube: data.socialHandles?.youtube || "",
        twitter: data.socialHandles?.x || "",
        linkedin: data.socialHandles?.linkedin || "",
        github: data.socialHandles?.github || "",
        website: data.socialHandles?.website || "",
      });

      setPortfolioItems(data.portfolioItems || []);
      setSpecialties(data.creatorSettings?.specialties || []);
      setProfilePicture(data.profilePic);

      // Set other states from user data
      if (data.creatorSettings) {
        setContentTypes(data.creatorSettings.contentTypes || contentTypes);
        setCollaborationPrefs(
          data.creatorSettings.collaborationPreferences || collaborationPrefs
        );
        setPrivacySettings(
          data.creatorSettings.privacySettings || privacySettings
        );
        setNotificationSettings(
          data.creatorSettings.notificationPreferences || notificationSettings
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const userId = userData?.id || "current-user-id";

      // Update basic profile
      const profileResponse = await fetch(
        `https://taseer-b.onrender.com/api/settings/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: profileForm.firstName,
            lastName: profileForm.lastName,
            fullName: profileForm.fullName,
            email: profileForm.email,
            phone: profileForm.phone,
            city: profileForm.city,
            website: profileForm.website,
            profilePic: profilePicture,
          }),
        }
      );

      if (!profileResponse.ok) {
        throw new Error("Failed to update profile");
      }

      // Update creator settings
      const creatorResponse = await fetch(
        `https://taseer-b.onrender.com/api/settings/creator-settings/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bio: profileForm.bio,
            location: profileForm.location,
            skills: profileForm.skills,
            specialties,
            contentTypes,
            collaborationPreferences: collaborationPrefs,
            notificationPreferences: notificationSettings,
            privacySettings,
          }),
        }
      );

      if (!creatorResponse.ok) {
        throw new Error("Failed to update creator settings");
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialUpdate = async () => {
    try {
      setLoading(true);
      const userId = userData?.id || "current-user-id";

      const response = await fetch(
        `https://taseer-b.onrender.com/api/settings/social-handles/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            instagram: socialForm.instagram,
            youtube: socialForm.youtube,
            x: socialForm.twitter,
            linkedin: socialForm.linkedin,
            github: socialForm.github,
            website: socialForm.website,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update social handles");
      }

      toast.success("Social handles updated successfully!");
    } catch (error) {
      console.error("Error updating social handles:", error);
      toast.error("Failed to update social handles");
    } finally {
      setLoading(false);
    }
  };

  const handleShippingUpdate = async () => {
    try {
      setLoading(true);
      const userId = userData?.id || "current-user-id";

      const response = await fetch(
        `https://taseer-b.onrender.com/api/settings/shipping-address/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(shippingForm),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update shipping address");
      }

      toast.success("Shipping address updated successfully!");
    } catch (error) {
      console.error("Error updating shipping address:", error);
      toast.error("Failed to update shipping address");
    } finally {
      setLoading(false);
    }
  };

  const addPortfolioItem = async () => {
    try {
      const userId = userData?.id || "current-user-id";

      const response = await fetch(
        `https://taseer-b.onrender.com/api/settings/portfolio/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: "New Project",
            description: "Project description",
            url: "https://example.com",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add portfolio item");
      }

      const data = await response.json();
      setPortfolioItems([...portfolioItems, data.item]);
      toast.success("Portfolio item added successfully!");
    } catch (error) {
      console.error("Error adding portfolio item:", error);
      toast.error("Failed to add portfolio item");
    }
  };

  const removePortfolioItem = async (id: string) => {
    try {
      const response = await fetch(
        `https://taseer-b.onrender.com/api/settings/portfolio/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete portfolio item");
      }

      setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
      toast.success("Portfolio item deleted successfully!");
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      toast.error("Failed to delete portfolio item");
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
      `https://yourplatform.com/creator/${userData?.firstName}/${uniqueId}`
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
                  disabled={loading}
                  className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
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
                className="flex items-center gap-2 px-4 py-2 border border-violet-300 text-violet-600 rounded-md hover:bg-violet-50 transition"
              >
                <Plus size={16} />
                Add Project
              </button>
            </div>

            <div className="space-y-4">
              {portfolioItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border border-violet-200 rounded-md bg-violet-50 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      <a
                        href={item.url}
                        className="text-violet-600 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit Project
                      </a>
                    </div>
                    <button
                      onClick={() => removePortfolioItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
                    >
                      <Trash size={16} />
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
              <input
                type="url"
                placeholder="Instagram URL"
                value={socialForm.instagram}
                onChange={(e) =>
                  setSocialForm({ ...socialForm, instagram: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="url"
                placeholder="YouTube URL"
                value={socialForm.youtube}
                onChange={(e) =>
                  setSocialForm({ ...socialForm, youtube: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="url"
                placeholder="Twitter URL"
                value={socialForm.twitter}
                onChange={(e) =>
                  setSocialForm({ ...socialForm, twitter: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="url"
                placeholder="LinkedIn URL"
                value={socialForm.linkedin}
                onChange={(e) =>
                  setSocialForm({ ...socialForm, linkedin: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="url"
                placeholder="GitHub URL"
                value={socialForm.github}
                onChange={(e) =>
                  setSocialForm({ ...socialForm, github: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="url"
                placeholder="Website URL"
                value={socialForm.website}
                onChange={(e) =>
                  setSocialForm({ ...socialForm, website: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

              <button
                onClick={handleSocialUpdate}
                disabled={loading}
                className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Social Links"}
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
              disabled={loading}
              className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Preferences"}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
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
              disabled={loading}
              className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Address"}
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
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-gray-500">
                    Last changed 30 days ago
                  </p>
                </div>
                <button
                  onClick={() =>
                    toast.info("Change password feature coming soon")
                  }
                  className="px-4 py-2 border border-violet-300 text-violet-600 rounded-md hover:bg-violet-50 transition"
                >
                  Change
                </button>
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
              disabled={loading}
              className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Security Settings"}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  onClick={() => setShowDeleteDialog(false)}
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
                      Delete Your Account
                    </h3>
                    <p className="mb-4 text-red-600 font-medium">
                      This action cannot be undone. All your data will be
                      permanently removed.
                    </p>
                    <p className="font-medium mb-2">
                      Please type "DELETE" to confirm:
                    </p>
                    <input
                      type="text"
                      placeholder="Type DELETE here"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                    <button
                      onClick={() =>
                        toast.error("Account deletion is disabled in demo mode")
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                    >
                      Permanently Delete Account
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  onClick={() => setShowDeactivateDialog(false)}
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
                      onClick={() =>
                        toast.warning(
                          "Account deactivation is disabled in demo mode"
                        )
                      }
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                    >
                      Deactivate Account
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
