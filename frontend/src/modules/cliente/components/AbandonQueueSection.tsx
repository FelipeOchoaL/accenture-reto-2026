import { useState } from "react"

import { LeaveIcon } from "@/App/utils/icons"
import { Button } from "@/components/custom/Button"
import { Modal } from "@/components/custom/Modal"

interface AbandonQueueSectionProps {
  ticketCode: string
  onConfirm: () => void
  loading: boolean
}

// Botón "Abandonar fila" con confirmación: la acción libera el lugar y no se puede deshacer.
export function AbandonQueueSection({ ticketCode, onConfirm, loading }: AbandonQueueSectionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <Button variant="tonal" block onClick={() => setOpen(true)}>
        <LeaveIcon className="size-5" aria-hidden />
        Abandonar fila
      </Button>
      <p className="text-center text-label-telemetry text-on-surface-variant">
        Si cancelas, cederás tu lugar al siguiente usuario en la fila.
      </p>

      <Modal open={open} onClose={() => setOpen(false)} title="¿Abandonar la fila?">
        <p className="mt-2 mb-6 text-body-sm text-on-surface-variant">
          Tu turno <strong className="text-on-surface">{ticketCode}</strong> se cancelará y
          tendrás que pedir uno nuevo si regresas.
        </p>
        <div className="flex flex-col gap-2">
          <Button
            variant="danger"
            size="md"
            block
            loading={loading}
            onClick={onConfirm}
          >
            Sí, abandonar fila
          </Button>
          <Button variant="outline" size="md" block onClick={() => setOpen(false)}>
            Seguir en la fila
          </Button>
        </div>
      </Modal>
    </div>
  )
}
