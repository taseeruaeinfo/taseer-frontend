import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"

interface Stat { label: string, value: string }
interface GigCardProps {
    gig: {
        title: string
        description: string
        image: string
        stats?: Stat[]
        hasButton?: boolean
    }
    type: "recommended" | "saved" | "applied" | "in progress" | "canceled"
    id: number
}

export default function GigCard({ gig, type, id }: GigCardProps) {
    const router = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleApply = () => router(`/gig/${id}`)

    const buttonConfig = {
        applied: <button disabled className="w-full mt-4 bg-gray-300 text-white py-2 rounded-md">Applied</button>,
        "in progress": <button disabled className="w-full mt-4 bg-green-500 text-white py-2 rounded-md">In Progress</button>,
        canceled: <p className="w-full mt-4 text-red-500 text-center">Canceled</p>,
        saved: <button className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md">Apply Now</button>,
        recommended: (
            <>
                <button onClick={handleApply} className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md">Apply Now</button>
                <div className="relative mt-2">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="absolute right-0 text-gray-600">
                        &#x22EE;
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-6 w-32 bg-white border shadow-md rounded-md z-10 text-sm">
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Save</button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Not Interested</button>
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
                <img src={gig.image || "/placeholder.svg"} alt={gig.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-semibold text-lg">{gig.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{gig.description}</p>

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
