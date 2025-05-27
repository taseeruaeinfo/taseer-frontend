"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Check, X, Clock, ExternalLink, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
import Cookies from "js-cookie"

interface Campaign {
  id: string
  title: string
  description: string
  budget: string
  duration: string
  platform: string
  status: string
  CampaignImage: string
}

interface Application {
  id: string
  campaignId: string
  status: string
  createdAt: string
  campaign: Campaign
  contract?: Contract
  deliverables?: Deliverable[]
  questions?: Questions
}

interface Contract {
  id: number
  title: string
  description: string
  compensation: string
  deliverables: string
  timeline: string
  terms: string
  status: string
}

interface Deliverable {
  id: number
  platform: string
  contentType: string
  notes: string
  status: string
  url: string | null
  approvalDate: string | null
  postDate: string | null
}

interface Questions {
  id: number
  needEmail: boolean
  needPhone: boolean
  needShippingAddress: boolean
}

export default function CreatorCampaigns() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [currentApplication, setCurrentApplication] = useState<Application | null>(null)
  const [creatorInfo, setCreatorInfo] = useState({
    email: "",
    phone: "",
    shippingAddress: "",
  })

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const token = Cookies.get("jwt")
      const response = await axios.get("http://localhost:5000/api/creator/applications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      //@ts-expect-error - network error
      setApplications(response.data)
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast.error("Failed to load your applications")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptContract = async (applicationId: string) => {
    try {
      const token = Cookies.get("jwt")
      await axios.post(
        `http://localhost:5000/api/creator/applications/${applicationId}/contract/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      toast.success("Contract accepted successfully")
      fetchApplications()
    } catch (error) {
      console.error("Error accepting contract:", error)
      toast.error("Failed to accept contract")
    }
  }

  const handleRejectContract = async (applicationId: string) => {
    try {
      const token = Cookies.get("jwt")
      await axios.post(
        `http://localhost:5000/api/creator/applications/${applicationId}/contract/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      toast.success("Contract rejected")
      fetchApplications()
    } catch (error) {
      console.error("Error rejecting contract:", error)
      toast.error("Failed to reject contract")
    }
  }

  const handleSubmitInfo = async (applicationId: string) => {
    if (!creatorInfo.email && !creatorInfo.phone && !creatorInfo.shippingAddress) {
      toast.error("Please provide at least one piece of information")
      return
    }

    try {
      const token = Cookies.get("jwt")
      await axios.post(`http://localhost:5000/api/creator/applications/${applicationId}/info`, creatorInfo, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Information submitted successfully")
      setShowInfoModal(false)
      setCreatorInfo({ email: "", phone: "", shippingAddress: "" })
      fetchApplications()
    } catch (error) {
      console.error("Error submitting information:", error)
      toast.error("Failed to submit information")
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getApplicationStatusIndicator = (application: Application) => {
    // Check if questions are pending
    if (application.questions) {
      return (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            Information requested by brand. Please provide the required details.
          </p>
        </div>
      )
    }

    // Check if contract is pending
    if (application.contract && application.contract.status === "pending") {
      return (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800 flex items-center">
            <Clock size={14} className="mr-1" />
            Contract received. Please review and respond.
          </p>
        </div>
      )
    }

    // Check if deliverables are waiting for content
    if (application.deliverables && application.deliverables.some((d) => d.status === "content_in_progress")) {
      return (
        <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-md">
          <p className="text-sm text-purple-800 flex items-center">
            <Clock size={14} className="mr-1" />
            Deliverables assigned. Content creation in progress.
          </p>
        </div>
      )
    }

    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Campaign Applications</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your campaign applications and deliverables</p>
      </div>

      <div className="space-y-6">
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <X size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
            <p className="mt-2 text-gray-500">Start applying to campaigns to see them here.</p>
            <button
              onClick={() => navigate("/deals")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              Browse Campaigns
            </button>
          </div>
        ) : (
          applications.map((application) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div
                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedApplication(expandedApplication === application.id ? null : application.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={application.campaign.CampaignImage || "/placeholder.svg"}
                        alt={application.campaign.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{application.campaign.title}</h3>
                      <div className="flex items-center mt-1 space-x-3 text-sm text-gray-500">
                        <span>{application.campaign.platform}</span>
                        <span>•</span>
                        <span>{application.campaign.budget}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        application.status,
                      )}`}
                    >
                      {application.status === "accepted" && <Check size={12} className="mr-1" />}
                      {application.status === "rejected" && <X size={12} className="mr-1" />}
                      {application.status === "pending" && <Clock size={12} className="mr-1" />}
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    {expandedApplication === application.id ? (
                      <ChevronUp size={20} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {getApplicationStatusIndicator(application)}
              </div>

              {expandedApplication === application.id && (
                <div className="border-t border-gray-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Campaign Details</h4>
                      <div className="bg-gray-50 rounded-md p-4">
                        <p className="text-sm text-gray-600">{application.campaign.description}</p>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Duration:</span> {application.campaign.duration}
                          </div>
                          <div>
                            <span className="font-medium">Budget:</span> {application.campaign.budget}
                          </div>
                        </div>
                      </div>

                      {application.questions && (
                        <div className="mt-6">
                          <h4 className="font-medium text-gray-900 mb-3">Information Requested</h4>
                          <div className="space-y-2">
                            {application.questions.needEmail && (
                              <div className="flex items-center">
                                <AlertCircle size={14} className="text-amber-500 mr-2" />
                                <span className="text-sm text-gray-700">Email Address Required</span>
                              </div>
                            )}
                            {application.questions.needPhone && (
                              <div className="flex items-center">
                                <AlertCircle size={14} className="text-amber-500 mr-2" />
                                <span className="text-sm text-gray-700">Phone Number Required</span>
                              </div>
                            )}
                            {application.questions.needShippingAddress && (
                              <div className="flex items-center">
                                <AlertCircle size={14} className="text-amber-500 mr-2" />
                                <span className="text-sm text-gray-700">Shipping Address Required</span>
                              </div>
                            )}
                            <button
                              onClick={() => {
                                setCurrentApplication(application)
                                setShowInfoModal(true)
                              }}
                              className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Provide Information
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      {application.contract && (
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-3">Contract Details</h4>
                          <div className="bg-gray-50 rounded-md p-4">
                            <h5 className="font-medium text-gray-800">{application.contract.title}</h5>
                            <p className="mt-2 text-sm text-gray-600">{application.contract.description}</p>
                            <div className="mt-4 space-y-2 text-sm">
                              <p>
                                <span className="font-medium">Compensation:</span> {application.contract.compensation}
                              </p>
                              <p>
                                <span className="font-medium">Timeline:</span> {application.contract.timeline}
                              </p>
                              <p>
                                <span className="font-medium">Deliverables:</span> {application.contract.deliverables}
                              </p>
                            </div>
                            {application.contract.status === "pending" && (
                              <div className="mt-4 flex gap-2">
                                <button
                                  onClick={() => handleAcceptContract(application.id)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                >
                                  <Check size={14} className="mr-1" /> Accept
                                </button>
                                <button
                                  onClick={() => handleRejectContract(application.id)}
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <X size={14} className="mr-1" /> Reject
                                </button>
                              </div>
                            )}
                            {application.contract.status === "approved" && (
                              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                                <p className="text-sm text-green-800 flex items-center">
                                  <Check size={14} className="mr-1" />
                                  Contract accepted. Waiting for deliverables assignment.
                                </p>
                              </div>
                            )}
                            {application.contract.status === "rejected" && (
                              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800 flex items-center">
                                  <X size={14} className="mr-1" />
                                  Contract rejected.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {application.deliverables && application.deliverables.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Deliverables</h4>
                          <div className="space-y-4">
                            {application.deliverables.map((deliverable) => (
                              <div key={deliverable.id} className="bg-gray-50 rounded-md p-4 border border-gray-200">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {deliverable.contentType} on {deliverable.platform}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">{deliverable.notes}</p>
                                  </div>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                      deliverable.status,
                                    )}`}
                                  >
                                    {deliverable.status
                                      .split("_")
                                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                      .join(" ")}
                                  </span>
                                </div>

                                {deliverable.url && (
                                  <div className="mt-2">
                                    <a
                                      href={deliverable.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                                    >
                                      <ExternalLink size={14} className="mr-1" /> View Content
                                    </a>
                                  </div>
                                )}

                                {deliverable.status === "content_in_progress" && (
                                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-sm text-blue-800 flex items-center">
                                      <Clock size={14} className="mr-1" />
                                      Create content and wait for brand to submit the URL once posted.
                                    </p>
                                  </div>
                                )}

                                {deliverable.status === "content_submitted" && (
                                  <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-md">
                                    <p className="text-sm text-purple-800 flex items-center">
                                      <Clock size={14} className="mr-1" />
                                      Content URL submitted by brand. Waiting for approval.
                                    </p>
                                  </div>
                                )}

                                {deliverable.status === "approved_for_posting" && (
                                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-sm text-green-800 flex items-center">
                                      <Check size={14} className="mr-1" />
                                      Content approved! You can now post it.
                                    </p>
                                  </div>
                                )}

                                {deliverable.status === "live" && (
                                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                                    <p className="text-sm text-emerald-800 flex items-center">
                                      <Check size={14} className="mr-1" />
                                      Content is live! Great work!
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Information Modal */}
      {showInfoModal && currentApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Provide Required Information</h3>
            <div className="space-y-4">
              {currentApplication.questions?.needEmail && (
                <div>
                  <label htmlFor="creator-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="creator-email"
                    value={creatorInfo.email}
                    onChange={(e) =>
                      setCreatorInfo({
                        ...creatorInfo,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              )}
              {currentApplication.questions?.needPhone && (
                <div>
                  <label htmlFor="creator-phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="creator-phone"
                    value={creatorInfo.phone}
                    onChange={(e) =>
                      setCreatorInfo({
                        ...creatorInfo,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              )}
              {currentApplication.questions?.needShippingAddress && (
                <div>
                  <label htmlFor="creator-address" className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Address
                  </label>
                  <textarea
                    id="creator-address"
                    value={creatorInfo.shippingAddress}
                    onChange={(e) =>
                      setCreatorInfo({
                        ...creatorInfo,
                        shippingAddress: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitInfo(currentApplication.id)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
