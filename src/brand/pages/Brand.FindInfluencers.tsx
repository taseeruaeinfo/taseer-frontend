import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaInstagram, FaTiktok, FaYoutube, FaFacebook, FaLinkedin, FaTwitter, FaFilter, FaStar } from 'react-icons/fa';
import BrandLayout from '../components/BrandLayout';

// Mock data for influencers
const mockInfluencers: Influencer[] = [
    {
        id: 1,
        username: 'neha_jakhar',
        name: 'Neha Jakhar',
        avatar: '/path/to/avatar1.jpg', // In production, use actual avatar paths
        location: 'Dubai, UAE',
        categories: ['Lifestyle', 'Education', 'Travel', 'Entrepreneur'],
        platforms: ['instagram', 'tiktok', 'youtube'],
        followers: { instagram: '120K', tiktok: '80K', youtube: '50K' },
        engagementRate: '4.5%',
        previousBrands: ['Nike', 'Adidas', 'Samsung'],
        verified: true,
        rating: 4.8
    },
    {
        id: 2,
        username: 'travel_with_sarah',
        name: 'Sarah Johnson',
        avatar: '/path/to/avatar2.jpg',
        location: 'London, UK',
        categories: ['Travel', 'Photography', 'Lifestyle'],
        platforms: ['instagram', 'facebook', 'twitter'],
        followers: { instagram: '200K', facebook: '150K', twitter: '100K' },
        engagementRate: '3.8%',
        previousBrands: ['Airbnb', 'Canon', 'Expedia'],
        verified: true,
        rating: 4.5
    },
    {
        id: 3,
        username: 'tech_mike',
        name: 'Mike Chen',
        avatar: '/path/to/avatar3.jpg',
        location: 'San Francisco, USA',
        categories: ['Technology', 'Gadgets', 'Reviews'],
        platforms: ['youtube', 'instagram', 'linkedin'],
        followers: { youtube: '500K', instagram: '150K', linkedin: '50K' },
        engagementRate: '5.2%',
        previousBrands: ['Apple', 'Microsoft', 'Google'],
        verified: true,
        rating: 4.9
    },
    {
        id: 4,
        username: 'fitness_alex',
        name: 'Alex Rodriguez',
        avatar: '/path/to/avatar4.jpg',
        location: 'Miami, USA',
        categories: ['Fitness', 'Health', 'Nutrition'],
        platforms: ['instagram', 'tiktok', 'youtube'],
        followers: { instagram: '300K', tiktok: '250K', youtube: '100K' },
        engagementRate: '6.1%',
        previousBrands: ['Under Armour', 'Protein World', 'MyFitnessPal'],
        verified: false,
        rating: 4.7
    },
    {
        id: 5,
        username: 'beauty_emma',
        name: 'Emma Williams',
        avatar: '/path/to/avatar5.jpg',
        location: 'Paris, France',
        categories: ['Beauty', 'Fashion', 'Lifestyle'],
        platforms: ['instagram', 'youtube', 'tiktok'],
        followers: { instagram: '450K', youtube: '300K', tiktok: '200K' },
        engagementRate: '4.3%',
        previousBrands: ['L\'Oréal', 'Sephora', 'Dior'],
        verified: true,
        rating: 4.6
    },
];

// Available categories for filtering
const availableCategories = [
    'Lifestyle', 'Education', 'Travel', 'Entrepreneur', 'Beauty', 'Fashion',
    'Technology', 'Fitness', 'Health', 'Photography', 'Food', 'Gaming', 'Music',
    'Art', 'Parenting', 'Finance', 'DIY', 'Sports', 'Comedy', 'Movies'
];

// Available platforms for filtering
const availablePlatforms = [
    { name: 'Instagram', value: 'instagram', icon: <FaInstagram /> },
    { name: 'TikTok', value: 'tiktok', icon: <FaTiktok /> },
    { name: 'YouTube', value: 'youtube', icon: <FaYoutube /> },
    { name: 'Facebook', value: 'facebook', icon: <FaFacebook /> },
    { name: 'LinkedIn', value: 'linkedin', icon: <FaLinkedin /> },
    { name: 'Twitter', value: 'twitter', icon: <FaTwitter /> }
];


// Update the Influencer interface to correctly handle the followers property
interface Influencer {
    id: number;
    username: string;
    name: string;
    avatar: string;
    location: string;
    categories: string[];
    platforms: string[];
    followers: {
        [key: string]: string;
    };
    engagementRate: string;
    previousBrands: string[];
    verified: boolean;
    rating: number;
}

const FindInfluencers: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>(mockInfluencers);
    const [showFilters, setShowFilters] = useState(false);
    const [minFollowers, setMinFollowers] = useState<number>(0);
    const [minEngagement, setMinEngagement] = useState<number>(0);

    // Generate a placeholder image URL for each influencer
    useEffect(() => {
        setFilteredInfluencers(
            mockInfluencers.map(influencer => ({
                ...influencer,
                avatar: `/api/placeholder/150/150?text=${influencer.name.charAt(0)}`,
                followers: Object.fromEntries(
                    Object.entries(influencer.followers).filter(
                        ([_, value]) => typeof value === 'string'
                    )
                ),
            }))
        );
    }, []);


    // Apply filters when criteria changes
    useEffect(() => {
        let results = [...mockInfluencers];

        // Apply search term filter
        if (searchTerm) {
            results = results.filter(
                influencer =>
                    influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    influencer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    influencer.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filters
        if (selectedCategories.length > 0) {
            results = results.filter(influencer =>
                selectedCategories.some(category => influencer.categories.includes(category))
            );
        }

        // Apply platform filters
        if (selectedPlatforms.length > 0) {
            results = results.filter(influencer =>
                selectedPlatforms.some(platform => influencer.platforms.includes(platform))
            );
        }

        // Apply follower count filter
        if (minFollowers > 0) {
            results = results.filter(influencer => {
                const totalFollowers = Object.values(influencer.followers).reduce((sum, followers) => {
                    const num = parseInt(followers.replace(/[^0-9]/g, ''));
                    return sum + (followers.includes('M') ? num * 1000000 : followers.includes('K') ? num * 1000 : num);
                }, 0);
                return totalFollowers >= minFollowers;
            });
        }

        // Apply engagement rate filter
        if (minEngagement > 0) {
            results = results.filter(influencer => {
                const engagementRate = parseFloat(influencer.engagementRate.replace('%', ''));
                return engagementRate >= minEngagement;
            });
        }

        // Update avatars to use placeholders
        results = results.map(influencer => ({
            ...influencer,
            avatar: `/api/placeholder/150/150?text=${influencer.name.charAt(0)}`
        }));

        setFilteredInfluencers(results);
    }, [searchTerm, selectedCategories, selectedPlatforms, minFollowers, minEngagement]);

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handlePlatformToggle = (platform: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    const handleVisitProfile = (username: string) => {
        navigate(`/profile/${username}`);
    };

    const handleMessage = (username: string) => {
        navigate(`/brand/message?username=${username}`);
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'instagram': return <FaInstagram />;
            case 'tiktok': return <FaTiktok />;
            case 'youtube': return <FaYoutube />;
            case 'facebook': return <FaFacebook />;
            case 'linkedin': return <FaLinkedin />;
            case 'twitter': return <FaTwitter />;
            default: return null;
        }
    };

    return (
        <>
            <BrandLayout>
                <div className="min-h-screen bg-gray-50 pt-6 pb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Find the Perfect <span className="text-[#6a38ca]">Creator</span> for Your Brand
                            </h1>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Connect with top-tier influencers who can elevate your brand and engage with your target audience across multiple platforms.
                            </p>
                        </div>

                        {/* Search and Filter Section */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                                {/* Search Bar */}
                                <div className="relative flex-grow">
                                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, username, or location..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a38ca]"
                                    />
                                </div>

                                {/* Filter Toggle Button */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                                >
                                    <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                                </button>
                            </div>

                            {/* Expanded Filters */}
                            {showFilters && (
                                <div className="bg-gray-50 rounded-xl p-6 animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Categories Filter */}
                                        <div>
                                            <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {availableCategories.slice(0, 12).map(category => (
                                                    <button
                                                        key={category}
                                                        onClick={() => handleCategoryToggle(category)}
                                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategories.includes(category)
                                                            ? 'bg-[#6a38ca] text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                            }`}
                                                    >
                                                        {category}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Platforms Filter */}
                                        <div>
                                            <h3 className="font-medium text-gray-700 mb-3">Platforms</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {availablePlatforms.map(platform => (
                                                    <button
                                                        key={platform.value}
                                                        onClick={() => handlePlatformToggle(platform.value)}
                                                        className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors ${selectedPlatforms.includes(platform.value)
                                                            ? 'bg-[#6a38ca] text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                            }`}
                                                    >
                                                        {platform.icon} {platform.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Numeric Filters */}
                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Followers Range */}
                                            <div>
                                                <label className="block font-medium text-gray-700 mb-2">
                                                    Minimum Followers: {minFollowers > 0 ? (minFollowers >= 1000000 ? `${minFollowers / 1000000}M` : `${minFollowers / 1000}K`) : 'Any'}
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1000000"
                                                    step="10000"
                                                    value={minFollowers}
                                                    onChange={(e) => setMinFollowers(Number(e.target.value))}
                                                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#6a38ca]"
                                                />
                                            </div>

                                            {/* Engagement Rate */}
                                            <div>
                                                <label className="block font-medium text-gray-700 mb-2">
                                                    Minimum Engagement: {minEngagement}%
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="10"
                                                    step="0.5"
                                                    value={minEngagement}
                                                    onChange={(e) => setMinEngagement(Number(e.target.value))}
                                                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#6a38ca]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reset Filters */}
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => {
                                                setSelectedCategories([]);
                                                setSelectedPlatforms([]);
                                                setMinFollowers(0);
                                                setMinEngagement(0);
                                                setSearchTerm('');
                                            }}
                                            className="px-4 py-2 text-[#6a38ca] hover:underline font-medium"
                                        >
                                            Reset All Filters
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Results Count */}
                        <div className="mb-6 px-2">
                            <p className="text-gray-600">
                                {filteredInfluencers.length} creators found {searchTerm || selectedCategories.length > 0 || selectedPlatforms.length > 0 || minFollowers > 0 || minEngagement > 0 ? 'matching your criteria' : ''}
                            </p>
                        </div>

                        {/* Influencers Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredInfluencers.map(influencer => (
                                <motion.div
                                    key={influencer.id}
                                    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all"
                                >
                                    <div className="relative">
                                        {/* Top background accent */}
                                        <div className="h-20 bg-gradient-to-r from-[#6a38ca] to-[#9969f8]" />

                                        {/* Avatar */}
                                        <div className="absolute left-6 top-6 w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                                            <img
                                                src={influencer.avatar}
                                                alt={influencer.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Verified badge */}
                                        {influencer.verified && (
                                            <div className="absolute right-6 top-6 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                                                <FaCheck className="mr-1" size={10} /> Verified
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="px-6 pt-12 pb-6">
                                        <div className="mb-4">
                                            <h2 className="text-xl font-bold text-gray-800">{influencer.name}</h2>
                                            <p className="text-gray-500 text-sm">@{influencer.username}</p>
                                            <p className="text-gray-600 text-sm mt-1 flex items-center">
                                                <FaMapMarkerAlt className="mr-1" /> {influencer.location}
                                            </p>
                                        </div>

                                        {/* Categories */}
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-2">
                                                {influencer.categories.slice(0, 3).map(category => (
                                                    <span key={category} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                                                        {category}
                                                    </span>
                                                ))}
                                                {influencer.categories.length > 3 && (
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                                                        +{influencer.categories.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Social platforms with follower counts */}
                                        <div className="mb-4">
                                            <div className="flex items-center gap-3">
                                                {Object.entries(influencer.followers).map(([platform, count]) => (
                                                    <div key={platform} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                                                        {getPlatformIcon(platform)}
                                                        <span className="text-sm font-medium">{count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                                                <p className="text-sm text-gray-500">Engagement</p>
                                                <p className="font-bold text-[#6a38ca]">{influencer.engagementRate}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                                                <p className="text-sm text-gray-500">Rating</p>
                                                <p className="font-bold text-[#6a38ca] flex items-center justify-center">
                                                    {influencer.rating} <FaStar className="ml-1 text-yellow-500" size={14} />
                                                </p>
                                            </div>
                                        </div>

                                        {/* Previous brands */}
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-500 mb-2">Previous collaborations:</p>
                                            <p className="text-sm font-medium">
                                                {influencer.previousBrands.join(', ')}
                                            </p>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleVisitProfile(influencer.username)}
                                                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors"
                                            >
                                                Visit Profile
                                            </button>
                                            <button
                                                onClick={() => handleMessage(influencer.username)}
                                                className="px-4 py-3 bg-[#6a38ca] hover:bg-[#5c2eb8] text-white font-medium rounded-xl transition-colors"
                                            >
                                                Message
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Empty state */}
                        {filteredInfluencers.length === 0 && (
                            <div className="bg-white rounded-2xl shadow p-8 text-center">
                                <FaSearch className="mx-auto text-gray-300 text-5xl mb-4" />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No creators found</h3>
                                <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategories([]);
                                        setSelectedPlatforms([]);
                                        setMinFollowers(0);
                                        setMinEngagement(0);
                                        setSearchTerm('');
                                    }}
                                    className="px-6 py-3 bg-[#6a38ca] text-white font-medium rounded-xl"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </BrandLayout>
        </>
    );
};

// Helper component for the location icon
const FaMapMarkerAlt = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 1a5 5 0 0 0-5 5c0 2.761 2.01 5.924 4.59 8.384.792.849 2.028.849 2.82 0C12.99 11.924 15 8.761 15 6a5 5 0 0 0-5-5zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
);

// Helper component for the check icon
const FaCheck = ({ className, size }: { className?: string, size?: number }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size || 16} height={size || 16} fill="currentColor" viewBox="0 0 16 16">
        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
    </svg>
);

export default FindInfluencers;