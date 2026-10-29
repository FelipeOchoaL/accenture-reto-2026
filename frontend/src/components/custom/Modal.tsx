import { useEffect, useId, useRef, type ReactNode } from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  // Oculta el título visualmente cuando el contenido ya lo muestra con otro estilo.
  hideTitle?: boolean
  children: ReactNode
  className?: string
}

// Diálogo modal accesible: bloquea el fondo, cierra con Escape y enfoca el contenido al abrir.
export function Modal({
  open,
  onClose,
  title,
  hideTitle = false,
  children,
  className,
}: ModalProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previousFocus = document.activeElement as HTMLElement | null
    panelRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        aria-hidden
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "relative w-full max-w-sm rounded-xl bg-surface-container-lowest p-6 shadow-xl outline-none animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        <h2
          id={titleId}
          className={cn("text-headline-md text-on-surface", hideTitle && "sr-only")}
        >
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body
  )
}
