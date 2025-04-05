import { useState } from "react";
import { cn } from "../../lib/cn";
import DashboardLayout from "../../components/main/DashBoardLayout";

type DealStatus = "Completed" | "Ongoing";

const statusColors: Record<DealStatus, string> = {
    Completed: "bg-green-100 text-green-700",
    Ongoing: "bg-yellow-100 text-yellow-800",
};

const deals: {
    brand: string;
    logo: string;
    title: string;
    status: DealStatus;
    amount: string;
    date: string;
}[] = [
        {
            brand: "GlowUp Skincare",
            logo: "https://randomuser.me/api/portraits/women/81.jpg",
            title: "Instagram Reel + Story Combo",
            status: "Completed",
            amount: "₹30,000",
            date: "Mar 12, 2025",
        },
        {
            brand: "NeoFit Gymwear",
            logo: "https://randomuser.me/api/portraits/men/32.jpg",
            title: "YouTube Short + Instagram Post",
            status: "Ongoing",
            amount: "₹18,000",
            date: "Apr 2, 2025",
        },
        {
            brand: "ByteTech",
            logo: "https://randomuser.me/api/portraits/men/14.jpg",
            title: "Tech Review Video",
            status: "Completed",
            amount: "₹40,000",
            date: "Feb 21, 2025",
        },
    ];

const tabs = ["All", "Completed", "Ongoing"];

export default function Deals() {
    const [activeTab, setActiveTab] = useState("All");

    const filteredDeals =
        activeTab === "All"
            ? deals
            : deals.filter((deal) => deal.status === activeTab);

    return (
        <>
            <DashboardLayout>


                <div className="max-w-5xl mx-auto p-6">
                    <h1 className="text-2xl font-bold mb-6">My Deals</h1>

                    {/* Tabs */}
                    <div className="flex space-x-4 mb-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium border transition",
                                    activeTab === tab
                                        ? "bg-purple-600 text-white"
                                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                                )}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Deal Cards */}
                    <div className="space-y-4">
                        {filteredDeals.map((deal, i) => (
                            <div
                                key={i}
                                className="flex items-center bg-white shadow-sm border rounded-lg p-4 hover:shadow-md transition"
                            >
                                {/* Logo */}
                                <img
                                    src={deal.logo}
                                    alt={deal.brand}
                                    className="w-12 h-12 rounded-full object-cover"
                                />

                                {/* Info */}
                                <div className="ml-4 flex-1">
                                    <div className="flex items-center justify-between">
                                        <h2 className="font-semibold text-lg">{deal.title}</h2>
                                        <span
                                            className={cn(
                                                "text-xs font-medium px-2 py-1 rounded-full",
                                                statusColors[deal.status]
                                            )}
                                        >
                                            {deal.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{deal.brand}</p>
                                    <div className="text-sm text-gray-500 mt-1">{deal.date}</div>
                                </div>

                                {/* Amount */}
                                <div className="text-right ml-4">
                                    <p className="font-semibold text-black text-lg">
                                        {deal.amount}
                                    </p>
                                    <p className="text-xs text-gray-500">Total Payment</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
