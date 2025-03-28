import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

const platforms = ["Any", "Instagram", "TikTok", "User Generated Content", "YouTube", "Twitter"];

const DiscoverInfluencers = () => {
    const [selectedPlatform, setSelectedPlatform] = useState("Choose a platform");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="text-gray-900 p-6 flex flex-col items-center">
            <motion.h1
                className="text-3xl md:text-5xl h font-bold text-center bg bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}

            >
                Influencer Marketing Made Easy
            </motion.h1>
            <p className="text-gray-600 mt-2 text-center max-w-lg">
                Find and hire top Instagram, TikTok, YouTube, and UGC influencers to create unique content for your brand.
            </p>

            <div className="flex flex-col md:flex-row items-center gap-4 mt-6 w-full max-w-2xl">
                {/* Platform Dropdown */}
                <div className="relative w-full md:w-1/2">
                    <button
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {selectedPlatform}
                    </button>
                    {isDropdownOpen && (
                        <motion.ul
                            className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden z-10"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {platforms.map((platform) => (
                                <li
                                    key={platform}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setSelectedPlatform(platform);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {platform}
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </div>

                {/* Category Input */}
                <div className="relative w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Enter keywords, niches or categories"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <FaSearch className="absolute right-3 top-3 text-gray-400" />
                </div>
            </div>


        </div>
    );
};

export default DiscoverInfluencers;