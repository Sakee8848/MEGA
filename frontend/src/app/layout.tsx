import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MEGA - Make Email Great Again',
  description: 'AI-Powered Insurance Brokerage OS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
