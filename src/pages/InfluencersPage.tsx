import Navbar from '../components/Navbar'
import Footer from '../components/Fotter'
import InfluencersHero from '../components/influencers/InfluencersHero'
import InfluencerSection from '../components/influencers/InfluencersAll'
import Faq from '../components/influencers/Faq'

export default function Influencers() {
    return (
        <>
            <Navbar />
            <div className='pt-[100px]'></div>
            <InfluencersHero />
            <InfluencerSection />
            <Faq />
            <Footer />
        </>
    )
}
