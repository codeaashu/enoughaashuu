import { HeroSection } from './HeroSection'
import { BentoGrid } from './BentoGrid'

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 blur-[100px] rounded-full mix-blend-screen" />
      </div>
      <div className="relative z-10">
        <HeroSection />
        <BentoGrid />
      </div>
    </div>
  )
}
