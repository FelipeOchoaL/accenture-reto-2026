import type { ButtonHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { SpinnerIcon } from "@/App/utils/icons"
import { cn } from "@/lib/utils"

// Botones del design system "Telemetry Queue System": transiciones lineales, presión a scale(0.98).
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-150 ease-out select-none active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-on-primary shadow-md shadow-primary/20 hover:bg-primary-container",
        accent:
          "bg-primary-container text-on-primary shadow-md hover:bg-primary",
        tonal:
          "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
        outline:
          "border border-hairline bg-surface-container-lowest text-on-surface hover:border-on-surface hover:bg-gray-50",
        danger:
          "border border-danger-border bg-danger-container text-on-danger-container hover:bg-red-200",
        ghost: "text-on-surface-variant hover:bg-surface-container-low",
      },
      size: {
        sm: "h-9 px-3 text-body-sm",
        md: "h-11 px-4 text-body-md",
        lg: "h-12 px-6 text-body-md",
        icon: "size-10",
      },
      block: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  }
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }

export function Button({
  className,
  variant,
  size,
  block,
  loading = false,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, block }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <SpinnerIcon className="size-5 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  )
}
