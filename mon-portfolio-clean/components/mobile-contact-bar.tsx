import { MessageCircle, Phone } from "lucide-react"

const PHONE = "+33782135483"
const WHATSAPP_MESSAGE = "Bonjour, je souhaite un devis pour…"
const WHATSAPP_URL = `https://wa.me/33782135483?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

/**
 * Barre de contact fixée en bas de l'écran, visible uniquement sur mobile.
 * La hauteur réservée en bas du body est définie dans app/globals.css
 * (--mobile-contact-bar-height) pour ne pas masquer le pied de page.
 */
export function MobileContactBar() {
  return (
    <nav
      aria-label="Contact rapide"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 pt-3 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-md gap-3">
        <a
          href={`tel:${PHONE}`}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Appeler
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </nav>
  )
}
