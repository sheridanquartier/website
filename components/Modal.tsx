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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-white rounded-[18px] border border-[#d2d2d7] shadow-sm w-full ${sizeClasses[size]} ${size === 'full' ? 'flex flex-col' : ''}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#d2d2d7]">
            <h2 className="text-[24px] font-medium mb-0 text-[#1d1d1f]">{title}</h2>
            <button
              onClick={onClose}
              className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors p-2 -mr-2"
              aria-label="Schließen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className={`p-6 ${size === 'full' ? 'flex-1 overflow-y-auto' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
