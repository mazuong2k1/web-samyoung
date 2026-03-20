export type ProductItem = {
  name: string
  imageUrl: string
  tab?: string
  href?: string
}

export type ProductBlock = {
  title: string
  tabs?: string[]
  items: ProductItem[]
  autoSlide?: boolean
}

export type ProductSpec = {
  label: string
  value: string
}

export type RelatedProduct = {
  name: string
  imageUrl: string
}

export type ProductDetail = {
  slug: string
  name: string
  code: string
  brand: string
  origin: string
  status: string
  views: string
  price: string
  imageUrl: string
  gallery: string[]
  hotline: string
  supportHours: string
  features: string[]
  specs: ProductSpec[]
  related: RelatedProduct[]
}
