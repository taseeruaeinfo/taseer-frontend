import { FaEnvelope } from "react-icons/fa";

export default function Footer() {
    const links = [
        {
            name: "Home",
            link: "/"
        },
        {
            name: "Join App",
            link: "/signu["
        },
        {
            name: "Influencers",
            link: "/signup/onboarding"
        },
        {
            name: "Brands",
            link: "/signup/onboarding"
        },
        {
            name: "Blogs",
            link: "/blogs"
        }

    ]
    return (
        <footer className="bg text-white py-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

                {/* Left Section - Logo & Contact */}
                <div className="flex flex-col items-center md:items-start space-y-4">
                    <h2 className="text-2xl font-bold">taseer</h2>
                    <button className="bg-white text-purple-700 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-200 transition">
                        Book a Meeting with Us →
                    </button>
                    <div className="flex items-center gap-2 text-sm">
                        <FaEnvelope className="text-white" />
                        <span>support@taseer.app</span>
                    </div>
                    <p className="text-sm opacity-80">© taseer 2024</p>
                    <div className="flex space-x-4 text-sm">
                        <a href="#" className="hover:underline">Terms and Conditions</a>
                        <a href="#" className="hover:underline">Privacy</a>
                    </div>
                </div>

                {/* Middle Section - Quick Links */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Quick Links</h3>
                    {links.map((link) => (
                        <a key={link.name} href={link.link} className="block text-sm hover:underline">
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Right Section - Social Links */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Connect with Us</h3>
                    {["Instagram", "LinkedIn", "Medium", "Facebook", "TikTok", "Youtube"].map((link) => (
                        <a key={link} href="#" className="block text-sm hover:underline">
                            {link}
                        </a>
                    ))}
                </div>

            </div>
        </footer>
    );
}
