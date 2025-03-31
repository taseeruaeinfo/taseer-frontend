import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import Button from "../ui/Button";

export default function BrandsSection() {
    return (
        <div className="flex flex-col md:flex-row items-center bg-white text-gray-900 p-8 md:p-16 rounded-lg  gap-8">
            {/* Left Section - Content */}
            <motion.div
                className="w-full md:w-1/2 space-y-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
            >
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                    BRANDS: <span className="text-purple-600">Collaborate</span> With{" "}
                    <span className="text-purple-600">Top Influencers</span>
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                    We help brands connect with the right influencers to amplify their message and
                    reach the right audience. Whether you're a global brand or a niche business, we make
                    influencer marketing effortless.
                </p>

                {/* Offer List */}
                <ul className="space-y-4 text-gray-800">
                    {[
                        {
                            title: "Creative Campaigns",
                            description:
                                "Engaging content created in collaboration with top influencers.",
                        },
                        {
                            title: "Comprehensive Support",
                            description: "From strategy to execution, we provide full support.",
                        },
                        {
                            title: "Global Reach",
                            description:
                                "Expand your brand by partnering with influencers worldwide.",
                        },
                        {
                            title: "Cost-Effective",
                            description:
                                "Reduce costs and save time with our optimized influencer partnerships.",
                        },
                    ].map((item, index) => (
                        <li key={index} className="flex items-start">
                            <FaCheckCircle className="text-purple-600 mt-1 mr-3" size={20} />
                            <div>
                                <strong className="text-lg">{item.title}:</strong>{" "}
                                <span className="text-gray-700">{item.description}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Button */}
                <Button
                    variant="primary"
                    className="m-5"
                >
                    I'm a Brand
                </Button>
            </motion.div>

            {/* Right Section - Image */}
            <motion.div
                className="w-full md:w-1/2 flex justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                <img
                    src="/brands.jpg"
                    alt="Brands Collaboration"
                    className="w-80 md:w-[90%] object-contain"
                />
            </motion.div>
        </div>
    );
}
