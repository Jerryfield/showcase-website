import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/src/sanity/client'
import { urlFor } from '@/src/sanity/image'
import { brandsQuery, productsByBrandSlugQuery } from '@/src/sanity/queries'

export const revalidate = 60

type Brand = {
  _id: string
  name: string
  slug: string
}

type ProductListItem = {
  _id: string
  name: string
  slug: string
  description?: string
  brandName?: string
  brandSlug?: string
  mainImage?: any
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>
}) {
  // ✅ Next 16.1.x：searchParams 也是 Promise
  const { brand } = await searchParams
  const brandSlug = decodeURIComponent(brand ?? '')

  const [brands, products] = await Promise.all([
    client.fetch<Brand[]>(brandsQuery),
    client.fetch<ProductListItem[]>(productsByBrandSlugQuery, { brandSlug }),
  ])

  return (
    <main style={{ padding: 24, maxWidth: 980, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Products</h1>

        {/* 筛选器：用链接实现（服务端组件最稳） */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link
            href="/products"
            style={{
              textDecoration: 'none',
              padding: '6px 10px',
              border: '1px solid #eee',
              borderRadius: 999,
              background: brandSlug === '' ? '#f5f5f5' : 'white',
            }}
          >
            All
          </Link>

          {brands.map((b) => (
            <Link
              key={b._id}
              href={`/products?brand=${encodeURIComponent(b.slug)}`}
              style={{
                textDecoration: 'none',
                padding: '6px 10px',
                border: '1px solid #eee',
                borderRadius: 999,
                background: brandSlug === b.slug ? '#f5f5f5' : 'white',
              }}
            >
              {b.name}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, opacity: 0.7 }}>
        {brandSlug
          ? `Filtered by brand: ${brands.find((b) => b.slug === brandSlug)?.name ?? brandSlug}`
          : `Showing all products`}
      </div>

      <ul style={{ marginTop: 16, display: 'grid', gap: 14 }}>
        {products.map((p) => (
          <li key={p._id}>
            <Link
              href={`/products/${p.slug}`}
              style={{
                display: 'block',
                border: '1px solid #eee',
                borderRadius: 12,
                padding: 14,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {p.mainImage ? (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 9',
                    borderRadius: 10,
                    overflow: 'hidden',
                    background: '#f5f5f5',
                    marginBottom: 10,
                  }}
                >
                  <Image
                    src={urlFor(p.mainImage).width(1200).height(675).url()}
                    alt={p.name}
                    fill
                    sizes="(max-width: 980px) 100vw, 980px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ) : null}

              <div style={{ fontWeight: 800, fontSize: 18 }}>{p.name}</div>

              <div style={{ marginTop: 6, opacity: 0.8 }}>
                {p.brandName ? `Brand: ${p.brandName}` : 'Brand: -'}
              </div>

              {p.description ? (
                <p style={{ marginTop: 8, opacity: 0.9 }}>{p.description}</p>
              ) : null}

              <div style={{ marginTop: 10, opacity: 0.6, fontSize: 12 }}>
                /products/{p.slug}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
