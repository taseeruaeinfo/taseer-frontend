"use client"

import type React from "react"

// import { useState } from "react"
import { motion } from "framer-motion"
import { Users, BarChart2, FileText, Settings } from "lucide-react"
import SelectedCreators from "./SelectedCreators"

interface CampaignTabsProps {
  campaignId: string
  refreshCampaign: () => void
  activeTab: string
  setActiveTab: (tab: string) => void
  influencersComponent: React.ReactNode
  detailsComponent: React.ReactNode
  settingsComponent: React.ReactNode
}

export default function CampaignTabs({
  campaignId,
  refreshCampaign,
  activeTab,
  setActiveTab,
  influencersComponent,
  detailsComponent,
  settingsComponent,
}: CampaignTabsProps) {
  const tabs = [
    { id: "influencers", label: "Applicants", icon: <Users size={18} /> },
    { id: "selected", label: "Selected Creators", icon: <Users size={18} /> },
    // { id: "progress", label: "Progress", icon: <BarChart2 size={18} /> },
    { id: "details", label: "Details", icon: <FileText size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ]

  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "influencers" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {influencersComponent}
          </motion.div>
        )}

        {activeTab === "selected" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <SelectedCreators campaignId={campaignId} refreshCampaign={refreshCampaign} />
          </motion.div>
        )}

        {activeTab === "progress" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <CampaignProgress campaignId={campaignId} />
          </motion.div>
        )}

        {activeTab === "details" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {detailsComponent}
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {settingsComponent}
          </motion.div>
        )}
      </div>
    </div>
  )
}

function CampaignProgress({ campaignId }: { campaignId: string }) {
console.log(campaignId)
//   const [loading, setLoading] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Progress</h3>
        <div className="flex items-center">
          <div className="flex-grow">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-purple-600 h-3 rounded-full" style={{ width: "40%" }}></div>
            </div>
          </div>
          <span className="ml-4 text-lg font-medium">40%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-gray-500 text-sm font-medium">Budget Spent</h4>
          </div>
          <div className="mt-2 flex items-end">
            <p className="text-2xl font-bold text-gray-900">$2,200</p>
            <p className="ml-2 text-sm text-gray-500">of $5,000</p>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: "44%" }}></div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-gray-500 text-sm font-medium">Creators Secured</h4>
          </div>
          <div className="mt-2 flex items-end">
            <p className="text-2xl font-bold text-gray-900">4</p>
            <p className="ml-2 text-sm text-gray-500">of 10 target</p>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: "40%" }}></div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-gray-500 text-sm font-medium">Content Delivered</h4>
          </div>
          <div className="mt-2 flex items-end">
            <p className="text-2xl font-bold text-gray-900">2</p>
            <p className="ml-2 text-sm text-gray-500">of 8 deliverables</p>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: "25%" }}></div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
      <div className="border-l-4 border-purple-600 pl-4 ml-4 space-y-6 mb-8">
        <div className="relative">
          <div className="w-3 h-3 bg-purple-600 rounded-full absolute -left-6 mt-1.5"></div>
          <div>
            <p className="text-sm text-gray-500">May 1, 2023</p>
            <p className="font-medium text-gray-900">Campaign created</p>
          </div>
        </div>
        <div className="relative">
          <div className="w-3 h-3 bg-purple-600 rounded-full absolute -left-6 mt-1.5"></div>
          <div>
            <p className="text-sm text-gray-500">May 5, 2023</p>
            <p className="font-medium text-gray-900">Received 12 influencer applications</p>
          </div>
        </div>
        <div className="relative">
          <div className="w-3 h-3 bg-purple-600 rounded-full absolute -left-6 mt-1.5"></div>
          <div>
            <p className="text-sm text-gray-500">May 10, 2023</p>
            <p className="font-medium text-gray-900">Selected 4 influencers</p>
          </div>
        </div>
        <div className="relative">
          <div className="w-3 h-3 bg-purple-600 rounded-full absolute -left-6 mt-1.5 border-2 border-white"></div>
          <div>
            <p className="text-sm text-gray-500">Current Status</p>
            <p className="font-medium text-gray-900">Campaign active</p>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-4">Latest Updates</h3>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">Sarah Johnson submitted content for approval</p>
            <p className="text-sm text-gray-500">May 15, 2023</p>
          </div>
          <p className="text-sm text-gray-600 mt-1">Instagram post ready for review</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">Mike Chen approved contract</p>
            <p className="text-sm text-gray-500">May 12, 2023</p>
          </div>
          <p className="text-sm text-gray-600 mt-1">Ready to begin creating content</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">Alex Wong posted content live</p>
            <p className="text-sm text-gray-500">May 11, 2023</p>
          </div>
          <p className="text-sm text-gray-600 mt-1">TikTok video is now live</p>
        </div>
      </div>
    </div>
  )
}
