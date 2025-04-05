import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/main/DashBoardLayout";

const gigData = [
    {
        id: "1",
        title: "Content Creator for Skincare Brand",
        image: "/blog.webp",
        description: "Create Instagram Reels and TikToks promoting our new skincare line...",
        deliverables: ["3 Instagram Reels", "2 TikToks", "5 Story posts"],
        budget: "$700",
        duration: "2 weeks",
        requirements: [
            "Experience in skincare or beauty niche",
            "Engagement rate above 3%",
        ],
        qualifications: [
            "Must have 10K+ followers",
            "Past brand collaboration experience preferred"
        ],
        brand: {
            name: "GlowUp Skincare",
            website: "https://glowup.com",
            twitter: "https://twitter.com/glowup",
            instagram: "https://instagram.com/glowup",
        }
    }
];

export default function GigDetails() {
    const { id } = useParams();
    console.log(id)
    const gig = gigData[0]; // Replace with actual fetch logic

    if (!gig) return <div className="p-8 text-xl">Gig not found</div>;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Left Section */}
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{gig.title}</h1>
                        <img src={gig.image} alt={gig.title} className="rounded-2xl shadow-xl w-full h-auto object-cover" />
                    </div>

                    <div className="space-y-6 text-gray-700 leading-relaxed">
                        <div className="flex justify-end w-full">
                            <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition duration-300 shadow-md"
                            >
                                Save for Later
                            </button>
                        </div>
                        <section>
                            <h2 className="text-2xl font-semibold mb-2 text-purple-700">📝 Description</h2>
                            <p>{gig.description}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-2 text-purple-700">📋 Requirements</h2>
                            <ul className="list-disc list-inside space-y-1">
                                {gig.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-2 text-purple-700">🎓 Qualifications</h2>
                            <ul className="list-disc list-inside space-y-1">
                                {gig.qualifications.map((qual, idx) => <li key={idx}>{qual}</li>)}
                            </ul>
                        </section>
                    </div>

                    {/* Form Section */}
                    <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Apply Now</h2>
                        <form className="space-y-4">
                            <input
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Your Name"
                                defaultValue="Saikrishna"
                            />
                            <input
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Email"
                                defaultValue="saikrishna@email.com"
                            />
                            <textarea
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                rows={4}
                                placeholder="Why are you a good fit?"
                            ></textarea>
                            <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition duration-300 shadow-md"
                            >
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">📦 Deliverables</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {gig.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">💰 Budget & Duration</h3>
                        <p><strong>Budget:</strong> {gig.budget}</p>
                        <p><strong>Duration:</strong> {gig.duration}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">🏢 About the Brand</h3>
                        <p className="text-gray-800 font-medium">{gig.brand.name}</p>
                        <div className="mt-3 space-y-2 text-purple-600">
                            <a href={gig.brand.website} className="block hover:underline" target="_blank" rel="noopener noreferrer">🌐 Website</a>
                            <a href={gig.brand.twitter} className="block hover:underline" target="_blank" rel="noopener noreferrer">🐦 Twitter</a>
                            <a href={gig.brand.instagram} className="block hover:underline" target="_blank" rel="noopener noreferrer">📸 Instagram</a>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
