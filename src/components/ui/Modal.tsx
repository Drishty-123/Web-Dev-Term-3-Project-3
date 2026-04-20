import { useEffect, type ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, description, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/72 px-4 py-6 backdrop-blur-md md:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="glass-panel w-full max-w-3xl rounded-[32px] bg-[var(--bg)] p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Habit editor
            </p>
            <h3 className="font-['Fraunces'] text-3xl text-white">{title}</h3>
            {description ? (
              <p className="max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                {description}
              </p>
            ) : null}
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}
