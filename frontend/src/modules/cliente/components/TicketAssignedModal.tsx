import type { Ticket } from "@/App/types/queue.types"
import { firstName } from "@/App/utils/format"
import { SuccessIcon } from "@/App/utils/icons"
import { Button } from "@/components/custom/Button"
import { Modal } from "@/components/custom/Modal"

interface TicketAssignedModalProps {
  ticket: Ticket | null
  position: number
  estimatedMinutes: number
  onContinue: () => void
}

// Confirmación tras pedir el turno: número asignado, posición y espera estimada.
export function TicketAssignedModal({
  ticket,
  position,
  estimatedMinutes,
  onContinue,
}: TicketAssignedModalProps) {
  return (
    <Modal open={Boolean(ticket)} onClose={onContinue} title="Turno asignado" hideTitle>
      {ticket ? (
        <div className="flex flex-col items-center text-center">
          <span className="mb-2 flex size-14 items-center justify-center rounded-full bg-primary-fixed text-primary">
            <SuccessIcon className="size-8" aria-hidden />
          </span>
          <span className="text-label-telemetry text-on-surface-variant uppercase">
            Turno asignado
          </span>
          <span className="my-1 font-heading text-display-ticket-mobile text-primary tabular-nums">
            {ticket.code}
          </span>
          <p className="mb-1 text-body-md font-medium text-on-surface">
            {ticket.customerName ? `¡Listo, ${firstName(ticket.customerName)}!` : "¡Listo!"}
          </p>
          <p className="mb-6 text-body-sm text-on-surface-variant">
            Estás en la posición <strong>#{position}</strong>. Tu tiempo estimado de espera
            es de <strong>{estimatedMinutes} min</strong>.
          </p>
          <Button size="md" block onClick={onContinue}>
            Ver mi seguimiento en vivo
          </Button>
        </div>
      ) : null}
    </Modal>
  )
}
