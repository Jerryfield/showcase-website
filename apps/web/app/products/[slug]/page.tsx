import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/src/sanity/client'
import { productBySlugQuery } from '@/src/sanity/queries'
import Image from 'next/image'
import { urlFor } from '@/src/sanity/image'


export const revalidate = 60

type ProductDetail = {
  _id: string
  name: string
  slug: string
  description?: string
  brandName?: string
  mainImage?: string
}

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>
}) {
  // ✅ Next.js 16.1.4: params 是 Promise，需要 await
  const { slug } = await props.params

  // ✅ 如果 slug 有编码（中文/空格），解一下更稳
  const safeSlug = decodeURIComponent(slug)

  const product = await client.fetch<ProductDetail | null>(productBySlugQuery, {
    slug: safeSlug,
  })

  if (!product) return notFound()

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Link href="/products" style={{ textDecoration: 'none' }}>
        ← Back to Products
      </Link>

            {product.mainImage ? (
        <div
          style={{
            marginTop: 14,
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 12,
            overflow: 'hidden',
            background: '#f5f5f5',
          }}
        >
          <Image
            src={urlFor(product.mainImage).width(1600).height(900).url()}
            alt={product.name}
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      ) : null}


      <h1 style={{ marginTop: 14, fontSize: 30, fontWeight: 800 }}>
        {product.name}
      </h1>

      <div style={{ marginTop: 8, opacity: 0.8 }}>
        {product.brandName ? `Brand: ${product.brandName}` : 'Brand: -'}
      </div>

      {product.description ? (
        <p style={{ marginTop: 14, lineHeight: 1.6 }}>{product.description}</p>
      ) : (
        <p style={{ marginTop: 14, opacity: 0.7 }}>No description.</p>
      )}

      <div style={{ marginTop: 16, opacity: 0.6, fontSize: 12 }}>
        slug: {product.slug}
      </div>
    </main>
  )
}
