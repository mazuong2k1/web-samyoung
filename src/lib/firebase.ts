import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'

export const firebaseConfig = {
  apiKey: 'AIzaSyDz0wBRZdgOLJS6-ReAKtaQY4oiYdvD8mo',
  authDomain: 'web-samyo.firebaseapp.com',
  projectId: 'web-samyo',
  storageBucket: 'web-samyo.firebasestorage.app',
  messagingSenderId: '16046067388',
  appId: '1:16046067388:web:ccf2cc05bf7cde2ca80ab9',
  measurementId: 'G-ZB4JZPHRWE',
}

export const firebaseApp = initializeApp(firebaseConfig)

// Analytics chỉ chạy ở client/browser có hỗ trợ.
export const initFirebaseAnalytics = async () => {
  if (typeof window === 'undefined') return null
  const supported = await isSupported()
  if (!supported) return null
  return getAnalytics(firebaseApp)
}
