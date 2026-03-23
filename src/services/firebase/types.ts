export type FirebaseRootData = Record<string, unknown> | null

export type FirebaseCreateResponse = { name: string }

export type FirebaseContactPayload = {
  fullName: string
  address?: string
  phone: string
  email?: string
  message: string
  createdAt?: string
  updatedAt?: string
}

export type FirebaseCategoryPayload = {
  name: string
  createdAt?: string
  updatedAt?: string
}

/** Thông số kỹ thuật (lưới label / value) */
export type FirebaseProductSpec = {
  label: string
  value: string
}

/** Sản phẩm gợi ý cuối trang chi tiết */
export type FirebaseRelatedProduct = {
  name: string
  imageUrl: string
}

export type FirebaseProductPayload = {
  name: string
  imageUrl: string
  tags?: number[]
  note?: string
  tab?: string
  href?: string
  blockTitle?: string
  createdAt?: string
  updatedAt?: string
  /** Slug URL: /san-pham/:slug */
  slug?: string
  code?: string
  /** Hiển thị khi không dùng "Liên hệ" */
  price?: string
  /** true = hiển thị "Liên hệ", false = dùng `price` */
  priceIsContact?: boolean
  views?: number
  brand?: string
  origin?: string
  tax?: string
  unit?: string
  warranty?: string
  delivery?: string
  receipt?: string
  stockStatus?: string
  gallery?: string[]
  description?: string
  features?: string[]
  specs?: FirebaseProductSpec[]
  hotline?: string
  supportHours?: string
  related?: FirebaseRelatedProduct[]
}

export type FirebaseProductRow = FirebaseProductPayload & {
  id: string
}

export type FirebaseContactRow = FirebaseContactPayload & {
  id: string
}

export type FirebaseCategoryRow = FirebaseCategoryPayload & {
  id: string
}

export type FirebaseProductsResponse = Record<string, FirebaseProductPayload> | null
export type FirebaseContactsResponse = Record<string, FirebaseContactPayload> | null
export type FirebaseCategoriesResponse = Record<string, FirebaseCategoryPayload> | null
