"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    AiOutlineHome,
    AiOutlineMessage,
    AiOutlineBell,
    AiOutlineCompass,
    AiOutlineSetting,
    AiOutlineUser,
    AiOutlineFileText,
    AiOutlineMenu,
    AiOutlineLogout,
    // AiOutlineQuestionCircle,
} from "react-icons/ai"
import { useNavigate } from "react-router-dom"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const router = useNavigate()
    const navItems = [
        { icon: <AiOutlineHome className="w-5 h-5" />, label: "Home", active: true },
        { icon: <AiOutlineFileText className="w-5 h-5" />, label: "Posts", active: false },
        { icon: <AiOutlineMessage className="w-5 h-5" />, label: "Messages", active: false },
        { icon: <AiOutlineBell className="w-5 h-5" />, label: "Notifications", active: false },
        { icon: <AiOutlineCompass className="w-5 h-5" />, label: "Explore", active: false },
        { icon: <AiOutlineSetting className="w-5 h-5" />, label: "Settings", active: false },
        { icon: <AiOutlineUser className="w-5 h-5" />, label: "Profile", active: false },
    ]

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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside
                        className="fixed md:relative z-40 h-full w-64 bg-white shadow-lg"
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="flex flex-col h-full">
                            {/* Logo */}
                            <div className="flex items-center p-4 border-b">
                                <img src="/logo.svg" className="ml-5" alt="" />
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 overflow-y-auto py-4">
                                <ul className="space-y-2 px-2">
                                    {navItems.map((item, index) => (
                                        <li key={index}>
                                            <a
                                                href="#"
                                                className={`flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors ${item.active ? "bg-blue-50 text-purple-600" : "text-gray-700"
                                                    }`}
                                            >
                                                {item.icon}
                                                <span className="ml-3">{item.label}</span>
                                                {item.active && <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full"></div>}
                                            </a>
                                        </li>
                                    ))}
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

