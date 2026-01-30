import Link from 'next/link'
import { client } from '@/src/sanity/client'
import { siteSettingsQuery } from '@/src/sanity/queries'

export const revalidate = 60

export default async function HomePage() {
  const settings = await client.fetch(siteSettingsQuery)

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        {settings?.siteTitle ?? 'Showcase Website'}
      </h1>

      <p style={{ marginTop: 8 }}>
        Contact: {settings?.contactEmail ?? '-'}
      </p>

      <div style={{ marginTop: 18 }}>
        <Link href="/products">Go to Products →</Link>
      </div>
    </main>
  )
}
