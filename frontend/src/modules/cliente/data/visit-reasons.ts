import type { LucideIcon } from "lucide-react"

import { DocumentsIcon, HelpIcon, PaymentsIcon } from "@/App/utils/icons"

export interface VisitReason {
  value: string
  icon: LucideIcon
}

export const VISIT_REASONS: VisitReason[] = [
  { value: "Consultas generales", icon: HelpIcon },
  { value: "Trámites y pagos", icon: PaymentsIcon },
  { value: "Entrega de documentos", icon: DocumentsIcon },
]
