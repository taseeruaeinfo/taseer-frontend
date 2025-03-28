import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/Accordition";

const Faq = () => {
    return (
        <div className="p-8 rounded-lg max-w-[1440px] mx-auto">
            {/* Header Section */}
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-gray-600 text-center mb-8">
                Find answers to common questions about Taseer and how it helps
                brands and influencers collaborate effortlessly.
            </p>
            <section className="px-5">

                {/* Accordion Section */}
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is Taseer?</AccordionTrigger>
                        <AccordionContent>
                            Taseer is a platform that connects brands with influencers to
                            collaborate on marketing campaigns. Brands can launch campaigns,
                            and influencers can apply to participate.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>How does Taseer work for brands?</AccordionTrigger>
                        <AccordionContent>
                            Brands create campaigns, set budgets, and select influencers to
                            promote their products. Once content is approved, influencers
                            share it on social media, and brands track performance in real-time.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>How can influencers join Taseer?</AccordionTrigger>
                        <AccordionContent>
                            Influencers can sign up, link their social media accounts, and
                            browse brand campaigns. They can apply to campaigns, create content,
                            and get paid for collaborations.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>Which social media platforms are supported?</AccordionTrigger>
                        <AccordionContent>
                            Taseer supports collaborations on Instagram, TikTok, YouTube,
                            Twitter, and Facebook, allowing brands to engage with audiences
                            across multiple channels.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger>How do payments work?</AccordionTrigger>
                        <AccordionContent>
                            Payments are securely processed through Taseer. Influencers
                            receive their earnings once they complete a campaign and their
                            content is approved by the brand.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                        <AccordionTrigger>Is there a fee to use Taseer?</AccordionTrigger>
                        <AccordionContent>
                            Taseer is free for influencers. Brands can choose from different
                            pricing plans based on their campaign needs.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                        <AccordionTrigger>Can small businesses use Taseer?</AccordionTrigger>
                        <AccordionContent>
                            Yes! Taseer is designed for businesses of all sizes, from startups
                            to global brands, making influencer marketing accessible to everyone.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-8">
                        <AccordionTrigger>How do I track campaign performance?</AccordionTrigger>
                        <AccordionContent>
                            Taseer provides real-time analytics, including engagement rates,
                            impressions, and conversions, helping brands measure campaign
                            success effectively.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-9">
                        <AccordionTrigger>How do brands find the right influencers?</AccordionTrigger>
                        <AccordionContent>
                            Taseer uses AI-driven matching and advanced filters to help brands
                            discover influencers based on audience demographics, engagement,
                            and niche.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-10">
                        <AccordionTrigger>How do I get started with Taseer?</AccordionTrigger>
                        <AccordionContent>
                            Simply sign up, set up your profile, and start exploring
                            campaigns. Whether you're a brand or an influencer, Taseer makes
                            collaborations seamless and rewarding.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
};

export default Faq;
