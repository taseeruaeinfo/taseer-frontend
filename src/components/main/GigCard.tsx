"use client"
import { motion } from "framer-motion"

interface GigCardProps {
    title: string
    description: string
    image: string
    stats?: {
        label: string
        value: string
    }[]
    hasButton?: boolean
}

export default function GigCard({ title, description, image, stats, hasButton = false }: GigCardProps) {
    return (
        <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div className="relative h-40 overflow-hidden">
                <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-gray-600 mt-1">{description}</p>

                {stats && stats.length > 0 && (
                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-xs text-gray-500">{stat.label}</p>
                                <p className="font-medium text-sm">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {hasButton && (
                    <div className="mt-auto">
                        <button className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md transition-colors">
                            Apply Now
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
