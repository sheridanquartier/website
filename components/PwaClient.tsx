'use client'

import { useEffect, useMemo, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isStandaloneMode() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia('(display-mode: standalone)').matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
}

export default function PwaClient() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [installVisible, setInstallVisible] = useState(false)
  const [iosHintVisible, setIosHintVisible] = useState(false)

  const isIosSafari = useMemo(() => {
    if (typeof window === 'undefined') {
      return false
    }

    const ua = window.navigator.userAgent.toLowerCase()
    const isIos = /iphone|ipad|ipod/.test(ua)
    const isSafari = /safari/.test(ua) && !/crios|fxios|edgios/.test(ua)
    return isIos && isSafari
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((error) => {
          console.error('Service worker registration failed:', error)
        })
      })
    }

    const updateDisplayMode = () => {
      document.documentElement.dataset.displayMode = isStandaloneMode() ? 'standalone' : 'browser'
    }

    updateDisplayMode()

    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const onMediaChange = () => updateDisplayMode()
    mediaQuery.addEventListener('change', onMediaChange)

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
      setInstallVisible(true)
    }

    const onAppInstalled = () => {
      setInstallVisible(false)
      setInstallEvent(null)
      document.documentElement.dataset.displayMode = 'standalone'
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)

    if (!isStandaloneMode() && isIosSafari) {
      setIosHintVisible(true)
    }

    return () => {
      mediaQuery.removeEventListener('change', onMediaChange)
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [isIosSafari])

  const handleInstall = async () => {
    if (!installEvent) {
      return
    }

    await installEvent.prompt()
    const choice = await installEvent.userChoice
    if (choice.outcome === 'accepted') {
      setInstallVisible(false)
    }
  }

  if ((!installVisible && !iosHintVisible) || isStandaloneMode()) {
    return null
  }

  return (
    <div className="md:hidden fixed left-4 right-4 z-[70] bottom-[calc(5.6rem+env(safe-area-inset-bottom))]">
      <div className="rounded-[26px] border border-[rgba(31,77,67,0.12)] bg-[rgba(251,248,241,0.96)] px-4 py-4 shadow-[0_18px_44px_rgba(31,77,67,0.12)] backdrop-blur-[18px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[15px] font-semibold leading-[1.25] text-[var(--ink)]">
              Quartier-App auf den Startbildschirm legen
            </p>
            <p className="mb-0 text-[13px] leading-[1.45] text-[var(--muted)]">
              {installVisible
                ? 'Dann wirkt die Seite auf dem Handy wie eine eigene App.'
                : 'Auf dem iPhone: Teilen antippen und dann "Zum Home-Bildschirm".'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setInstallVisible(false)
              setIosHintVisible(false)
            }}
            className="shrink-0 rounded-full p-2 text-[var(--muted)]"
            aria-label="Hinweis schließen"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {installVisible && (
          <div className="mt-3 flex justify-end">
            <button type="button" onClick={handleInstall} className="btn-primary px-4 py-2 text-[13px]">
              Installieren
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
