import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// Canonical site URL. Override per-environment with NEXT_PUBLIC_SITE_URL
// (e.g. the production domain) so relative OG image URLs resolve correctly.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://flow-experiments-lab.vercel.app'

const title = 'Flow Experiments Lab'
const description = 'A minimal space for builders and entrepreneurs. Experimentation, building, iteration.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  generator: 'v0.app',
  other: {
    'facebook-domain-verification': 'ga9o0e9eh74snhjyyu2dog51qtauh8',
  },
  openGraph: {
    title,
    description,
    type: 'website',
    url: siteUrl,
    siteName: title,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Flow Experiments Lab — a space for building and experimentation.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
