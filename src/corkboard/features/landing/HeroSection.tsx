import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { Button } from '@heroui/react'

export function HeroSection() {
  return (
    <section className="pt-44 md:pt-36 pb-20 px-6 relative">
      <motion.div
        className="max-w-4xl mx-auto text-center relative z-10"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h1
          className="mb-6 text-center tracking-tight"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="inline-block whitespace-nowrap leading-[1.16] pb-[0.12em] bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent text-[clamp(1.95rem,6.2vw,5.5rem)]">
            Photo Corkboard
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          A digital photo corkboard for organizing memories. Drag and drop photos, apply retro filters, add captions, pin your memories, and export high-resolution collages.
        </motion.p>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col items-center"
        >
          <a href="https://peerlist.io/aashuu/project/enough-aashuu" target="_blank" rel="noreferrer">
            <img
              src="https://dqy38fnwh4fqs.cloudfront.net/website/project-spotlight/project-week-rank-one-dark.svg"
              alt="enough aashuu"
              style={{ width: "auto", height: "64px" }}
              className="mb-4"
            />
          </a>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm md:text-base text-gray-300 mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            Supports: Crop • Add Caption • Filters • Pins • Organize • Export
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
        >
          <a href="/corkboard/editor">
            <Button
              size="lg"
              variant="ghost"
              className="font-semibold px-8 gap-2 text-white bg-gradient-to-r from-red-600 to-pink-600 hover:brightness-110"
            >
              Open Web Editor
              <Icon icon="lucide:arrow-right" width={16} />
            </Button>
          </a>
        </motion.div>

        {/* Preview image area – cork texture mockup */}
        <motion.div
          className="mt-16 w-full max-w-4xl mb-24"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42 }}
        >
          <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/40 relative" style={{ background: '#8a6b4e', minHeight: '320px' }}>
            {/* Cork texture via inline SVG background */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <filter id="hero-cork">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" result="noise" />
                  <feDiffuseLighting in="noise" lightingColor="#dcb386" surfaceScale="1.5" result="litNoise">
                    <feDistantLight azimuth="45" elevation="50" />
                  </feDiffuseLighting>
                  <feComponentTransfer in="litNoise">
                    <feFuncR type="linear" slope="0.8" intercept="0.1" />
                    <feFuncG type="linear" slope="0.7" intercept="0.05" />
                    <feFuncB type="linear" slope="0.6" intercept="0.0" />
                  </feComponentTransfer>
                </filter>
              </defs>
              <rect width="100%" height="100%" fill="#8a6b4e" />
              <rect width="100%" height="100%" filter="url(#hero-cork)" opacity="0.85" />
            </svg>

            {/* Sample polaroids overlay */}
            <div className="relative z-10 p-8 flex items-center justify-center gap-6 flex-wrap" style={{ minHeight: 320 }}>
              {[
{ rot: -2, caption: 'Icecream', color: '#fff8f0', emoji: '🍦', top: 60, left: 155 },
{ rot: 3, caption: 'Fuel', color: '#f8fff8', emoji: '⚡', top: 20, left: 250 },
{ rot: -3, caption: 'My 🧠', color: '#fff8f0', emoji: '🧑‍💻', top: 110, left: 80 },
{ rot: 2, caption: 'Obsession', color: '#f8fff8', emoji: '🔥', top: 10, left: 320 },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: item.color,
                    padding: '10px 10px 38px',
                    borderRadius: 2,
                    transform: `rotate(${item.rot}deg)`,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                    width: 140,
                    flexShrink: 0,
                    userSelect: 'none',
                  }}
                >
                  <div style={{ width: '100%', height: 110, background: '#f0ebe0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
                    {item.emoji}
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, fontFamily: 'cursive', color: '#444' }}>
                    {item.caption}
                  </div>
                  {/* Red Pin */}
                  <div style={{
                    position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                    width: 14, height: 14, borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #e63946, #9d0208)',
                    boxShadow: '1px 2px 4px rgba(0,0,0,0.3)'
                  }} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
