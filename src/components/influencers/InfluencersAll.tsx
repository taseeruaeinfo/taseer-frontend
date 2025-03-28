import { motion } from "framer-motion";
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaStar } from "react-icons/fa";
import Button from "../ui/Button";

const socialPlatforms = [
    {
        name: "Instagram",
        icon: <FaInstagram className="text-pink-500 text-2xl mr-2" />,
        influencers: [
            {
                name: "Paige Adams",
                location: "Chicago, United States, Illinois",
                description: "I am an interior designer/food blogger obsessed with cooking and baking using seasonal...",
                img: "/influncer.jpeg",
            },
            {
                name: "Paige Adams",
                location: "Chicago, United States, Illinois",
                description: "I am an interior designer/food blogger obsessed with cooking and baking using seasonal...",
                img: "/influncer.jpeg",
            },
            {
                name: "Melissa Male",
                location: "New York, United States, New York",
                description: "I'm Melissa, a New York City based content creator. My Instagram can be categorized as lifestyle...",
                img: "/influncer.jpeg",
            },
        ],
    },
    {
        name: "TikTok",
        icon: <FaTiktok className="text-black text-2xl mr-2" />,
        influencers: [
            {
                name: "Grace Silla",
                location: "Harrisburg, United States, Pennsylvania",
                description: "I'm a lifestyle & travel photographer who has worked with various brands...",
                img: "/influncer.jpeg",
            },
            {
                name: "Paige Adams",
                location: "Chicago, United States, Illinois",
                description: "I am an interior designer/food blogger obsessed with cooking and baking using seasonal...",
                img: "/influncer.jpeg",
            },
            {
                name: "John Doe",
                location: "Los Angeles, United States, California",
                description: "TikTok influencer specializing in viral challenges and short-form engaging content...",
                img: "/influncer.jpeg",
            },
        ],
    },
    {
        name: "YouTube",
        icon: <FaYoutube className="text-red-500 text-2xl mr-2" />,
        influencers: [
            {
                name: "Sophia Lee",
                location: "Austin, United States, Texas",
                description: "Tech reviewer and vlogger creating in-depth analysis and product reviews...",
                img: "/influncer.jpeg",
            },
            {
                name: "Paige Adams",
                location: "Chicago, United States, Illinois",
                description: "I am an interior designer/food blogger obsessed with cooking and baking using seasonal...",
                img: "/influncer.jpeg",
            },
            {
                name: "Daniel James",
                location: "San Francisco, United States, California",
                description: "Professional YouTube creator focused on travel vlogs and storytelling...",
                img: "/influncer.jpeg",
            },
        ],
    },
    {
        name: "Twitter",
        icon: <FaTwitter className="text-blue-400 text-2xl mr-2" />,
        influencers: [
            {
                name: "Ella Roberts",
                location: "Seattle, United States, Washington",
                description: "Twitter influencer sharing industry insights and daily updates...",
                img: "/influncer.jpeg",
            },
            {
                name: "Paige Adams",
                location: "Chicago, United States, Illinois",
                description: "I am an interior designer/food blogger obsessed with cooking and baking using seasonal...",
                img: "/influncer.jpeg",
            },
            {
                name: "Kevin Smith",
                location: "Miami, United States, Florida",
                description: "Content strategist sharing thought-provoking tweets and news updates...",
                img: "/influncer.jpeg",
            },
        ],
    },
];

const InfluencerSection = () => {
    return (
        <div className="py-10">
            <div className="max-w-6xl mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-left  text-gray-800 mb-8"
                >
                    Top <span className="text-pink">Influencers</span>  -
                </motion.h2>
                <div className="border-b-2 shadow-md shadow-[#] -mt-8 mb-10 w-[320px] border-[#ffa5cc]"></div>

                {socialPlatforms.map((platform, idx) => (
                    <div key={idx} className="mb-10">
                        <motion.h3
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-2xl font-semibold flex items-center mb-5"
                        >
                            {platform.icon} {platform.name} Influencers
                        </motion.h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {platform.influencers.map((influencer, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                    className="bg-white p-6 rounded-lg shadow-md text-center border border-purple-500 shadow-purple-500"
                                >
                                    <div className="relative inline-block">
                                        <img
                                            src={influencer.img}
                                            alt={influencer.name}
                                            className="w-20 h-20 rounded-full mx-auto"
                                        />
                                        <span className="absolute -top-2 left-12 bg-green-500 text-white px-2 py-1 text-xs rounded-lg flex items-center">
                                            <FaStar className="mr-1" /> Highly Rated
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold mt-4">{influencer.name}</h3>
                                    <p className="text-sm text-gray-500">{influencer.location}</p>
                                    <p className="text-sm text-gray-700 mt-2">{influencer.description}</p>

                                    <button className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
                                        View Profile
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <center className="w-full mx-auto">
                <Button className="mx-auto">View All Influencers</Button>
            </center>
        </div>
    );
};

export default InfluencerSection;
