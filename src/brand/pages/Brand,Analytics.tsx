import { ReactElement, useState } from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiUsers,
  FiHeart,
  FiEye,
  FiArrowRight,
  FiBarChart2,
  FiDollarSign,
  FiLayout,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import BrandLayout from "../components/BrandLayout";

type NavButtonColor = "purple" | "blue";

const campaignStats = [
  { label: "No. of Creators", value: "24", icon: <FiUsers /> },
  { label: "ROI", value: "12%", icon: <FiTrendingUp /> },
  { label: "Platform Reach", value: "45k", icon: <FiEye /> },
  { label: "Budget Spent", value: "$1,500", icon: <FiDollarSign /> },
];

const platformData = [
  { name: "Instagram", value: 45 },
  { name: "Facebook", value: 25 },
  { name: "Twitter", value: 15 },
  { name: "TikTok", value: 15 },
];

const contentTypeData = [
  { name: "Reels", value: 40 },
  { name: "Stories", value: 30 },
  { name: "Posts", value: 20 },
  { name: "Articles", value: 10 },
];

const creatorEngagementData = [
  { name: "Creator 1", engagement: 85, reach: 120 },
  { name: "Creator 2", engagement: 75, reach: 100 },
  { name: "Creator 3", engagement: 90, reach: 80 },
  { name: "Creator 4", engagement: 65, reach: 140 },
];

const COLORS = ["#7c3aed", "#10b981", "#3b82f6", "#f59e0b"];

export default function BrandAnalytics() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("campaign");

  return (
    <BrandLayout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 space-y-10"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Brand Dashboard</h1>
          <div className="flex gap-3 flex-wrap">
            <NavButton
              label="Favorite Creators"
              icon={<FiHeart />}
              path="/brand/favorite-creators"
              navigate={navigate}
              color="purple"
            />
            <NavButton
              label="Explore Creators"
              icon={<FiArrowRight />}
              path="/brand/explore"
              navigate={navigate}
              color="blue"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <TabButton
            active={activeTab === "campaign"}
            onClick={() => setActiveTab("campaign")}
            icon={<FiBarChart2 />}
            label="Campaign Analytics"
          />
          <TabButton
            active={activeTab === "platform"}
            onClick={() => setActiveTab("platform")}
            icon={<FiLayout />}
            label="Platform Analytics"
          />
        </div>

        {/* Tab Content */}
        {activeTab === "campaign" ? (
          <CampaignAnalyticsTab />
        ) : (
          <PlatformAnalyticsTab />
        )}
      </motion.div>
    </BrandLayout>
  );
}

function CampaignAnalyticsTab() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      {/* Campaign Header */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Ramadan Campaign
        </h2>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {campaignStats.map((item, i) => (
            <StatCard
              key={i}
              icon={item.icon}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      </section>

      {/* Platform vs Engagement Pie Chart */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Platform vs Engagement
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={platformData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {platformData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Creator vs Engagement Bar Chart */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Creator vs Engagement
        </h2>
        <div className="text-sm text-gray-500 mb-2">
          Content piece comparison by creator
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={creatorEngagementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="engagement" fill="#7c3aed" />
            <Bar dataKey="reach" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Creator Comparison */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Creator Comparison
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
              D
            </div>
            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">Dave</span>
                <span>Performance: 92%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
              K
            </div>
            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">Karina</span>
                <span>Performance: 87%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function PlatformAnalyticsTab() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      {/* Posts Section */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Postings</h2>
        <div className="space-y-4">
          {["Reel 1", "Story 1", "Reel 2"].map((post, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{post}</span>
                <span className="text-sm text-gray-500">
                  {Math.floor(Math.random() * 1000 + 500)} views
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Content Type Comparison */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Content Type Comparison
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={contentTypeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {contentTypeData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-500 text-center">
          Comparison for Reels vs Story vs Post vs Article
        </div>
      </section>

      {/* Platform Overview */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium mb-2">Users Reached</h3>
            <div className="text-2xl font-bold">24,500</div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium mb-2">Engagement Rate</h3>
            <div className="text-2xl font-bold">8.7%</div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium mb-2">Spend</h3>
            <div className="text-2xl font-bold">$3,250</div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium mb-2">Leads Generated</h3>
            <div className="text-2xl font-bold">142</div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactElement;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4"
    >
      <div className="text-purple-600 text-2xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
    </motion.div>
  );
}

function NavButton({
  label,
  icon,
  path,
  navigate,
  color,
}: {
  label: string;
  icon: ReactElement;
  path: string;
  navigate: (item: string) => void;
  color: NavButtonColor;
}) {
  const colorMap: Record<NavButtonColor, string> = {
    purple: "text-purple-600 bg-purple-100 hover:bg-purple-200",
    blue: "text-blue-600 bg-blue-100 hover:bg-blue-200",
  };
  return (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${colorMap[color]}`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactElement;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
        active
          ? "border-purple-600 text-purple-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}
