import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Link } from "react-router"

import { buttonVariants } from "@/components/custom/Button"
import { cn } from "@/lib/utils"

interface RoleCardProps {
  icon: LucideIcon
  tag: ReactNode
  title: string
  description: string
  preview: ReactNode
  actionLabel: string
  actionIcon: LucideIcon
  to: string
  emphasis?: boolean
}

export function RoleCard({
  icon: Icon,
  tag,
  title,
  description,
  preview,
  actionLabel,
  actionIcon: ActionIcon,
  to,
  emphasis = false,
}: RoleCardProps) {
  return (
    <article className="group flex flex-col justify-between rounded-xl bg-surface-container-lowest p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-10">
      <div className="flex flex-col">
        <div className="mb-6 flex items-center justify-between gap-3">
          <span
            className={cn(
              "flex size-14 items-center justify-center rounded-lg transition-colors duration-200",
              emphasis
                ? "bg-primary-container/10 text-primary-container group-hover:bg-primary-container group-hover:text-on-primary"
                : "bg-surface-container-low text-primary group-hover:bg-primary group-hover:text-on-primary"
            )}
          >
            <Icon className="size-8" aria-hidden />
          </span>
          {tag}
        </div>
        <h2 className="mb-1 text-headline-lg font-bold text-on-surface">{title}</h2>
        <p className="mb-6 text-body-md leading-relaxed text-secondary">{description}</p>
        <div className="mb-6 flex items-center justify-between rounded-lg bg-surface-container-low p-4">
          {preview}
        </div>
      </div>
      <Link
        to={to}
        className={cn(
          buttonVariants({ variant: emphasis ? "primary" : "tonal", block: true }),
          "px-6"
        )}
      >
        <span>{actionLabel}</span>
        <ActionIcon
          className="size-5 transition-transform duration-150 group-hover:translate-x-1"
          aria-hidden
        />
      </Link>
    </article>
  )
}
