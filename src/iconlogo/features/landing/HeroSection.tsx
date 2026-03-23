import { Icon } from '@iconify/react'
import { Button } from '@heroui/react'
import { motion } from 'framer-motion'

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
          <span className="inline-block whitespace-nowrap leading-[1.16] pb-[0.12em] bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent text-[clamp(1.95rem,6.2vw,5.5rem)]">
            The Free Icon Logo Maker
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Pick from 300,000+ icons, customize colors and multi-stop gradients,
          export to SVG, PNG, ICO, or favicon — entirely in your browser.
        </motion.p>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col items-center"
        >
          <a
            href="https://peerlist.io/aashuu/project/enough-aashuu"
            target="_blank"
            rel="noreferrer"
            className="mb-4"
            aria-label="Enough Aashuu on Peerlist"
            data-umami-event="click peerlist"
            data-umami-event-source="iconlogo"
          >
            <img
              src="https://peerlist.io/api/v1/projects/embed/PRJHNN7JQ6QA9KKLJ1OA9AK8O9AQP8?showUpvote=true&theme=dark"
              alt="enough aashuu"
              style={{ width: "auto", height: "72px" }}
            />
          </a>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm md:text-base text-gray-300 mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            Supports: 300,000+ Icons • SVG • PNG • ICO
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
        >
          <a href="/iconlogo/editor">
            <Button
              size="lg"
              variant="ghost"
              className="font-semibold px-8 gap-2 text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:brightness-110"
            >
              Open Web Editor
              <Icon icon="lucide:arrow-right" width={16} />
            </Button>
          </a>
          <Button
            size="lg"
            variant="ghost"
            className="text-muted"
            onPress={() =>
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          >
            See features
          </Button>
        </motion.div>

        <motion.div
          className="mt-16 w-full max-w-4xl mb-24"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42 }}
        >
          <div className="rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xl shadow-black/40">
            <img
              src="/iconlogo/screenshot.png"
              alt="IconLogo.dev editor — SVG logo maker interface"
              className="w-full block"
              width={1280}
              height={800}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
