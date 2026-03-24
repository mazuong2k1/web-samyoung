<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import ProductDetailPage from '../components/sections/ProductDetailPage.vue'
import { useProductCatalog } from '../composables/useProductCatalog'
import { productDetail, toSlug } from '../data/siteData'
import { fetchFirebaseProducts, updateFirebaseProduct } from '../services/firebaseApi'
import type { FirebaseProductRow } from '../services/firebaseApi'
import { mapFirebaseRowToProductDetail } from '../utils/mapFirebaseProductDetail'

const route = useRoute()
const { productBlocks } = useProductCatalog()
const firebaseProducts = ref<FirebaseProductRow[]>([])

const slug = computed(() => (route.params.slug as string) ?? '')

onMounted(() => {
  void (async () => {
    try {
      firebaseProducts.value = await fetchFirebaseProducts()
    } catch {
      firebaseProducts.value = []
    }
  })()
})

const matchesFirebaseSlug = (row: FirebaseProductRow, s: string) => {
  if (!s) return false
  if (row.slug?.trim() === s) return true
  if (row.href) {
    const h = row.href.replace(/^\//, '').replace(/^san-pham\//, '')
    if (h === s) return true
  }
  if (row.code && toSlug(row.code) === s) return true
  if (toSlug(row.name) === s) return true
  return false
}

const findItemBySlug = (s: string) => {
  const allItems = productBlocks.value.flatMap((block) => block.items)
  return allItems.find((entry) => {
    if (entry.href) {
      const h = entry.href.replace(/^\//, '').replace(/^san-pham\//, '')
      return h === s
    }
    return toSlug(entry.name) === s
  })
}

const currentFirebaseProduct = computed(() => {
  const s = slug.value
  if (!s) return null
  return firebaseProducts.value.find((row) => matchesFirebaseSlug(row, s)) ?? null
})

const buildAutoRelatedProducts = (row: FirebaseProductRow) => {
  const sameCategory = firebaseProducts.value
    .filter((candidate) => candidate.id !== row.id)
    .filter((candidate) => {
      const sameTab = row.tab?.trim() && candidate.tab?.trim() === row.tab?.trim()
      const sameBlock =
        row.blockTitle?.trim() && candidate.blockTitle?.trim() === row.blockTitle?.trim()
      return Boolean(sameTab || sameBlock)
    })
    .slice(0, 8)

  return sameCategory.map((item) => ({
    name: item.name?.trim() || 'Sản phẩm',
    imageUrl: item.imageUrl?.trim() || '/banner/product.jpeg',
    price: item.priceIsContact === false ? (item.price?.trim() || 'Liên hệ') : 'Liên hệ',
    soldCount: typeof item.soldCount === 'number' ? Math.max(0, item.soldCount) : 0,
    rating: typeof item.rating === 'number' ? Math.min(5, Math.max(0, item.rating)) : 0,
    href: item.href?.trim() || item.slug?.trim() || '',
  }))
}

const calcNextRatingState = (currentRating: number, currentCount: number, stars: number) => {
  const safeCurrentRating = Number.isFinite(currentRating) ? Math.min(5, Math.max(0, currentRating)) : 0
  const safeCurrentCount = Number.isFinite(currentCount) ? Math.max(0, Math.floor(currentCount)) : 0
  const safeStars = Math.min(5, Math.max(1, Math.round(stars)))
  const nextCount = safeCurrentCount + 1
  const nextRating = Number((((safeCurrentRating * safeCurrentCount) + safeStars) / nextCount).toFixed(1))
  return { nextRating, nextCount }
}

const onRate = async (stars: number) => {
  const row = currentFirebaseProduct.value
  if (!row?.id) {
    void message.info('Chỉ có thể đánh giá sản phẩm lấy từ API.')
    return
  }

  const { nextRating, nextCount } = calcNextRatingState(row.rating ?? 0, row.ratingCount ?? 0, stars)
  const idx = firebaseProducts.value.findIndex((x) => x.id === row.id)
  const prev = idx >= 0 ? { ...firebaseProducts.value[idx] } : null
  if (idx >= 0) {
    firebaseProducts.value[idx] = {
      ...firebaseProducts.value[idx],
      rating: nextRating,
      ratingCount: nextCount,
    }
  }

  try {
    await updateFirebaseProduct(row.id, { rating: nextRating, ratingCount: nextCount })
    void message.success('Cảm ơn bạn đã gửi đánh giá!')
  } catch {
    if (idx >= 0 && prev) {
      firebaseProducts.value[idx] = prev
    }
    void message.error('Gửi đánh giá thất bại, vui lòng thử lại.')
  }
}

const onSubmitReview = async (payload: { fullName: string; stars: number; content: string }) => {
  const row = currentFirebaseProduct.value
  if (!row?.id) {
    void message.info('Chỉ có thể gửi đánh giá cho sản phẩm lấy từ API.')
    return
  }

  const review = {
    fullName: payload.fullName.trim() || 'Khách hàng',
    stars: Math.min(5, Math.max(1, Math.round(payload.stars))),
    content: payload.content.trim(),
    createdAt: new Date().toISOString(),
  }
  if (!review.content) return

  const currentReviews = Array.isArray(row.reviews) ? row.reviews : []
  const nextReviews = [review, ...currentReviews].slice(0, 30)
  const { nextRating, nextCount } = calcNextRatingState(row.rating ?? 0, row.ratingCount ?? 0, review.stars)

  const idx = firebaseProducts.value.findIndex((x) => x.id === row.id)
  const prev = idx >= 0 ? { ...firebaseProducts.value[idx] } : null
  if (idx >= 0) {
    firebaseProducts.value[idx] = {
      ...firebaseProducts.value[idx],
      reviews: nextReviews,
      rating: nextRating,
      ratingCount: nextCount,
    }
  }

  try {
    await updateFirebaseProduct(row.id, {
      reviews: nextReviews,
      rating: nextRating,
      ratingCount: nextCount,
    })
    void message.success('Đã gửi đánh giá của bạn.')
  } catch {
    if (idx >= 0 && prev) {
      firebaseProducts.value[idx] = prev
    }
    void message.error('Gửi đánh giá thất bại, vui lòng thử lại.')
  }
}

const resolvedProduct = computed(() => {
  const s = slug.value
  if (!s) return productDetail

  const fromApi = firebaseProducts.value.find((row) => matchesFirebaseSlug(row, s))
  if (fromApi) {
    const mapped = mapFirebaseRowToProductDetail(fromApi)
    if (mapped.related.length > 0) return mapped
    return {
      ...mapped,
      related: buildAutoRelatedProducts(fromApi),
    }
  }

  if (s === 'mui-vat-mep-centering-2cen') return productDetail
  const item = findItemBySlug(s)
  if (!item) {
    return {
      ...productDetail,
      name: 'Sản phẩm',
      code: s.toUpperCase(),
    }
  }
  return {
    ...productDetail,
    name: item.name,
    imageUrl: item.imageUrl,
    gallery: [item.imageUrl, item.imageUrl, item.imageUrl],
    code: s.toUpperCase(),
    soldCount: typeof item.soldCount === 'number' ? item.soldCount : 0,
  }
})
</script>

<template>
  <ProductDetailPage :product="resolvedProduct" @rate="onRate" @submit-review="onSubmitReview" />
</template>
