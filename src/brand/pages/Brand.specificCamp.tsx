"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ArrowLeft, Check, X, Edit2, Share2, Search, Instagram, Twitter, Youtube } from "lucide-react"
import { AiFillTikTok } from "react-icons/ai"
import { motion } from "framer-motion"
import BrandLayout from "../components/BrandLayout"
import CampaignTabs from "../components/campaign/CampaignTabs"
import axios from "axios"
import Cookies from "js-cookie"

// Types based on your Prisma models
interface User {
  id: string
  username?: string
  profilePic?: string
}

interface CampaignApplication {
  id: string
  userId: string
  campaignId: string
  name: string
  email: string
  text: string
  status: string
  createdAt: string
  updatedAt: string
  user: User
}

interface Campaign {
  id: string
  userId: string
  title: string
  description: string
  requirements: string
  qualifications: string
  delivables: string
  budget: string
  duration: string
  CampaignImage: string
  platform: string
  status: "active" | "draft" | "completed" | "paused"
  createdAt: string
  updatedAt: string
  campaignApplications: CampaignApplication[]
}

// Influencer interface for UI representation
interface Influencer {
  id: string
  name: string
  handle: string
  avatar: string
  followers: string
  engagement: string
  platforms: string[]
  rate: string
  status: "applied" | "selected" | "rejected" | "completed" | "in-progress"
  appliedDate: string
  fit: number
  message?: string
  applicationId?: string // Reference to the actual application
}

const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <Instagram size={16} className="text-pink-600" />
    case "twitter":
      return <Twitter size={16} className="text-blue-500" />
    case "youtube":
      return <Youtube size={16} className="text-red-600" />
    case "tiktok":
      return <AiFillTikTok size={16} className="text-black" />
    default:
      return null
  }
}

const CampaignDetailPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>("influencers")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCampaign()
  }, [campaignId ])

  const loadCampaign = async () => {
    if (!campaignId) return

    setLoading(true)
    try {
      const token = Cookies.get("jwt")
      const response = await axios.get(`https://api.taseer.app/api/campaign/${campaignId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      //@ts-expect-error - network error
      setCampaign(response.data)

      // Transform campaign applications to influencers for UI
            //@ts-expect-error - network error
      const transformedInfluencers = response.data.campaignApplications.map((app: CampaignApplication) => ({
        id: app.userId,
        applicationId: app.id,
        name: app.name,
        handle: app.user?.username ? `@${app.user.username}` : "@user",
        avatar: app.user?.profilePic || "/placeholder.svg",
        followers: "N/A", // This data isn't in your model, could be fetched separately
        engagement: "N/A",
              //@ts-expect-error - network error
        platforms: [response.data.platform], // Using the campaign platform
        rate: "N/A",
        status: mapApplicationStatus(app.status),
        appliedDate: new Date(app.createdAt).toLocaleDateString(),
        fit: 85, // Placeholder value
        message: app.text,
      }))

      setInfluencers(transformedInfluencers)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching campaign:", err)
      setError("Failed to load campaign data")
      toast.error("Failed to load campaign data")
      setLoading(false)
    }
  }

  // Map backend status to UI status
  const mapApplicationStatus = (status: string): "applied" | "selected" | "rejected" | "completed" | "in-progress" => {
    switch (status) {
      case "accepted":
        return "selected"
      case "rejected":
        return "rejected"
      case "completed":
        return "completed"
      case "in-progress":
        return "in-progress"
      default:
        return "applied"
    }
  }

  // Map UI status to backend status
  const mapToBackendStatus = (status: string): string => {
    switch (status) {
      case "selected":  
        return "accepted"
      case "rejected":
        return "rejected"
      case "completed":
        return "completed"
      case "in-progress":
        return "in-progress"
      default:
        return "none"
    }
  }

  const handleUpdateCampaign = async (updatedData: Partial<Campaign>) => {
    if (!campaignId) return

    try {
      const token = Cookies.get("jwt")
      const response = await axios.put(`https://api.taseer.app/api/campaigns/${campaignId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })
            //@ts-expect-error - network error

      setCampaign((prev) => (prev ? { ...prev, ...response.data } : response.data))
      toast.success("Campaign updated successfully")
    } catch (err) {
      console.error("Error updating campaign:", err)
      toast.error("Failed to update campaign")
    }
  }

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const token = Cookies.get("jwt")
      const backendStatus = mapToBackendStatus(newStatus)
      await axios.put(
        `https://api.taseer.app/api/campaign-applications/${applicationId}/status`,
        { status: backendStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      // Update local state
      setInfluencers((prev) =>

        prev.map((inf) => (inf.applicationId === applicationId ? { ...inf, status: newStatus as any } : inf)),
      )

      toast.success(`Influencer status updated to ${newStatus}`)
      loadCampaign() // Refresh data
    } catch (err) {
      console.error("Error updating application status:", err)
      toast.error("Failed to update influencer status")
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800"
      case "selected":
        return "bg-indigo-100 text-indigo-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-amber-100 text-amber-800"
      case "completed":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredInfluencers = influencers.filter((influencer) => {
    const matchesStatus = statusFilter === "all" || influencer.status === statusFilter
    const matchesSearch =
      influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.handle.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Handle form submission for campaign settings
  const handleSaveChanges = async () => {
    const title = (document.getElementById("campaign-title") as HTMLInputElement)?.value
    const description = (document.getElementById("campaign-description") as HTMLTextAreaElement)?.value
    const budget = (document.getElementById("campaign-budget") as HTMLInputElement)?.value
    const platform = (document.getElementById("campaign-platform") as HTMLSelectElement)?.value
    const requirements = (document.getElementById("campaign-requirements") as HTMLTextAreaElement)?.value
    const qualifications = (document.getElementById("campaign-qualifications") as HTMLTextAreaElement)?.value
    const delivables = (document.getElementById("campaign-delivables") as HTMLTextAreaElement)?.value

    const updatedData = {
      title,
      description,
      budget: `$${budget}`,
      platform,
      requirements,
      qualifications,
      delivables,
    }

    await handleUpdateCampaign(updatedData)
  }

  // Render the influencers tab content
  const renderInfluencersTab = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Loading campaign data...</h3>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <X size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">{error}</h3>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      )
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Search influencers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${statusFilter === "all" ? "bg-purple-100 text-purple-800" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setStatusFilter("all")}
              >
                All
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${statusFilter === "applied" ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setStatusFilter("applied")}
              >
                Applied ({influencers.filter((i) => i.status === "applied").length})
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${statusFilter === "selected" ? "bg-indigo-100 text-indigo-800" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setStatusFilter("selected")}
              >
                Selected ({influencers.filter((i) => i.status === "selected").length})
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${statusFilter === "in-progress" ? "bg-amber-100 text-amber-800" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setStatusFilter("in-progress")}
              >
                In Progress ({influencers.filter((i) => i.status === "in-progress").length})
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${statusFilter === "completed" ? "bg-emerald-100 text-emerald-800" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setStatusFilter("completed")}
              >
                Completed ({influencers.filter((i) => i.status === "completed").length})
              </button>
            </div>
          </div>
        </div>
        {filteredInfluencers.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredInfluencers.map((influencer) => (
              <motion.div
                key={influencer.id}
                className="p-5 hover:bg-gray-50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                      <img
                        src={influencer.avatar || "/placeholder.svg"}
                        alt={influencer.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{influencer.name}</h3>
                        <span className="ml-2 text-sm text-gray-500">{influencer.handle}</span>
                        {influencer.fit >= 90 && (
                          <span className="ml-2 flex items-center text-amber-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 fill-amber-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-xs font-medium">Top Match</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1 space-x-3 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          {influencer.platforms.map((platform) => (
                            <span key={`${influencer.id}-${platform}`} className="inline-flex items-center">
                              <SocialIcon platform={platform} />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(influencer.status)}`}
                      >
                        {influencer.status === "applied" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                        {influencer.status === "selected" && <Check size={12} className="mr-1" />}
                        {influencer.status === "rejected" && <X size={12} className="mr-1" />}
                        <span className="capitalize">{influencer.status}</span>
                      </span>
                      <div className="mt-1 text-sm text-gray-500">Applied on {influencer.appliedDate}</div>
                    </div>
                    {influencer.status === "applied" && influencer.applicationId && (
                      <div className="flex gap-2">
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          onClick={() => handleUpdateApplicationStatus(influencer.applicationId!, "selected")}
                        >
                          <Check size={16} className="mr-1" /> Select
                        </button>
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          onClick={() => handleUpdateApplicationStatus(influencer.applicationId!, "rejected")}
                        >
                          <X size={16} className="mr-1" /> Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {influencer.status === "applied" && influencer.message && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-600">"{influencer.message}"</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No influencers found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    )
  }

  // Render the details tab content
  const renderDetailsTab = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Overview</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-600 text-sm whitespace-pre-line">{campaign?.description}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Requirements</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-600 text-sm whitespace-pre-line">{campaign?.requirements}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Qualifications</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-600 text-sm whitespace-pre-line">{campaign?.qualifications}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Deliverables</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-600 text-sm whitespace-pre-line">{campaign?.delivables}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Platform</h3>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <SocialIcon platform={campaign?.platform || ""} />
                  <span className="ml-1 text-gray-600">{campaign?.platform}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Campaign Details</h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="flex items-center mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        campaign?.status === "active"
                          ? "bg-green-100 text-green-800"
                          : campaign?.status === "paused"
                            ? "bg-amber-100 text-amber-800"
                            : campaign?.status === "draft"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          campaign?.status === "active"
                            ? "bg-green-600"
                            : campaign?.status === "paused"
                              ? "bg-amber-600"
                              : campaign?.status === "draft"
                                ? "bg-gray-600"
                                : "bg-blue-600"
                        }`}
                      ></div>

                      {campaign && campaign?.status?.charAt(0).toUpperCase() + campaign?.status?.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Budget</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">{campaign?.budget}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Duration</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">{campaign?.duration} days</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Created</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {new Date(campaign?.createdAt || "").toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Last Updated</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {new Date(campaign?.updatedAt || "").toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Actions</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <button
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Edit2 size={16} className="mr-2" /> Edit Campaign
                  </button>
                  <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    <Share2 size={16} className="mr-2" /> Share Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render the settings tab content
  const renderSettingsTab = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Campaign Settings</h3>
          <p className="mt-1 text-sm text-gray-500">Update your campaign details and preferences.</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h4>
            <div className="space-y-4">
              <div>
                <label htmlFor="campaign-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  id="campaign-title"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  defaultValue={campaign?.title}
                />
              </div>
              <div>
                <label htmlFor="campaign-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="campaign-description"
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  defaultValue={campaign?.description}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="campaign-budget" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Budget
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      id="campaign-budget"
                      className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      defaultValue={campaign?.budget?.replace("$", "")}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="campaign-platform" className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    id="campaign-platform"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    defaultValue={campaign?.platform || "Instagram"}
                  >
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>YouTube</option>
                    <option>Twitter</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Campaign Details</h4>
            <div className="space-y-4">
              <div>
                <label htmlFor="campaign-requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <div className="mt-1">
                  <textarea
                    id="campaign-requirements"
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    defaultValue={campaign?.requirements}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="campaign-qualifications" className="block text-sm font-medium text-gray-700 mb-1">
                  Qualifications
                </label>
                <div className="mt-1">
                  <textarea
                    id="campaign-qualifications"
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    defaultValue={campaign?.qualifications}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="campaign-delivables" className="block text-sm font-medium text-gray-700 mb-1">
                  Deliverables
                </label>
                <div className="mt-1">
                  <textarea
                    id="campaign-delivables"
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    defaultValue={campaign?.delivables}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Status</h4>
            <div className="mt-1">
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="status-active"
                    name="status"
                    type="radio"
                    checked={campaign?.status === "active"}
                    onChange={() => handleUpdateCampaign({ status: "active" })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="status-active" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="status-paused"
                    name="status"
                    type="radio"
                    checked={campaign?.status === "paused"}
                    onChange={() => handleUpdateCampaign({ status: "paused" })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="status-paused" className="ml-2 block text-sm text-gray-700">
                    Paused
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="status-draft"
                    name="status"
                    type="radio"
                    checked={campaign?.status === "draft"}
                    onChange={() => handleUpdateCampaign({ status: "draft" })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="status-draft" className="ml-2 block text-sm text-gray-700">
                    Draft
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="status-completed"
                    name="status"
                    type="radio"
                    checked={campaign?.status === "completed"}
                    onChange={() => handleUpdateCampaign({ status: "completed" })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="status-completed" className="ml-2 block text-sm text-gray-700">
                    Completed
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200 flex justify-end">
            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={() => window.location.reload()}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <BrandLayout>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <button
                onClick={() => navigate("/brand/my-campaigns")}
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={16} className="mr-1" /> Back to Campaigns
              </button>
            </div>

            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{campaign?.title || "Loading..."}</h1>
                  <div className="mt-1 flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        campaign?.status === "active"
                          ? "bg-green-100 text-green-800"
                          : campaign?.status === "paused"
                            ? "bg-amber-100 text-amber-800"
                            : campaign?.status === "draft"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          campaign?.status === "active"
                            ? "bg-green-600"
                            : campaign?.status === "paused"
                              ? "bg-amber-600"
                              : campaign?.status === "draft"
                                ? "bg-gray-600"
                                : "bg-blue-600"
                        }`}
                      ></div>
                      {campaign && campaign?.status?.charAt(0).toUpperCase() + campaign?.status?.slice(1) || "Loading..."}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">Duration: {campaign?.duration || "0"} days</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">Budget: {campaign?.budget || "$0"}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Edit2 size={16} className="mr-1" /> Edit Campaign
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    <Share2 size={16} className="mr-1" /> Share
                  </button>
                </div>
              </div>
            </div>

            <CampaignTabs
              campaignId={campaignId || ""}
              refreshCampaign={loadCampaign}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              influencersComponent={renderInfluencersTab()}
              detailsComponent={renderDetailsTab()}
              settingsComponent={renderSettingsTab()}
            />
          </div>
        </div>
      </BrandLayout>
    </>
  )
}

export default CampaignDetailPage
