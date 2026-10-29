import { useState, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { LucideIcon } from "lucide-react"

import {
  HideIcon,
  LockIcon,
  LoginIcon,
  MailIcon,
  ShowIcon,
  WarningIcon,
} from "@/App/utils/icons"
import { Button } from "@/components/custom/Button"
import { cn } from "@/lib/utils"
import { loginSchema, type LoginValues } from "@/modules/auth/schemas/login.schema"

interface LoginFormProps {
  onSubmit: (values: LoginValues) => void
  submitting: boolean
  serverError: string | null
}

interface FieldProps {
  id: string
  label: string
  icon: LucideIcon
  error?: string
  children: ReactNode
  trailing?: ReactNode
}

function Field({ id, label, icon: Icon, error, children, trailing }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-body-sm font-medium text-on-surface">
        {label}
      </label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-outline"
          aria-hidden
        />
        {children}
        {trailing}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-body-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

const inputClass = (hasError: boolean) =>
  cn(
    "h-11 w-full rounded-sm border border-input bg-surface-container-lowest pr-3 pl-10 text-body-md text-on-surface transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-outline focus:border-primary-container focus:shadow-[0_0_0_1px_#7928ca] focus:outline-none",
    hasError && "border-destructive"
  )

export function LoginForm({ onSubmit, submitting, serverError }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {serverError ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-danger-border bg-danger-container px-3 py-2.5 text-body-sm text-on-danger-container"
        >
          <WarningIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
          {serverError}
        </div>
      ) : null}

      <Field id="email" label="Correo corporativo" icon={MailIcon} error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="username"
          placeholder="nombre@rowcenture.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClass(Boolean(errors.email))}
          {...register("email")}
        />
      </Field>

      <Field
        id="password"
        label="Contraseña"
        icon={LockIcon}
        error={errors.password?.message}
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-sm text-on-surface-variant transition-colors hover:bg-surface-container-low"
          >
            {showPassword ? (
              <HideIcon className="size-[18px]" aria-hidden />
            ) : (
              <ShowIcon className="size-[18px]" aria-hidden />
            )}
          </button>
        }
      >
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={cn(inputClass(Boolean(errors.password)), "pr-11")}
          {...register("password")}
        />
      </Field>

      <Button type="submit" block loading={submitting} className="mt-1">
        {!submitting ? <LoginIcon className="size-5" aria-hidden /> : null}
        Ingresar al centro operativo
      </Button>
    </form>
  )
}
