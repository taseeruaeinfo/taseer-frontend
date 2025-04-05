// pages/Profile.tsx

import { useState } from 'react';
import {
    FaUser,
    FaFolderOpen,
    FaGlobe,
    FaCog,
    FaShieldAlt,
    FaBell,
} from 'react-icons/fa';
import DashboardLayout from '../../../components/main/DashBoardLayout';

const menuItems = [
    { key: 'profile', label: 'Profile', icon: <FaUser /> },
    { key: 'portfolio', label: 'My Portfolio', icon: <FaFolderOpen /> },
    { key: 'social', label: 'Social Networks', icon: <FaGlobe /> },
    { key: 'settings', label: 'Account Settings', icon: <FaCog /> },
    { key: 'security', label: 'Security & Privacy', icon: <FaShieldAlt /> },
    { key: 'notifications', label: 'Notifications', icon: <FaBell /> },
];

export default function ProfileSettings() {
    const [activeTab, setActiveTab] = useState('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Basic Info</h2>
                        <p className="mb-2">👤 <strong>Name:</strong> Neha Jakhar</p>
                        <p className="mb-2">📄 <strong>Bio:</strong> UI/UX enthusiast & frontend wizard crafting magical web experiences.</p>
                        <p className="mb-2">📍 <strong>Location:</strong> Bengaluru, India</p>
                        <p className="mb-2">🛠️ <strong>Skills:</strong> React, Next.js, Tailwind CSS, TypeScript, Figma, Framer Motion</p>
                    </div>
                );

            case 'portfolio':
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Projects</h2>
                        <ul className="space-y-4">
                            <li className="p-4 border border-violet-200 rounded-md bg-violet-50 hover:shadow-md transition">
                                🧠 <strong>MindSpace:</strong> Mental health journaling app — <a href="https://mindspace-ai.vercel.app" className="text-violet-600 hover:underline" target="_blank">Visit</a>
                            </li>
                            <li className="p-4 border border-violet-200 rounded-md bg-violet-50 hover:shadow-md transition">
                                🛍️ <strong>TrendyMart:</strong> Fashion ecommerce frontend — <a href="https://trendymart-ui.vercel.app" className="text-violet-600 hover:underline" target="_blank">Visit</a>
                            </li>
                            <li className="p-4 border border-violet-200 rounded-md bg-violet-50 hover:shadow-md transition">
                                🎨 <strong>PortfolioV2:</strong> Animated personal portfolio — <a href="https://neha-portfolio.vercel.app" className="text-violet-600 hover:underline" target="_blank">Visit</a>
                            </li>
                        </ul>
                    </div>
                );

            case 'social':
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Social Links</h2>
                        <input className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500" placeholder="https://twitter.com/neha_jakhar" />
                        <input className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500" placeholder="https://linkedin.com/in/nehajakhar" />
                        <input className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500" placeholder="https://github.com/nehajakhar" />
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Account Settings</h2>
                        <p>📧 <strong>Email:</strong> neha.jakhar@example.com</p>
                        <p>🆔 <strong>Username:</strong> neha_j</p>
                        <p>🌐 <strong>Language:</strong> English (UK)</p>
                        <p>🕓 <strong>Timezone:</strong> IST (GMT+5:30)</p>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Security</h2>
                        <p>🔐 <strong>Password:</strong> ******** <button className="text-violet-600 hover:underline ml-2">Change</button></p>
                        <p>🔒 <strong>2FA:</strong> <span className="text-green-600">Enabled</span></p>
                        <p>🧠 <strong>Login Alerts:</strong> Active</p>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Notifications</h2>
                        <p>📨 <strong>Email Alerts:</strong> ✅ Daily Digest</p>
                        <p>🔔 <strong>In-App Alerts:</strong> ✅ Real-time</p>
                        <p>📱 <strong>Push Notifications:</strong> ❌ Disabled</p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <div className="bg-white p-6 rounded-xl shadow w-full md:w-1/4">
                    <h3 className="text-lg font-semibold mb-6 text-violet-700">Personal Details</h3>
                    <ul className="space-y-4">
                        {menuItems.map((item) => (
                            <li
                                key={item.key}
                                onClick={() => setActiveTab(item.key)}
                                className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition duration-200 
                ${activeTab === item.key
                                        ? 'bg-violet-100 text-violet-700 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white p-6 rounded-xl shadow">
                    {renderContent()}
                </div>
            </div>
        </DashboardLayout>
    );
}
