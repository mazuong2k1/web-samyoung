import { toSlug } from '../../data/siteData'
import { RTDB_BASE_URL } from './config'
import type {
  FirebaseCreateResponse,
  FirebaseProductPayload,
  FirebaseProductRow,
  FirebaseProductSpec,
  FirebaseProductsResponse,
  FirebaseProductReview,
  FirebaseRelatedProduct,
} from './types'

export const fetchFirebaseProducts = async () => {
  const response = await fetch(`${RTDB_BASE_URL}/product.json`)
  if (!response.ok) {
    throw new Error(`Không thể tải product: ${response.status}`)
  }

  const data = (await response.json()) as FirebaseProductsResponse
  if (!data) return [] as FirebaseProductRow[]

  return Object.entries(data).map(([id, value]) => ({
    id,
    ...value,
  }))
}

/** Gộp payload đầy đủ khi POST (dùng lại từ admin nếu cần đồng bộ state). */
export function mergeProductPayload(payload?: Partial<FirebaseProductPayload>): FirebaseProductPayload {
  const p = payload ?? {}
  const now = new Date().toISOString()
  const name = p.name?.trim() || 'Sản phẩm'
  const slugRaw = p.slug?.trim()
  const codeRaw = p.code?.trim()
  const slug = slugRaw || toSlug(codeRaw || name)
  const href =
    p.href?.trim() ||
    (slug ? `san-pham/${slug}` : '')

  return {
    name,
    imageUrl: p.imageUrl?.trim() || '/banner/product.jpeg',
    tags: Array.isArray(p.tags) ? p.tags : [],
    note: p.note ?? '',
    tab: p.tab ?? '',
    href,
    blockTitle: p.blockTitle ?? '',
    slug,
    code: codeRaw ?? '',
    price: p.price?.trim() ?? 'Liên hệ',
    priceIsContact: p.priceIsContact !== false,
    soldCount:
      typeof p.soldCount === 'number' && !Number.isNaN(p.soldCount) ? Math.max(0, p.soldCount) : 0,
    rating:
      typeof p.rating === 'number' && !Number.isNaN(p.rating)
        ? Math.min(5, Math.max(0, Number(p.rating.toFixed(1))))
        : 0,
    ratingCount:
      typeof p.ratingCount === 'number' && !Number.isNaN(p.ratingCount) ? Math.max(0, p.ratingCount) : 0,
    views: typeof p.views === 'number' && !Number.isNaN(p.views) ? p.views : Number(p.views) || 0,
    brand: p.brand?.trim() || 'SAMYOUNG',
    origin: p.origin?.trim() || 'Việt Nam',
    tax: p.tax?.trim() ?? '',
    unit: p.unit?.trim() ?? '',
    warranty: p.warranty?.trim() ?? '',
    delivery: p.delivery?.trim() ?? '',
    receipt: p.receipt?.trim() ?? '',
    stockStatus: p.stockStatus?.trim() || 'Còn hàng',
    gallery: Array.isArray(p.gallery) ? p.gallery.filter(Boolean) : [],
    description: p.description ?? '',
    features: Array.isArray(p.features) ? p.features.filter(Boolean) : [],
    specs: Array.isArray(p.specs)
      ? (p.specs as FirebaseProductSpec[]).filter((s) => s.label?.trim() || s.value?.trim())
      : [],
    hotline: p.hotline?.trim() || '098 5493875 — 096 1054936',
    supportHours: p.supportHours?.trim() ?? '',
    related: Array.isArray(p.related)
      ? (p.related as FirebaseRelatedProduct[]).filter((r) => r.name?.trim())
      : [],
    reviews: Array.isArray(p.reviews)
      ? (p.reviews as FirebaseProductReview[]).filter((r) => r.content?.trim() && r.stars)
      : [],
    createdAt: now,
    updatedAt: now,
  }
}

export const createFirebaseProduct = async (payload?: Partial<FirebaseProductPayload>) => {
  const merged = mergeProductPayload(payload)
  const response = await fetch(`${RTDB_BASE_URL}/product.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(merged),
  })

  if (!response.ok) {
    throw new Error(`Tạo product thất bại: ${response.status}`)
  }

  const data = (await response.json()) as FirebaseCreateResponse
  return {
    ...data,
    createdAt: merged.createdAt,
    updatedAt: merged.updatedAt,
  }
}

export const updateFirebaseProduct = async (id: string, payload: Partial<FirebaseProductPayload>) => {
  const response = await fetch(`${RTDB_BASE_URL}/product/${id}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      updatedAt: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    throw new Error(`Cập nhật product thất bại: ${response.status}`)
  }
}

export const deleteFirebaseProduct = async (id: string) => {
  const response = await fetch(`${RTDB_BASE_URL}/product/${id}.json`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Xóa product thất bại: ${response.status}`)
  }
}

/** Giữ tên cũ để tương thích các chỗ đã import. */
export const createFirebaseTestProduct = createFirebaseProduct
