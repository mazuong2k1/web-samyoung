<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import SiteFooter from './components/layout/SiteFooter.vue'
import SiteHeader from './components/layout/SiteHeader.vue'
import HomeShowcase from './components/sections/HomeShowcase.vue'
import ProductBlocks from './components/sections/ProductBlocks.vue'
import ProductDetailPage from './components/sections/ProductDetailPage.vue'

// TODO: thay bằng logo trả về từ API.
const logoUrl = '/logo.jpg'

const menuItems = [
  { label: 'TRANG CHỦ', path: '/' },
  { label: 'VỀ CHÚNG TÔI', path: '/ve-chung-toi' },
  { label: 'ĐỐI TÁC', path: '/doi-tac' },
  { label: 'TÀI LIỆU', path: '/tai-lieu' },
  { label: 'TIN TỨC', path: '/tin-tuc' },
  { label: 'LIÊN HỆ', path: '/lien-he' },
]

const sidebarCategories = [
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

const quickTiles = [
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

const productBlocks = [
  {
    title: 'SẢN PHẨM MỚI NHẤT',
    autoSlide: true,
    items: [
      { name: 'Bộ Căn Song Song GP-08', imageUrl: '/banner/product.jpeg' },
      { name: 'Đầu Dò Cảm Biến Vị Trí Sản Phẩm', imageUrl: '/banner/product.jpeg' },
      { name: 'Khối Gá Kẹp Điện Cực EDM', imageUrl: '/banner/product.jpeg' },
      { name: 'Collet Chuẩn SK', imageUrl: '/banner/product.jpeg' },
      { name: 'Chuôi Kẹp BT30 ER32', imageUrl: '/banner/product.jpeg' },
      { name: 'Chuôi Kẹp BT40 ER32', imageUrl: '/banner/product.jpeg' },
      { name: 'Chuôi Kẹp BT50 ER40', imageUrl: '/banner/product.jpeg' },
      { name: 'Ống Kẹp Côn ER32', imageUrl: '/banner/product.jpeg' },
      { name: 'Vít Rút BT40', imageUrl: '/banner/product.jpeg' },
      { name: 'Dao Phay Ngón 4 Me', imageUrl: '/banner/product.jpeg' },
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
      { name: 'Mũi Taro Xoắn', imageUrl: '/banner/product.jpeg', tab: 'MŨI TARO' },
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

const productDetail = {
  name: 'Mũi Vát Mép Centering (2CEN)',
  code: '2CEN',
  brand: 'SAMYOUNG',
  origin: 'Việt Nam',
  status: 'Còn hàng',
  views: '3652',
  price: 'Liên hệ',
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

const DETAIL_PATH = '/mui-vat-mep-centering-2cen'
const currentPath = ref('/')

const normalizePath = (path: string) => {
  const cleaned = path.replace(/\/+$/, '')
  return cleaned === '' ? '/' : cleaned
}

const syncPath = () => {
  currentPath.value = normalizePath(window.location.pathname)
}

const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const navigate = (path: string) => {
  const target = normalizePath(path)
  if (target === currentPath.value) return
  window.history.pushState({}, '', target)
  currentPath.value = target
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const currentSlug = computed(() => {
  if (currentPath.value === DETAIL_PATH) return 'mui-vat-mep-centering-2cen'
  const match = currentPath.value.match(/^\/san-pham\/([^/]+)$/)
  return match?.[1] ?? ''
})

const fallbackDetailBySlug = computed(() => {
  if (!currentSlug.value) return null

  const allItems = productBlocks.flatMap((block) => block.items)
  const item = allItems.find((entry) => toSlug(entry.name) === currentSlug.value)
  if (!item) return null

  return {
    ...productDetail,
    name: item.name,
    imageUrl: item.imageUrl,
    gallery: [item.imageUrl, item.imageUrl, item.imageUrl],
    code: currentSlug.value.toUpperCase(),
  }
})

const currentDetail = computed(() => fallbackDetailBySlug.value ?? productDetail)

const isDetailPage = computed(() => Boolean(currentSlug.value))

onMounted(() => {
  syncPath()
  window.addEventListener('popstate', syncPath)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncPath)
})
</script>

<template>
  <div class="site-shell">
    <SiteHeader
      :menu-items="menuItems"
      :current-path="currentPath"
      :logo-url="logoUrl"
      @navigate="navigate"
    />

    <main>
      <template v-if="isDetailPage">
        <ProductDetailPage :product="currentDetail" @navigate="navigate" />
      </template>
      <template v-else>
        <HomeShowcase :sidebar-categories="sidebarCategories" :quick-tiles="quickTiles" />
        <ProductBlocks :blocks="productBlocks" @navigate="navigate" />
      </template>
    </main>

    <SiteFooter />
  </div>
</template>
