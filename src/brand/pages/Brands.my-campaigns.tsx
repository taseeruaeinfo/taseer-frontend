// /brand/my-campaigns.tsx
import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Calendar,
    ChevronRight,
    CheckCircle,
    Clock as ClockIcon,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BrandLayout from '../components/BrandLayout';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Campaign {
    id: string;
    title: string;
    status: 'active' | 'draft' | 'completed' | 'paused';
    budget: string;
    applications?: number;
    selected?: number;
    description: string;
    platform: string;
    createdAt: string;
    duration: string;
}

const MyCampaignsPage: React.FC = () => {
    const router = useNavigate();
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        setIsLoading(true);
        const token = Cookies.get('jwt');
        try {
            const response = await axios.get('https://taseer-b.onrender.com/api/campaigns/brand/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Format the campaigns data from the backend
            //@ts-expect-error - network
            const formattedCampaigns = response.data.map((campaign: any) => ({
                ...campaign,
                applications: campaign.campaignApplications?.length || 0,
                selected: campaign.campaignApplications?.filter((app: any) => app.status === 'accepted').length || 0,
                createdAt: new Date(campaign.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })
            }));

            setCampaigns(formattedCampaigns);
            setIsLoading(false);
        } catch (error) {
            toast.error('Failed to load campaigns. Please try again later.');
            console.error('Error fetching campaigns:', error);
            setIsLoading(false);
        }
    };

    const navigateToCampaign = (campaignId: string) => {
        router(`/brand/campaign/${campaignId}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 text-emerald-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'paused': return 'bg-amber-100 text-amber-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle size={16} className="text-emerald-600" />;
            case 'draft': return <ClockIcon size={16} className="text-gray-600" />;
            case 'completed': return <CheckCircle size={16} className="text-blue-600" />;
            case 'paused': return <AlertCircle size={16} className="text-amber-600" />;
            default: return <ClockIcon size={16} className="text-gray-600" />;
        }
    };

    // Format date string for deadline display
    const formatDeadline = (createdAt: string, duration: string) => {
        const durationDays = parseInt(duration.split(' ')[0]);
        const startDate = new Date(createdAt);
        const deadlineDate = new Date(startDate);
        deadlineDate.setDate(deadlineDate.getDate() + durationDays);

        return deadlineDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesFilter = activeFilter === 'all' || campaign.status === activeFilter;
        const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.platform.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <>
            <BrandLayout>
                <ToastContainer position="top-right" autoClose={5000} />
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-semibold text-gray-900">My Campaigns</h1>
                            <button
                                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                                onClick={() => router('/brand/post')}
                            >
                                <Plus size={18} className="mr-2" />
                                Create Campaign
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="relative w-full md:w-64">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Search campaigns..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeFilter === 'all' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-700 hover:bg-gray-100'}`}
                                            onClick={() => setActiveFilter('all')}
                                        >
                                            All
                                        </button>
                                        <button
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeFilter === 'active' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:bg-gray-100'}`}
                                            onClick={() => setActiveFilter('active')}
                                        >
                                            Active
                                        </button>
                                        <button
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeFilter === 'draft' ? 'bg-gray-200 text-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                                            onClick={() => setActiveFilter('draft')}
                                        >
                                            Draft
                                        </button>
                                        <button
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeFilter === 'completed' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
                                            onClick={() => setActiveFilter('completed')}
                                        >
                                            Completed
                                        </button>
                                        <button
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeFilter === 'paused' ? 'bg-amber-100 text-amber-800' : 'text-gray-700 hover:bg-gray-100'}`}
                                            onClick={() => setActiveFilter('paused')}
                                        >
                                            Paused
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-20">
                                        <Loader2 size={32} className="animate-spin text-indigo-600" />
                                        <span className="ml-2 text-gray-600">Loading campaigns...</span>
                                    </div>
                                ) : (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Campaign
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Budget
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Applications
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Deadline
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Details</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredCampaigns.length > 0 ? (
                                                filteredCampaigns.map((campaign) => (
                                                    <tr
                                                        key={campaign.id}
                                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                                        onClick={() => navigateToCampaign(campaign.id)}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                                                                    <div className="text-sm text-gray-500">{campaign.platform} • Created {campaign.createdAt}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                                                    {getStatusIcon(campaign.status)}
                                                                    <span className="ml-1 capitalize">{campaign.status}</span>
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {campaign.budget}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{campaign.applications} applications</div>
                                                            {campaign.selected ? (
                                                                <div className="text-xs text-gray-500">{campaign.selected} selected</div>
                                                            ) : null}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <div className="flex items-center">
                                                                <Calendar size={16} className="mr-1 text-gray-400" />
                                                                {formatDeadline(campaign.createdAt, campaign.duration)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <ChevronRight size={18} className="text-gray-400" />
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                                        No campaigns found. Try adjusting your filters or create a new campaign.
                                                        <div className="mt-4">
                                                            <button
                                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                                                onClick={() => router('/brand/post')}
                                                            >
                                                                <Plus size={16} className="mr-2" />
                                                                Create New Campaign
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </BrandLayout>
        </>
    );
};

export default MyCampaignsPage;