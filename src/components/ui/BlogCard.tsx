import React from "react";

interface BlogCardProps {
    image: string;
    title: string;
    description: string;
    author: string;
    date: string;
    index: number
    link: string
}

const BlogCard: React.FC<BlogCardProps> = ({
    image,
    title,
    description,
    link,
    author,
    date,
    index
}) => {
    console.log(author, date)
    return (
        <a href={link}>

            <div className={`bg-white shadow-xl rounded-lg overflow-hidden border-2 border-purple-500 shadow-purple-500 flex flex-col ${index % 2 == 0 ? "md:flex-row" : "md:flex-row-reverse"} max-w-4xl mx-auto transition-transform transform hover:scale-105 duration-300`}>
                {/* Image Section */}
                <div className="relative w-full md:w-1/3">
                    <img src={image} alt={title} className="w-full h-[200px] object-cover" />

                    <div className="absolute top-3 right-3">
                        <img
                            src="/tiktok-icon.png"
                            alt="Platform"
                            className="w-6 h-6 opacity-90"
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        <p className="text-gray-600 mt-2 text-sm">{description}</p>
                    </div>

                    {/* Author Section */}
                    {/* <div className="flex items-center mt-4 text-gray-500 text-sm">
                    <img
                    src="/influncer.jpeg"
                    alt={author}
                    className="w-8 h-8 rounded-full mr-2"
                    />
                    <p>
                    {author} <span className="mx-2">/</span> {date}
                    </p>
                    </div> */}
                </div>
            </div>
        </a>
    );
};

export default BlogCard;
