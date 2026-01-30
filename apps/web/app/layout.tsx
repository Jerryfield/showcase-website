import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import { Header } from './_components/Header'
import { client } from '@/src/sanity/client'
import { siteSettingsQuery } from '@/src/sanity/queries'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Showcase Website',
  description: 'Product showcase website',
}

// ⭐ layout 是 Server Component，可以 async
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ⭐ 从 Sanity 读取全站设置（含 navigation）
  const settings = await client.fetch(siteSettingsQuery)

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header
          siteTitle={settings?.siteTitle}
          navigation={settings?.navigation}
        />
        {children}
      </body>
    </html>
  )
}
