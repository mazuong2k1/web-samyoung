import { RTDB_BASE_URL } from './config'
import type {
  FirebaseContactPayload,
  FirebaseContactRow,
  FirebaseContactsResponse,
  FirebaseCreateResponse,
} from './types'

export const createFirebaseContact = async (payload: FirebaseContactPayload) => {
  const now = new Date().toISOString()
  const response = await fetch(`${RTDB_BASE_URL}/contact.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      createdAt: now,
      updatedAt: now,
    }),
  })
  if (!response.ok) {
    throw new Error(`Gửi contact thất bại: ${response.status}`)
  }

  const data = (await response.json()) as FirebaseCreateResponse
  return data
}

export const fetchFirebaseContacts = async () => {
  const response = await fetch(`${RTDB_BASE_URL}/contact.json`)
  if (!response.ok) {
    throw new Error(`Không thể tải contact: ${response.status}`)
  }

  const data = (await response.json()) as FirebaseContactsResponse
  if (!data) return [] as FirebaseContactRow[]

  return Object.entries(data).map(([id, value]) => ({
    id,
    ...value,
  }))
}

export const deleteFirebaseContact = async (id: string) => {
  const response = await fetch(`${RTDB_BASE_URL}/contact/${id}.json`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Xóa contact thất bại: ${response.status}`)
  }
}
