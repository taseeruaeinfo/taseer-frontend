"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Send, LinkIcon } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
import Cookies from "js-cookie"

interface DeliverableSubmissionProps {
  campaignId: string
  deliverableId: string
  platform: string
  contentType: string
  onSubmit: () => void
}

export default function DeliverableSubmission({
  campaignId,
  deliverableId,
  platform,
  contentType,
  onSubmit,
}: DeliverableSubmissionProps) {
  const [url, setUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!url) {
      toast.error("Please enter a content URL")
      return
    }

    try {
      setLoading(true)
      const token = Cookies.get("jwt")
      await axios.post(
        `http://localhost:5000/api/campaigns/${campaignId}/deliverables/${deliverableId}/submit`,
        { url, notes },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      toast.success("Content submitted successfully")
      setUrl("")
      setNotes("")
      onSubmit()
    } catch (error) {
      console.error("Error submitting content:", error)
      toast.error("Failed to submit content")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
    >
      <div className="bg-purple-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Submit {contentType} for {platform}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="content-url" className="block text-sm font-medium text-gray-700 mb-1">
              Content URL <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon size={16} className="text-gray-400" />
              </div>
              <input
                type="url"
                id="content-url"
                value={url}
                onChange={handleUrlChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder={`Enter your ${platform} ${contentType.toLowerCase()} URL`}
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Please provide the direct link to your content on {platform}</p>
          </div>

          <div>
            <label htmlFor="content-notes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              id="content-notes"
              value={notes}
              onChange={handleNotesChange}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Add any additional information about your content"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading || !url}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                loading || !url ? "opacity-70 cursor-not-allowed" : ""
              }`}
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
                  Submitting...
                </span>
              ) : (
                <>
                  <Send size={16} className="mr-1" /> Submit Content
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
