import type { ProductBlock } from '../types/product'

export const menuItems = [
  { label: 'TRANG CHỦ', path: '/' },
  { label: 'VỀ CHÚNG TÔI', path: '/ve-chung-toi' },
  { label: 'ĐỐI TÁC', path: '/doi-tac' },
  { label: 'TÀI LIỆU', path: '/tai-lieu' },
  { label: 'TIN TỨC', path: '/tin-tuc' },
  { label: 'LIÊN HỆ', path: '/lien-he' },
]

export const quickTiles = [
  {
    title: 'PHỤ KIỆN MÁY PHAY CNC',
    label: '8 nhóm sản phẩm',
    imageUrl: '/banner/quick-tile-phu-kien-may-cnc.jpg',
  },
  {
    title: 'DỤNG CỤ CẮT SAMYOUNG',
    label: 'Mũi phay, khoan, taro',
    imageUrl: '/banner/quick-tile-dung-cu-cat-samyoung.jpg',
  },
  {
    title: 'BẦU KẸP, COLLET JINYOUNG',
    label: 'Hàng chính hãng',
    imageUrl: '/banner/quick-tile-bau-kep-jinyoung.jpg',
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
  hotline: '098 5493875 — 096 1054936',
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
