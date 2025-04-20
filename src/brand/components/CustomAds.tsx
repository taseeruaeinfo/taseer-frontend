import { motion } from 'framer-motion';

export default function CusotmAdsBar({
    longBoxContent = "Long Box Content",
    smallBoxContent = "Small Box Content",
    longBoxStyles = "bg-white border-2 border-black",
    smallBoxStyles = "bg-white border-2 border-dashed border-black",
}) {

    // Animation variants for the boxes
    const boxVariants = {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
        hover: { scale: 1.02, transition: { duration: 0.2 } }
    };

    return (
        <div className="fixed top-0 right-0 h-full flex flex-col items-end justify-between p-4 z-50">
            {/* Long box at the right - wider now */}
            <motion.div
                className={`w-40 h-96 ${longBoxStyles} flex items-center justify-center`}

                whileHover="hover"
                variants={boxVariants}
            >
                <div className="text-center p-2">
                    {longBoxContent}
                </div>
            </motion.div>

            {/* Small box at the bottom right - wider now */}
            <motion.div
                className={`w-40 h-24 mt-4 ${smallBoxStyles} flex items-center justify-center`}
                whileHover="hover"
                variants={boxVariants}
            >
                <div className="text-center p-2">
                    {smallBoxContent}
                </div>
            </motion.div>
        </div>
    );
}