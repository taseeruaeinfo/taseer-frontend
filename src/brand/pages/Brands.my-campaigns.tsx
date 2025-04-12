// /brand/my-campaigns.tsx
import React, { useState } from 'react';
import {
    Search,
    Plus,
    Calendar,
    ChevronRight,
    CheckCircle,
    Clock as ClockIcon,
    AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BrandLayout from '../components/BrandLayout';

interface Campaign {
    id: string;
    title: string;
    status: 'active' | 'draft' | 'completed' | 'paused';
    budget: string;
    applications: number;
    selected: number;
    deadline: string;
    category: string;
    progress: number;
    createdAt: string;
}

const MyCampaignsPage: React.FC = () => {
    const router = useNavigate();
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const campaigns: Campaign[] = [
        {
            id: 'camp-1001',
            title: 'Summer Collection Launch',
            status: 'active',
            budget: '$5,000',
            applications: 24,
            selected: 8,
            deadline: 'May 10, 2025',
            category: 'Fashion',
            progress: 65,
            createdAt: 'Apr 2, 2025'
        },
        {
            id: 'camp-1002',
            title: 'Fitness App Promotion',
            status: 'active',
            budget: '$3,500',
            applications: 31,
            selected: 12,
            deadline: 'May 15, 2025',
            category: 'Health & Fitness',
            progress: 40,
            createdAt: 'Apr 5, 2025'
        },
        {
            id: 'camp-1003',
            title: 'New Skincare Line',
            status: 'draft',
            budget: '$7,200',
            applications: 0,
            selected: 0,
            deadline: 'May 30, 2025',
            category: 'Beauty',
            progress: 0,
            createdAt: 'Apr 9, 2025'
        },
        {
            id: 'camp-1004',
            title: 'Tech Gadget Review',
            status: 'completed',
            budget: '$4,800',
            applications: 42,
            selected: 15,
            deadline: 'Mar 25, 2025',
            category: 'Technology',
            progress: 100,
            createdAt: 'Mar 10, 2025'
        },
        {
            id: 'camp-1005',
            title: 'Eco-Friendly Product Launch',
            status: 'paused',
            budget: '$6,300',
            applications: 18,
            selected: 5,
            deadline: 'Jun 5, 2025',
            category: 'Sustainability',
            progress: 30,
            createdAt: 'Apr 8, 2025'
        }
    ];

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

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesFilter = activeFilter === 'all' || campaign.status === activeFilter;
        const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <>
            <BrandLayout>

                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-semibold text-gray-900">My Campaigns</h1>
                            <button
                                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                                onClick={() => router('/brand/create-campaign')}
                            >
                                <Plus size={18} className="mr-2" />
                                Create Campaign
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="relative w-full md:w-64">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                            {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Progress
                                            </th> */}
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
                                                                <div className="text-sm text-gray-500">{campaign.category} • Created {campaign.createdAt}</div>
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
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <div className="flex items-center">
                                                            <Calendar size={16} className="mr-1 text-gray-400" />
                                                            {campaign.deadline}
                                                        </div>
                                                    </td>
                                                    {/* <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                            <div
                                                                className={`h-2.5 rounded-full ${campaign.progress >= 100 ? 'bg-blue-600' :
                                                                    campaign.progress > 50 ? 'bg-emerald-500' :
                                                                        campaign.progress > 25 ? 'bg-amber-500' : 'bg-indigo-600'
                                                                    }`}
                                                                style={{ width: `${campaign.progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">{campaign.progress}% complete</div>
                                                    </td> */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <ChevronRight size={18} className="text-gray-400" />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                                                    No campaigns found. Try adjusting your filters or create a new campaign.
                                                    <div className="mt-4">
                                                        <button
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                                            onClick={() => router('/brand/create-campaign')}
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
                            </div>
                        </div>


                    </div>
                </div>
            </BrandLayout>
        </>
    );
};

export default MyCampaignsPage;