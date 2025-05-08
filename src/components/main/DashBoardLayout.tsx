"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    AiOutlineHome,
    AiOutlineMessage,
    AiOutlineBell,
    AiOutlineMenu,
    AiOutlineLogout,
} from "react-icons/ai"
import { useLocation, useNavigate } from "react-router-dom"
import { IoMdSettings } from "react-icons/io"
import { FaHandshake } from "react-icons/fa"
import { BsPlusSquareFill } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import { logout } from "../../store/userSlice"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const router = useNavigate()
    const location = useLocation()

    const dispatch = useDispatch() // Use the dispatch hook to dispatch actions
    const user = useSelector((state: RootState) => state.user)

    console.log(user)
    // Redirect logic for user not logged in or not a creator
    useEffect(() => {
        if (!user) {
            router('/login') // Not logged in
        } else if (user.type !== 'creator') {
            router('/brand/home') // Logged in but not a creator
        }
    }, [user, router])

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    const navItems = [
        { icon: <AiOutlineHome className="w-5 h-5" />, label: "Home", href: "/home" },
        { icon: <FaHandshake className="w-5 h-5" />, label: "Deals", href: "/deals" },
        { icon: <AiOutlineMessage className="w-5 h-5" />, label: "Messages", href: "/messages" },
        { icon: <AiOutlineBell className="w-5 h-5" />, label: "Notifications", href: "/notifications" },
        { icon: <BsPlusSquareFill className="w-5 h-5" />, label: "Post", href: "/create-post" },
        { icon: <IoMdSettings className="w-5 h-5" />, label: "Settings", href: "/profile-settings" },
    ]

    const handleLogout = () => {
        // Dispatch the logout action to clear the user state
        dispatch(logout())

        // Optionally, clear session data like tokens from localStorage or sessionStorage
        localStorage.removeItem('token') // Clear token if stored in localStorage
        sessionStorage.removeItem('token') // Clear token if stored in sessionStorage

        // Redirect to login page after logging out
        router('/login')
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <button className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden" onClick={toggleSidebar}>
                <AiOutlineMenu className="w-6 h-6 text-gray-700" />
            </button>

            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside className="fixed md:relative z-40 h-full w-64 bg-white shadow-lg">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center p-4 border-b">
                                <img src="/logo.svg" className="ml-5" alt="" />
                            </div>
                            <nav className="flex-1 overflow-y-auto py-4">
                                <ul className="space-y-2 px-2">
                                    {navItems.map((item, index) => {
                                        const isActive = location.pathname === item.href
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
                                        )
                                    })}
                                </ul>
                            </nav>
                            <div className="p-4 border-t">
                                <button
                                    onClick={handleLogout} // Trigger the logout function here
                                    className="w-full flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <AiOutlineLogout className="w-5 h-5 mr-2" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
    )
}
