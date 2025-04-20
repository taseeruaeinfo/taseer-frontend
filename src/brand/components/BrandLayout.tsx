"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import {
    AiOutlineHome,
    AiOutlineBell,
    AiOutlineMenu,
    AiOutlineLogout,
} from "react-icons/ai";

import { useLocation, useNavigate } from "react-router-dom"
import { FiBarChart2, FiCompass, FiMessageSquare, FiSearch } from "react-icons/fi";
import { BiUserPin } from "react-icons/bi";
import { MdOutlineMessage, MdPerson } from "react-icons/md";

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function BrandLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const router = useNavigate();
    const location = useLocation(); // get current route



    const navItems = [
        {
            icon: <AiOutlineHome className="w-5 h-5" />,
            label: "Home",
            href: "/brand/post",
        },
        {
            icon: <FiMessageSquare className="w-5 h-5" />,
            label: "My Campaigns",
            href: "/brand/my-campaigns",
        },
        {
            icon: <FiSearch className="w-5 h-5" />,
            label: "Search Creators",
            href: "/brand/find-creators",
        },
        {
            icon: <FiCompass className="w-5 h-5" />,
            label: "Explore",
            href: "/brand/home",
        },
        // {
        //     icon: <FiPlusSquare className="w-5 h-5" />,
        //     label: "Post",
        //     href: "/brand/home",
        // },
        {
            icon: <AiOutlineBell className="w-5 h-5" />,
            label: "Notifications",
            href: "/brand/notifications",
        },
        {
            icon: <MdOutlineMessage className="w-5 h-5" />,
            label: "Notifications",
            href: "/brand/message",
        },
        {
            icon: <BiUserPin className="w-5 h-5" />,
            label: "My Creators",
            href: "/brand/my-creators",
        },
        {
            icon: <FiBarChart2 className="w-5 h-5" />,
            label: "Analytics",
            href: "/brand/analytics",
        },
        {
            icon: <MdPerson className="w-5 h-5" />,
            label: "Profile",
            href: "/brand/profile-settings",
        },
    ];



    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile menu button */}
            <button className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden" onClick={toggleSidebar}>
                <AiOutlineMenu className="w-6 h-6 text-gray-700" />
            </button>

            {/* Sidebar overlay for mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"

                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside
                        className="fixed md:relative z-40 h-full w-64 bg-white shadow-lg"

                    >
                        <div className="flex flex-col h-full">
                            {/* Logo */}
                            <div className="flex items-center p-4 border-b">
                                <img src="/logo.svg" className="ml-5" alt="" />
                                <div className="text-white rounded-full text-sm bg px-2 w-fit -mt-8">Brand</div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 overflow-y-auto py-4">
                                <ul className="space-y-2 px-2">
                                    {navItems.map((item, index) => {
                                        const isActive = location.pathname === item.href;
                                        return (
                                            <li key={index}>
                                                <button
                                                    onClick={() => router(item.href)}
                                                    className={`flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors ${isActive ? "bg-blue-50 text-purple-600" : "text-gray-700"
                                                        }`}
                                                >
                                                    {item.icon}
                                                    <span className="ml-3">{item.label}</span>
                                                    {isActive && <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full"></div>}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>

                            {/* Bottom section */}
                            <div className="p-4 border-t">
                                {/* <div className="mb-4 p-3 bg-gray-100 rounded-lg flex items-center">
                                    <AiOutlineQuestionCircle className="w-5 h-5 text-gray-600" />
                                    <span className="ml-3 text-gray-700">Post Guide</span>
                                    <span className="ml-auto text-xs text-blue-600">1/6</span>
                                </div> */}
                                <button onClick={() => router('/')} className="w-full flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-gray-700 transition-colors">
                                    <AiOutlineLogout className="w-5 h-5 mr-2" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div >
    )
}

