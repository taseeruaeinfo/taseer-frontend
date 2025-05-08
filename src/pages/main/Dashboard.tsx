import { useState, useEffect, useCallback } from "react"
import Tabs from "../../components/ui/Tabs"
import GigCard from "../../components/main/GigCard"
import DashboardLayout from "../../components/main/DashBoardLayout"
import campaignService from "../../service/campaignService"

// Define allowed gig types
export type GigType = "recommended" | "saved" | "applied" | "in-progress" | "canceled"

// Gig interface
export interface Gig {
    id: number
    title: string
    description: string
    image: string
    stats: { label: string; value: string }[]
}

// Map of gig sections
type GigTabs = {
    Recommended: Gig[]
    Applied: Gig[]
}

export default function Dashboard() {
    // State for all gigs and UI
    const [allGigs, setAllGigs] = useState<GigTabs>({
        Recommended: [],
        Applied: [],
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Tab states
    const [mainTab, setMainTab] = useState<"Recommended Deals" | "My Deals">("Recommended Deals")
    const [myDealsTab, setMyDealsTab] = useState<keyof Omit<GigTabs, "Recommended">>("Applied")

    // Transform campaign data to Gig format
    const transformCampaignToGig = useCallback((campaign: any): Gig => {
        return {
            id: campaign.id ?? 0,
            title: campaign.title ?? "Untitled Campaign",
            description: campaign.description ?? "No description available",
            image: campaign.CampaignImage ?? "",
            stats: [
                { label: "Budget", value: `$${campaign.budget ?? 0}` },
                { label: "Duration", value: `${campaign.duration ?? "N/A"}` },
            ]
        }
    }, [])

    // Fetch recommended campaigns
    const fetchRecommendedCampaigns = useCallback(async () => {
        try {
            setLoading(true)
            setError("")
            const campaigns = await campaignService.getRecommendedCampaigns()
            setAllGigs(prev => ({
                ...prev,
                Recommended: Array.isArray(campaigns) ? campaigns.map(transformCampaignToGig) : []
            }))
        } catch (err) {
            console.error("Error fetching recommended campaigns:", err)
            setError("Failed to load recommended deals")
        } finally {
            setLoading(false)
        }
    }, [transformCampaignToGig])

    // Fetch campaigns by tab
    //@ts-ignore
    const fetchCampaignsByTab = useCallback(async (tab: keyof omit<GigTabs, "Recommended">) => {
        try {
            setLoading(true)
            setError("")
            let campaigns

            switch (tab) {
                case "Applied":
                    campaigns = await campaignService.getAppliedCampaigns()
                    break
                case "Saved":
                    campaigns = await campaignService.getSavedCampaigns()
                    break
                case "In Progress":
                    campaigns = await campaignService.getInProgressCampaigns()
                    break
                case "Canceled":
                    campaigns = await campaignService.getCanceledCampaigns()
                    break
                default:
                    campaigns = []
            }

            setAllGigs(prev => ({
                ...prev,
                [tab]: Array.isArray(campaigns) ? campaigns.map(transformCampaignToGig) : []
            }))
        } catch (err) {
            //@ts-ignore
            console.error(`Error fetching ${tab.toLowerCase()} campaigns:`, err)
            //@ts-ignore
            setError(`Failed to load ${tab.toLowerCase()} deals`)
        } finally {
            setLoading(false)
        }
    }, [transformCampaignToGig])

    // Handle tab changes and fetch data only once per tab click
    useEffect(() => {
        if (mainTab === "Recommended Deals") {
            fetchRecommendedCampaigns()
        } else {
            fetchCampaignsByTab(myDealsTab)
        }
    }, [mainTab, myDealsTab, fetchRecommendedCampaigns, fetchCampaignsByTab])

    // Handle removing a gig
    const handleRemoveGig = useCallback((gigId: number) => {
        setAllGigs(prev => ({
            ...prev,
            Recommended: prev.Recommended.filter(gig => gig.id !== gigId)
        }))
    }, [])



    // Render content based on tabs
    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center p-8">Loading deals...</div>
        }

        if (error) {
            return <div className="flex justify-center p-8 text-red-500">{error}</div>
        }

        if (mainTab === "Recommended Deals") {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allGigs.Recommended.length > 0 ? (
                        allGigs.Recommended.map((gig) => (
                            <GigCard
                                key={gig.id}
                                gig={gig}
                                type="recommended"
                                onNotInterested={() => handleRemoveGig(gig.id)}
                            />
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-8">No recommended deals available</div>
                    )}
                </div>
            )
        } else {
            const currentGigs = allGigs[myDealsTab] || []
            const gigType = myDealsTab.toLowerCase().replace(/\s+/g, "-") as GigType

            return (
                <>
                    <div role="tablist" className="flex gap-3 mb-4 overflow-x-auto pb-2">
                        {["Applied", "Canceled"].map(tab => (
                            <button
                                key={tab}
                                role="tab"
                                aria-selected={myDealsTab === tab}
                                className={`px-4 py-2 text-sm rounded-full whitespace-nowrap ${myDealsTab === tab
                                    ? "bg-purple-100 text-purple-600 font-medium"
                                    : "text-gray-500 hover:bg-gray-100"
                                    }`}
                                //@ts-ignore
                                onClick={() => setMyDealsTab(tab as keyof omit<GigTabs, "Recommended">)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentGigs.length > 0 ? (
                            currentGigs.map((gig) => (
                                <GigCard key={gig.id} gig={gig} type={gigType} />
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-8">
                                No deals {myDealsTab.toLowerCase()}
                            </div>
                        )}
                    </div>
                </>
            )
        }
    }

    return (
        <DashboardLayout>
            <Tabs currentTab={mainTab} onChange={setMainTab} />
            {renderContent()}
        </DashboardLayout>
    )
}