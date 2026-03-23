import { productDetail as defaultDetail } from '../data/siteData'
import type { FirebaseProductRow } from '../services/firebase/types'

/** Chuẩn hóa dữ liệu Firebase → props ProductDetailPage */
export function mapFirebaseRowToProductDetail(row: FirebaseProductRow) {
  const gallery =
    row.gallery && row.gallery.length > 0 ? row.gallery.filter(Boolean) : [row.imageUrl]
  const contact = row.priceIsContact !== false
  return {
    name: row.name,
    code: row.code ?? '',
    brand: row.brand ?? 'SAMYOUNG',
    origin: row.origin ?? 'Việt Nam',
    status: row.stockStatus ?? 'Còn hàng',
    views: String(row.views ?? 0),
    price: contact ? 'Liên hệ' : (row.price?.trim() || 'Liên hệ'),
    imageUrl: row.imageUrl,
    gallery,
    hotline: row.hotline ?? defaultDetail.hotline,
    supportHours: row.supportHours ?? defaultDetail.supportHours,
    features: row.features ?? [],
    specs: row.specs ?? [],
    related: row.related ?? [],
    tax: row.tax,
    unit: row.unit,
    warranty: row.warranty,
    delivery: row.delivery,
    receipt: row.receipt,
    description: row.description,
  }
}
