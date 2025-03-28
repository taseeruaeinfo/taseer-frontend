import DashboardLayout from "../../components/main/DashBoardLayout"
import GigCard from "../../components/main/GigCard"

export default function Dashboard() {
    const gigs = [
        {
            title: "Buffer Sports",
            description: "Sports content creation and social media management",
            image: "/blog.webp",
            hasButton: true,
            stats: [
                { label: "Budget", value: "$1,500" },
                { label: "Duration", value: "3 Months" },
                { label: "Proposals", value: "12" },
            ],
        },
        {
            title: "Carbona (Carpet Cleaners)",
            description: "Content creation for carpet cleaning products",
            image: "/blog.webp",
            hasButton: true,
            stats: [
                { label: "Budget", value: "$800" },
                { label: "Duration", value: "1 Month" },
                { label: "Proposals", value: "8" },
            ],
        },
        {
            title: "The 100 Club Annuals and Accessible Merch",
            description: "Design work for merchandise and annual reports",
            image: "/blog.webp",
            hasButton: true,
            stats: [
                { label: "Budget", value: "$2,000" },
                { label: "Duration", value: "2 Months" },
                { label: "Proposals", value: "15" },
            ],
        },
        {
            title: "Vybe Launch Campaign",
            description: "Marketing campaign for new product launch",
            image: "/blog.webp",
            hasButton: true,
            stats: [
                { label: "Budget", value: "$3,500" },
                { label: "Duration", value: "3 Months" },
                { label: "Proposals", value: "24" },
            ],
        },
        {
            title: "Wix | Acme Tech Services Partnership on YouTube Series",
            description: "Content creation for YouTube series",
            image: "/blog.webp",
            hasButton: true,
            stats: [
                { label: "Budget", value: "$5,000" },
                { label: "Duration", value: "6 Months" },
                { label: "Proposals", value: "18" },
            ],
        },
    ]

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl text-color font-semibold">Suggested Gigs</h1>
                <p className="text-gray-600">We found some matches</p>
            </div>

            <div className="flex justify-end mb-4">
                <button className="text-purple-600 text-sm flex items-center">
                    <span>Filter</span>
                    <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gigs.map((gig, index) => (
                    <GigCard
                        key={index}
                        title={gig.title}
                        description={gig.description}
                        image={gig.image}
                        stats={gig.stats}
                        hasButton={gig.hasButton}
                    />
                ))}
            </div>
        </DashboardLayout>
    )
}

