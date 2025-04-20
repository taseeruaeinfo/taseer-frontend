import Footer from '../components/Fotter'
import ContactForm from '../components/home/ContactForm'
import FaqSection from '../components/home/Faq'
import Navbar from '../components/Navbar'
import {
    Mail,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    MapPin
} from "lucide-react";

export default function ContactUspage() {
    return (
        <>
            <Navbar />
            <div className='pt-[100px]'></div>
            <ContactForm />
            <FaqSection />

            <section className="w-full px-4 py-12  bg-white">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 border border-purple-500 rounded-md p-2 items-center">
                    {/* Left: Embedded Google Map */}
                    <div className="w-full h-[300px] md:h-[400px]">
                        <iframe
                            title="Taseer Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462563.03849518095!2d54.89713687129321!3d25.07565686586663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1745098130154!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    {/* Right: Contact Info */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Drop us an email at
                        </h2>

                        <div className="flex items-center text-lg text-gray-700">
                            <Mail className="w-5 h-5 mr-2 text-primary" />
                            <a href="mailto:support@taseer.app" className="underline hover:text-primary transition">
                                support@taseer.app
                            </a>
                        </div>

                        <div className="flex items-center space-x-4 mt-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <Facebook className="w-5 h-5 text-gray-600 hover:text-blue-600 transition" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <Twitter className="w-5 h-5 text-gray-600 hover:text-sky-500 transition" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <Instagram className="w-5 h-5 text-gray-600 hover:text-pink-500 transition" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <Linkedin className="w-5 h-5 text-gray-600 hover:text-blue-700 transition" />
                            </a>
                        </div>

                        <div className="flex items-center text-lg text-gray-700 mt-4">
                            <MapPin className="w-5 h-5 mr-2 text-red-500" />
                            <span>Dubai, UAE</span>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}
