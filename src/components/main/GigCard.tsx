import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import { Gig, GigType } from "../../pages/main/Dashboard"

interface GigCardProps {
    gig: Gig
    type: GigType
    onSave?: () => void
    onNotInterested?: () => void
}

export default function GigCard({ gig, type, onSave, onNotInterested }: GigCardProps) {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    // Handle applying to a gig
    const handleApply = async () => {
        if (type === "recommended" || type === "saved") {
            try {


                navigate(`/gig/${gig.id}`)
            } catch (err) {
                console.error("Error applying to campaign:", err)
                setError("Failed to apply. Please try again.")
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    // Handle saving a gig
    const handleSave = async () => {
        try {
            await axios.post(`/campaigns/${gig.id}/save`)
            setMenuOpen(false)
            if (onSave) onSave()
        } catch (err) {
            console.error("Error saving campaign:", err)
        }
    }

    // Handle marking a gig as not interested
    const handleNotInterested = async () => {
        try {
            await axios.post(`/campaigns/${gig.id}/not-interested`)
            setMenuOpen(false)
            if (onNotInterested) onNotInterested()
        } catch (err) {
            console.error("Error marking campaign as not interested:", err)
        }
    }

    // Config for button display based on gig type
    const buttonConfig = {
        "applied": (
            <button disabled className="w-full mt-4 bg-gray-300 text-white py-2 rounded-md font-medium">
                Applied
            </button>
        ),
        "in-progress": (
            <button disabled className="w-full mt-4 bg-green-500 text-white py-2 rounded-md font-medium">
                In Progress
            </button>
        ),
        "canceled": (
            <p className="w-full mt-4 text-red-500 text-center font-medium">
                Canceled
            </p>
        ),
        "saved": (
            <button
                onClick={handleApply}
                disabled={isSubmitting}
                className={`w-full mt-4 ${isSubmitting ? 'bg-purple-400' : 'bg-purple-500 hover:bg-purple-600'} text-white py-2 rounded-md font-medium`}
            >
                {isSubmitting ? "Applying..." : "Apply Now"}
            </button>
        ),
        "recommended": (
            <>
                <button
                    onClick={handleApply}
                    disabled={isSubmitting}
                    className={`w-full mt-4 ${isSubmitting ? 'bg-purple-400' : 'bg-purple-500 hover:bg-purple-600'} text-white py-2 rounded-md font-medium`}
                >
                    {isSubmitting ? "Applying..." : "Apply Now"}
                </button>
                <div className="relative mt-2">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="absolute right-0 text-gray-600 p-1 hover:bg-gray-100 rounded-full"
                    >
                        <span className="text-xl">⋮</span>
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-36 bg-white border shadow-md rounded-md z-10 text-sm">
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                                onClick={handleNotInterested}
                            >
                                Not Interested
                            </button>
                        </div>
                    )}
                </div>
            </>
        )
    }

    return (
        <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col relative"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div className="relative h-40 overflow-hidden">
                <img
                    src={gig.image || gig.user.profilePic}
                    alt={gig.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                    }}
                />
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-semibold text-lg">{gig.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{gig.description}</p>

                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                {gig.stats && (
                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                        {gig.stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-xs text-gray-500">{stat.label}</p>
                                <p className="font-medium text-sm">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-auto">
                    {buttonConfig[type]}
                </div>
            </div>
        </motion.div>
    )
}