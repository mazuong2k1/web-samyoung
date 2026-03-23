export { RTDB_BASE_URL } from './config'

export type {
  FirebaseCategoryPayload,
  FirebaseCategoryRow,
  FirebaseContactPayload,
  FirebaseContactRow,
  FirebaseCreateResponse,
  FirebaseProductPayload,
  FirebaseProductRow,
  FirebaseProductSpec,
  FirebaseRelatedProduct,
  FirebaseRootData,
  FirebaseCategoriesResponse,
  FirebaseContactsResponse,
  FirebaseProductsResponse,
} from './types'

export { testFirebaseRealtimeApi } from './root'

export {
  createFirebaseProduct,
  createFirebaseTestProduct,
  deleteFirebaseProduct,
  fetchFirebaseProducts,
  mergeProductPayload,
  updateFirebaseProduct,
} from './product'

export { createFirebaseContact, deleteFirebaseContact, fetchFirebaseContacts } from './contact'

export {
  createFirebaseCategory,
  deleteFirebaseCategory,
  fetchFirebaseCategories,
  updateFirebaseCategory,
} from './category'
