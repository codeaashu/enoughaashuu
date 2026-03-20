import { GridBackground } from '#/features/editor/GridBackground'
import { HeroSection } from './HeroSection'
import { BentoGrid } from './BentoGrid'

export function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10">
        <HeroSection />
        <BentoGrid />
      </div>
    </div>
  )
}
