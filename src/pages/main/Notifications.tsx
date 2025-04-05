import { useState } from "react";
import clsx from "clsx";
import DashboardLayout from "../../components/main/DashBoardLayout";

const tabs = ["all", "brand"];

export default function PremiumNotifications() {
    const [activeTab, setActiveTab] = useState("all");

    const notifications = [
        {
            type: "brand",
            user: {
                name: "CreaBrand",
                image: "https://randomuser.me/api/portraits/women/81.jpg"
            },
            title: "CreaBrand invited you to a paid collab 💼",
            time: "2h ago"
        },
        {
            type: "all",
            user: {
                name: "Aria Content",
                image: "https://randomuser.me/api/portraits/women/32.jpg"
            },
            title: "Aria gave you a shoutout in their latest story 🔥",
            time: "5h ago"
        },
        {
            type: "brand",
            user: {
                name: "GlowUp Agency",
                image: "https://randomuser.me/api/portraits/men/41.jpg"
            },
            title: "GlowUp wants to sponsor your skincare reel ✨",
            time: "1d ago"
        },
        {
            type: "all",
            user: {
                name: "Mark Creator",
                image: "https://randomuser.me/api/portraits/men/65.jpg"
            },
            title: "Mark mentioned you in a post about creator tools",
            time: "3d ago"
        }
    ];

    const filtered = activeTab === "all" ? notifications : notifications.filter(n => n.type === "brand");

    return (
        <>
            <DashboardLayout>

                <div className="max-w-3xl mx-auto  px-4">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Your Notifications</h1>

                    {/* Tab Switcher */}
                    <div className="flex space-x-4 mb-6">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={clsx(
                                    "capitalize px-5 py-2 rounded-full font-semibold transition-all duration-300",
                                    activeTab === tab
                                        ? "bg-purple-600 text-white shadow-lg"
                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Notifications */}
                    <div className="space-y-5">
                        {filtered.map((n, i) => (
                            <div
                                key={i}
                                className="flex items-center p-4 rounded-xl shadow-xl backdrop-blur-md bg-white/70 hover:bg-white/90 transition-all"
                            >
                                <img
                                    src={n.user.image}
                                    alt={n.user.name}
                                    className="w-14 h-14 rounded-full object-cover mr-4 cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => window.location.href = `/profile/${n.user.name.toLowerCase().replace(/\s+/g, "")}`}
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{n.title}</p>
                                    <span className="text-sm text-gray-500">{n.time}</span>
                                </div>
                                <span className="text-purple-500 text-sm font-semibold">View</span>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <p className="text-center text-gray-500 pt-10">You’re all caught up 🚀</p>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
