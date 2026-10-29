import { getErrorMessage } from "@/App/types/api.types"
import { SpinnerIcon, WarningIcon } from "@/App/utils/icons"
import { Button } from "@/components/custom/Button"

interface QueueDataStateProps {
  error: unknown
  onRetry: () => void
}

// Estados de carga y error de los datos de la fila en el panel del asesor.
export function QueueDataState({ error, onRetry }: QueueDataStateProps) {
  if (!error) {
    return (
      <div className="flex items-center justify-center py-24" role="status">
        <SpinnerIcon className="size-8 animate-spin text-primary" aria-hidden />
        <span className="sr-only">Cargando la fila…</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center" role="alert">
      <span className="flex size-14 items-center justify-center rounded-full bg-danger-container text-on-danger-container">
        <WarningIcon className="size-7" aria-hidden />
      </span>
      <h2 className="text-headline-md text-on-surface">No pudimos cargar la fila</h2>
      <p className="max-w-sm text-body-sm text-on-surface-variant">{getErrorMessage(error)}</p>
      <Button size="md" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  )
}
