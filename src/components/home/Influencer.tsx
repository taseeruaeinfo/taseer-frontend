import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

export default function InfluencerSection() {
    const router = useNavigate()
    return (
        <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 md:p-12 rounded-lg shadow-lg">
            {/* Left Section - Image */}
            <motion.div
                className="w-full md:w-1/2 flex justify-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
            >
                <img
                    src="/influencer.jpg"
                    alt="Influencer Rocket"
                    className="w-80 md:w-[90%] object-contain"
                />
            </motion.div>

            {/* Right Section - Content */}
            <motion.div
                className="w-full md:w-1/2 md:text-left"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                <h2 className="text-2xl md:text-4xl font-bold">
                    INFLUENCERS: <span className="text-pink">Join Our</span> Influencer{" "}
                    <span className="text-pink">Network</span>
                </h2>
                <p className="mt-4 text-lg text-gray-200">
                    At Ta’seer, we understand the power of influence and creativity. We are here
                    to help you connect with top brands that value your unique voice and style.
                </p>

                {/* Offer List */}
                <ul className="mt-4 text-gray-100 space-y-3">
                    <li className="grid md:flex items-center">

                        <div className="flex">  <FaRocket className="text-purple-300 mr-2 mt-1" />{" "}
                            <strong>Global Exposure:</strong> </div>Work with leading brands from around the world.
                    </li>
                    <li className="grid md:flex items-center">
                        <div className="flex"> <FaRocket className="text-purple-300 mr-2 mt-1" />{" "}
                            <strong>Tailored Opportunities:</strong> </div> Collaborations that match your audience and style.
                    </li>
                    <li className="grid md:flex items-center">
                        <div className="flex"> <FaRocket className="text-purple-300 mr-2 mt-1" />{" "}
                            <strong>Support & Guidance:</strong> </div> Assistance in contract negotiations and strategy.
                    </li>
                    <li className="grid md:flex items-center">
                        <div className="flex">  <FaRocket className="text-purple-300 mr-2 mt-1" />{" "}
                            <strong>Join now by filling application here</strong> </div>
                    </li>
                </ul>

                {/* Button */}
                <Button
                    onClick={() => router('/signup/onboarding')}
                    variant="primary"
                    className="my-5"
                >
                    Join Now
                </Button>
            </motion.div>
        </div>
    );
}
