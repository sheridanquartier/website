'use client'

import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'full'
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    full: 'max-w-full mx-4 my-4 h-[calc(100vh-2rem)]'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-[var(--app-system-font)]">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-end justify-center p-0 md:items-center md:p-4">
        <div className={`relative flex w-full flex-col border border-[var(--app-ios-line)] bg-[#f9f9fb] shadow-[0_24px_80px_rgba(0,0,0,0.18)] ${sizeClasses[size]} rounded-t-[28px] md:rounded-[24px] ${size === 'full' ? 'h-[calc(100vh-1rem)] md:h-[calc(100vh-2rem)]' : 'max-h-[88svh] md:max-h-[calc(100vh-2rem)]'} ${size === 'full' ? 'md:flex-col' : ''}`}>
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-[var(--app-ios-line)] bg-[#f9f9fb]/90 px-4 pb-4 pt-3 backdrop-blur-xl md:px-6 md:py-5">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#d2d2d7] md:hidden" />
            <div className="flex items-center justify-between gap-4">
            <h2 className="mb-0 text-[20px] font-semibold text-[#1d1d1f] md:text-[24px]">{title}</h2>
            <button
              onClick={onClose}
              className="-mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#e5e5ea] text-[#6e6e73] transition-colors hover:text-[#1d1d1f]"
              aria-label="Schließen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            </div>
          </div>

          {/* Content */}
          <div className={`flex-1 overflow-y-auto px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4 md:px-6 md:pb-6 md:pt-5 ${size === 'full' ? 'flex-1' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
