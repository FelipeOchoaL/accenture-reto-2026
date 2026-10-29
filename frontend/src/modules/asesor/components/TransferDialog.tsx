import { TransferIcon } from "@/App/utils/icons"
import { Button } from "@/components/custom/Button"
import { Modal } from "@/components/custom/Modal"

const MODULES = [
  { code: "01", name: "Caja y pagos" },
  { code: "02", name: "Créditos" },
  { code: "04", name: "Servicios empresariales" },
]

interface TransferDialogProps {
  open: boolean
  ticketCode: string | undefined
  currentModule: string
  loading: boolean
  onClose: () => void
  onConfirm: (moduleCode: string) => void
}

export function TransferDialog({
  open,
  ticketCode,
  currentModule,
  loading,
  onClose,
  onConfirm,
}: TransferDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title="Transferir turno">
      <p className="mt-1 mb-4 text-body-sm text-on-surface-variant">
        Selecciona el módulo que atenderá el turno{" "}
        <strong className="text-on-surface">{ticketCode}</strong>.
      </p>
      <ul className="flex flex-col gap-2">
        {MODULES.filter((module) => module.code !== currentModule).map((module) => (
          <li key={module.code}>
            <button
              type="button"
              disabled={loading}
              onClick={() => onConfirm(module.code)}
              className="flex w-full items-center gap-3 rounded-lg border border-hairline px-3 py-3 text-left transition-colors duration-150 hover:border-primary-container hover:bg-surface-container-low disabled:opacity-60"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary-fixed font-heading font-bold text-primary">
                {module.code}
              </span>
              <span className="flex flex-1 flex-col">
                <span className="text-body-md font-medium text-on-surface">Módulo {module.code}</span>
                <span className="text-body-sm text-on-surface-variant">{module.name}</span>
              </span>
              <TransferIcon className="size-4 text-outline" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <Button variant="outline" size="md" block className="mt-4" onClick={onClose}>
        Cancelar
      </Button>
    </Modal>
  )
}
