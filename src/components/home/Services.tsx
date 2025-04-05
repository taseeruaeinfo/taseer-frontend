import { motion } from "framer-motion";
import { FaHandshake, FaGlobe, FaChalkboardTeacher, FaUsers } from "react-icons/fa";

const services = [
    {
        title: "Brand Partnerships",
        description: "We connect influencers with brands that align with their personal values and vision.",
        icon: <FaHandshake className="text-purple-600 text-3xl" />,
    },
    {
        title: "Global Campaigns",
        description: "Our experience creates successful campaigns that work with brands from various industries and regions.",
        icon: <FaGlobe className="text-purple-600 text-3xl" />,
    },
    {
        title: "Workshops & Training",
        description: "We offer workshops and training sessions to help you sharpen skills, stay updated, and thrive in the business aspects of influencing.",
        icon: <FaChalkboardTeacher className="text-purple-600 text-3xl" />,
    },
    {
        title: "Relevant Influencers",
        description: "Search for influencers that match your brand values, and connect with those who can drive results on the selected channels.",
        icon: <FaUsers className="text-purple-600 text-3xl" />,
    },
];

export default function ServicesSection() {
    return (
        <section className="w-full flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-24 py-12">
            {/* Left Side - Image */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full lg:w-1/2 "
            >
                <img src={'/services.jpg'} alt="Illustration" className=" h-full" />
                {/* Contact Button */}

            </motion.div>

            {/* Right Side - Text & Services */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                {/* Header */}
                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-2xl md:text-3xl font-bold max-w-2xl"
                >
                    We <span className="text-purple-600">Connect</span> Influencers And Brands
                    Together, Driving <span className="text-[#FFA5CC]">Collaborations</span>
                    That Drive Growth, Creativity And Success.
                </motion.h2>
                <div className="w-[300px] border-b-2 mt-5 border-purple-600"></div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-gray-600 mt-4 max-w-lg"
                >
                    Our mission is to support and amplify your creative and business journey, no matter where you are located.
                </motion.p>

                {/* Service Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 max-w-2xl">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="p-2 bg-white shadow-lg rounded-xl py-5  space-x-4"
                        >
                            <center className="text-center bg-purple-100 rounded-full ml-5 mb-5 p-2 w-fit ">{service.icon}                            </center>
                            <div>
                                <h3 className="text-lg font-semibold">{service.title}</h3>
                                <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>


            </div>
        </section >
    );
}
