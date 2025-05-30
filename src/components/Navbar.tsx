import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
// import { FiChevronDown } from "react-icons/fi";
import { FaHome, FaBookOpen } from "react-icons/fa";
import Button from "./ui/Button";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import {
  FaInstagram,
  FaLinkedin,
  FaMedium,
  FaFacebook,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { BsFillPersonFill } from "react-icons/bs";
import { IoPricetagsSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const user = useSelector((state: RootState) => state.user);

  const router = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = window.location.pathname === "/";

  return (
    <>
      <div className="w-full bg-white border-t max-w-[1300px] mx-auto border-purple-200 py-2 px-4 flex justify-between items-center text-purple-400 text-sm">
        <div className="flex items-center space-x-2">
          <MdEmail className="text-lg" />
          <a href="mailto:support@taseer.app" className="hover:underline">
            support@taseer.app
          </a>
        </div>
        <div className="flex space-x-4">
          <a href="https://www.instagram.com/taseer.app">
            <FaInstagram
              size={20}
              className="cursor-pointer hover:text-purple-600"
            />
          </a>
          <a href="https://www.linkedin.com/company/ta-seer/">
            <FaLinkedin
              size={20}
              className="cursor-pointer hover:text-purple-600"
            />
          </a>
          <a href="https://medium.com/@taseeruae">
            <FaMedium
              size={20}
              className="cursor-pointer hover:text-purple-600"
            />
          </a>
          <a href="https://www.facebook.com/share/4PjmQnUt2UveNf64/">
            <FaFacebook
              size={20}
              className="cursor-pointer hover:text-purple-600"
            />
          </a>
          <a href="https://www.tiktok.com/@taseer727">
            <FaTiktok
              size={20}
              className="cursor-pointer hover:text-purple-600"
            />
          </a>
          <a href="https://www.youtube.com/channel/UCZqNy4u25KYdB90gA0WG0VA">
            <FaYoutube
              size={20}
              className="cursor-pointer hover:text-purple-600"
            />
          </a>
        </div>
      </div>

      {/* Navbar */}
      <motion.header
        className={`fixed left-0 w-full shadow-md z-50 transition-all bg text-white  duration-300 ${
          scrolled ? " py-3 shadow-lg" : " py-5"
        } ${isHomePage && !scrolled ? "top-12" : "top-0"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto \ flex items-center justify-between px-6">
          {/* Logo */}
          <motion.img
            src="/logo.png"
            alt="Logo"
            whileHover={{ scale: 1.1 }}
            className={`transition-all duration-300 ${
              scrolled ? "w-24" : "w-32"
            }`}
          />

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8  font-medium">
            <motion.a
              href="/"
              className="flex items-center gap-2 hover:text-gray-900 transition"
              whileHover={{ scale: 1.05 }}
            >
              <FaHome className="text-lg" />
              Home
            </motion.a>

            {/* Resources Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <motion.button
                onClick={() => router("/resources")}
                className="flex items-center gap-2 hover:text-gray-900 transition"
                whileHover={{ scale: 1.05 }}
              >
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
            <motion.a
              href="/pricing"
              className="flex items-center gap-2 hover:text-gray-900 transition"
              whileHover={{ scale: 1.05 }}
            >
              <IoPricetagsSharp className="text-lg" />
              Pricing
            </motion.a>

            <motion.a
              href="/influencers"
              className="flex items-center gap-2 hover:text-gray-900 transition"
              whileHover={{ scale: 1.05 }}
            >
              <CiSearch className="text-lg" />
              Find Creators
            </motion.a>
            <motion.a
              href="/contact"
              className="flex items-center gap-2 hover:text-gray-900 transition"
              whileHover={{ scale: 1.05 }}
            >
              <BsFillPersonFill className="text-lg" />
              Contact us
            </motion.a>
          </nav>

          {/* Actions */}
          {!user ? (
            <>
              <div className="hidden md:flex space-x-4">
                <Button onClick={() => router("/signup")} variant="white">
                  Signup
                </Button>
                <Button
                  onClick={() => router("/login")}
                  className="border rounded-3xl border-white"
                  variant="primary"
                >
                  Login
                </Button>
              </div>
            </>
          ) : user?.type == "creator" ? (
            <Button
              onClick={() => router("/home")}
              className="border rounded-3xl border-white"
              variant="primary"
            >
              Goo to Dashboard
            </Button>
          ) : (
            <Button
              onClick={() => router("/brand/post")}
              className="border rounded-3xl border-white"
              variant="primary"
            >
              Go to Dashboard
            </Button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl "
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden bg-white fixed top-16 left-0 w-full shadow-lg flex flex-col items-center gap-6 py-6 "
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <a
                href="/"
                className="text-lg flex items-center gap-2 hover:text-gray-900"
              >
                <FaHome />
                Home
              </a>

              {/* Resources Dropdown (Mobile) */}
              <div className="w-full flex flex-col items-center">
                <button
                  className="flex items-center gap-2 text-lg hover:text-gray-900"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
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

              <a
                href="#"
                className="text-lg flex items-center gap-2 hover:text-gray-900"
              >
                <CiSearch />
                Find Creators
              </a>
              <a
                href="/contact"
                className="text-lg flex items-center gap-2 hover:text-gray-900"
              >
                <BsFillPersonFill />
                Contact Us
              </a>

              <Button onClick={() => router("/signup")} variant="white">
                Signup
              </Button>
              <Button onClick={() => router("/login")} variant="primary">
                Login
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
