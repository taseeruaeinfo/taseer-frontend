"use client"

import { useState, type ChangeEvent, type ReactNode } from "react"
import {
    FaUser,
    FaFolderOpen,
    FaGlobe,
    FaCog,
    FaShieldAlt,
    FaBell,
    FaShare,
    FaPlus,
    FaTrash,
    FaPowerOff,
    FaMapMarkerAlt,
    FaCamera,
    FaTimes,
    FaCopy,
} from "react-icons/fa"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import DashboardLayout from "../../../components/main/DashBoardLayout"
import { CgWorkAlt } from "react-icons/cg"
import Deals from "../Deals"

type MenuItem = {
    key: string
    label: string
    icon: React.ReactElement
}

const menuItems: MenuItem[] = [
    { key: "profile", label: "Profile", icon: <FaUser /> },
    { key: "portfolio", label: "My Portfolio", icon: <FaFolderOpen /> },
    { key: "my work", label: "My Work", icon: <CgWorkAlt /> },
    { key: "social", label: "Social Networks", icon: <FaGlobe /> },
    { key: "specialties", label: "Specialties", icon: <FaPlus /> },
    { key: "shipping", label: "Shipping Address", icon: <FaMapMarkerAlt /> },
    { key: "settings", label: "Account Settings", icon: <FaCog /> },
    { key: "security", label: "Security & Privacy", icon: <FaShieldAlt /> },
    { key: "notifications", label: "Notifications", icon: <FaBell /> },
]

// Button component props
interface ButtonProps {
    children: ReactNode
    onClick?: () => void
    variant?: "primary" | "outline" | "danger" | "warning" | "ghost"
    size?: "small" | "medium" | "large"
    className?: string
}

// Custom Button Component
const Button = ({ children, onClick, variant = "primary", size = "medium", className = "" }: ButtonProps) => {
    const baseStyle = "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

    const variantStyles = {
        primary: "bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-500",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-violet-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    }

    const sizeStyles = {
        small: "px-2 py-1 text-sm",
        medium: "px-4 py-2",
        large: "px-6 py-3 text-lg",
    }

    return (
        <button onClick={onClick} className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
            {children}
        </button>
    )
}

// Input component props
interface InputProps {
    id?: string
    label?: string
    type?: string
    placeholder?: string
    value?: string
    defaultValue?: string
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    className?: string
}

// Custom Input Component
const Input = ({
    id,
    label,
    type = "text",
    placeholder = "",
    value,
    defaultValue,
    onChange,
    className = "",
}: InputProps) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${className}`}
            />
        </div>
    )
}

// Textarea component props
interface TextareaProps {
    id?: string
    label?: string
    placeholder?: string
    value?: string
    defaultValue?: string
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
    className?: string
}

// Custom Textarea Component
const Textarea = ({ id, label, placeholder = "", value, defaultValue, onChange, className = "" }: TextareaProps) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <textarea
                id={id}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 min-h-[100px] ${className}`}
            />
        </div>
    )
}

// Switch component props
interface SwitchProps {
    id: string
    checked: boolean
    onChange: () => void
    label?: string
}

// Custom Switch Component
const Switch = ({ id, checked, onChange, label }: SwitchProps) => {
    return (
        <div className="flex items-center">
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input type="checkbox" id={id} checked={checked} onChange={onChange} className="opacity-0 w-0 h-0 absolute" />
                <label
                    htmlFor={id}
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${checked ? "bg-violet-600" : "bg-gray-300"
                        }`}
                >
                    <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${checked ? "translate-x-4" : "translate-x-0"
                            }`}
                    />
                </label>
            </div>
            {label && (
                <label htmlFor={id} className="text-sm text-gray-700 cursor-pointer">
                    {label}
                </label>
            )}
        </div>
    )
}

// Badge component props
interface BadgeProps {
    children: ReactNode
    onRemove?: () => void
    className?: string
}

// Custom Badge Component
const Badge = ({ children, onRemove, className = "" }: BadgeProps) => {
    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-800 ${className}`}
        >
            {children}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="ml-1 text-violet-500 hover:text-violet-700 focus:outline-none"
                >
                    <FaTimes className="h-3 w-3" />
                </button>
            )}
        </span>
    )
}

// Modal component props
interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    footer?: ReactNode
}

// Custom Modal Component
const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" onClick={onClose}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{title}</h3>
                                {children}
                            </div>
                        </div>
                    </div>

                    {footer && <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">{footer}</div>}
                </div>
            </div>
        </div>
    )
}

// Portfolio item type
interface PortfolioItem {
    id: number
    name: string
    description: string
    url: string
}

export default function ProfileSettings() {
    const [activeTab, setActiveTab] = useState<string>("profile")
    const [profilePicture, setProfilePicture] = useState<string>("/placeholder.svg?height=150&width=150")
    const [shareUrl, setShareUrl] = useState<string>("")
    const [showShareDialog, setShowShareDialog] = useState<boolean>(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
    const [showDeactivateDialog, setShowDeactivateDialog] = useState<boolean>(false)
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
        { id: 1, name: "MindSpace", description: "Mental health journaling app", url: "https://mindspace-ai.vercel.app" },
        { id: 2, name: "TrendyMart", description: "Fashion ecommerce frontend", url: "https://trendymart-ui.vercel.app" },
        {
            id: 3,
            name: "PortfolioV2",
            description: "Animated personal portfolio",
            url: "https://neha-portfolio.vercel.app",
        },
    ])
    const [specialties, setSpecialties] = useState<string[]>(["UI/UX Design", "Frontend Development", "React"])
    const [newSpecialty, setNewSpecialty] = useState<string>("")

    // Switch states
    const [videoContent, setVideoContent] = useState<boolean>(true)
    const [photoContent, setPhotoContent] = useState<boolean>(true)
    const [writtenContent, setWrittenContent] = useState<boolean>(true)
    const [audioContent, setAudioContent] = useState<boolean>(false)
    const [sponsoredPosts, setSponsoredPosts] = useState<boolean>(true)
    const [affiliateMarketing, setAffiliateMarketing] = useState<boolean>(true)
    const [barterCollabs, setBarterCollabs] = useState<boolean>(true)
    const [longTermPartnerships, setLongTermPartnerships] = useState<boolean>(false)
    const [addressVisible, setAddressVisible] = useState<boolean>(false)
    const [emailAlerts, setEmailAlerts] = useState<boolean>(true)
    const [inAppAlerts, setInAppAlerts] = useState<boolean>(true)
    const [pushNotifications, setPushNotifications] = useState<boolean>(false)
    const [collabNotifications, setCollabNotifications] = useState<boolean>(true)
    const [marketingNotifications, setMarketingNotifications] = useState<boolean>(false)
    const [profileVisibility, setProfileVisibility] = useState<boolean>(true)
    const [dataCollection, setDataCollection] = useState<boolean>(true)
    const [thirdPartySharing, setThirdPartySharing] = useState<boolean>(false)

    const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result
                if (typeof result === "string") {
                    setProfilePicture(result)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const generateShareUrl = () => {
        // In a real app, this would generate a unique URL
        const uniqueId = Math.random().toString(36).substring(2, 10)
        setShareUrl(`https://yourplatform.com/creator/neha_j/${uniqueId}`)
        setShowShareDialog(true)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl)
        toast.success("URL copied to clipboard!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        })
    }

    const addPortfolioItem = () => {
        setPortfolioItems([
            ...portfolioItems,
            {
                id: portfolioItems.length + 1,
                name: "New Project",
                description: "Project description",
                url: "https://example.com",
            },
        ])
    }

    const removePortfolioItem = (id: number) => {
        setPortfolioItems(portfolioItems.filter((item) => item.id !== id))
    }

    const addSpecialty = () => {
        if (newSpecialty.trim() !== "") {
            setSpecialties([...specialties, newSpecialty])
            setNewSpecialty("")
        }
    }

    const removeSpecialty = (specialty: string) => {
        setSpecialties(specialties.filter((item) => item !== specialty))
    }

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-violet-200">
                                    <img
                                        src={profilePicture || "/placeholder.svg"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <label
                                    htmlFor="profile-upload"
                                    className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full cursor-pointer hover:bg-violet-700 transition"
                                >
                                    <FaCamera />
                                    <input
                                        id="profile-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                    />
                                </label>
                            </div>

                            <div className="flex-1 space-y-4">
                                <h2 className="text-2xl font-semibold border-b pb-2 border-violet-200">Basic Info</h2>

                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-medium">Neha Jakhar</p>
                                    <Button variant="outline" size="small" onClick={generateShareUrl} className="flex items-center gap-2">
                                        <FaShare className="text-violet-600" />
                                        Share Profile
                                    </Button>
                                </div>

                                <div className="grid gap-4">
                                    <Textarea
                                        id="bio"
                                        label="Bio"
                                        defaultValue="UI/UX enthusiast & frontend wizard crafting magical web experiences."
                                    />

                                    <Input id="location" label="Location" defaultValue="Bengaluru, India" />

                                    <Input
                                        id="skills"
                                        label="Skills"
                                        defaultValue="React, Next.js, Tailwind CSS, TypeScript, Figma, Framer Motion"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <h3 className="text-xl font-semibold border-b pb-2 border-violet-200">Profile Questions</h3>

                            <Input
                                id="question1"
                                label="What type of content do you create?"
                                defaultValue="Tech tutorials, UI/UX design content, and coding tips"
                            />

                            <Input
                                id="question2"
                                label="What platforms do you primarily use?"
                                defaultValue="YouTube, Instagram, Twitter"
                            />

                            <Input
                                id="question3"
                                label="What is your target audience?"
                                defaultValue="Tech enthusiasts, developers, and design students"
                            />

                            <Input id="question4" label="How often do you post content?" defaultValue="2-3 times per week" />
                        </div>
                    </div>
                )

            case "portfolio":
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold border-b pb-2 border-violet-200">Projects</h2>
                            <Button variant="outline" size="small" onClick={addPortfolioItem} className="flex items-center gap-2">
                                <FaPlus className="text-violet-600" />
                                Add Project
                            </Button>
                        </div>

                        <ul className="space-y-4">
                            {portfolioItems.map((item) => (
                                <li
                                    key={item.id}
                                    className="p-4 border border-violet-200 rounded-md bg-violet-50 hover:shadow-md transition"
                                >
                                    <div className="flex justify-between">
                                        <div>
                                            🧠 <strong>{item.name}:</strong> {item.description} —
                                            <a
                                                href={item.url}
                                                className="text-violet-600 hover:underline ml-1"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Visit
                                            </a>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="small"
                                            onClick={() => removePortfolioItem(item.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )

            case "social":
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Social Links</h2>
                        <div className="space-y-4">
                            <Input id="twitter" label="Twitter" placeholder="https://twitter.com/neha_jakhar" />
                            <Input id="linkedin" label="LinkedIn" placeholder="https://linkedin.com/in/nehajakhar" />
                            <Input id="github" label="GitHub" placeholder="https://github.com/nehajakhar" />
                            <Input id="instagram" label="Instagram" placeholder="https://instagram.com/neha_jakhar" />
                            <Input id="youtube" label="YouTube" placeholder="https://youtube.com/@nehajakhar" />
                        </div>
                    </div>
                )

            case "specialties":
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Specialties & Capabilities</h2>

                        <div>
                            <h3 className="text-lg font-medium mb-2">Your Specialties</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {specialties.map((specialty, index) => (
                                    <Badge key={index} onRemove={() => removeSpecialty(specialty)}>
                                        {specialty}
                                    </Badge>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a new specialty"
                                    value={newSpecialty}
                                    onChange={(e) => setNewSpecialty(e.target.value)}
                                    className="flex-1"
                                />
                                <Button onClick={addSpecialty}>Add</Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-2">Content Types</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Switch
                                    id="video"
                                    checked={videoContent}
                                    onChange={() => setVideoContent(!videoContent)}
                                    label="Video Content"
                                />
                                <Switch
                                    id="photo"
                                    checked={photoContent}
                                    onChange={() => setPhotoContent(!photoContent)}
                                    label="Photo Content"
                                />
                                <Switch
                                    id="written"
                                    checked={writtenContent}
                                    onChange={() => setWrittenContent(!writtenContent)}
                                    label="Written Content"
                                />
                                <Switch
                                    id="audio"
                                    checked={audioContent}
                                    onChange={() => setAudioContent(!audioContent)}
                                    label="Audio Content"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-2">Collaboration Preferences</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Switch
                                    id="sponsored"
                                    checked={sponsoredPosts}
                                    onChange={() => setSponsoredPosts(!sponsoredPosts)}
                                    label="Sponsored Posts"
                                />
                                <Switch
                                    id="affiliate"
                                    checked={affiliateMarketing}
                                    onChange={() => setAffiliateMarketing(!affiliateMarketing)}
                                    label="Affiliate Marketing"
                                />
                                <Switch
                                    id="barter"
                                    checked={barterCollabs}
                                    onChange={() => setBarterCollabs(!barterCollabs)}
                                    label="Barter Collaborations"
                                />
                                <Switch
                                    id="longterm"
                                    checked={longTermPartnerships}
                                    onChange={() => setLongTermPartnerships(!longTermPartnerships)}
                                    label="Long-term Partnerships"
                                />
                            </div>
                        </div>
                    </div>
                )

            case "shipping":
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Shipping Address</h2>
                            <Switch
                                id="address-visible"
                                checked={addressVisible}
                                onChange={() => setAddressVisible(!addressVisible)}
                                label="Visible to approved brands only"
                            />
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                            This address will only be shared with brands for barter collaborations after your approval.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input id="full-name" label="Full Name" placeholder="Neha Jakhar" />
                            <Input id="phone" label="Phone Number" placeholder="+91 9876543210" />
                        </div>

                        <Input id="address-line1" label="Address Line 1" placeholder="123 Creator Street" />

                        <Input id="address-line2" label="Address Line 2 (Optional)" placeholder="Apartment 4B" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input id="city" label="City" placeholder="Bengaluru" />
                            <Input id="state" label="State" placeholder="Karnataka" />
                            <Input id="zip" label="Postal Code" placeholder="560001" />
                        </div>

                        <Input id="country" label="Country" placeholder="India" />

                        <Textarea
                            id="delivery-notes"
                            label="Delivery Notes (Optional)"
                            placeholder="Any special instructions for delivery"
                        />

                        <Button onClick={() => toast.success("Address saved!")}>Save Address</Button>
                    </div>
                )

            case "settings":
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Account Settings</h2>

                        <div className="space-y-4">
                            <Input id="email" label="Email Address" defaultValue="neha.jakhar@example.com" />

                            <Input id="username" label="Username" defaultValue="neha_j" />

                            <Input id="language" label="Language" defaultValue="English (UK)" />

                            <Input id="timezone" label="Timezone" defaultValue="IST (GMT+5:30)" />
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-red-600 mb-4">Account Management</h3>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="outline"
                                    className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 flex items-center justify-center gap-2"
                                    onClick={() => setShowDeactivateDialog(true)}
                                >
                                    <FaPowerOff /> Deactivate Account
                                </Button>

                                <Button
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                                    onClick={() => setShowDeleteDialog(true)}
                                >
                                    <FaTrash /> Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>
                )

            case "security":
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Security</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <p>
                                    🔐 <strong>Password:</strong> ********
                                </p>
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() => toast.info("Change password feature coming soon")}
                                >
                                    Change
                                </Button>
                            </div>

                            <div className="flex justify-between items-center">
                                <p>
                                    🔒 <strong>Two-Factor Authentication:</strong> <span className="text-green-600">Enabled</span>
                                </p>
                                <Button variant="outline" size="small" onClick={() => toast.info("2FA settings coming soon")}>
                                    Configure
                                </Button>
                            </div>

                            <div className="flex justify-between items-center">
                                <p>
                                    🧠 <strong>Login Alerts:</strong> Active
                                </p>
                                <Button variant="outline" size="small" onClick={() => toast.info("Alert settings coming soon")}>
                                    Manage
                                </Button>
                            </div>

                            <div className="flex justify-between items-center">
                                <p>
                                    🔍 <strong>Recent Logins:</strong>
                                </p>
                                <Button variant="outline" size="small" onClick={() => toast.info("Login history coming soon")}>
                                    View All
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="profile-visibility" className="text-sm font-medium text-gray-700">
                                        Profile Visibility
                                    </label>
                                    <Switch
                                        id="profile-visibility"
                                        checked={profileVisibility}
                                        onChange={() => setProfileVisibility(!profileVisibility)}
                                        label=""
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label htmlFor="data-collection" className="text-sm font-medium text-gray-700">
                                        Data Collection
                                    </label>
                                    <Switch
                                        id="data-collection"
                                        checked={dataCollection}
                                        onChange={() => setDataCollection(!dataCollection)}
                                        label=""
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label htmlFor="third-party" className="text-sm font-medium text-gray-700">
                                        Third-Party Sharing
                                    </label>
                                    <Switch
                                        id="third-party"
                                        checked={thirdPartySharing}
                                        onChange={() => setThirdPartySharing(!thirdPartySharing)}
                                        label=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case "notifications":
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-violet-200">Notifications</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Email Alerts</p>
                                    <p className="text-sm text-gray-500">Receive daily digest of activities</p>
                                </div>
                                <Switch
                                    id="email-alerts"
                                    checked={emailAlerts}
                                    onChange={() => setEmailAlerts(!emailAlerts)}
                                    label=""
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">In-App Alerts</p>
                                    <p className="text-sm text-gray-500">Real-time notifications in the app</p>
                                </div>
                                <Switch
                                    id="in-app-alerts"
                                    checked={inAppAlerts}
                                    onChange={() => setInAppAlerts(!inAppAlerts)}
                                    label=""
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Push Notifications</p>
                                    <p className="text-sm text-gray-500">Notifications on your device</p>
                                </div>
                                <Switch
                                    id="push-notifications"
                                    checked={pushNotifications}
                                    onChange={() => setPushNotifications(!pushNotifications)}
                                    label=""
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Collaboration Requests</p>
                                    <p className="text-sm text-gray-500">Get notified about new collaboration opportunities</p>
                                </div>
                                <Switch
                                    id="collab-notifications"
                                    checked={collabNotifications}
                                    onChange={() => setCollabNotifications(!collabNotifications)}
                                    label=""
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Marketing Communications</p>
                                    <p className="text-sm text-gray-500">Updates about new features and promotions</p>
                                </div>
                                <Switch
                                    id="marketing-notifications"
                                    checked={marketingNotifications}
                                    onChange={() => setMarketingNotifications(!marketingNotifications)}
                                    label=""
                                />
                            </div>
                        </div>
                    </div>
                )

            case "my work":
                return <Deals />

            default:
                return null
        }
    }

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
                                        ? "bg-violet-100 text-violet-700 font-semibold"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white p-6 rounded-xl shadow">{renderContent()}</div>
            </div>

            {/* Share Profile Modal */}
            <Modal
                isOpen={showShareDialog}
                onClose={() => setShowShareDialog(false)}
                title="Share Your Creator Profile"
                footer={
                    <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                        Close
                    </Button>
                }
            >
                <p className="mb-4">Copy this unique URL to share your creator profile with brands and followers.</p>
                <div className="flex items-center gap-2">
                    <Input value={shareUrl} className="flex-1" />
                    <Button onClick={copyToClipboard} className="flex items-center gap-2">
                        <FaCopy /> Copy
                    </Button>
                </div>
            </Modal>

            {/* Delete Account Modal */}
            <Modal
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                title="Delete Your Account"
                footer={
                    <div className="flex flex-col sm:flex-row gap-2 sm:justify-between w-full">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => toast.error("Account deletion is disabled in demo mode")}>
                            Permanently Delete Account
                        </Button>
                    </div>
                }
            >
                <p className="mb-4 text-red-600 font-medium">
                    This action cannot be undone. All your data will be permanently removed.
                </p>
                <p className="font-medium mb-2">Please type "DELETE" to confirm:</p>
                <Input placeholder="Type DELETE here" />
            </Modal>

            {/* Deactivate Account Modal */}
            <Modal
                isOpen={showDeactivateDialog}
                onClose={() => setShowDeactivateDialog(false)}
                title="Deactivate Your Account"
                footer={
                    <div className="flex flex-col sm:flex-row gap-2 sm:justify-between w-full">
                        <Button variant="outline" onClick={() => setShowDeactivateDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="warning" onClick={() => toast.warning("Account deactivation is disabled in demo mode")}>
                            Deactivate Account
                        </Button>
                    </div>
                }
            >
                <p className="mb-4">Your account will be temporarily deactivated. You can reactivate it by logging in again.</p>
                <p className="font-medium mb-2">During deactivation:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Your profile won't be visible to others</li>
                    <li>You won't receive notifications or messages</li>
                    <li>Your content will be temporarily hidden</li>
                </ul>
            </Modal>

            {/* Toast Container */}
            <ToastContainer />
        </DashboardLayout>
    )
}
