import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { asset } from '@/lib/asset'
import './globals.css'

// NEXT_PUBLIC_PREVIEW=1 задаётся только при сборке предпросмотра (/preview/).
const isPreview = process.env.NEXT_PUBLIC_PREVIEW === '1'

export const metadata: Metadata = {
  title: 'Кампания Медины — BINOM School',
  description: 'Голос каждого — будущее всех. Кампания Медины за школьные изменения.',
  generator: 'v0.app',
  ...(isPreview && { robots: { index: false, follow: false } }),
  icons: {
    icon: [
      {
        url: asset('/icon-light-32x32.png'),
        media: '(prefers-color-scheme: light)',
      },
      {
        url: asset('/icon-dark-32x32.png'),
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: asset('/icon.svg'),
        type: 'image/svg+xml',
      },
    ],
    apple: asset('/apple-icon.png'),
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
        {isPreview && <div className="preview-badge" role="note">ПРЕДПРОСМОТР · ещё не опубликовано</div>}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
