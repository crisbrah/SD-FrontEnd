import Navbar from '../components/layout/Navbar'
import Hero from '../components/landing/Hero'
import Vision from '../components/landing/Vision'
import MinisteriosPreview from '../components/landing/MinisteriosPreview'
import Features from '../components/landing/Features'
import JoinSection from '../components/landing/JoinSection'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Vision />
      <MinisteriosPreview />
      <Features />
      <JoinSection />
      <Footer />
    </div>
  )
}
