'use client'

import { useEffect, useMemo, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const INSTALL_HINT_DISMISSED_KEY = 'quartier-install-hint-dismissed'

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
    const registerServiceWorker = () => {
      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch((error) => {
        console.error('Service worker registration failed:', error)
      })
    }

    if ('serviceWorker' in navigator) {
      if (document.readyState === 'complete') {
        registerServiceWorker()
      } else {
        window.addEventListener('load', registerServiceWorker, { once: true })
      }
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

    let iosHintTimer: ReturnType<typeof setTimeout> | undefined
    if (
      !isStandaloneMode() &&
      isIosSafari &&
      window.localStorage.getItem(INSTALL_HINT_DISMISSED_KEY) !== 'true'
    ) {
      iosHintTimer = setTimeout(() => setIosHintVisible(true), 1600)
    }

    return () => {
      window.removeEventListener('load', registerServiceWorker)
      mediaQuery.removeEventListener('change', onMediaChange)
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
      if (iosHintTimer) clearTimeout(iosHintTimer)
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

  const dismissHint = () => {
    setInstallVisible(false)
    setIosHintVisible(false)
    window.localStorage.setItem(INSTALL_HINT_DISMISSED_KEY, 'true')
  }

  if ((!installVisible && !iosHintVisible) || isStandaloneMode()) {
    return null
  }

  return (
    <div className="md:hidden fixed left-4 right-4 z-[75] bottom-[calc(5.6rem+env(safe-area-inset-bottom))]">
      <div className="rounded-[24px] border border-white/50 bg-[rgba(251,251,247,0.96)] px-4 py-4 shadow-[0_20px_48px_rgba(22,57,47,0.2)] backdrop-blur-[20px]">
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
              dismissHint()
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
