import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import type { Ticket } from "@/App/types/queue.types"
import {
  AbsentIcon,
  LeaveIcon,
  SuccessIcon,
  TransferIcon,
  WarningIcon,
} from "@/App/utils/icons"
import { Button } from "@/components/custom/Button"
import { cn } from "@/lib/utils"

interface ClienteMessageStateProps {
  icon: LucideIcon
  tone?: "primary" | "danger" | "neutral"
  title: string
  description: ReactNode
  actionLabel: string
  onAction: () => void
}

// Estado a pantalla completa para fin de atención, errores o turnos cerrados.
export function ClienteMessageState({
  icon: Icon,
  tone = "primary",
  title,
  description,
  actionLabel,
  onAction,
}: ClienteMessageStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <span
        className={cn(
          "flex size-16 items-center justify-center rounded-full",
          tone === "primary" && "bg-primary-fixed text-primary",
          tone === "danger" && "bg-danger-container text-on-danger-container",
          tone === "neutral" && "bg-surface-container-high text-on-surface-variant"
        )}
      >
        <Icon className="size-8" aria-hidden />
      </span>
      <h1 className="text-headline-lg-mobile text-on-surface">{title}</h1>
      <p className="max-w-xs text-body-md text-on-surface-variant">{description}</p>
      <Button className="mt-2" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  )
}

const CLOSED_COPY: Record<
  string,
  { icon: LucideIcon; tone: ClienteMessageStateProps["tone"]; title: string; text: (ticket: Ticket) => string }
> = {
  atendido: {
    icon: SuccessIcon,
    tone: "primary",
    title: "¡Gracias por tu visita!",
    text: (ticket) =>
      `Tu atención del turno ${ticket.code} quedó registrada${ticket.module ? ` en el módulo ${ticket.module}` : ""}.`,
  },
  ausente: {
    icon: AbsentIcon,
    tone: "danger",
    title: "Tu turno fue marcado como ausente",
    text: (ticket) =>
      `No te presentaste a tiempo para el turno ${ticket.code}. Puedes pedir un turno nuevo.`,
  },
  transferido: {
    icon: TransferIcon,
    tone: "primary",
    title: "Tu turno fue transferido",
    text: (ticket) =>
      `Dirígete al módulo ${ticket.module ?? "indicado en la sala"} para continuar tu atención.`,
  },
  cancelado: {
    icon: LeaveIcon,
    tone: "neutral",
    title: "Saliste de la fila",
    text: (ticket) => `El turno ${ticket.code} fue cancelado.`,
  },
}

export function TicketClosedState({ ticket, onNewTicket }: { ticket: Ticket; onNewTicket: () => void }) {
  const copy = CLOSED_COPY[ticket.status] ?? {
    icon: WarningIcon,
    tone: "neutral" as const,
    title: "Tu turno ya no está activo",
    text: () => "Puedes pedir un turno nuevo cuando lo necesites.",
  }

  return (
    <ClienteMessageState
      icon={copy.icon}
      tone={copy.tone}
      title={copy.title}
      description={copy.text(ticket)}
      actionLabel="Pedir nuevo turno"
      onAction={onNewTicket}
    />
  )
}
