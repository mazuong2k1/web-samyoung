import { RTDB_BASE_URL } from './config'
import type {
  FirebaseCategoriesResponse,
  FirebaseCategoryRow,
  FirebaseCreateResponse,
} from './types'

export const fetchFirebaseCategories = async () => {
  const response = await fetch(`${RTDB_BASE_URL}/category.json`)
  if (!response.ok) {
    throw new Error(`Không thể tải category: ${response.status}`)
  }

  const data = (await response.json()) as FirebaseCategoriesResponse
  if (!data) return [] as FirebaseCategoryRow[]

  return Object.entries(data).map(([id, value]) => ({
    id,
    ...value,
  }))
}

export const createFirebaseCategory = async (name: string) => {
  const now = new Date().toISOString()
  const response = await fetch(`${RTDB_BASE_URL}/category.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.trim(),
      createdAt: now,
      updatedAt: now,
    }),
  })
  if (!response.ok) {
    throw new Error(`Tạo category thất bại: ${response.status}`)
  }

  const data = (await response.json()) as FirebaseCreateResponse
  return { ...data, createdAt: now, updatedAt: now }
}

export const updateFirebaseCategory = async (id: string, name: string) => {
  const response = await fetch(`${RTDB_BASE_URL}/category/${id}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.trim(),
      updatedAt: new Date().toISOString(),
    }),
  })
  if (!response.ok) {
    throw new Error(`Cập nhật category thất bại: ${response.status}`)
  }
}

export const deleteFirebaseCategory = async (id: string) => {
  const response = await fetch(`${RTDB_BASE_URL}/category/${id}.json`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Xóa category thất bại: ${response.status}`)
  }
}
