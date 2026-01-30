import { notFound } from 'next/navigation'
import { client } from '@/src/sanity/client'
import { pageBySlugQuery, siteSettingsQuery } from '@/src/sanity/queries'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

type SiteSettings = {
  siteTitle?: string
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
  socialLinks?: { label?: string; url?: string }[]
}

type PageDoc = {
  title: string
  slug: string
  body?: any[]
}

function ContactBlock({ settings }: { settings: SiteSettings }) {
  const { contactEmail, contactPhone, contactAddress, socialLinks } = settings

  return (
    <section
      style={{
        marginTop: 14,
        padding: 14,
        border: '1px solid #eee',
        borderRadius: 12,
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 800 }}>Contact Info</h2>

      <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
        <div>
          <span style={{ opacity: 0.7 }}>Email: </span>
          {contactEmail ? (
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          ) : (
            <span>-</span>
          )}
        </div>

        <div>
          <span style={{ opacity: 0.7 }}>Phone: </span>
          {contactPhone ? <span>{contactPhone}</span> : <span>-</span>}
        </div>

        <div>
          <span style={{ opacity: 0.7 }}>Address: </span>
          {contactAddress ? (
            <div style={{ whiteSpace: 'pre-line' }}>{contactAddress}</div>
          ) : (
            <span>-</span>
          )}
        </div>

        {socialLinks?.length ? (
          <div>
            <span style={{ opacity: 0.7 }}>Social: </span>
            <div style={{ marginTop: 6, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {socialLinks
                .filter((s) => s?.url)
                .map((s, idx) => (
                  <a
                    key={`${s.url}-${idx}`}
                    href={s.url!}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: 'none',
                      padding: '6px 10px',
                      border: '1px solid #eee',
                      borderRadius: 999,
                    }}
                  >
                    {s.label ?? 'Link'}
                  </a>
                ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default async function GenericPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const safeSlug = decodeURIComponent(slug)

  // ✅ 同时取 page + siteSettings（Contact 会用到）
  const [page, settings] = await Promise.all([
    client.fetch<PageDoc | null>(pageBySlugQuery, { slug: safeSlug }),
    client.fetch<SiteSettings | null>(siteSettingsQuery),
  ])

  if (!page) return notFound()

  const isContact = safeSlug === 'contact'

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 30, fontWeight: 800 }}>{page.title}</h1>

      {/* ✅ 只有 /contact 才展示结构化联系方式 */}
      {isContact && settings ? <ContactBlock settings={settings} /> : null}

      <div style={{ marginTop: 14, lineHeight: 1.8 }}>
        <PortableText value={page.body ?? []} />
      </div>
    </main>
  )
}
