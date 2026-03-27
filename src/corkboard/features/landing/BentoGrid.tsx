import { motion } from 'framer-motion'

const FEATURES = [
  {
    icon: '🖼️',
    label: 'Photos',
    title: 'Drag & Drop Upload',
    desc: 'Drop multiple images at once onto the board. Paste image URLs too.',
    span: 'md:col-span-2',
    delay: 0,
  },
  {
    icon: '📌',
    label: 'Pins',
    title: 'Color Pins',
    desc: 'Red, blue, gold, green, purple — or remove the pin entirely.',
    span: '',
    delay: 0.05,
  },
  {
    icon: '🎨',
    label: 'Filters',
    title: 'Retro Filters',
    desc: 'One-click Vintage, Noir, Faded, Cool, Warm, or Dramatic filter per photo.',
    span: '',
    delay: 0.08,
  },
  {
    icon: '✂️',
    label: 'Edit',
    title: 'Crop & Zoom',
    desc: 'Enter crop mode to pan and scroll-zoom any photo inside its polaroid frame.',
    span: 'md:col-span-2',
    delay: 0.12,
  },
  {
    icon: '💾',
    label: 'Export',
    title: '4K Wallpaper Export',
    desc: 'Download a full 4K (3840×2160) PNG wallpaper of your board — complete with cork texture.',
    span: 'md:col-span-2',
    delay: 0.15,
  },
  {
    icon: '$0',
    label: 'Pricing',
    title: 'Free Forever',
    desc: 'No login, no watermarks, no limits.',
    span: '',
    delay: 0.18,
  },
]

function cardVariants(delay = 0) {
  return {
    initial: false,
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  }
}

export function BentoGrid() {
  return (
    <section id="features" className="px-4 pb-24 max-w-5xl mx-auto scroll-mt-16">
      {/* <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Everything you need
        </h2>
        <p className="text-gray-400 text-lg">
          A cozy photo corkboard — no account required.
        </p>
      </motion.div> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {FEATURES.map((f) => (
          <motion.div
            key={f.title}
            {...cardVariants(f.delay)}
            className={`rounded-2xl border border-white/10 bg-white/5 p-6 ${f.span}`}
          >
            <div className="text-2xl mb-3">{f.icon}</div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1">{f.label}</p>
            <h3 className="text-lg font-semibold text-white mb-1">{f.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div> */}
    </section>
  )
}
