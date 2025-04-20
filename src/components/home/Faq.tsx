import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/Accordition";

const faqs = [
    {
        question: "What makes Taseer different from other influencer platforms?",
        answer: "We focus on authenticity, simplicity, and transparency. Our platform is built to support small businesses and everyday creators, not just big-budget brands or celebrity influencers."
    },
    {
        question: "How do I join Taseer as an influencer?",
        answer: "It’s simple! Just sign up on our website, fill out your profile with your niche, audience insights, and past work. Once approved, you’ll be visible to brands looking for your type of content."
    },
    {
        question: "Is there a minimum follower count to join?",
        answer: "We generally prefer influencers with 2,000+ followers, but if you have strong engagement and quality content, you may still qualify. Our focus is on value, not just numbers."
    },
    {
        question: "Do influencers get paid through the platform?",
        answer: "Yes — most campaigns offer payments, vouchers, or goodies. Taseer ensures clarity in campaign terms before you accept any offer. Payment terms depend on the brand's agreement."
    },
    {
        question: "Can I apply to multiple campaigns at once?",
        answer: "Definitely! You can browse live campaigns and apply to as many as you’d like. Make sure your profile is complete and your pitch is personalized for better chances."
    },
    {
        question: "How does Taseer help brands find influencers?",
        answer: "Taseer uses smart filters, reviews, and data-driven recommendations to match you with influencers who align with your campaign goals, audience, and budget. You can search by niche, follower count, engagement rate, location, and more."
    },
    {
        question: "Can I work with micro or nano influencers through Taseer?",
        answer: "Absolutely! In fact, Taseer specializes in connecting brands with micro and nano influencers who offer high engagement and authentic audience connections — all at affordable rates."
    },
];

const FaqSection = () => {
    return (
        <section className="px-4 py-12 md:py-20 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-800">
                Frequently Asked Questions
            </h2>
            <Accordion type="multiple" className="space-y-4">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left text-lg font-medium text-gray-900">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-700 text-base leading-relaxed">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
};

export default FaqSection;
