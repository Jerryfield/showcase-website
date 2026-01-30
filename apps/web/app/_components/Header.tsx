import Link from 'next/link'

type NavItem = {
  label: string
  href: string
}

export function Header({
  siteTitle,
  navigation,
}: {
  siteTitle?: string
  navigation?: NavItem[]
}) {
  const nav = navigation?.length
    ? navigation
    : [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ]

  return (
    <header
      style={{
        borderBottom: '1px solid #eee',
        padding: '14px 24px',
        position: 'sticky',
        top: 0,
        background: 'white',
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <Link href="/" style={{ fontWeight: 800, textDecoration: 'none' }}>
          {siteTitle ?? 'Showcase'}
        </Link>

        <nav style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {nav.map((item) => {
            const isExternal = /^https?:\/\//.test(item.href)

            return isExternal ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none', opacity: 0.9 }}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: 'none', opacity: 0.9 }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
