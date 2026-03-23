import type { ProductBlock } from '../types/product'

export const menuItems = [
  { label: 'TRANG CHỦ', path: '/' },
  { label: 'VỀ CHÚNG TÔI', path: '/ve-chung-toi' },
  { label: 'ĐỐI TÁC', path: '/doi-tac' },
  { label: 'TÀI LIỆU', path: '/tai-lieu' },
  { label: 'TIN TỨC', path: '/tin-tuc' },
  { label: 'LIÊN HỆ', path: '/lien-he' },
]

export const sidebarCategories = [
  'Dao phay CNC',
  'Chuôi kẹp BT30',
  'Chuôi kẹp BT40',
  'Chuôi kẹp BT50',
  'Chuôi kẹp HSK',
  'Ống kẹp côn (collet)',
  'Vít rút (đuôi chuột)',
  'Chíp phay CNC',
  'Cán + đầu phay (hợp kim + thép)',
  'Đồ gá zeropoint',
  'Đầu chuyển hướng',
]

export const quickTiles = [
  {
    title: 'PHỤ KIỆN MÁY PHAY CNC',
    label: '8 nhóm sản phẩm',
    imageUrl: '/banner/product.jpeg',
  },
  {
    title: 'DỤNG CỤ CẮT SAMYOUNG',
    label: 'Mũi phay, khoan, taro',
    imageUrl: '/banner/product.jpeg',
  },
  {
    title: 'BẦU KẸP, COLLET JINYOUNG',
    label: 'Hàng chính hãng',
    imageUrl: '/banner/product.jpeg',
  },
]

export const productBlocks: ProductBlock[] = []

export const productDetail = {
  name: 'Sản phẩm',
  code: '',
  brand: '',
  origin: '',
  status: '',
  views: '0',
  soldCount: 0,
  price: 'Liên hệ',
  rating: 0,
  ratingCount: 0,
  reviews: [],
  imageUrl: '/banner/product.jpeg',
  gallery: [],
  hotline: '0982 047 123',
  supportHours: '',
  features: [],
  specs: [],
  related: [],
}

/** Sidebar “Sản phẩm bán chạy” — chỉ dùng khi API chưa sẵn sàng */
export const bestSellingProducts: { name: string; imageUrl: string }[] = []

export const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
