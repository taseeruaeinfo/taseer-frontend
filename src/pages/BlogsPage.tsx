import React from "react";
import BlogCard from "../components/ui/BlogCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Fotter";

interface Blog {
    image: string;
    category: string;
    title: string;
    description: string;
    author: string;
    date: string;
}

const blogs: Blog[] = [
    {
        image: "/blog.webp",
        category: "Influencer Marketing",
        title:
            "Cyber Monday Marketing Strategy: Unleashing the Power of Influencer Collaborations",
        description:
            "Unlock Cyber Monday success with influencer marketing. Discover strategies, tips, and timelines to boost sales and stand out from the competition.",
        author: "Tally Moran",
        date: "October 1, 2024",
    },
    {
        image: "/blog.webp",
        category: "Social Media Growth",
        title: "How to Scale Your Brand with Micro-Influencers",
        description:
            "Micro-influencers can drive engagement and conversions. Learn how to leverage them for your brand's growth.",
        author: "John Doe",
        date: "September 15, 2024",
    },
    {
        image: "/blog.webp",
        category: "Influencer Marketing",
        title:
            "Cyber Monday Marketing Strategy: Unleashing the Power of Influencer Collaborations",
        description:
            "Unlock Cyber Monday success with influencer marketing. Discover strategies, tips, and timelines to boost sales and stand out from the competition.",
        author: "Tally Moran",
        date: "October 1, 2024",
    },
    {
        image: "/blog.webp",
        category: "Social Media Growth",
        title: "How to Scale Your Brand with Micro-Influencers",
        description:
            "Micro-influencers can drive engagement and conversions. Learn how to leverage them for your brand's growth.",
        author: "John Doe",
        date: "September 15, 2024",
    },
    {
        image: "/blog.webp",
        category: "Influencer Marketing",
        title:
            "Cyber Monday Marketing Strategy: Unleashing the Power of Influencer Collaborations",
        description:
            "Unlock Cyber Monday success with influencer marketing. Discover strategies, tips, and timelines to boost sales and stand out from the competition.",
        author: "Tally Moran",
        date: "October 1, 2024",
    },
    {
        image: "/blog.webp",
        category: "Social Media Growth",
        title: "How to Scale Your Brand with Micro-Influencers",
        description:
            "Micro-influencers can drive engagement and conversions. Learn how to leverage them for your brand's growth.",
        author: "John Doe",
        date: "September 15, 2024",
    },
    {
        image: "/blog.webp",
        category: "Influencer Marketing",
        title:
            "Cyber Monday Marketing Strategy: Unleashing the Power of Influencer Collaborations",
        description:
            "Unlock Cyber Monday success with influencer marketing. Discover strategies, tips, and timelines to boost sales and stand out from the competition.",
        author: "Tally Moran",
        date: "October 1, 2024",
    },
    {
        image: "/blog.webp",
        category: "Social Media Growth",
        title: "How to Scale Your Brand with Micro-Influencers",
        description:
            "Micro-influencers can drive engagement and conversions. Learn how to leverage them for your brand's growth.",
        author: "John Doe",
        date: "September 15, 2024",
    },
];

const Blogs: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className='pt-[100px]'></div>

            <div className="p-6 max-w-6xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-center text-color mb-6">
                    Latest Blogs
                </h1>
                <div className="grid gap-6">
                    {blogs.map((blog, index) => (
                        <BlogCard key={index} index={index} {...blog} />
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Blogs;
