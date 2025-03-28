import Footer from "../components/Fotter";
import BrandsSection from "../components/home/Brands";
import Connect from "../components/home/Connect";
import ContactForm from "../components/home/ContactForm";
import Hero from "../components/home/Hero";
import InfluencerSection from "../components/home/Influencer";
import ServicesSection from "../components/home/Services";
import WhichOne from "../components/home/WhichOne";
import Navbar from "../components/Navbar";

export default function Home() {

    return (
        <>
            <Navbar />
            <Hero />
            <Connect />
            <WhichOne />
            <ServicesSection />
            <InfluencerSection />
            <BrandsSection />
            <ContactForm />
            <Footer />
        </>
    );
}
