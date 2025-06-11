// "use client"

// import { type ReactElement, useState } from "react"
// import { motion } from "framer-motion"
// import {
//   FiTrendingUp,
//   FiUsers,
//   FiHeart,
//   FiEye,
//   FiArrowRight,
//   FiBarChart2,
//   FiDollarSign,
//   FiLayout,
//   FiChevronDown,
//   FiTarget,
//   FiActivity,
// } from "react-icons/fi"
// import { useNavigate } from "react-router-dom"
// import {
//   BarChart,
//   Bar,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
//   Legend,
//   FunnelChart,
//   Funnel,
//   LabelList,
// } from "recharts"
// import BrandLayout from "../components/BrandLayout"

// type NavButtonColor = "purple" | "blue"

// const campaignStats = [
//   { label: "No. of Creators", value: "24", icon: <FiUsers /> },
//   { label: "ROI", value: "12%", icon: <FiTrendingUp /> },
//   { label: "Platform Reach", value: "45k", icon: <FiEye /> },
//   { label: "Budget Spent", value: "$1,500", icon: <FiDollarSign /> },
// ]

// const platformData = [
//   { name: "Instagram", value: 45 },
//   { name: "Facebook", value: 25 },
//   { name: "Twitter", value: 15 },
//   { name: "TikTok", value: 15 },
// ]

// const contentTypeData = [
//   { name: "Reels", value: 40 },
//   { name: "Stories", value: 30 },
//   { name: "Posts", value: 20 },
//   { name: "Articles", value: 10 },
// ]

// const creatorEngagementData = [
//   { name: "Creator 1", engagement: 85, reach: 120 },
//   { name: "Creator 2", engagement: 75, reach: 100 },
//   { name: "Creator 3", engagement: 90, reach: 80 },
//   { name: "Creator 4", engagement: 65, reach: 140 },
// ]

// const COLORS = ["#7c3aed", "#10b981", "#3b82f6", "#f59e0b"]

// // New data for Overview tab
// const campaignsOverview = [
//   { status: "Completed", count: 2 },
//   { status: "Active", count: 1 },
// ]

// const budgetOverview = {
//   allocated: 1000,
//   spent: 650,
//   averagePerCreator: 150,
// }

// const roiMetrics = {
//   views: 75,
//   comments: 60,
//   likes: 65,
//   shares: 40,
//   leadsGenerated: 80,
//   leadsConverted: "Yes",
// }

// const engagementData = [
//   { name: "Instagram", views: 25000, comments: 1200, likes: 3500, shares: 800 },
//   { name: "Facebook", views: 15000, comments: 800, likes: 2000, shares: 400 },
//   { name: "Twitter", views: 8000, comments: 500, likes: 1200, shares: 200 },
//   { name: "TikTok", views: 30000, comments: 1500, likes: 4000, shares: 1000 },
// ]

// const roiVsCampaignData = [
//   { name: "Ramadan", value: 45 },
//   { name: "Summer", value: 30 },
//   { name: "Back to School", value: 25 },
// ]

// const timeVsCreatorData = [
//   { name: "Week 1", "Creator 1": 85, "Creator 2": 65, "Creator 3": 75 },
//   { name: "Week 2", "Creator 1": 90, "Creator 2": 70, "Creator 3": 80 },
//   { name: "Week 3", "Creator 1": 95, "Creator 2": 75, "Creator 3": 85 },
//   { name: "Week 4", "Creator 1": 100, "Creator 2": 80, "Creator 3": 90 },
// ]

// const campaignVsBudgetData = [
//   { name: "Ramadan", budget: 1500, spent: 1200 },
//   { name: "Summer", budget: 1200, spent: 900 },
//   { name: "Back to School", budget: 1000, spent: 650 },
// ]

// const funnelData = [
//   { name: "Reach", value: 50000, fill: "#7c3aed" },
//   { name: "Engagement", value: 25000, fill: "#3b82f6" },
//   { name: "Conversion", value: 5000, fill: "#10b981" },
// ]

// // Campaign options for dropdown
// const campaignOptions = ["Ramadan Campaign", "Summer Campaign", "Back to School Campaign"]

// export default function BrandAnalytics() {
//   const navigate = useNavigate()
//   const [activeTab, setActiveTab] = useState("overview")

//   return (
//     <BrandLayout>
//       <motion.div
//         initial={{ opacity: 0, y: 12 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="p-6 space-y-10"
//       >
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//           <h1 className="text-3xl font-bold text-gray-800">Brand Dashboard</h1>
//           <div className="flex gap-3 flex-wrap">
//             <NavButton
//               label="Favorite Creators"
//               icon={<FiHeart />}
//               path="/brand/favorite-creators"
//               navigate={navigate}
//               color="purple"
//             />
//             <NavButton
//               label="Explore Creators"
//               icon={<FiArrowRight />}
//               path="/brand/explore"
//               navigate={navigate}
//               color="blue"
//             />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-gray-200">
//           <TabButton
//             active={activeTab === "overview"}
//             onClick={() => setActiveTab("overview")}
//             icon={<FiBarChart2 />}
//             label="Overview"
//           />
//           <TabButton
//             active={activeTab === "campaign"}
//             onClick={() => setActiveTab("campaign")}
//             icon={<FiBarChart2 />}
//             label="Campaign Analytics"
//           />
//           <TabButton
//             active={activeTab === "platform"}
//             onClick={() => setActiveTab("platform")}
//             icon={<FiLayout />}
//             label="Platform Analytics"
//           />
//         </div>

//         {/* Tab Content */}
//         {activeTab === "overview" ? (
//           <OverviewTab />
//         ) : activeTab === "campaign" ? (
//           <CampaignAnalyticsTab />
//         ) : (
//           <PlatformAnalyticsTab />
//         )}
//       </motion.div>

//     </BrandLayout>
//   )
// }

// function OverviewTab() {
//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-10">
//       {/* Campaigns Overview */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">Campaigns</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           {campaignsOverview.map((item, i) => (
//             <div key={i} className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
//               <div className="text-purple-600 text-2xl">
//                 {item.status === "Completed" ? <FiTarget /> : <FiActivity />}
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">{item.status}</p>
//                 <p className="text-lg font-bold text-gray-800">{item.count}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Budget Overview */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">Budget</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div className="bg-white p-5 rounded-xl shadow-sm">
//             <p className="text-sm text-gray-500">Allocated</p>
//             <p className="text-lg font-bold text-gray-800">${budgetOverview.allocated}</p>
//           </div>
//           <div className="bg-white p-5 rounded-xl shadow-sm">
//             <p className="text-sm text-gray-500">Spent</p>
//             <p className="text-lg font-bold text-gray-800">${budgetOverview.spent}</p>
//           </div>
//           <div className="bg-white p-5 rounded-xl shadow-sm sm:col-span-2 lg:col-span-1">
//             <p className="text-sm text-gray-500">Average Spend per Creator</p>
//             <p className="text-lg font-bold text-gray-800">${budgetOverview.averagePerCreator}</p>
//           </div>
//         </div>
//       </section>

//       {/* ROI Metrics */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">ROI</h2>
//         <div className="space-y-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">Views</p>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${roiMetrics.views}%` }}></div>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">Comments</p>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${roiMetrics.comments}%` }}></div>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">Likes</p>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${roiMetrics.likes}%` }}></div>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">Shares</p>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${roiMetrics.shares}%` }}></div>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">Leads Generated</p>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${roiMetrics.leadsGenerated}%` }}></div>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">All Leads Generated Tracked</p>
//               <p className="text-lg font-bold text-gray-800">{roiMetrics.leadsConverted}</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Engagement Metrics */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">Engagements</h2>
//         <div className="space-y-6">
//           <div>
//             <h3 className="text-lg font-medium mb-3 text-gray-700">Views vs Platform</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={engagementData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="views" fill="#7c3aed" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div>
//             <h3 className="text-lg font-medium mb-3 text-gray-700">Comments vs Platform</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={engagementData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="comments" fill="#3b82f6" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div>
//             <h3 className="text-lg font-medium mb-3 text-gray-700">Likes vs Platform</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={engagementData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="likes" fill="#10b981" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div>
//             <h3 className="text-lg font-medium mb-3 text-gray-700">Shares vs Platform</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={engagementData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="shares" fill="#f59e0b" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </section>

//       {/* ROI vs Campaign Pie Chart */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">ROI vs Campaign</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie data={roiVsCampaignData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
//               {roiVsCampaignData.map((entry, index) => (
//                 <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//       </section>

//       {/* Time vs Highest Performing Creator */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">Time vs Highest Performing Creator</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={timeVsCreatorData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="Creator 1" stroke="#7c3aed" activeDot={{ r: 8 }} />
//             <Line type="monotone" dataKey="Creator 2" stroke="#3b82f6" />
//             <Line type="monotone" dataKey="Creator 3" stroke="#10b981" />
//           </LineChart>
//         </ResponsiveContainer>
//       </section>

//       {/* Campaign vs Budget Spent */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">Campaign vs Budget Spent</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={campaignVsBudgetData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="budget" fill="#7c3aed" />
//             <Bar dataKey="spent" fill="#3b82f6" />
//           </BarChart>
//         </ResponsiveContainer>
//       </section>

//       {/* Funnel Graph */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">Conversion Funnel</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <FunnelChart>
//             <Tooltip />
//             <Funnel dataKey="value" data={funnelData} isAnimationActive>
//               {funnelData.map((entry, index) => (
//                 <LabelList key={`funnel-${index}`} fill={entry.fill} stroke={entry.fill} />
//               ))}
//             </Funnel>
//           </FunnelChart>
//         </ResponsiveContainer>
//         <div className="mt-4 grid grid-cols-3 gap-4 text-center">
//           <div>
//             <p className="text-sm text-gray-500">Reach</p>
//             <p className="text-lg font-bold text-gray-800">50,000</p>
//             <p className="text-xs text-gray-500">(Likes + Shares + Comments)</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Engagement</p>
//             <p className="text-lg font-bold text-gray-800">25,000</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Conversion</p>
//             <p className="text-lg font-bold text-gray-800">5,000</p>
//             <p className="text-xs text-gray-500">(Leads Generated)</p>
//           </div>
//         </div>
//       </section>
//     </motion.div>
//   )
// }

// function CampaignAnalyticsTab() {
//   const [selectedCampaign, setSelectedCampaign] = useState(campaignOptions[0])

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-10">
//       {/* Campaign Header with Dropdown */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
//           <h2 className="text-xl font-semibold text-gray-700">{selectedCampaign}</h2>
//           <div className="relative mt-2 sm:mt-0">
//             <select
//               value={selectedCampaign}
//               onChange={(e) => setSelectedCampaign(e.target.value)}
//               className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//             >
//               {campaignOptions.map((campaign) => (
//                 <option key={campaign} value={campaign}>
//                   {campaign}
//                 </option>
//               ))}
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <FiChevronDown className="h-4 w-4" />
//             </div>
//           </div>
//         </div>

//         {/* Overview Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {campaignStats.map((item, i) => (
//             <StatCard key={i} icon={item.icon} label={item.label} value={item.value} />
//           ))}
//         </div>
//       </section>

//       {/* Platform vs Engagement Pie Chart */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-lg font-semibold mb-4 text-gray-700">Platform vs Engagement</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie data={platformData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
//               {platformData.map((entry, index) => (
//                 <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//       </section>

//       {/* Creator vs Engagement Bar Chart */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-lg font-semibold mb-4 text-gray-700">Creator vs Engagement</h2>
//         <div className="text-sm text-gray-500 mb-2">Content piece comparison by creator</div>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={creatorEngagementData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="engagement" fill="#7c3aed" />
//             <Bar dataKey="reach" fill="#3b82f6" />
//           </BarChart>
//         </ResponsiveContainer>
//       </section>

//       {/* Creator Comparison */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-lg font-semibold mb-4 text-gray-700">Creator Comparison</h2>
//         <div className="space-y-4">
//           <div className="flex items-center gap-3">
//             <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
//               D
//             </div>
//             <div className="flex-1 p-3 bg-gray-50 rounded-lg">
//               <div className="flex justify-between">
//                 <span className="font-medium">Dave</span>
//                 <span>Performance: 92%</span>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
//               K
//             </div>
//             <div className="flex-1 p-3 bg-gray-50 rounded-lg">
//               <div className="flex justify-between">
//                 <span className="font-medium">Karina</span>
//                 <span>Performance: 87%</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </motion.div>
//   )
// }

// function PlatformAnalyticsTab() {
//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-10">
//       {/* Posts Section */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-lg font-semibold mb-4 text-gray-700">Postings</h2>
//         <div className="space-y-4">
//           {["Reel 1", "Story 1", "Reel 2"].map((post, i) => (
//             <div key={i} className="p-4 border border-gray-200 rounded-lg">
//               <div className="flex justify-between items-center">
//                 <span className="font-medium">{post}</span>
//                 <span className="text-sm text-gray-500">{Math.floor(Math.random() * 1000 + 500)} views</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Content Type Comparison */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-lg font-semibold mb-4 text-gray-700">Content Type Comparison</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie data={contentTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
//               {contentTypeData.map((entry, index) => (
//                 <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//         <div className="mt-4 text-sm text-gray-500 text-center">Comparison for Reels vs Story vs Post vs Article</div>
//       </section>

//       {/* Platform Overview */}
//       <section className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-lg font-semibold mb-4 text-gray-700">Overview</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="p-4 border border-gray-200 rounded-lg">
//             <h3 className="font-medium mb-2">Users Reached</h3>
//             <div className="text-2xl font-bold">24,500</div>
//           </div>
//           <div className="p-4 border border-gray-200 rounded-lg">
//             <h3 className="font-medium mb-2">Engagement Rate</h3>
//             <div className="text-2xl font-bold">8.7%</div>
//           </div>
//           <div className="p-4 border border-gray-200 rounded-lg">
//             <h3 className="font-medium mb-2">Spend</h3>
//             <div className="text-2xl font-bold">$3,250</div>
//           </div>
//           <div className="p-4 border border-gray-200 rounded-lg">
//             <h3 className="font-medium mb-2">Leads Generated</h3>
//             <div className="text-2xl font-bold">142</div>
//           </div>
//         </div>
//       </section>
//     </motion.div>
//   )
// }

// function StatCard({
//   icon,
//   label,
//   value,
// }: {
//   icon: ReactElement
//   label: string
//   value: string
// }) {
//   return (
//     <motion.div whileHover={{ scale: 1.03 }} className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
//       <div className="text-purple-600 text-2xl">{icon}</div>
//       <div>
//         <p className="text-sm text-gray-500">{label}</p>
//         <p className="text-lg font-bold text-gray-800">{value}</p>
//       </div>
//     </motion.div>
//   )
// }

// function NavButton({
//   label,
//   icon,
//   path,
//   navigate,
//   color,
// }: {
//   label: string
//   icon: ReactElement
//   path: string
//   navigate: (item: string) => void
//   color: NavButtonColor
// }) {
//   const colorMap: Record<NavButtonColor, string> = {
//     purple: "text-purple-600 bg-purple-100 hover:bg-purple-200",
//     blue: "text-blue-600 bg-blue-100 hover:bg-blue-200",
//   }
//   return (
//     <button
//       onClick={() => navigate(path)}
//       className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${colorMap[color]}`}
//     >
//       {icon}
//       <span className="ml-2">{label}</span>
//     </button>
//   )
// }

// function TabButton({
//   active,
//   onClick,
//   icon,
//   label,
// }: {
//   active: boolean
//   onClick: () => void
//   icon: ReactElement
//   label: string
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
//         active
//           ? "border-purple-600 text-purple-600"
//           : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//       }`}
//     >
//       <span className="mr-2">{icon}</span>
//       {label}
//     </button>
//   )
// }

import BrandLayout from "../components/BrandLayout";

const AnalyticsPage = () => {
  const handleBuySubscription = () => {
    alert("Thank you! We will get back to you as soon as possible.");
  };

  return (
    <BrandLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>

        <button
          onClick={handleBuySubscription}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition"
        >
          Buy Subscription
        </button>

        <p className="text-gray-600 mt-6 text-center">
          We will get back to you as soon as possible
        </p>
      </div>
    </BrandLayout>
  );
};

export default AnalyticsPage;
