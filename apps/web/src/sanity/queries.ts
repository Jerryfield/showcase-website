import { groq } from 'next-sanity'
console.log('✅ USING queries.ts from apps/web/src/sanity/queries.ts')

export const siteSettingsQuery = groq`
*[_type == "siteSettings"][0]{
  siteTitle,
   navigation[]{
    label,
    href
  },
  contactEmail,
  contactPhone,
  contactAddress,
  socialLinks
}
`
//  页面内容
export const pageBySlugQuery = groq`
*[_type == "page" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  body
}
`

//  品牌列表
export const brandsQuery = groq`
*[_type == "brand"]|order(name asc){
  _id,
  name,
  "slug": slug.current
}
`
//  产品列表
export const productsQuery = groq`
*[_type == "product"]|order(_createdAt desc){
  _id,
  name,
  "slug": slug.current,
  description,
  "brandName": brand->name,
  mainImage
}
`
//  根据 slug 获取单个产品详情
export const productBySlugQuery = groq`
*[_type == "product" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,
  description,
  "brandName": brand->name,
  mainImage
}
`
//  按品牌 slug 过滤产品（brandSlug 为空时返回全部）
export const productsByBrandSlugQuery = groq`
*[_type == "product" && (
  $brandSlug == "" || brand->slug.current == $brandSlug
)]|order(_createdAt desc){
  _id,
  name,
  "slug": slug.current,
  description,
  "brandName": brand->name,
  "brandSlug": brand->slug.current,
  mainImage
}
`
