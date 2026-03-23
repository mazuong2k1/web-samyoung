import { RTDB_BASE_URL } from './config'
import type {
  FirebaseCreateResponse,
  FirebaseProductPayload,
  FirebaseProductRow,
  FirebaseProductsResponse,
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

export const createFirebaseProduct = async (payload?: Partial<FirebaseProductPayload>) => {
  const now = new Date().toISOString()
  const response = await fetch(`${RTDB_BASE_URL}/product.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: payload?.name ?? 'Test Product',
      imageUrl: payload?.imageUrl ?? '/banner/product.jpeg',
      tags: payload?.tags ?? [],
      note: payload?.note ?? 'Created from admin test',
      tab: payload?.tab ?? '',
      href: payload?.href ?? '',
      blockTitle: payload?.blockTitle ?? '',
      createdAt: now,
      updatedAt: now,
    }),
  })

  if (!response.ok) {
    throw new Error(`Tạo product thất bại: ${response.status}`)
  }

  const data = (await response.json()) as FirebaseCreateResponse
  return { ...data, createdAt: now, updatedAt: now }
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
