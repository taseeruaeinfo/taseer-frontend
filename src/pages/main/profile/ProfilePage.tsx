import React, { useState } from "react";
import { FaInstagram, FaFacebook, FaPinterest, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../../components/main/DashBoardLayout";

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState<"analytics" | "audience" | "experience" | "reviews" | "posts">("analytics");

    const dummyData: Record<typeof activeTab, React.ReactNode> = {
        analytics: (
            <>
                <h3 className="text-lg font-semibold mb-2">Analytics Overview</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Engagement Rate: <strong>12.5%</strong></li>
                    <li>Monthly Reach: <strong>120K Users</strong></li>
                    <li>Top Performing Campaign: <strong>#GoGreen</strong></li>
                </ul>
            </>
        ),
        audience: (
            <>
                <h3 className="text-lg font-semibold mb-2">Audience Insights</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Age Group: <strong>18–35 years</strong></li>
                    <li>Top Countries: <strong>USA, India, Germany</strong></li>
                    <li>Interests: <strong>Tech, Lifestyle, Fitness</strong></li>
                </ul>
            </>
        ),
        experience: (
            <>
                <h3 className="text-lg font-semibold mb-2">Professional Experience</h3>
                <ul className="space-y-2">
                    <li>🎥 Brand Ambassador for <strong>Adidas</strong> – 2023</li>
                    <li>📸 Content Collab with <strong>Samsung</strong> – 2022</li>
                    <li>✈️ Featured Speaker at <strong>Influence Summit</strong> – 2021</li>
                </ul>
            </>
        ),
        reviews: (
            <>
                <h3 className="text-lg font-semibold mb-2">Client Reviews</h3>
                <div className="space-y-2">
                    <p>⭐️⭐️⭐️⭐️⭐️ “Amazing work and super professional!” – <i>Apple Inc</i></p>
                    <p>⭐️⭐️⭐️⭐️ “Great communication and delivery!” – <i>Nike</i></p>
                    <p>⭐️⭐️⭐️⭐️⭐️ “Would work again 100%.” – <i>Startup XYZ</i></p>
                </div>
            </>
        ),
        posts: (
            <>
                <h3 className="text-lg font-semibold mb-2">Recent Posts</h3>
                <ul className="space-y-3">
                    <li>📢 Launched a new product with <strong>#GreenTech</strong> 🌱</li>
                    <li>🎙 Co-hosted a podcast on influencer trends</li>
                    <li>📸 Behind the scenes of my latest ad shoot!</li>
                </ul>
            </>
        ),
    };

    const tabs = ["Analytics", "Audience", "Experience", "Reviews", "Posts"];

    return (
        <DashboardLayout>

            <div className="max-w-5xl mx-auto p-6">
                {/* Header */}
                <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center">
                    <img
                        src="https://randomuser.me/api/portraits/women/12.jpg"
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                    />

                    <div className="md:ml-6 flex-1 text-center md:text-left mt-4 md:mt-0">
                        <h1 className="text-2xl font-bold">Neha Jakhar</h1>
                        <p className="text-gray-600 text-sm">31 • Male • New York, NY, USA</p>

                        <div className="flex items-center justify-center md:justify-start text-gray-700 text-sm mt-2 space-x-4">
                            <span className="flex items-center">
                                <FaStar className="text-yellow-400 mr-1" />
                                <span>4.95</span>
                                <span className="ml-1 text-gray-500">(47 reviews)</span>
                            </span>
                            <span className="text-blue-500 cursor-pointer">7 Campaigns</span>
                        </div>

                        <div className="flex justify-center md:justify-start space-x-4 mt-3 text-gray-700">
                            <FaInstagram size={20} className="hover:text-pink-500 cursor-pointer" />
                            <FaFacebook size={20} className="hover:text-blue-600 cursor-pointer" />
                            <FaPinterest size={20} className="hover:text-red-500 cursor-pointer" />
                        </div>
                    </div>

                    <button
                        onClick={() => toast.success("Followed Neha Jakhar!")}
                        className="text-blue-500 font-semibold mt-4 md:mt-0 md:ml-auto hover:underline"
                    >
                        Follow
                    </button>
                </div>

                {/* Tabs */}
                <div className="mt-6 border-b pb-2">
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase() as typeof activeTab)}
                                className={`capitalize pb-2 transition ${activeTab === tab.toLowerCase()
                                    ? "border-b-2 border-black text-black"
                                    : "hover:text-black"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab content */}
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md text-gray-700">
                    {dummyData[activeTab]}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;
