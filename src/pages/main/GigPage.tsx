import  { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import DashboardLayout from "../../components/main/DashBoardLayout";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

// Define types for the campaign and application
interface Campaign {
    id: string;
    userId: string;
    title: string;
    description: string;
    requirements: string;
    qualifications: string;
    deliverables: string;
    budget: string;
    duration: string;
    CampaignImage: string;
    platform: string;
    status: 'active' | 'completed' | 'draft';
    createdAt: string;
    updatedAt: string;

    user:{
        profilePic:string
    }
    
    // Basic Information
    content_requirements: string[];
    
    // Campaign Goal
    campaign_goals: string[];
    kpi_reach: string;
    kpi_leads: string;
    kpi_downloads: string;
    kpi_website_visits: string;
    kpi_promo_code: string;
    
    // Compensation Model
    compensation_type: string;
    barter_product_value: string;
    fixed_fee_amount: string;
    pay_per_views: string;
    minimum_views: string;
    pay_per_sale: string;
    tracking_method: string;
    pay_per_lead: string;
    other_compensation: string;
    hybrid_basic_fee: string;
    hybrid_bonus_type: string;
    
    // Budget
    custom_budget: string;
    
    // Target Audience
    audience_age: string[];
    audience_gender: string[];
    audience_geography: string;
    audience_nationality: string;
    audience_behavior: string;
    
    // Creator Preferences
    creator_count: string;
    creator_age: string[];
    creator_gender: string[];
    creator_geography: string;
    creator_nationality: string;
    creator_platforms: string[];
    creator_followers: string[];
    creator_engagement_rate: string;
    creator_reach: string;
    creator_content_types: string[];
    
    // Content Requirements
    show_face: string;
    require_unboxing: string;
    require_experience: string;
    require_cross_promotion: string;
    use_hashtags: string;
    delivery_time: string;
    
    // Content Approvals
    approval_type: string;
    usage_rights: string;
    
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
    const [activeTab, setActiveTab] = useState<string>("description");

    useEffect(() => {
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
        } catch  {
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

   

    // Determine if we have the new fields or need to fall back to legacy fields
    const requirements = campaign.content_requirements?.length > 0 
        ? campaign.content_requirements 
        : campaign.requirements.split(',').map(item => item.trim());
        
    const qualifications = campaign.campaign_goals?.length > 0
        ? campaign.campaign_goals
        : campaign.qualifications.split(',').map(item => item.trim());
        
    const deliverables = campaign.deliverables.split(',').map(item => item.trim());
    
    const platforms = campaign.creator_platforms?.length > 0
        ? campaign.creator_platforms
        : campaign.platform.split(',').map(item => item.trim());

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Left Section */}
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
                        <div className="relative h-64 md:h-96 overflow-hidden rounded-2xl shadow-xl mb-6">
                            <img 
                                src={campaign.CampaignImage  || campaign?.user?.profilePic} 
                                alt={campaign.title} 
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                            />
                        </div>

                        <div className="flex justify-end w-full mb-8">
                            <button
                                type="button"
                                onClick={handleSaveForLater}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition duration-300 shadow-md"
                            >
                                Save for Later
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="mb-6 border-b border-gray-200">
                            <div className="flex overflow-x-auto scrollbar-hide">
                                <button
                                    onClick={() => setActiveTab("description")}
                                    className={`py-3 px-6 border-b-2 font-medium transition-colors ${
                                        activeTab === "description" 
                                        ? "border-purple-600 text-purple-600" 
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    Description
                                </button>
                                <button
                                    onClick={() => setActiveTab("requirements")}
                                    className={`py-3 px-6 border-b-2 font-medium transition-colors ${
                                        activeTab === "requirements" 
                                        ? "border-purple-600 text-purple-600" 
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    Requirements
                                </button>
                                <button
                                    onClick={() => setActiveTab("audience")}
                                    className={`py-3 px-6 border-b-2 font-medium transition-colors ${
                                        activeTab === "audience" 
                                        ? "border-purple-600 text-purple-600" 
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    Target Audience
                                </button>
                                <button
                                    onClick={() => setActiveTab("creator")}
                                    className={`py-3 px-6 border-b-2 font-medium transition-colors ${
                                        activeTab === "creator" 
                                        ? "border-purple-600 text-purple-600" 
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    Creator Details
                                </button>
                                <button
                                    onClick={() => setActiveTab("compensation")}
                                    className={`py-3 px-6 border-b-2 font-medium transition-colors ${
                                        activeTab === "compensation" 
                                        ? "border-purple-600 text-purple-600" 
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    Compensation
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6 text-gray-700 leading-relaxed"
                        >
                            {activeTab === "description" && (
                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 text-purple-700">📝 Campaign Description</h2>
                                    <p className="whitespace-pre-line">{campaign.description}</p>
                                    
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold mb-3 text-purple-700">Platform Focus</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {platforms.map((platform, idx) => (
                                                <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                                    {platform.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold mb-3 text-purple-700">Campaign Goals</h3>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {qualifications.map((goal, idx) => (
                                                <li key={idx} className="flex items-center">
                                                    <span className="mr-2 text-purple-600">✓</span>
                                                    {goal.trim()}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>
                            )}

                            {activeTab === "requirements" && (
                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 text-purple-700">📋 Content Requirements</h2>
                                    
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                                        <h3 className="text-xl font-semibold mb-3">Required Content Type</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {requirements.map((req, idx) => (
                                                <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                    {req.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <h3 className="text-xl font-semibold mb-3">Content Specifications</h3>
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-2">
                                                    <span className="font-medium">Show Face:</span> 
                                                    <span className={campaign.show_face === "Yes" ? "text-green-600" : "text-red-600"}>
                                                        {campaign.show_face || "Not specified"}
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="font-medium">Unboxing Required:</span> 
                                                    <span className={campaign.require_unboxing === "Yes" ? "text-green-600" : "text-red-600"}>
                                                        {campaign.require_unboxing || "Not specified"}
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="font-medium">Use Hashtags:</span> 
                                                    <span className={campaign.use_hashtags === "Yes" ? "text-green-600" : "text-red-600"}>
                                                        {campaign.use_hashtags || "Not specified"}
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="font-medium">Cross Promotion:</span> 
                                                    <span className={campaign.require_cross_promotion === "Yes" ? "text-green-600" : "text-red-600"}>
                                                        {campaign.require_cross_promotion || "Not specified"}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                        
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <h3 className="text-xl font-semibold mb-3">Delivery & Approvals</h3>
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-2">
                                                    <span className="font-medium">Delivery Time:</span> 
                                                    <span>{campaign.delivery_time || "Not specified"}</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="font-medium">Approval Process:</span> 
                                                    <span>{campaign.approval_type || "Not specified"}</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="font-medium">Usage Rights:</span> 
                                                    <span>{campaign.usage_rights || "Not specified"}</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="font-medium">Campaign Duration:</span> 
                                                    <span>{campaign.duration}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold mb-3">Specific Deliverables</h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {deliverables.map((d, i) => <li key={i}>{d}</li>)}
                                        </ul>
                                    </div>
                                </section>
                            )}

                            {activeTab === "audience" && (
                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 text-purple-700">👥 Target Audience</h2>
                                    
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3">Demographics</h3>
                                                <ul className="space-y-3">
                                                    <li className="flex flex-col">
                                                        <span className="font-medium">Age Groups:</span> 
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {campaign.audience_age?.length > 0 ? (
                                                                campaign.audience_age.map((age, idx) => (
                                                                    <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                                                        {age}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-gray-500">Not specified</span>
                                                            )}
                                                        </div>
                                                    </li>
                                                    <li className="flex flex-col">
                                                        <span className="font-medium">Gender:</span> 
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {campaign.audience_gender?.length > 0 ? (
                                                                campaign.audience_gender.map((gender, idx) => (
                                                                    <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                                                        {gender}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-gray-500">Not specified</span>
                                                            )}
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3">Location</h3>
                                                <ul className="space-y-3">
                                                    <li className="flex items-center gap-2">
                                                        <span className="font-medium">Geography:</span> 
                                                        <span>{campaign.audience_geography || "Not specified"}</span>
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span className="font-medium">Nationality:</span> 
                                                        <span>{campaign.audience_nationality || "Not specified"}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        
                                        {campaign.audience_behavior && (
                                            <div className="mt-6">
                                                <h3 className="text-lg font-semibold mb-2">Buying Behavior & Pain Points</h3>
                                                <p className="text-gray-700">{campaign.audience_behavior}</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {activeTab === "creator" && (
                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 text-purple-700">👨‍🎨 Creator Preferences</h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <h3 className="text-xl font-semibold mb-3">Creator Profile</h3>
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-2">
                                                    <span className="font-medium">Number of Creators:</span> 
                                                    <span>{campaign.creator_count || "Not specified"}</span>
                                                </li>
                                                <li className="flex flex-col">
                                                    <span className="font-medium">Age Groups:</span> 
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {campaign.creator_age?.length > 0 ? (
                                                            campaign.creator_age.map((age, idx) => (
                                                                <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                                    {age}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-500">Not specified</span>
                                                        )}
                                                    </div>
                                                </li>
                                                <li className="flex flex-col">
                                                    <span className="font-medium">Gender:</span> 
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {campaign.creator_gender?.length > 0 ? (
                                                            campaign.creator_gender.map((gender, idx) => (
                                                                <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                                    {gender}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-500">Not specified</span>
                                                        )}
                                                    </div>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="font-medium">Geography:</span> 
                                                    <span>{campaign.creator_geography || "Not specified"}</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="font-medium">Nationality:</span> 
                                                    <span>{campaign.creator_nationality || "Not specified"}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <h3 className="text-xl font-semibold mb-3">Audience Requirements</h3>
                                            <ul className="space-y-3">
                                                <li className="flex flex-col">
                                                    <span className="font-medium">Follower Count:</span> 
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {campaign.creator_followers?.length > 0 ? (
                                                            campaign.creator_followers.map((follower, idx) => (
                                                                <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                                                    {follower}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-500">Not specified</span>
                                                        )}
                                                    </div>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="font-medium">Engagement Rate:</span> 
                                                    <span>{campaign.creator_engagement_rate || "Not specified"}</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="font-medium">Combined Reach:</span> 
                                                    <span>{campaign.creator_reach || "Not specified"}</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="font-medium">Need Previous Experience:</span> 
                                                    <span className={campaign.require_experience === "Yes" ? "text-green-600" : "text-gray-600"}>
                                                        {campaign.require_experience || "Not specified"}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="text-xl font-semibold mb-3">Content Type Preferences</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {campaign.creator_content_types?.length > 0 ? (
                                                campaign.creator_content_types.map((type, idx) => (
                                                    <span key={idx} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                                                        {type}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500">Not specified</span>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === "compensation" && (
                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 text-purple-700">💰 Compensation Details</h2>
                                    
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                                        <h3 className="text-xl font-semibold mb-3">Compensation Model</h3>
                                        
                                        <div className="mb-4">
                                            <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg text-base font-medium">
                                                {campaign.compensation_type || "Not specified"}
                                            </span>
                                        </div>
                                        
                                        {campaign.compensation_type === "barter" && (
                                            <div>
                                                <p><strong>Product Value:</strong> {campaign.barter_product_value}</p>
                                            </div>
                                        )}
                                        
                                        {campaign.compensation_type === "fixed" && (
                                            <div>
                                                <p><strong>Fixed Fee Amount:</strong> {campaign.fixed_fee_amount}</p>
                                            </div>
                                        )}
                                        
                                        {campaign.compensation_type === "performance" && (
                                            <div className="space-y-2">
                                                {campaign.pay_per_views && (
                                                    <p><strong>Pay Per 1000 Views:</strong> {campaign.pay_per_views}</p>
                                                )}
                                                {campaign.minimum_views && (
                                                    <p><strong>Minimum Views to Qualify:</strong> {campaign.minimum_views}</p>
                                                )}
                                                {campaign.pay_per_sale && (
                                                    <p><strong>Pay Per Sale/Signup:</strong> {campaign.pay_per_sale}</p>
                                                )}
                                                {campaign.tracking_method && (
                                                    <p><strong>Tracking Method:</strong> {campaign.tracking_method}</p>
                                                )}
                                                {campaign.pay_per_lead && (
                                                    <p><strong>Pay Per Lead:</strong> {campaign.pay_per_lead}</p>
                                                )}
                                                {campaign.other_compensation && (
                                                    <p><strong>Other Compensation:</strong> {campaign.other_compensation}</p>
                                                )}
                                            </div>
                                        )}
                                        
                                        {campaign.compensation_type === "hybrid" && (
                                            <div className="space-y-2">
                                                <p><strong>Basic Fee:</strong> {campaign.hybrid_basic_fee}</p>
                                                <p><strong>Bonus Type:</strong> {campaign.hybrid_bonus_type}</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="text-xl font-semibold mb-3">Budget Information</h3>
                                        <p className="text-lg">
                                            <strong>Budget Range:</strong> {campaign.budget === "custom" ? campaign.custom_budget : campaign.budget}
                                        </p>
                                        <p className="text-lg mt-2">
                                            <strong>Campaign Duration:</strong> {campaign.duration}
                                        </p>
                                    </div>
                                </section>
                            )}
                        </motion.div>
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
                                placeholder="Why are you a good fit for this campaign?"
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
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">💼 Campaign Overview</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-700">💰 Budget</h4>
                                <p className="text-lg font-semibold text-purple-700">
                                    {campaign.budget === "custom" ? campaign.custom_budget : campaign.budget}
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-gray-700">⏱️ Duration</h4>
                                <p className="text-lg font-semibold text-purple-700">{campaign.duration}</p>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-gray-700">🏆 Campaign Status</h4>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                                    campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                </span>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-gray-700">🎯 Platforms</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {platforms.map((platform, idx) => (
                                        <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                            {platform.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-gray-700">📅 Posted On</h4>
                                <p className="text-gray-600">
                                    {new Date(campaign.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition duration-300 shadow-md"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}