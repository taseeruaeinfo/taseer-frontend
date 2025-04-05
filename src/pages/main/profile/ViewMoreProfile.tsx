"use client";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../../../components/main/DashBoardLayout";

const recommendedCreators = [
    {
        name: "Neha Jakhar",
        username: "nehajakhar",
        location: "Dubai, UAE",
        badge: "Creator",
        tags: ["Lifestyle", "Education", "Travel", "Entrepreneur"],
        profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
        name: "John Doe",
        username: "johndoe",
        location: "New York, USA",
        badge: "Influencer",
        tags: ["Tech", "Business", "Marketing"],
        profilePic: "https://randomuser.me/api/portraits/women/13.jpg",
    },
    {
        name: "Emily Clark",
        username: "emilyclark",
        location: "Los Angeles, USA",
        badge: "Creator",
        tags: ["Fashion", "Beauty", "Vlogs"],
        profilePic: "https://randomuser.me/api/portraits/women/15.jpg",
    },
    {
        name: "Ali Khan",
        username: "alikhan",
        location: "Lahore, Pakistan",
        badge: "Entrepreneur",
        tags: ["Startups", "Business", "Motivation"],
        profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    {
        name: "Sophie Martin",
        username: "sophiemartin",
        location: "Paris, France",
        badge: "Artist",
        tags: ["Design", "Illustration", "NFT"],
        profilePic: "https://randomuser.me/api/portraits/women/20.jpg",
    },
];

export default function ViewMoreCreators() {
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold mb-6">Discover More Creators</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedCreators.map((creator, index) => (
                        <div key={index} className="bg-white p-5 rounded-lg shadow flex flex-col justify-between h-full">
                            <div className="flex items-center gap-3">
                                <img
                                    src={creator.profilePic}
                                    className="w-14 h-14 rounded-full cursor-pointer"
                                    alt={creator.name}
                                    onClick={() => navigate(`/profile/${creator.username}`)}
                                />
                                <div className="flex-1">
                                    <h2
                                        className="font-semibold text-lg cursor-pointer hover:underline"
                                        onClick={() => navigate(`/profile/${creator.username}`)}
                                    >
                                        {creator.name}
                                    </h2>
                                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                        {creator.badge}
                                    </span>
                                    <p className="text-sm text-gray-500">{creator.location}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {creator.tags.slice(0, 4).map((tag, i) => (
                                    <span
                                        key={i}
                                        className="border border-gray-400 text-xs px-2 py-1 rounded-lg text-gray-600"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {creator.tags.length > 4 && (
                                    <span className="border border-gray-400 text-xs px-2 py-1 rounded-lg text-gray-600">
                                        +{creator.tags.length - 4} more
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => toast.success(`You followed ${creator.name}!`)}
                                className="mt-4 text-blue-500 font-medium"
                            >
                                Follow
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
