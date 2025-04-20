import React from "react";
import BlogCard from "../components/ui/BlogCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Fotter";

interface Blog {
    image: string;
    link: string;
    title: string;
    description: string;
    author: string;
    date: string;
}

const blogs: Blog[] = [
    {
        image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*GWwnu7tGV6wl-eYTb0qmYQ.png",
        link: "https://medium.com/@taseeruae/gymsharks-66-day-challenge-a-case-study-9fe74708b2cb",
        title: "Gymshark’s 66 Day Challenge: A Case Study",
        description: "A deep dive into how Gymshark’s 66 Day Challenge fostered community engagement and drove massive brand loyalty.",
        author: "Tally Moran",
        date: "October 1, 2024",
    },
    {
        image: "https://images.pexels.com/photos/5716032/pexels-photo-5716032.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        link: "https://medium.com/@taseeruae/unpacking-2024s-biggest-influencer-marketing-trends-how-brands-are-winning-big-7d50010ef7ce",
        title: "Unpacking 2024’s Biggest Influencer Marketing Trends: How Brands Are Winning Big!",
        description: "Explore the latest influencer marketing shifts in 2024 and how brands are leveraging them to win big in the digital space.",
        author: "John Doe",
        date: "September 15, 2024",
    },
    {
        image: "https://images.pexels.com/photos/8117815/pexels-photo-8117815.jpeg?auto=compress&cs=tinysrgb&w=600",
        link: "https://medium.com/@taseeruae/the-future-of-influencer-marketing-5-trends-that-will-explode-in-2024-6e4eef57bf67",
        title: "The Future of Influencer Marketing: 5 Trends That Will Explode in 2024!",
        description: "Get ahead of the curve with five emerging trends that are set to redefine influencer marketing in 2024 and beyond.",
        author: "Tally Moran",
        date: "October 1, 2024",
    },
    {
        image: "https://media.istockphoto.com/id/1149096534/photo/healthy-eating.jpg?b=1&s=612x612&w=0&k=20&c=JVzitM-H-CYxsQ-u4dvxz5ikAYfBpeo8fTvaAqHRiQo=",
        link: "https://medium.com/@taseeruae/how-hellofresh-turned-meal-kits-into-a-trend-76015ddab60a",
        title: "Here’s how GoPro used User-Generated content for Marketing",
        description: "Discover how GoPro turned everyday users into powerful brand ambassadors through creative UGC campaigns.",
        author: "Tally Moran",
        date: "October 1, 2024",
    },
    {
        image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*jFUR9LDRdgAhbWwp_dJJRQ.png",
        link: "https://medium.com/@taseeruae/heres-how-gopro-used-user-generated-content-for-marketing-95f017fc53d0",
        title: "How to Scale Your Brand with Micro-Influencers",
        description: "Learn the step-by-step approach to harnessing micro-influencers and scaling your brand efficiently and authentically.",
        author: "John Doe",
        date: "September 15, 2024",
    },
    {
        image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*LoPpRkZvBTo-_7khc8Jn_g.png",
        link: "https://medium.com/@taseeruae/micro-influencers-vs-nano-influencers-whats-the-difference-a482265528ae",
        title: "Micro-Influencers vs. Nano-Influencers: What’s the Difference? 🧩",
        description: "Not all influencers are the same. Explore the key differences between micro and nano-influencers to choose the right fit for your brand.",
        author: "Tally Moran",
        date: "October 1, 2024",
    },
];

const Blogs: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className='pt-[100px]'></div>

            {/* Hero Content */}
            <div className="px-6 max-w-5xl mx-auto text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-4">
                    Welcome to Knowledge Hub
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    Your go-to place for the latest in influencer marketing, branding strategies, and content trends.
                </p>

            </div>

            {/* Blog List */}
            <div className="p-6 max-w-6xl mx-auto">

                <div className="grid  gap-6">
                    {blogs.map((blog, index) => (
                        <BlogCard key={index} index={index} {...blog} />
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-5xl text-center p-6 py-20 bg-white shadow-lg rounded-lg mt-10">
                <p className="text-gray-600 mb-2 italic">Links for articles…</p>
                <p className="text-lg font-medium text-purple-700 mb-4">
                    Stay curious. Stay informed. Stay inspired.
                </p>
                <div className="flex justify-center">
                    <input type="text" className="border rounded-md border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter your email" />
                    <button className="bg-purple-600 w-fit rounded-md hover:bg-purple-700 text-white py-2 px-2 transition">
                        Subscribe
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Blogs;
