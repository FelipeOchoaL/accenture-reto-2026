import { Link } from "react-router"

import { BackIcon } from "@/App/utils/icons"
import { buttonVariants } from "@/components/custom/Button"
import { Logo } from "@/components/custom/Logo"
import { PATHS } from "@/routes/paths"

const NotFoundPage = () => {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-surface px-6 text-center">
      <Logo />
      <span className="font-heading text-display-ticket text-primary tabular-nums">404</span>
      <div>
        <h1 className="text-headline-lg text-on-surface">Esta página no está en la fila</h1>
        <p className="mt-1 text-body-md text-secondary">
          La dirección que buscas no existe o fue movida.
        </p>
      </div>
      <Link to={PATHS.inicio} className={buttonVariants({ size: "md" })}>
        <BackIcon className="size-4" aria-hidden />
        Volver al inicio
      </Link>
    </main>
  )
}

export default NotFoundPage
