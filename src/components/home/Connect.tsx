import { motion } from "framer-motion";
import Button from "../ui/Button";

export default function Connect() {
    return (
        <section className="relative w-full  flex flex-col-reverse md:flex-row items-center justify-between  px-6 md:px-10 py-12">
            {/* Left Content */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center md:text-left max-w-2xl"
            >
                <p className="text-color font-semibold tracking-widest uppercase">
                    Create. Connect. Influence
                    <div className="border-b my-5 border-gray-400 w-[300px]"></div>
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">
                    Platform that  <br /> <span className="text-color">Connects Brands</span> <br />
                    with  <span className="text-[#FFA5CC]">Influencers</span> and <br />
                    <span className="text-color">Content Creators</span>
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-4">
                    We are a Dubai-based startup dedicated to connecting talented content creators
                    and leading brands worldwide.
                </p>
                <Button
                    variant="primary"
                    className="mt-6 px-6 py-3  text-white font-semibold rounded-full shadow-md  transition"
                >
                    Contact Us
                </Button>
            </motion.div>

            {/* Right Side Image */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="flex justify-center md:justify-end"
            >
                <img
                    src="/connect.png"  // Replace with your actual image path
                    alt="VR Influencer"
                    className="w-full max-w-lg md:max-w-xl"
                />
            </motion.div>
        </section>
    );
}
