"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  FaSearch,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  // FaFilter,
} from "react-icons/fa"
import BrandLayout from "../components/BrandLayout"
import { AiFillHeart } from "react-icons/ai"

// API base URL - replace with your actual API URL
const API_BASE_URL = "https://api.taseer.app/api"

// Available categories for filtering

// Interface for creator/influencer data
interface Creator {
  id: string
  username: string
  firstName: string
  lastName: string
  profilePic: string
  city: string
  creatorMeta?: {
    typeOfContent: any
    averageEngagementRate: string
    brandsWorkedWith: string
  }
  socialHandles?: {
    instagram?: string
    tiktok?: string
    youtube?: string
    facebook?: string
    linkedin?: string
    x?: string
  }
}

// Interface for pagination data
interface PaginationData {
  total: number
  pages: number
  page: number
  limit: number
}

const MyCreators: React.FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [creators, setCreators] = useState<Creator[]>([])
  const [minFollowers, setMinFollowers] = useState<number>(0)
  const [minEngagement, setMinEngagement] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 9,
  })
  const [currentBrandId, setCurrentBrandId] = useState<string>("")

  // Fetch the current brand ID (this would come from your auth system)
  useEffect(() => {
    // This is a placeholder - replace with your actual auth logic
    const fetchCurrentUser = async () => {
      try {
        // Replace with your actual API call to get the current user
        // const response = await fetch(`${API_BASE_URL}/auth/me`)
        // const data = await response.json()
        // if (data.user && data.user.id) {
        //   setCurrentBrandId(data.user.id)
        // }

        // For demo purposes, set a mock brand ID
        setCurrentBrandId("mock-brand-id")
      } catch (error) {
        console.error("Error fetching current user:", error)
        // For demo purposes, set a mock brand ID
        setCurrentBrandId("mock-brand-id")
      }
    }

    fetchCurrentUser()
  }, [])

  // Fetch favorite creators with filters and pagination
  const fetchFavoriteCreators = async (page = 1) => {
    if (!currentBrandId) return

    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        brandId: currentBrandId,
        page: page.toString(),
        limit: pagination.limit.toString(),
        search: searchTerm,
        categories: selectedCategories.join(","),
        platforms: selectedPlatforms.join(","),
        minFollowers: minFollowers.toString(),
        minEngagement: minEngagement.toString(),
      })

      const response = await fetch(`${API_BASE_URL}/creators/favorites?${queryParams}`)
      const data = await response.json()

      if (data.creators) {
        setCreators(data.creators)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching favorite creators:", error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (currentBrandId) {
      fetchFavoriteCreators()
    }
  }, [currentBrandId])

  // Fetch when filters change
  useEffect(() => {
    if (currentBrandId) {
      fetchFavoriteCreators(1) // Reset to first page when filters change
    }
  }, [currentBrandId, searchTerm, selectedCategories, selectedPlatforms, minFollowers, minEngagement])

  // const handleCategoryToggle = (category: string) => {
  //   setSelectedCategories((prev) =>
  //     prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
  //   )
  // }

  // const handlePlatformToggle = (platform: string) => {
  //   setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  // }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      fetchFavoriteCreators(newPage)
    }
  }

  const toggleFavorite = async (creatorId: string) => {
    if (!currentBrandId) return

    try {
      const response = await fetch(`${API_BASE_URL}/creators/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandId: currentBrandId,
          creatorId,
        }),
      })

      const data = await response.json()

      if (!data.isFavorite) {
        // Remove from the list if unfavorited
        setCreators((prev) => prev.filter((creator) => creator.id !== creatorId))
        // Update pagination
        setPagination((prev) => ({
          ...prev,
          total: prev.total - 1,
          pages: Math.ceil((prev.total - 1) / prev.limit),
        }))
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const handleVisitProfile = (id: string) => {
    navigate(`/profile/${id}`)
  }

  const handleMessage = (id: string) => {
    navigate(`/brand/messages?id=${id}`)
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <FaInstagram />
      case "tiktok":
        return <FaTiktok />
      case "youtube":
        return <FaYoutube />
      case "facebook":
        return <FaFacebook />
      case "linkedin":
        return <FaLinkedin />
      case "x":
        return <FaTwitter />
      default:
        return null
    }
  }

  // Helper function to get platform follower counts
  const getFollowerCounts = (creator: Creator) => {
    if (!creator.socialHandles) return []

    return Object.entries(creator.socialHandles)
      .filter(([_, value]) => value) // Only include platforms with values
      .map(([platform, _]) => ({
        platform,
        count: "100K", // This would come from your actual data
      }))
  }

  // Helper function to get creator categories
  const getCategories = (creator: Creator) => {
    if (!creator.creatorMeta?.typeOfContent) return []

    try {
      return Array.isArray(creator.creatorMeta.typeOfContent)
        ? creator.creatorMeta.typeOfContent
        : JSON.parse(creator.creatorMeta.typeOfContent.toString())
    } catch (e) {
      return []
    }
  }

  // Helper function to get previous brands
  const getPreviousBrands = (creator: Creator) => {
    if (!creator.creatorMeta?.brandsWorkedWith) return []

    return creator.creatorMeta.brandsWorkedWith.split(",").map((brand) => brand.trim())
  }

  return (
    <>
      <BrandLayout>
        <div className="min-h-screen bg-gray-50 pt-6 pb-12">
          <div className=" mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold capitalize text-gray-900 mb-4">
                Creators those you have <span className="text-[#6a38ca]">Loved </span> to work with .
              </h1>
              <p className="text-lg text-gray-600  mx-auto">
                Connect with top-tier influencers who can elevate your brand and engage with your target audience across
                multiple platforms.
              </p>
            </div>

          

            {/* Results Count */}
            <div className="mb-6 px-2">
              <p className="text-gray-600">
                {pagination.total} favorite creators found{" "}
                {searchTerm ||
                selectedCategories.length > 0 ||
                selectedPlatforms.length > 0 ||
                minFollowers > 0 ||
                minEngagement > 0
                  ? "matching your criteria"
                  : ""}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6a38ca]"></div>
              </div>
            )}

            {/* Creators Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creators.map((creator) => {
                  const creatorCategories = getCategories(creator)
                  const followerCounts = getFollowerCounts(creator)
                  const previousBrands = getPreviousBrands(creator)

                  return (
                    <motion.div
                      key={creator.id}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                      }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all"
                    >
                      <div className="relative">
                        {/* Top background accent */}
                        <div className="h-20 bg-gradient-to-r from-[#6a38ca] to-[#9969f8]" />

                        {/* Avatar */}
                        <div className="absolute left-6 top-6 w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                          <img
                            src={creator.profilePic || `/api/placeholder/150/150?text=${creator.firstName.charAt(0)}`}
                            alt={`${creator.firstName} ${creator.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-6 pt-12 pb-6">
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">{`${creator.firstName} ${creator.lastName}`}</h2>
                            <button
                              onClick={() => toggleFavorite(creator.id)}
                              className="text-red-500 hover:scale-110 transition-transform duration-200"
                            >
                              <AiFillHeart className="w-6 h-6" />
                            </button>
                          </div>
                          <p className="text-gray-500 text-sm">@{creator.username}</p>
                          <p className="text-gray-600 text-sm mt-1 flex items-center">
                            <FaMapMarkerAlt className="mr-1" /> {creator.city}
                          </p>
                        </div>

                        {/* Categories */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {/* @typescript-eslint/no-explicit-any */}
                            {creatorCategories.slice(0, 3).map((category:any) => (
                              <span key={category} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                                {category}
                              </span>
                            ))}
                            {creatorCategories.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                                +{creatorCategories.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Social platforms with follower counts */}
                        <div className="mb-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            {followerCounts.map(({ platform, count }) => (
                              <div
                                key={platform}
                                className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1"
                              >
                                {getPlatformIcon(platform)}
                                <span className="text-sm font-medium">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Engagement</p>
                            <p className="font-bold text-[#6a38ca]">
                              {creator.creatorMeta?.averageEngagementRate || "0%"}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Rating</p>
                            <p className="font-bold text-[#6a38ca] flex items-center justify-center">
N/A                            </p>
                          </div>
                        </div>

                        {/* Previous brands */}
                        <div className="mb-6">
                          <p className="text-sm text-gray-500 mb-2">Previous collaborations:</p>
                          <p className="text-sm font-medium">
                            {previousBrands.length > 0 ? previousBrands.join(", ") : "No previous collaborations"}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleVisitProfile(creator.id)}
                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors"
                          >
                            Visit Profile
                          </button>
                          <button
                            onClick={() => handleMessage(creator.id)}
                            className="px-4 py-3 bg-[#6a38ca] hover:bg-[#5c2eb8] text-white font-medium rounded-xl transition-colors"
                          >
                            Message
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Empty state */}
            {!loading && creators.length === 0 && (
              <div className="bg-white rounded-2xl shadow p-8 text-center">
                <FaSearch className="mx-auto text-gray-300 text-5xl mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No favorite creators found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters, or add some creators to your favorites
                </p>
                <button
                  onClick={() => {
                    setSelectedCategories([])
                    setSelectedPlatforms([])
                    setMinFollowers(0)
                    setMinEngagement(0)
                    setSearchTerm("")
                  }}
                  className="px-6 py-3 bg-[#6a38ca] text-white font-medium rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && creators.length > 0 && pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`px-3 py-2 rounded-lg ${
                      pagination.page === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show current page, first page, last page, and pages around current page
                      return page === 1 || page === pagination.pages || Math.abs(page - pagination.page) <= 1
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there are gaps
                      const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1
                      const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1

                      return (
                        <React.Fragment key={page}>
                          {showEllipsisBefore && <span className="px-3 py-2">...</span>}

                          <button
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg ${
                              pagination.page === page
                                ? "bg-[#6a38ca] text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {page}
                          </button>

                          {showEllipsisAfter && <span className="px-3 py-2">...</span>}
                        </React.Fragment>
                      )
                    })}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className={`px-3 py-2 rounded-lg ${
                      pagination.page === pagination.pages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </BrandLayout>
    </>
  )
}

// Helper component for the location icon
const FaMapMarkerAlt = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M8 1a5 5 0 0 0-5 5c0 2.761 2.01 5.924 4.59 8.384.792.849 2.028.849 2.82 0C12.99 11.924 15 8.761 15 6a5 5 0 0 0-5-5zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
  </svg>
)

export default MyCreators
