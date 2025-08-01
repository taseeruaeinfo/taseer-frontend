import { motion } from "framer-motion";

export default function CustomAdsBar({
  videoOneSrc = "/ad1.mp4",
  textOne = "Follow Us on Instagram",
  // videoTwoSrc = "/ad2.mp4",
  // textTwo = "Roriko x Ta’seer - Barter collaboration with Sanskriti Chauhan",
  textStyles = " text-black shadow-md",
}) {
  const boxVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
  };

  return (
    <div className=" w-[25vw] mr-3   overflow-y-hidden flex flex-col items-center gap-6 p-4">
      {/* Video 1 */}
      <motion.div
        className="w-full h-full overflow-hidden mt-10   border rounded-xl shadow-g "
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
          className="w-full  h-[90%] object-cover"
        />
        {/* Text 1 */}
        <div className={`p-4  h-full text-center  text-[1.5vh] ${textStyles}`}>
          {textOne}
          <div>
            <a
              href={
                "https://www.instagram.com/reel/DDhrfd6Tpqw/?igsh=MTQ0djd3ZDlzNnQ5eQ=="
              }
              className=" cursor-pointer text-purple-600"
            >
              Check out once {"-->"}{" "}
            </a>
          </div>
        </div>
      </motion.div>

      {/* Text 2 */}
    </div>
  );
}
