import { FaEnvelope } from "react-icons/fa";

export default function Footer() {
    const links = [
        {
            name: "Home",
            link: "/"
        },
        {
            name: "Signup",
            link: "/signup"
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

    const socialLinks = [
        {
            name: "Instagram",
            link: "https://www.instagram.com/_taseer_official?igsh=MThsdWY5ZXg1dzQ2aQ=="
        },
        {
            name: "LinkedIn",
            link: "https://www.linkedin.com/company/ta-seer/"
        },
        {
            name: "Medium",
            link: "https://medium.com/@taseer"
        },
        {
            name: "Facebook",
            link: "https://www.facebook.com/people/Taseer/61562012027547/?rdid=FOy7zWA8lbqiWzZM&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F4PjmQnUt2UveNf64%2F"
        },
        {
            name: "TikTok",
            link: "https://www.tiktok.com/@taseer727"
        },
        {
            name: "Youtube",
            link: "https://www.youtube.com/channel/UCZqNy4u25KYdB90gA0WG0VA"
        }
    ]

    return (
        <footer className="bg text-white py-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

                {/* Left Section - Logo & Contact */}
                <div className="flex flex-col items-center md:items-start space-y-4">
                    <img src="/logo.png" alt="" />

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
                    {socialLinks.map((link) => (
                        <a key={link.name} href={link.link} className="block text-sm hover:underline">
                            {link.name}
                        </a>
                    ))}
                </div>

            </div>
        </footer>
    );
}
