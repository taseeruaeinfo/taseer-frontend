"use client";

import { motion } from "framer-motion";
import {
    FiTrendingUp,
    FiUsers,
    FiHeart,
    FiEye,
    FiArrowRight,
    FiClock,
    FiCheckCircle,
    FiUserCheck,
    FiXCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
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

const weeklyData = [
    { name: "Week 1", views: 400, clicks: 240 },
    { name: "Week 2", views: 300, clicks: 139 },
    { name: "Week 3", views: 500, clicks: 300 },
    { name: "Week 4", views: 700, clicks: 410 },
];

const campaignStats = [
    { label: "Total Reach", value: "15.2k", icon: <FiTrendingUp /> },
    { label: "Views", value: "42.5k", icon: <FiEye /> },
    { label: "Clicks", value: "9.3k", icon: <FiUsers /> },
    { label: "Favorites", value: "1.4k", icon: <FiHeart /> },
    { label: "Conversions", value: "3.2k", icon: <FiCheckCircle /> },
    { label: "Bounce Rate", value: "18%", icon: <FiXCircle /> },
    { label: "Avg. Engagement Time", value: "2m 32s", icon: <FiClock /> },
    { label: "Top Creator Interactions", value: "842", icon: <FiUserCheck /> },
];

const audienceDemographics = [
    { name: "18-24", value: 400 },
    { name: "25-34", value: 300 },
    { name: "35-44", value: 300 },
    { name: "45+", value: 200 },
];

const COLORS = ["#7c3aed", "#10b981", "#3b82f6", "#f59e0b"];

export default function BrandAnalytics() {
    const navigate = useNavigate();

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
                    <h1 className="text-3xl font-bold text-gray-800">Brand Analytics</h1>
                    <div className="flex gap-3 flex-wrap">
                        <NavButton label="Favorite Creators" icon={<FiHeart />} path="/brand/favorite-creators" navigate={navigate} color="purple" />
                        <NavButton label="Explore Creators" icon={<FiArrowRight />} path="/brand/explore" navigate={navigate} color="blue" />
                    </div>
                </div>

                {/* Campaign Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {campaignStats.map((item, i) => (
                        <StatCard key={i} icon={item.icon} label={item.label} value={item.value} />
                    ))}
                </div>

                {/* Weekly Overview */}
                <section className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Weekly Campaign Overview</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={weeklyData}>
                            <Line type="monotone" dataKey="views" stroke="#7c3aed" strokeWidth={2} />
                            <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} />
                            <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                </section>

                {/* Demographics */}
                <section className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Audience Demographics</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={audienceDemographics}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {audienceDemographics.map((entry, index) => (

                                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </section>

                {/* Engagement Breakdown */}
                <section className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Engagement By Week</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="views" fill="#3b82f6" />
                            <Bar dataKey="clicks" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </section>

                {/* Placeholder for top-performing creators */}
                <section className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Top Performing Creators</h2>
                    <ul className="space-y-3">
                        {["Alex Marketing", "Riya Singh", "DigitalGuru", "InspireVlog"].map((creator, i) => (
                            <li
                                key={i}
                                className="flex justify-between items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                            >
                                <div className="text-gray-800 font-medium">{creator}</div>
                                <div className="text-sm text-gray-500">Click Rate: {Math.floor(Math.random() * 20 + 10)}%</div>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Activity Timeline - Coming Soon */}
                <section className="bg-white p-6 rounded-xl shadow-md text-center text-gray-400 italic">
                    Creator engagement timeline, performance trends, and export tools coming soon...
                </section>
            </motion.div>
        </BrandLayout>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

function NavButton({ label, icon, path, navigate, color }: { label: string; icon: React.ReactNode; path: string; navigate: any; color: string }) {
    const colorMap: Record<string, string> = {
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
