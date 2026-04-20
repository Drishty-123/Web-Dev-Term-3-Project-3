import { motion } from 'framer-motion'

export function Spinner() {
  return (
    <motion.span
      aria-hidden="true"
      className="inline-block h-5 w-5 rounded-full border-2 border-white/24 border-t-[var(--accent)]"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
    />
  )
}

export function FullPageLoader({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm text-[var(--text-secondary)]">
        <Spinner />
        <span>{label}</span>
      </div>
    </div>
  )
}
