import Footer from "../components/Fotter"
import Faq from "../components/influencers/Faq"
import Navbar from "../components/Navbar"
import PremiumFeatureTable from "../components/Pricing"

export default function PricingPage() {
    return (
        <>
            <Navbar />
            <div className='pt-[100px]'></div>
            <PremiumFeatureTable />
            <Faq />
            <Footer />
        </>
    )
}
