import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { AlertIcon, ForwardIcon, InfoIcon } from "@/App/utils/icons"
import { Button } from "@/components/custom/Button"
import { cn } from "@/lib/utils"
import { VISIT_REASONS } from "@/modules/cliente/data/visit-reasons"
import {
  pedirTurnoSchema,
  type PedirTurnoValues,
} from "@/modules/cliente/schemas/pedir-turno.schema"

interface PedirTurnoFormProps {
  onSubmit: (values: PedirTurnoValues) => void
  submitting: boolean
}

export function PedirTurnoForm({ onSubmit, submitting }: PedirTurnoFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PedirTurnoValues>({
    resolver: zodResolver(pedirTurnoSchema),
    defaultValues: { customerName: "", reason: null },
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-xl bg-surface-container-lowest p-4 shadow-md"
    >
      {/* Nombre */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="customerName" className="text-body-md font-medium text-on-surface">
            Tu nombre
          </label>
          <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-label-telemetry font-semibold text-on-primary-fixed uppercase">
            Obligatorio
          </span>
        </div>
        <input
          id="customerName"
          type="text"
          autoComplete="name"
          placeholder="Ej. Camila Fernández"
          aria-invalid={Boolean(errors.customerName)}
          aria-describedby={errors.customerName ? "customerName-error" : undefined}
          className={cn(
            "h-12 w-full rounded-lg bg-surface-container-low px-3.5 text-body-md text-on-surface transition-all duration-150 ease-out placeholder:text-outline focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#7928ca] focus:outline-none",
            errors.customerName && "shadow-[0_0_0_2px_#ba1a1a]"
          )}
          {...register("customerName")}
        />
        {errors.customerName ? (
          <p id="customerName-error" role="alert" className="text-body-sm text-destructive">
            {errors.customerName.message}
          </p>
        ) : null}
      </div>

      {/* Motivo de visita */}
      <fieldset className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <legend className="text-body-md font-medium text-on-surface">Motivo de visita</legend>
          <span className="text-label-telemetry text-on-surface-variant uppercase">Opcional</span>
        </div>
        <Controller
          control={control}
          name="reason"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {VISIT_REASONS.map(({ value, icon: Icon }) => {
                const selected = field.value === value
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => field.onChange(selected ? null : value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-body-sm transition-all duration-150 ease-out select-none active:scale-95",
                      selected
                        ? "bg-primary-container text-on-primary"
                        : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                    )}
                  >
                    <Icon
                      className={cn("size-4", selected ? "text-on-primary" : "text-outline")}
                      aria-hidden
                    />
                    {value}
                  </button>
                )
              })}
            </div>
          )}
        />
      </fieldset>

      <div className="flex items-center gap-2 rounded-lg bg-surface-container-low p-3">
        <AlertIcon className="size-5 shrink-0 text-primary" aria-hidden />
        <p className="text-body-sm text-on-surface-variant">
          Recibirás una alerta vibrante cuando tu turno esté a 2 personas de ser llamado.
        </p>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <Button type="submit" variant="accent" block loading={submitting} className="rounded-xl font-medium">
          <span>Pedir turno</span>
          {!submitting ? <ForwardIcon className="size-5" aria-hidden /> : null}
        </Button>
        <p className="flex items-start justify-center gap-2 pt-1 text-center">
          <InfoIcon className="mt-0.5 size-4 shrink-0 text-outline" aria-hidden />
          <span className="max-w-[280px] text-label-telemetry text-on-surface-variant">
            Te notificaremos en pantalla cuando tu turno sea llamado. No cierres esta ventana.
          </span>
        </p>
      </div>
    </form>
  )
}
