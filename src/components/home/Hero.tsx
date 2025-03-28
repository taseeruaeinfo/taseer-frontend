import Button from "../ui/Button";

export default function Hero() {
    return (
        <section className="relative w-full h-screen flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/image.jpg" // Ensure this image is in your public folder
                    alt="Hero Background"
                    loading="lazy"
                    className="w-full h-full object-cover"
                />
                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 text-center text-white px-6">
                <h1 className="text-4xl md:text-6xl font-bold">
                    Find the <span className="text-[#AEA5FF]">Right </span>Influencer <br />
                    for the <span className="text-pink">Right</span> brand
                </h1>

                <p className="mt-4 text-lg">Which one are you?</p>

                {/* Buttons */}
                <div className="mt-6 flex gap-4 justify-center">
                    <Button variant="primary">I'm a Brand</Button>
                    <Button variant="white">I'm a Creator</Button>
                </div>
            </div>
        </section>
    );
}
