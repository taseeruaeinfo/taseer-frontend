import { useState } from 'react';
import {
    FaUser,
    FaLock,
    FaFileContract,
    FaCrown,
    FaPhoneAlt,
    FaBookOpen,
    FaFlag,
    FaQuestionCircle,
    FaTrash,
} from 'react-icons/fa';
import BrandLayout from '../components/BrandLayout';

const menuItems = [
    { key: 'profile', label: 'Profile', icon: <FaUser /> },
    { key: 'changePassword', label: 'Change Password', icon: <FaLock /> },
    { key: 'terms', label: 'Terms of Service', icon: <FaFileContract /> },
    { key: 'subscription', label: 'Subscription', icon: <FaCrown /> },
    { key: 'sales', label: 'Talk to Sales', icon: <FaPhoneAlt /> },
    { key: 'tutorial', label: 'Request Tutorial', icon: <FaBookOpen /> },
    { key: 'report', label: 'Report Content', icon: <FaFlag /> },
    { key: 'help', label: 'Help', icon: <FaQuestionCircle /> },
];

export default function ProfileSettings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        fullName: 'Mohammed Al-Harbi',
        email: 'mohammed@example.com',
        phoneNumber: '+966 50 123 4567',
        company: 'Ta\'seer Corporation',
        position: 'Marketing Manager',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Profile Information</h2>

                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <img
                                    src="/api/placeholder/120/120"
                                    alt="Company Logo"
                                    className="w-32 h-32 rounded-full border-4 border-violet-200"
                                />
                                <button className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full hover:bg-violet-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition">
                                Save Changes
                            </button>
                        </div>

                        <div className="mt-12 border-t pt-6">
                            <h3 className="text-xl font-semibold text-red-600 mb-4">Account Actions</h3>
                            <div className="space-y-4">
                                <button className="flex items-center space-x-2 px-4 py-2 border border-orange-400 text-orange-600 rounded hover:bg-orange-50">
                                    <span>Deactivate Account</span>
                                </button>
                                <button className="flex items-center space-x-2 px-4 py-2 border border-red-400 text-red-600 rounded hover:bg-red-50">
                                    <FaTrash className="text-sm" />
                                    <span>Delete Account Permanently</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'changePassword':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Change Password</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                />
                            </div>
                            <div className="flex justify-end mt-4">
                                <button className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'terms':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Terms of Service</h2>
                        <div className="bg-gray-50 p-4 rounded-md h-96 overflow-y-auto border border-gray-200">
                            <h3 className="text-xl font-medium mb-2">Ta'seer User Agreement</h3>
                            <p className="mb-4">This document outlines the terms and conditions for using Ta'seer services.</p>

                            <h4 className="text-lg font-medium mt-4 mb-2">1. Introduction</h4>
                            <p className="mb-2">By accessing or using Ta'seer's platform, you agree to be bound by these Terms of Service.</p>

                            <h4 className="text-lg font-medium mt-4 mb-2">2. User Accounts</h4>
                            <p className="mb-2">Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.</p>

                            <h4 className="text-lg font-medium mt-4 mb-2">3. Subscription Terms</h4>
                            <p className="mb-2">Subscription fees are billed in advance on a recurring basis. Cancellations will take effect at the end of the current billing cycle.</p>

                            <h4 className="text-lg font-medium mt-4 mb-2">4. Privacy Policy</h4>
                            <p className="mb-2">Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information.</p>

                            <h4 className="text-lg font-medium mt-4 mb-2">5. Content Guidelines</h4>
                            <p className="mb-2">Users must not upload or share content that is unlawful, harmful, threatening, abusive, or otherwise objectionable.</p>

                            <p className="mt-8 text-gray-500">Last updated: April 15, 2025</p>
                        </div>
                    </div>
                );

            case 'subscription':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Subscription</h2>

                        <div className="bg-violet-50 border border-violet-200 rounded-lg p-6 mb-6">
                            <h3 className="text-xl font-semibold text-violet-800 mb-4">Premium Features</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-violet-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Advanced analytics and reporting</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-violet-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Custom branding options</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-violet-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Priority customer support</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-violet-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Unlimited user accounts</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-violet-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Advanced security features</span>
                                </li>
                            </ul>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                                <h3 className="text-xl font-semibold mb-4">Request a Call</h3>
                                <p className="text-gray-600 mb-4">Want to learn more about our premium features? Schedule a call with our team for a personalized demo.</p>
                                <button className="w-full bg-violet-100 text-violet-700 font-medium py-2 rounded hover:bg-violet-200 transition">
                                    Schedule a Call
                                </button>
                            </div>

                            <div className="border border-violet-200 rounded-lg p-6 bg-white hover:shadow-md transition">
                                <h3 className="text-xl font-semibold mb-4">Upgrade Now</h3>
                                <p className="text-gray-600 mb-4">Ready to unlock premium features? Choose your subscription plan below.</p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-medium">Premium Plan</span>
                                    <span className="text-xl font-bold">$49.99/month</span>
                                </div>
                                <button className="w-full bg-violet-600 text-white font-medium py-2 rounded hover:bg-violet-700 transition">
                                    Subscribe Now
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 border-t pt-6">
                            <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Smith"
                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'sales':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Talk to Sales</h2>

                        <p className="text-gray-600 mb-6">Have questions about our services or need a custom solution? Our sales team is here to help.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Best Time to Call</label>
                                <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500">
                                    <option>Morning (9AM - 12PM)</option>
                                    <option>Afternoon (12PM - 5PM)</option>
                                    <option>Evening (5PM - 8PM)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                    placeholder="Please briefly describe what you'd like to discuss..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition">
                                    Submit Request
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'tutorial':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Request a Tutorial Session</h2>

                        <p className="text-gray-600 mb-6">New to our platform or need help with specific features? Request a personalized tutorial session with our product specialists.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Participants</label>
                                <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500">
                                    <option>1 person</option>
                                    <option>2-5 people</option>
                                    <option>6-10 people</option>
                                    <option>More than 10 people</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Format</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="format" className="mr-2" />
                                        <span>Live video call</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="format" className="mr-2" />
                                        <span>Pre-recorded tutorial</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Topics You'd Like to Cover</label>
                                <textarea
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                    placeholder="Please list the specific features or processes you'd like help with..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition">
                                    Submit Request
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'report':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Report Inappropriate Content</h2>

                        <p className="text-gray-600 mb-6">Help us maintain a safe and respectful environment by reporting content or accounts that violate our community guidelines.</p>

                        <div className="space-y-6">
                            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                                <h3 className="font-medium text-violet-800 mb-2">Account Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Username or Account ID</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                            placeholder="Enter the username or ID of the account"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type of Content</label>
                                        <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500">
                                            <option>Profile</option>
                                            <option>Message</option>
                                            <option>Comment</option>
                                            <option>Post</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                                <h3 className="font-medium text-violet-800 mb-2">Report Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Report</label>
                                        <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500">
                                            <option>Harassment or Bullying</option>
                                            <option>Inappropriate Content</option>
                                            <option>Spam</option>
                                            <option>Fake Account</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            rows={4}
                                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                            placeholder="Please provide details about the issue..."
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Evidence (optional)</label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-gray-600">
                                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-violet-600 hover:text-violet-500 focus-within:outline-none">
                                                        <span>Upload a file</span>
                                                        <input type="file" className="sr-only" />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition">
                                    Submit Report
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'help':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Help Center</h2>

                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-md">
                                    <button className="flex justify-between items-center w-full p-4 text-left">
                                        <span className="font-medium">How do I update my account information?</span>
                                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="px-4 pb-4">
                                        <p className="text-gray-600">You can update your account information by navigating to the Profile section in your account settings.</p>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-md">
                                    <button className="flex justify-between items-center w-full p-4 text-left">
                                        <span className="font-medium">How do I upgrade to a premium subscription?</span>
                                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>

                                <button className="flex justify-between items-center w-full p-4 text-left">
                                    <span className="font-medium">What payment methods do you accept?</span>
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>

                            <div className="border border-gray-200 rounded-md">
                                <button className="flex justify-between items-center w-full p-4 text-left">
                                    <span className="font-medium">How can I reset my password?</span>
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-medium mb-4">Submit a Question</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Question</label>
                                    <textarea
                                        rows={4}
                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                        placeholder="What would you like to know?"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-violet-500"
                                        placeholder="We'll send the answer to this email"
                                    />
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition">
                                        Submit Question
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-violet-50 border border-violet-200 rounded-lg">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-violet-800">Need immediate assistance?</h3>
                                    <div className="mt-2 text-sm text-violet-700">
                                        <p>Contact our support team directly:</p>
                                        <p className="mt-1">📧 support@taseer.com</p>
                                        <p>📞 +966 12 345 6789</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <BrandLayout>
            <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <div className="bg-white p-6 rounded-xl shadow w-full md:w-1/4">
                    <h3 className="text-lg font-semibold mb-6 text-violet-700">Account Settings</h3>
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
        </BrandLayout>
    );
}