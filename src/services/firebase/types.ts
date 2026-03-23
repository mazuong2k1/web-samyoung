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
