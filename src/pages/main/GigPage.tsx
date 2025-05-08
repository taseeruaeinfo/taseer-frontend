import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import DashboardLayout from "../../components/main/DashBoardLayout";
import axios from "axios";
import Cookies from "js-cookie";

// Define types for the campaign and application
interface Campaign {
    id: string;
    userId: string;
    title: string;
    description: string;
    requirements: string;
    qualifications: string;
    delivables: string; // Note: This matches your Prisma model (typo included)
    budget: string;
    duration: string;
    CampaignImage: string;
    platform: string;
    status: 'active' | 'completed' | 'draft';
    createdAt: string;
    updatedAt: string;
    campaignApplications: CampaignApplication[];
}

interface CampaignApplication {
    id: string;
    userId: string;
    campaignId: string;
    name: string;
    email: string;
    text: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        username: string;
        profilePic: string | null;
    };
}

interface FormData {
    name: string;
    email: string;
    text: string;
}



export default function GigDetails() {
    const { id: campaignId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        text: ""
    });
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        console.log("campaignId", campaignId);
        const fetchCampaign = async (): Promise<void> => {
            const token = Cookies.get("jwt")
            try {
                setLoading(true);
                const response = await axios.get<Campaign>(`http://localhost:5000/api/campaign/${campaignId}`, {
                    headers: {
                        authorization: `Bearer ${token}`,

                    }
                });
                setCampaign(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching campaign:", err);
                setError("Failed to load campaign details");
            } finally {
                setLoading(false);
            }
        };

        if (campaignId) {
            fetchCampaign();
        }
    }, [campaignId]);


    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.text) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const token = Cookies.get("jwt")
            setSubmitting(true);
            await axios.post(`http://localhost:5000/api/campaigns/${campaignId}/apply`, formData, {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });
            toast.success("Application submitted successfully!");
            navigate("/deals");
        } catch (err) {
            toast.error("Failed to submit application");

            // If user already applied, redirect to deals
            setTimeout(() => navigate("/deals"), 2000);

        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveForLater = (): void => {
        // Implement save for later functionality
        toast.info("Campaign saved for later");
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="max-w-7xl mx-auto px-4 py-10 text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
                        <p className="text-red-600 mb-6">{error}</p>
                        <Link
                            to="/deals"
                            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition duration-300 shadow-md"
                        >
                            Return to Deals
                        </Link>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!campaign) {
        return (
            <DashboardLayout>
                <div className="p-8 text-xl text-center">
                    <p className="mb-4">Campaign not found</p>
                    <Link
                        to="/deals"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition duration-300 shadow-md"
                    >
                        Return to Deals
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    // Split comma-separated strings into arrays
    const requirements = campaign.requirements.split(',').map(item => item.trim());
    const qualifications = campaign.qualifications.split(',').map(item => item.trim());
    const deliverables = campaign.delivables.split(',').map(item => item.trim());

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Left Section */}
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
                        <img src={campaign.CampaignImage} alt={campaign.title} className="rounded-2xl shadow-xl w-full h-auto object-cover" />
                    </div>

                    <div className="space-y-6 text-gray-700 leading-relaxed">
                        <div className="flex justify-end w-full">
                            <button
                                type="button"
                                onClick={handleSaveForLater}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition duration-300 shadow-md"
                            >
                                Save for Later
                            </button>
                        </div>
                        <section>
                            <h2 className="text-2xl font-semibold mb-2 text-purple-700">📝 Description</h2>
                            <p>{campaign.description}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-2 text-purple-700">🎯 Platform</h2>
                            <p>{campaign.platform}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-2 text-purple-700">📋 Requirements</h2>
                            <ul className="list-disc list-inside space-y-1">
                                {requirements.map((req, idx) => <li key={idx}>{req}</li>)}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-2 text-purple-700">🎓 Qualifications</h2>
                            <ul className="list-disc list-inside space-y-1">
                                {qualifications.map((qual, idx) => <li key={idx}>{qual}</li>)}
                            </ul>
                        </section>
                    </div>

                    {/* Form Section */}
                    <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Apply Now</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Your Name"
                                required
                            />
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Email"
                                required
                            />
                            <textarea
                                name="text"
                                value={formData.text}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                rows={4}
                                placeholder="Why are you a good fit?"
                                required
                            ></textarea>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition duration-300 shadow-md w-full ${submitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center">
                                        <span className="mr-2">Submitting</span>
                                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                    </span>
                                ) : 'Submit Application'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">📦 Deliverables</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {deliverables.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">💰 Budget & Duration</h3>
                        <p><strong>Budget:</strong> {campaign.budget}</p>
                        <p><strong>Duration:</strong> {campaign.duration}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">🏢 Campaign Status</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                            campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}