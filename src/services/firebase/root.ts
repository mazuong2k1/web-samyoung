import { firebaseApp } from '../../lib/firebase'
import { RTDB_BASE_URL } from './config'
import type { FirebaseRootData } from './types'

export const testFirebaseRealtimeApi = async () => {
  if (!firebaseApp) {
    throw new Error('Firebase chưa được khởi tạo.')
  }

  const response = await fetch(`${RTDB_BASE_URL}/.json`)
  if (!response.ok) {
    throw new Error(`Realtime DB trả về lỗi: ${response.status}`)
  }

  const data = (await response.json()) as FirebaseRootData
  return data
}
