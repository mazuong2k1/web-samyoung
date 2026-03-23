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

export const productBlocks: ProductBlock[] = [
  {
    title: 'SẢN PHẨM MỚI NHẤT',
    autoSlide: true,
    items: [
      { name: 'Bộ Căn Song Song GP-08', imageUrl: '/banner/product.jpeg', tags: ['NEW'] },
      { name: 'Đầu Dò Cảm Biến Vị Trí Sản Phẩm', imageUrl: '/banner/product.jpeg' },
      { name: 'Khối Gá Kẹp Điện Cực EDM', imageUrl: '/banner/product.jpeg' },
      { name: 'Collet Chuẩn SK', imageUrl: '/banner/product.jpeg' },
      { name: 'Chuôi Kẹp BT30 ER32', imageUrl: '/banner/product.jpeg', tags: ['TOP BÁN CHẠY'] },
      { name: 'Chuôi Kẹp BT40 ER32', imageUrl: '/banner/product.jpeg' },
      { name: 'Chuôi Kẹp BT50 ER40', imageUrl: '/banner/product.jpeg' },
      { name: 'Ống Kẹp Côn ER32', imageUrl: '/banner/product.jpeg' },
      { name: 'Vít Rút BT40', imageUrl: '/banner/product.jpeg' },
      { name: 'Dao Phay Ngón 4 Me', imageUrl: '/banner/product.jpeg', tags: ['HOT'] },
      { name: 'Chíp Phay APMT1135', imageUrl: '/banner/product.jpeg' },
      { name: 'Đầu Chuyển Hướng 90 Độ', imageUrl: '/banner/product.jpeg' },
    ],
  },
  {
    title: 'PHỤ KIỆN MÁY PHAY CNC',
    tabs: [
      'Ê TÔ',
      'BỘ CĂN SONG SONG',
      'MÂM CẶP',
      'BÀN XOAY CHIA ĐỘ',
      'ĐẦU CHIA ĐỘ',
      'CHỐNG TÂM',
      'LẮC TÂM',
      'XÉT Z',
    ],
    items: [
      {
        name: 'Bộ Căn Song Song GP-08',
        imageUrl: '/banner/product.jpeg',
        tab: 'BỘ CĂN SONG SONG',
      },
      { name: 'Mâm Cặp Cơ 3 Chấu', imageUrl: '/banner/product.jpeg', tab: 'MÂM CẶP' },
      { name: 'Xét Z - NZH', imageUrl: '/banner/product.jpeg', tab: 'XÉT Z' },
      {
        name: 'Ê Tô Cường Lực Chính Xác MC',
        imageUrl: '/banner/product.jpeg',
        tab: 'Ê TÔ',
      },
      { name: 'Ê Tô Thủy Lực HP', imageUrl: '/banner/product.jpeg', tab: 'Ê TÔ' },
      { name: 'Ê Tô Máy Phay Độ Mở Lớn', imageUrl: '/banner/product.jpeg', tab: 'Ê TÔ' },
      {
        name: 'Đầu Chia Độ Vạn Năng',
        imageUrl: '/banner/product.jpeg',
        tab: 'ĐẦU CHIA ĐỘ',
      },
      {
        name: 'Bộ Gá Kẹp 52 Chi Tiết',
        imageUrl: '/banner/product.jpeg',
        tab: 'BÀN XOAY CHIA ĐỘ',
      },
    ],
  },
  {
    title: 'DỤNG CỤ CẮT CNC - SAMYOUNG',
    tabs: [
      'MŨI PHAY THÉP DƯỚI 50HRC',
      'MŨI PHAY THÉP DƯỚI 65HRC',
      'MŨI PHAY NHÔM, NHỰA, ĐỒNG',
      'MŨI KHOAN',
      'MŨI VÁT MÉP',
      'MŨI TARO',
    ],
    items: [
      {
        name: 'Mũi Khoan Hợp Kim',
        imageUrl: '/banner/product.jpeg',
        tab: 'MŨI KHOAN',
      },
      { name: 'Mũi Taro Xoắn', imageUrl: '/banner/product.jpeg', tab: 'MŨI TARO', tags: ['TOP BÁN CHẠY'] },
      {
        name: 'Mũi Vát Mép Centering (2CEN)',
        imageUrl: '/banner/product.jpeg',
        tab: 'MŨI VÁT MÉP',
        href: '/mui-vat-mep-centering-2cen',
      },
      {
        name: 'Mũi Dao Phay Trụ Inox (SUE204)',
        imageUrl: '/banner/product.jpeg',
        tab: 'MŨI PHAY THÉP DƯỚI 50HRC',
      },
    ],
  },
]

export const productDetail = {
  name: 'Mũi Vát Mép Centering (2CEN)',
  code: '2CEN',
  brand: 'SAMYOUNG',
  origin: 'Việt Nam',
  status: 'Còn hàng',
  views: '3652',
  soldCount: 128,
  price: 'Liên hệ',
  rating: 4.8,
  ratingCount: 12,
  reviews: [
    {
      fullName: 'Khách hàng CNC',
      stars: 5,
      content: 'Sản phẩm dùng ổn định, giao hàng nhanh.',
      createdAt: new Date().toISOString(),
    },
  ],
  imageUrl: '/banner/product.jpeg',
  gallery: ['/banner/product.jpeg', '/banner/product.jpeg', '/banner/product.jpeg'],
  hotline: '0982 047 123',
  supportHours: '8h - 21h (T2-T7), Chủ Nhật đến 17h',
  features: [
    'Dùng để vát góc, tường bên và căn giữa chi tiết trong một mũi dao.',
    'Lớp phủ tối ưu cho thép, inox, nhôm, đồng và các vật liệu phi kim.',
    'Độ bền cao, giảm bavia, chất lượng mép cắt ổn định cho gia công CNC.',
  ],
  specs: [
    { label: 'Góc vát', value: '60° / 90° (tuỳ mã)' },
    { label: 'Vật liệu gia công', value: 'Thép, inox, gang, nhôm, đồng' },
    { label: 'Kiểu chuôi', value: 'Chuôi thẳng hợp kim' },
    { label: 'Ứng dụng', value: 'Vát mép, lấy tâm, chuẩn bị lỗ khoan' },
  ],
  related: [
    { name: 'Mũi Vát Mép NC Spotting (2SPOC)', imageUrl: '/banner/product.jpeg' },
    { name: 'Mũi Vát Bo Cung R (2CRC)', imageUrl: '/banner/product.jpeg' },
    { name: 'Mũi Khoan Hợp Kim', imageUrl: '/banner/product.jpeg' },
  ],
}

/** Sidebar “Sản phẩm bán chạy” — dùng chung About / Đối tác */
export const bestSellingProducts = [
  { name: 'Mũi Taro Xoắn', imageUrl: '/banner/product.jpeg' },
  { name: 'Mũi Dao Phay Trụ 4 Me Cắt (GE714)', imageUrl: '/banner/product.jpeg' },
  { name: 'Mũi Dao Phay Cổ Dài 4Me Bo R (WER314)', imageUrl: '/banner/product.jpeg' },
]

export const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
