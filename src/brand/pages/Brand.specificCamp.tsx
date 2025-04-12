import React, { useState } from 'react';
import {
    ArrowLeft,
    Check,
    X,
    Clock,
    Edit2,
    Trash2,
    Users,
    Share2,
    Download,
    Search,
    MoreVertical,
    Star,
    Instagram,
    Twitter,
    Youtube,

} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { AiFillTikTok } from 'react-icons/ai';
import BrandLayout from '../components/BrandLayout';

interface Influencer {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    followers: string;
    engagement: string;
    platforms: string[];
    rate: string;
    status: 'applied' | 'selected' | 'rejected' | 'completed' | 'in-progress';
    appliedDate: string;
    fit: number;
    message?: string;
}

interface CampaignDetails {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'draft' | 'completed' | 'paused';
    budget: string;
    remainingBudget: string;
    startDate: string;
    endDate: string;
    category: string;
    platforms: string[];
    goals: string[];
    requirements: string[];
    influencers: Influencer[];
    createdAt: string;
    updatedAt: string;
}

const SocialIcon = ({ platform }: { platform: string }) => {
    switch (platform.toLowerCase()) {
        case 'instagram':
            return <Instagram size={16} className="text-pink-600" />;
        case 'twitter':
            return <Twitter size={16} className="text-blue-500" />;
        case 'youtube':
            return <Youtube size={16} className="text-red-600" />;
        case 'tiktok':
            return <AiFillTikTok size={16} className="text-black" />;
        default:
            return null;
    }
};

const CampaignDetailPage: React.FC = () => {
    const router = useNavigate();
    const campaignId = "asdas";
    const [activeTab, setActiveTab] = useState<string>('influencers');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Mock campaign data - in a real application, this would be fetched based on campaignId
    const campaignDetails: CampaignDetails = {
        id: campaignId as string || 'camp-1001',
        title: 'Summer Collection Launch',
        description: 'Promote our new summer collection with engaging content that highlights the versatility and quality of our products. We\'re looking for authentic content that resonates with your audience and showcases our items in real-life settings.',
        status: 'active',
        budget: '$5,000',
        remainingBudget: '$2,800',
        startDate: 'Apr 15, 2025',
        endDate: 'May 30, 2025',
        category: 'Fashion',
        platforms: ['Instagram', 'TikTok'],
        goals: [
            'Increase brand awareness',
            'Drive traffic to online store',
            'Generate content for brand usage'
        ],
        requirements: [
            'At least 1 feed post and 2 stories',
            'Include product links in bio',
            'Use campaign hashtag #SummerVibesCollection',
            'Content approval before posting'
        ],
        influencers: [
            {
                id: 'inf-101',
                name: 'Alex Morgan',
                handle: '@alexstyle',
                avatar: '/api/placeholder/40/40',
                followers: '120K',
                engagement: '4.2%',
                platforms: ['Instagram', 'TikTok'],
                rate: '$500',
                status: 'selected',
                appliedDate: 'Apr 5, 2025',
                fit: 95,
                message: 'Love your brand and would be excited to showcase your summer collection to my audience!'
            },
            {
                id: 'inf-102',
                name: 'Jamie Wilson',
                handle: '@wilsonwears',
                avatar: '/api/placeholder/40/40',
                followers: '85K',
                engagement: '5.1%',
                platforms: ['Instagram'],
                rate: '$350',
                status: 'in-progress',
                appliedDate: 'Apr 6, 2025',
                fit: 88
            },
            {
                id: 'inf-103',
                name: 'Taylor Greene',
                handle: '@taylorstyle',
                avatar: '/api/placeholder/40/40',
                followers: '210K',
                engagement: '3.8%',
                platforms: ['Instagram', 'TikTok', 'Youtube'],
                rate: '$750',
                status: 'applied',
                appliedDate: 'Apr 8, 2025',
                fit: 75
            },
            {
                id: 'inf-104',
                name: 'Jordan Smith',
                handle: '@jordanfashion',
                avatar: '/api/placeholder/40/40',
                followers: '65K',
                engagement: '6.2%',
                platforms: ['Instagram', 'TikTok'],
                rate: '$300',
                status: 'applied',
                appliedDate: 'Apr 9, 2025',
                fit: 82
            },
            {
                id: 'inf-105',
                name: 'Casey Brown',
                handle: '@caseyb',
                avatar: '/api/placeholder/40/40',
                followers: '45K',
                engagement: '7.5%',
                platforms: ['Instagram'],
                rate: '$250',
                status: 'applied',
                appliedDate: 'Apr 10, 2025',
                fit: 90
            },
            {
                id: 'inf-106',
                name: 'Riley Johnson',
                handle: '@rileyj',
                avatar: '/api/placeholder/40/40',
                followers: '175K',
                engagement: '4.0%',
                platforms: ['Instagram', 'TikTok'],
                rate: '$600',
                status: 'rejected',
                appliedDate: 'Apr 7, 2025',
                fit: 65
            },
            {
                id: 'inf-107',
                name: 'Quinn Davis',
                handle: '@quinnstyle',
                avatar: '/api/placeholder/40/40',
                followers: '95K',
                engagement: '5.3%',
                platforms: ['Instagram', 'Youtube'],
                rate: '$400',
                status: 'completed',
                appliedDate: 'Apr 4, 2025',
                fit: 92
            }
        ],
        createdAt: 'Apr 2, 2025',
        updatedAt: 'Apr 12, 2025'
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'applied': return 'bg-blue-100 text-blue-800';
            case 'selected': return 'bg-indigo-100 text-indigo-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'in-progress': return 'bg-amber-100 text-amber-800';
            case 'completed': return 'bg-emerald-100 text-emerald-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredInfluencers = campaignDetails.influencers.filter(influencer => {
        const matchesStatus = statusFilter === 'all' || influencer.status === statusFilter;
        const matchesSearch =
            influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            influencer.handle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getTabContent = () => {
        switch (activeTab) {
            case 'influencers':
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-200 bg-gray-50">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="relative flex-grow max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Search influencers..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${statusFilter === 'all' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={() => setStatusFilter('all')}
                                    >
                                        All
                                    </button>
                                    <button
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${statusFilter === 'applied' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={() => setStatusFilter('applied')}
                                    >
                                        Applied ({campaignDetails.influencers.filter(i => i.status === 'applied').length})
                                    </button>
                                    <button
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${statusFilter === 'selected' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={() => setStatusFilter('selected')}
                                    >
                                        Selected ({campaignDetails.influencers.filter(i => i.status === 'selected').length})
                                    </button>
                                    <button
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${statusFilter === 'in-progress' ? 'bg-amber-100 text-amber-800' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={() => setStatusFilter('in-progress')}
                                    >
                                        In Progress ({campaignDetails.influencers.filter(i => i.status === 'in-progress').length})
                                    </button>
                                    <button
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${statusFilter === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={() => setStatusFilter('completed')}
                                    >
                                        Completed ({campaignDetails.influencers.filter(i => i.status === 'completed').length})
                                    </button>
                                </div>
                            </div>
                        </div>
                        {filteredInfluencers.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {filteredInfluencers.map((influencer) => (
                                    <div key={influencer.id} className="p-5 hover:bg-gray-50">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                                                    <img src={influencer.avatar} alt={influencer.name} className="h-full w-full object-cover" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="flex items-center">
                                                        <h3 className="text-lg font-medium text-gray-900">{influencer.name}</h3>
                                                        <span className="ml-2 text-sm text-gray-500">{influencer.handle}</span>
                                                        {influencer.fit >= 90 && (
                                                            <span className="ml-2 flex items-center text-amber-500">
                                                                <Star size={16} className="fill-amber-500" />
                                                                <span className="ml-1 text-xs font-medium">Top Match</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center mt-1 space-x-3 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <Users size={14} className="mr-1" />
                                                            {influencer.followers}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">{influencer.engagement}</span> engagement
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            {influencer.platforms.map((platform) => (
                                                                <span key={`${influencer.id}-${platform}`} className="inline-flex items-center">
                                                                    <SocialIcon platform={platform} />
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(influencer.status)}`}>
                                                        {influencer.status === 'applied' && <Clock size={12} className="mr-1" />}
                                                        {influencer.status === 'selected' && <Check size={12} className="mr-1" />}
                                                        {influencer.status === 'rejected' && <X size={12} className="mr-1" />}
                                                        {influencer.status === 'in-progress' && <Clock size={12} className="mr-1" />}
                                                        {influencer.status === 'completed' && <Check size={12} className="mr-1" />}
                                                        <span className="capitalize">{influencer.status}</span>
                                                    </span>
                                                    <div className="mt-1 text-sm text-gray-500">
                                                        Applied on {influencer.appliedDate}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-right">
                                                        <div className="text-lg font-medium text-gray-900">{influencer.rate}</div>
                                                        <div className="text-sm text-gray-500">Quoted Rate</div>
                                                    </div>
                                                    {influencer.status === 'applied' && (
                                                        <div className="flex gap-2">
                                                            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                                <Check size={16} className="mr-1" /> Select
                                                            </button>
                                                            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                                <X size={16} className="mr-1" /> Decline
                                                            </button>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                        {(influencer.status === 'applied' && influencer.message) && (
                                            <div className="mt-4 bg-gray-50 p-3 rounded-md border border-gray-200">
                                                <p className="text-sm text-gray-600">"{influencer.message}"</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <Users size={24} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No influencers found</h3>
                                <p className="mt-1 text-gray-500">Try adjusting your filters or search query.</p>
                            </div>
                        )}
                    </div>
                );
            case 'progress':
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Progress</h3>
                            <div className="flex items-center">
                                <div className="flex-grow">
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-indigo-600 h-3 rounded-full"
                                            style={{ width: '40%' }}
                                        ></div>
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
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{ width: '44%' }}
                                    ></div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-gray-500 text-sm font-medium">Influencers Secured</h4>
                                </div>
                                <div className="mt-2 flex items-end">
                                    <p className="text-2xl font-bold text-gray-900">3</p>
                                    <p className="ml-2 text-sm text-gray-500">of 10 target</p>
                                </div>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{ width: '30%' }}
                                    ></div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-gray-500 text-sm font-medium">Content Delivered</h4>
                                </div>
                                <div className="mt-2 flex items-end">
                                    <p className="text-2xl font-bold text-gray-900">12</p>
                                    <p className="ml-2 text-sm text-gray-500">of 30 pieces</p>
                                </div>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{ width: '40%' }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
                        <div className="border-l-4 border-indigo-600 pl-4 ml-4 space-y-6 mb-8">
                            <div className="relative">
                                <div className="w-3 h-3 bg-indigo-600 rounded-full absolute -left-6 mt-1.5"></div>
                                <div>
                                    <p className="text-sm text-gray-500">Apr 2, 2025</p>
                                    <p className="font-medium text-gray-900">Campaign created</p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="w-3 h-3 bg-indigo-600 rounded-full absolute -left-6 mt-1.5"></div>
                                <div>
                                    <p className="text-sm text-gray-500">Apr 5-10, 2025</p>
                                    <p className="font-medium text-gray-900">Received 25 influencer applications</p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="w-3 h-3 bg-indigo-600 rounded-full absolute -left-6 mt-1.5"></div>
                                <div>
                                    <p className="text-sm text-gray-500">Apr 12, 2025</p>
                                    <p className="font-medium text-gray-900">Selected 3 influencers</p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="w-3 h-3 bg-indigo-600 rounded-full absolute -left-6 mt-1.5 border-2 border-white"></div>
                                <div>
                                    <p className="text-sm text-gray-500">Apr 15, 2025</p>
                                    <p className="font-medium text-gray-900">Campaign officially launched</p>
                                </div>
                            </div>
                            <div className="relative opacity-50">
                                <div className="w-3 h-3 bg-gray-400 rounded-full absolute -left-6 mt-1.5"></div>
                                <div>
                                    <p className="text-sm text-gray-500">May 15, 2025</p>
                                    <p className="font-medium text-gray-900">Content review checkpoint</p>
                                </div>
                            </div>
                            <div className="relative opacity-50">
                                <div className="w-3 h-3 bg-gray-400 rounded-full absolute -left-6 mt-1.5"></div>
                                <div>
                                    <p className="text-sm text-gray-500">May 30, 2025</p>
                                    <p className="font-medium text-gray-900">Campaign end date</p>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 mb-4">Latest Updates</h3>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-gray-900">Alex Morgan submitted content for review</p>
                                    <p className="text-sm text-gray-500">2 hours ago</p>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    1 Instagram post and 2 stories submitted for approval before posting
                                </p>
                                <div className="mt-2">
                                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">
                                        Review content
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-gray-900">Jamie Wilson began creating content</p>
                                    <p className="text-sm text-gray-500">Yesterday</p>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    Expected content delivery in 3 days
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-gray-900">Quinn Davis completed all deliverables</p>
                                    <p className="text-sm text-gray-500">Apr 11, 2025</p>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    All content has been delivered and approved
                                </p>
                                <div className="mt-2">
                                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">
                                        View analytics
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Campaign Settings</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Update your campaign details and preferences.
                            </p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="campaign-title" className="block text-sm font-medium text-gray-700 mb-1">
                                            Campaign Title
                                        </label>
                                        <input
                                            type="text"
                                            id="campaign-title"
                                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            defaultValue={campaignDetails.title}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="campaign-description" className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            id="campaign-description"
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            defaultValue={campaignDetails.description}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="campaign-start" className="block text-sm font-medium text-gray-700 mb-1">
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                id="campaign-start"
                                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                defaultValue="2025-04-15"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="campaign-end" className="block text-sm font-medium text-gray-700 mb-1">
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                id="campaign-end"
                                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                defaultValue="2025-05-30"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="campaign-budget" className="block text-sm font-medium text-gray-700 mb-1">
                                                Total Budget
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">$</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    id="campaign-budget"
                                                    className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    defaultValue="5000"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">USD</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="campaign-category" className="block text-sm font-medium text-gray-700 mb-1">
                                                Category
                                            </label>
                                            <select
                                                id="campaign-category"
                                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                defaultValue="Fashion"
                                            >
                                                <option>Fashion</option>
                                                <option>Beauty</option>
                                                <option>Lifestyle</option>
                                                <option>Travel</option>
                                                <option>Food & Beverage</option>
                                                <option>Technology</option>
                                                <option>Fitness</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Campaign Details</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="campaign-platforms" className="block text-sm font-medium text-gray-700 mb-1">
                                            Platforms
                                        </label>
                                        <div className="mt-1 space-y-2">
                                            <div className="flex items-center">
                                                <input
                                                    id="platform-instagram"
                                                    name="platforms"
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="platform-instagram" className="ml-2 block text-sm text-gray-700">
                                                    Instagram
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    id="platform-tiktok"
                                                    name="platforms"
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="platform-tiktok" className="ml-2 block text-sm text-gray-700">
                                                    TikTok
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    id="platform-youtube"
                                                    name="platforms"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="platform-youtube" className="ml-2 block text-sm text-gray-700">
                                                    YouTube
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    id="platform-twitter"
                                                    name="platforms"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="platform-twitter" className="ml-2 block text-sm text-gray-700">
                                                    Twitter
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="campaign-goals" className="block text-sm font-medium text-gray-700 mb-1">
                                            Campaign Goals
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="campaign-goals"
                                                rows={3}
                                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                defaultValue={campaignDetails.goals.join('\n')}
                                            />
                                            <p className="mt-1 text-xs text-gray-500">One goal per line</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="campaign-requirements" className="block text-sm font-medium text-gray-700 mb-1">
                                            Content Requirements
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="campaign-requirements"
                                                rows={4}
                                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                defaultValue={campaignDetails.requirements.join('\n')}
                                            />
                                            <p className="mt-1 text-xs text-gray-500">One requirement per line</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Status</h4>
                                <div className="mt-1">
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input
                                                id="status-active"
                                                name="status"
                                                type="radio"
                                                defaultChecked
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label htmlFor="status-active" className="ml-2 block text-sm text-gray-700">
                                                Active
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="status-paused"
                                                name="status"
                                                type="radio"
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label htmlFor="status-paused" className="ml-2 block text-sm text-gray-700">
                                                Paused
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="status-draft"
                                                name="status"
                                                type="radio"
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label htmlFor="status-draft" className="ml-2 block text-sm text-gray-700">
                                                Draft
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="status-completed"
                                                name="status"
                                                type="radio"
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label htmlFor="status-completed" className="ml-2 block text-sm text-gray-700">
                                                Completed
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-5 border-t border-gray-200 flex justify-between">
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Trash2 size={16} className="mr-2" /> Delete Campaign
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'details':
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Overview</h3>
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <p className="text-gray-600 text-sm whitespace-pre-line">{campaignDetails.description}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Goals</h3>
                                    <ul className="space-y-2">
                                        {campaignDetails.goals.map((goal, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    <Check size={16} className="text-green-500" />
                                                </div>
                                                <p className="ml-2 text-gray-600">{goal}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Content Requirements</h3>
                                    <ul className="space-y-2">
                                        {campaignDetails.requirements.map((req, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    <Check size={16} className="text-green-500" />
                                                </div>
                                                <p className="ml-2 text-gray-600">{req}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Platforms</h3>
                                    <div className="flex space-x-4">
                                        {campaignDetails.platforms.map((platform, index) => (
                                            <div key={index} className="flex items-center">
                                                <SocialIcon platform={platform} />
                                                <span className="ml-1 text-gray-600">{platform}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-900">Campaign Details</h3>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <div className="text-xs text-gray-500">Status</div>
                                            <div className="flex items-center mt-1">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></div>
                                                    {campaignDetails.status.charAt(0).toUpperCase() + campaignDetails.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Budget</div>
                                            <div className="mt-1 text-sm font-medium text-gray-900">{campaignDetails.budget}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Remaining Budget</div>
                                            <div className="mt-1 text-sm font-medium text-gray-900">{campaignDetails.remainingBudget}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Timeline</div>
                                            <div className="mt-1 text-sm font-medium text-gray-900">
                                                {campaignDetails.startDate} - {campaignDetails.endDate}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Category</div>
                                            <div className="mt-1 text-sm font-medium text-gray-900">{campaignDetails.category}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Created</div>
                                            <div className="mt-1 text-sm font-medium text-gray-900">{campaignDetails.createdAt}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Last Updated</div>
                                            <div className="mt-1 text-sm font-medium text-gray-900">{campaignDetails.updatedAt}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-900">Actions</h3>
                                    </div>
                                    <div className="p-4">
                                        <div className="space-y-2">
                                            <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                <Edit2 size={16} className="mr-2" /> Edit Campaign
                                            </button>
                                            <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                <Share2 size={16} className="mr-2" /> Share Campaign
                                            </button>
                                            <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                <Download size={16} className="mr-2" /> Export Data
                                            </button>
                                            <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                                <Trash2 size={16} className="mr-2" /> Delete Campaign
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <BrandLayout>


                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-6">
                            <button
                                onClick={() => router('/brand/my-campaigns')}
                                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                <ArrowLeft size={16} className="mr-1" /> Back to Campaigns
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{campaignDetails.title}</h1>
                                    <div className="mt-1 flex items-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${campaignDetails.status === 'active' ? 'bg-green-100 text-green-800' :
                                            campaignDetails.status === 'paused' ? 'bg-amber-100 text-amber-800' :
                                                campaignDetails.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${campaignDetails.status === 'active' ? 'bg-green-600' :
                                                campaignDetails.status === 'paused' ? 'bg-amber-600' :
                                                    campaignDetails.status === 'draft' ? 'bg-gray-600' :
                                                        'bg-blue-600'
                                                }`}></div>
                                            {campaignDetails.status.charAt(0).toUpperCase() + campaignDetails.status.slice(1)}
                                        </span>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <span className="text-sm text-gray-500">{campaignDetails.startDate} - {campaignDetails.endDate}</span>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <span className="text-sm text-gray-500">Budget: {campaignDetails.budget}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        <Edit2 size={16} className="mr-1" /> Edit Campaign
                                    </button>
                                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        <Share2 size={16} className="mr-1" /> Share
                                    </button>
                                    <div className="relative">
                                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            <MoreVertical size={16} className="mr-1" /> More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8">
                                    <button
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'influencers'
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        onClick={() => setActiveTab('influencers')}
                                    >
                                        Influencers
                                    </button>
                                    <button
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'progress'
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        onClick={() => setActiveTab('progress')}
                                    >
                                        Progress
                                    </button>
                                    <button
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details'
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        onClick={() => setActiveTab('details')}
                                    >
                                        Details
                                    </button>
                                    <button
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings'
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        onClick={() => setActiveTab('settings')}
                                    >
                                        Settings
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {getTabContent()}
                    </div>
                </div>
            </BrandLayout>
        </>
    );
};

export default CampaignDetailPage;