import { motion } from 'framer-motion';

export default function CustomAdsBar({
    videoOneSrc = "/ad1.mp4",
    textOne = "Jyo Culture - Marketing Campaign with Neeta",
    videoTwoSrc = "/ad2.mp4",
    textTwo = "Roriko x Ta’seer - Barter collaboration with Sanskriti Chauhan",
    textStyles = "bg-white text-black shadow-md border border-gray-300",
}) {
    const boxVariants = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        hover: { scale: 1.03, transition: { duration: 0.2 } },
    };

    return (
        <div className="h-screen w-[300px] overflow-y-auto flex flex-col items-center gap-6 p-4 bg-[#f8f8f8]">
            {/* Video 1 */}
            <motion.div
                className="w-full overflow-hidden rounded-xl shadow-lg h-[300px]"
                initial="initial"
                animate="animate"
                whileHover="hover"
                variants={boxVariants}
            >
                <video
                    src={videoOneSrc}
                    muted
                    playsInline
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                />
            </motion.div>

            {/* Text 1 */}
            <div className={`p-4 text-sm text-center -mt-5 font-medium rounded-xl ${textStyles}`}>
                {textOne}
            </div>

            {/* Video 2 */}
            <motion.div
                className="w-full overflow-hidden rounded-xl shadow-lg h-[300px]"
                initial="initial"
                animate="animate"
                whileHover="hover"
                variants={boxVariants}
            >
                <video
                    src={videoTwoSrc}
                    muted
                    playsInline
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                />
            </motion.div>

            {/* Text 2 */}
            <div className={`p-4 text-sm text-center  -mt-5 font-medium rounded-xl ${textStyles}`}>
                {textTwo}
            </div>
        </div>
    );
}
