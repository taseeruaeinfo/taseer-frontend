import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
// import { FiChevronDown } from "react-icons/fi";
import { FaHome, FaBookOpen, FaUserFriends } from "react-icons/fa";
import Button from "./ui/Button";
import { useNavigate } from "react-router-dom";

const ANNOUNCEMENT_TEXT = "🎉 Big update! Check out our latest features now.";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showAnnouncement, setShowAnnouncement] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state


    const router = useNavigate()
    useEffect(() => {
        const dismissedText = localStorage.getItem("announcementDismissed");

        if (dismissedText !== ANNOUNCEMENT_TEXT) {
            setShowAnnouncement(true);
        }

        setLoading(false); // Set loading to false once localStorage check is done

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleDismissAnnouncement = () => {
        localStorage.setItem("announcementDismissed", ANNOUNCEMENT_TEXT);
        setShowAnnouncement(false);
    };

    const isHomePage = window.location.pathname === "/";

    return (
        <>
            {/* Ensure no flickering while loading */}
            {!loading && isHomePage && showAnnouncement && !scrolled && (
                <AnimatePresence>
                    <motion.div
                        className="w-full text-white text-center py-3 px-6 duration-300 flex items-center justify-between fixed top-0 left-0 z-50 bg"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <p className="text-sm md:text-base">{ANNOUNCEMENT_TEXT}</p>
                        <button onClick={handleDismissAnnouncement} className="text-xl">
                            <FiX />
                        </button>
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Navbar */}
            <motion.header
                className={`fixed left-0 w-full shadow-md z-50 transition-all duration-300 ${scrolled ? "bg-white py-3 shadow-lg" : "bg-white py-5"} ${isHomePage && showAnnouncement ? "top-12" : "top-0"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="container mx-auto flex items-center justify-between px-6">
                    {/* Logo */}
                    <motion.img
                        src="/logo.svg"
                        alt="Logo"
                        whileHover={{ scale: 1.1 }}
                        className={`transition-all duration-300 ${scrolled ? "w-24" : "w-32"}`}
                    />

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
                        <motion.a href="/" className="flex items-center gap-2 hover:text-gray-900 transition" whileHover={{ scale: 1.05 }}>
                            <FaHome className="text-lg" />
                            Home
                        </motion.a>

                        {/* Resources Dropdown */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <motion.button onClick={() => router('/blogs')} className="flex items-center gap-2 hover:text-gray-900 transition" whileHover={{ scale: 1.05 }}>
                                <FaBookOpen className="text-lg" />
                                Resources
                                {/* <FiChevronDown /> */}
                            </motion.button>

                            {/* <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.ul
                                        className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        {["Tutorials", "Case Studies", "Guides"].map((item, index) => (
                                            <motion.li key={index} className="px-4 py-3 flex items-center gap-2 hover:bg-gray-100 transition" whileHover={{ scale: 1.05 }}>
                                                <FiChevronDown className="text-gray-500" />
                                                {item}
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence> */}
                        </div>

                        <motion.a href="/influencers" className="flex items-center gap-2 hover:text-gray-900 transition" whileHover={{ scale: 1.05 }}>
                            <FaUserFriends className="text-lg" />
                            Find Influencers
                        </motion.a>
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex space-x-4">
                        <Button variant="white">Signup</Button>
                        <Button variant="primary">Book a Demo</Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-2xl text-gray-700" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="md:hidden bg-white fixed top-16 left-0 w-full shadow-lg flex flex-col items-center gap-6 py-6 text-gray-700"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <a href="/" className="text-lg flex items-center gap-2 hover:text-gray-900">
                                <FaHome />
                                Home
                            </a>

                            {/* Resources Dropdown (Mobile) */}
                            <div className="w-full flex flex-col items-center">
                                <button className="flex items-center gap-2 text-lg hover:text-gray-900" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <FaBookOpen />
                                    Resources
                                    {/* <FiChevronDown /> */}
                                </button>

                                {/* <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.ul className="w-full mt-2 bg-gray-100 rounded-lg overflow-hidden" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            {["Tutorials", "Case Studies", "Guides"].map((item, index) => (
                                                <motion.li key={index} className="px-6 py-3 flex items-center gap-2 hover:bg-gray-200 transition" whileHover={{ scale: 1.05 }}>
                                                    <FiChevronDown className="text-gray-500" />
                                                    {item}
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence> */}
                            </div>

                            <a href="#" className="text-lg flex items-center gap-2 hover:text-gray-900">
                                <FaUserFriends />
                                Find Influencers
                            </a>

                            <Button variant="white">Signup</Button>
                            <Button variant="primary">Book a Demo</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </>
    );
}
