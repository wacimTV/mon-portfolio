"use client"

import Script from "next/script"
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove: (id?: string) => void
    }
  }
}

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""

export type TurnstileHandle = { reset: () => void }

type Props = { onToken: (token: string) => void }

// Widget Cloudflare Turnstile. Ne s'affiche que si NEXT_PUBLIC_TURNSTILE_SITE_KEY est défini.
export const TurnstileWidget = forwardRef<TurnstileHandle, Props>(function TurnstileWidget({ onToken }, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const [ready, setReady] = useState(false)

  const render = useCallback(() => {
    if (!window.turnstile || !containerRef.current || widgetId.current) return
    widgetId.current = window.turnstile.render(containerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      language: "fr",
      theme: "auto",
      size: "flexible",
      callback: (token: string) => onToken(token),
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    })
  }, [onToken])

  useEffect(() => {
    if (window.turnstile) setReady(true)
  }, [])

  useEffect(() => {
    if (ready) render()
    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current)
      widgetId.current = null
    }
  }, [ready, render])

  useImperativeHandle(ref, () => ({
    reset: () => {
      onToken("")
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current)
    },
  }))

  if (!TURNSTILE_SITE_KEY) return null

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onReady={() => setReady(true)}
      />
      <div ref={containerRef} className="min-h-[65px]" />
    </>
  )
})
