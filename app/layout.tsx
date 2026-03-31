import type { Metadata } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { verifyCookie } from '@/lib/auth/cookies'

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
})

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Sheridan Quartier',
  description: 'Drei Gemeinschaften im Sheridanpark. Eine ruhige, gemeinsame Plattform für Neuigkeiten, Orientierung und Alltag im Quartier.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Cookie serverseitig lesen (HttpOnly cookies können nicht von JS gelesen werden)
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('quartier_session')?.value
  const isLoggedIn = sessionToken ? Boolean(await verifyCookie(sessionToken)) : false

  return (
    <html lang="de">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        <Navigation isLoggedIn={isLoggedIn} />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
