import { motion } from "framer-motion";
import { FaInstagram, FaEnvelope, FaPodcast, FaLinkedin } from "react-icons/fa";

export default function ContactForm() {
    return (
        <div className="bg-white py-10 px-6 md:px-12 max-w-4xl mx-auto rounded-lg shadow-lg">
            {/* Title */}
            <motion.h2
                className="text-center text-2xl md:text-3xl font-bold text-gray-900"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Contact <span className="text-color">Us</span> & Get In <span className="text-color">Touch</span>
            </motion.h2>

            {/* Form */}
            <motion.form
                className="mt-6 space-y-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Your Name..."
                        className="p-3 rounded-lg bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Your Surname..."
                        className="p-3 rounded-lg bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="email"
                        placeholder="Your E-mail..."
                        className="p-3 rounded-lg bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Subject..."
                        className="p-3 rounded-lg bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                    />
                </div>
                <textarea
                    placeholder="Your Message"
                    className="p-3 rounded-lg bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full h-32"
                ></textarea>

                <motion.button
                    type="submit"
                    className="w-full bg text-white py-3 rounded-full text-lg font-semibold shadow-md hover:bg-purple-800 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Send Message Now
                </motion.button>
            </motion.form>

            {/* Social Links */}
            <div className="mt-8 bg text-white py-4 rounded-lg flex flex-col md:flex-row items-center justify-around">
                <div className="flex items-center space-x-2">
                    <FaInstagram className="text-2xl" />
                    <span>taseer.app</span>
                </div>
                <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-2xl" />
                    <span>support@taseer.app</span>
                </div>
                <div className="flex items-center space-x-2">
                    <FaPodcast className="text-2xl" />
                    <span>@taseeruae</span>
                </div>
                <div className="flex items-center space-x-2">
                    <FaLinkedin className="text-2xl" />
                    <span>Ta’seer On LinkedIn</span>
                </div>
            </div>
        </div>
    );
}
