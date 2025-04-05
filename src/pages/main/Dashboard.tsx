import { useState } from "react"
import Tabs from "../../components/ui/Tabs"
import GigCard from "../../components/main/GigCard"
import DashboardLayout from "../../components/main/DashBoardLayout"
import { gigs } from "../../assets/data/Gigs"

// ✅ Define allowed gig types
type GigType = "saved" | "applied" | "in progress" | "canceled" | "recommended"

// ✅ Gig interface
export interface Gig {
    title: string
    description: string
    image: string
    stats: { label: string; value: string }[]
}

// ✅ Map of gig sections
type MyGigs = {
    Saved: Gig[]
    Applied: Gig[]
    "In Progress": Gig[]
    Canceled: Gig[]
}

export default function Dashboard() {
    const [tab, setTab] = useState<"Recommended Deals" | "My Deals">("Recommended Deals")
    const [myTab, setMyTab] = useState<keyof MyGigs>("Saved")





    const myGigs: MyGigs = {
        Saved: gigs.slice(0, 2),
        Applied: gigs.slice(2, 3),
        "In Progress": gigs.slice(3, 4),
        Canceled: gigs.slice(4, 5),
    }

    return (
        <DashboardLayout>
            <Tabs currentTab={tab} onChange={setTab} />

            {tab === "Recommended Deals" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gigs.map((gig: Gig, index: number) => (
                        <GigCard key={index} gig={gig} type="recommended" id={index} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="flex gap-3 mb-4">
                        {["Saved", "Applied", "In Progress", "Canceled"].map(name => (
                            <button
                                key={name}
                                className={`px-3 py-1 text-sm rounded-full ${myTab === name ? "bg-purple-100 text-purple-600" : "text-gray-500"
                                    }`}
                                onClick={() => setMyTab(name as keyof MyGigs)}
                            >
                                {name}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myGigs[myTab].map((gig: Gig, index: number) => (
                            <GigCard
                                key={index}
                                gig={gig}
                                id={index}
                                type={myTab.toLowerCase() as GigType}
                            />
                        ))}
                    </div>
                </>
            )}
        </DashboardLayout>
    )
}
