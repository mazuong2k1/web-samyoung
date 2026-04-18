<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppBreadcrumbs from '../layout/AppBreadcrumbs.vue'
import ProductHighlightContact from '../product/ProductHighlightContact.vue'
import { COMPANY_HOTLINE_DISPLAY, COMPANY_PHONES } from '../../data/companyPhones'

type ProductSpec = {
  label: string
  value: string
}

type RelatedProduct = {
  name: string
  imageUrl: string
  price?: string
  soldCount?: number
  rating?: number
  href?: string
}

type ProductReview = {
  fullName: string
  stars: number
  content: string
  createdAt: string
}

type ProductDetail = {
  id?: string
  name: string
  code: string
  brand: string
  origin: string
  status: string
  views: string
  soldCount?: number
  price: string
  rating?: number
  ratingCount?: number
  reviews?: ProductReview[]
  imageUrl: string
  gallery: string[]
  hotline: string
  supportHours: string
  features: string[]
  specs: ProductSpec[]
  related: RelatedProduct[]
  tax?: string
  unit?: string
  warranty?: string
  delivery?: string
  receipt?: string
  description?: string
}

const props = defineProps<{
  product: ProductDetail
}>()
const emit = defineEmits<{
  rate: [stars: number]
  submitReview: [payload: { fullName: string; stars: number; content: string }]
}>()

const activeTab = ref<'detail' | 'comment'>('detail')
const activeImage = ref(props.product.imageUrl ?? '')
const previewImage = ref(props.product.imageUrl ?? '')
const isPreviewOpen = ref(false)
const selectedRating = ref(0)
const reviewName = ref('')
const reviewContent = ref('')
const reviewStars = ref(0)
const hasText = (value?: string) => Boolean(value?.trim())
const fallbackRelatedImage = '/banner/product.jpeg'
const isProductLoading = computed(() => !hasText(props.product?.name))
const productImageList = computed(() => {
  const merged = [props.product.imageUrl ?? '', ...(props.product.gallery ?? [])].filter((image) =>
    Boolean(image?.trim()),
  )
  return [...new Set(merged)]
})
const dash = (v?: string) => (v && v.trim() ? v : '-')
const ratingOptions = [1, 2, 3, 4, 5] as const
const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
const normalizeDetailHref = (item: RelatedProduct) => {
  const raw = item.href?.trim()
  if (raw) {
    const normalized = raw.replace(/^\//, '')
    if (normalized.startsWith('san-pham/')) return `/${normalized}`
    return `/san-pham/${normalized}`
  }
  return `/san-pham/${toSlug(item.name)}`
}

const normalizeRating = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0
  return Math.min(5, Math.max(0, value))
}

const averageRating = computed(() => normalizeRating(props.product.rating))
const totalRatings = computed(() => Math.max(0, Number(props.product.ratingCount ?? 0)))
const ratingSummaryStars = computed(() => {
  const full = Math.round(averageRating.value)
  return `${'★'.repeat(full)}${'☆'.repeat(5 - full)}`
})
const formattedViews = computed(() => {
  const num = Number(props.product.views ?? 0)
  if (!Number.isFinite(num)) return '0'
  return new Intl.NumberFormat('vi-VN').format(Math.max(0, Math.floor(num)))
})
const recentReviews = computed(() => props.product.reviews ?? [])
const relatedProducts = computed(() =>
  (props.product.related ?? [])
    .filter((item) => hasText(item?.name))
    .map((item) => ({
      name: item.name.trim(),
      imageUrl: item.imageUrl?.trim() || props.product.imageUrl || fallbackRelatedImage,
      price: item.price?.trim() || 'Liên hệ',
      soldCount: typeof item.soldCount === 'number' ? Math.max(0, item.soldCount) : 0,
      rating: typeof item.rating === 'number' ? Math.min(5, Math.max(0, item.rating)) : 0,
      href: normalizeDetailHref(item),
    })),
)

const detailRows = computed(() => [
  { label: 'Mã sản phẩm', value: props.product.code },
  { label: 'Thương hiệu', value: props.product.brand },
  { label: 'Xuất xứ', value: props.product.origin },
  { label: 'Lượt bán', value: String(Math.max(0, Number(props.product.soldCount ?? 0))) },
  { label: 'Thuế', value: dash(props.product.tax) },
  { label: 'Đơn vị', value: dash(props.product.unit) },
  { label: 'Bảo hành', value: dash(props.product.warranty) },
  { label: 'Giao hàng', value: dash(props.product.delivery) },
  { label: 'Nhận hàng', value: dash(props.product.receipt) },
  { label: 'Tình trạng', value: props.product.status },
])

const isInStockStatus = (value: string) => {
  const v = value.trim().toLowerCase()
  return v === 'còn hàng' || v.startsWith('còn hàng')
}

const openPreview = (image: string) => {
  previewImage.value = image
  isPreviewOpen.value = true
}

const closePreview = () => {
  isPreviewOpen.value = false
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closePreview()
  }
}

const submitRating = () => {
  if (selectedRating.value < 1 || selectedRating.value > 5) return
  emit('rate', selectedRating.value)
  selectedRating.value = 0
}

const submitReview = () => {
  const stars = Math.min(5, Math.max(1, reviewStars.value))
  const content = reviewContent.value.trim()
  const fullName = reviewName.value.trim() || 'Khách hàng'
  if (!content) return
  emit('submitReview', { fullName, stars, content })
  reviewName.value = ''
  reviewContent.value = ''
  reviewStars.value = 0
}

watch(
  () => props.product.imageUrl,
  (nextImage) => {
    activeImage.value = nextImage ?? ''
    previewImage.value = nextImage ?? ''
    closePreview()
  },
)
watch(
  () => props.product.id,
  () => {
    selectedRating.value = 0
    reviewName.value = ''
    reviewContent.value = ''
    reviewStars.value = 0
  },
)

watch(isPreviewOpen, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <section class="product-detail-page">
    <div class="container">
      <AppBreadcrumbs
        class="product-detail-breadcrumbs"
        :items="[
          { label: 'Trang chủ', to: '/' },
          { label: 'Sản phẩm', to: '/' },
          { label: product.name || 'Đang tải...' },
        ]"
      />

      <div v-if="isProductLoading" class="detail-loading-state" role="status" aria-live="polite">
        Đang tải dữ liệu sản phẩm...
      </div>

      <article v-else class="detail-top">
        <div class="top-gallery">
          <img
            :src="activeImage"
            :alt="product.name"
            class="top-main-image top-main-image-zoomable"
            @click="activeImage && openPreview(activeImage)"
          />
          <div class="top-thumbs">
            <button
              v-for="(image, index) in productImageList"
              :key="`${image}-${index}`"
              type="button"
              class="top-thumb-btn"
              :class="{ active: activeImage === image }"
              @click="activeImage = image"
            >
              <img :src="image" :alt="`${product.name} ${index + 1}`" />
            </button>
          </div>

        </div>

        <div class="top-info">
          <h1>{{ product.name }}</h1>
          <p class="top-views">{{ formattedViews }} lượt xem</p>
          <p class="top-price">Giá: {{ product.price }}</p>
          <div class="top-rating-summary">
            <span class="top-rating-stars">{{ ratingSummaryStars }}</span>
            <strong>{{ averageRating.toFixed(1) }}/5</strong>
            <span>({{ totalRatings }} đánh giá)</span>
          </div>
          <div class="top-rating-actions">
            <div class="top-rate-picker">
              <button
                v-for="star in ratingOptions"
                :key="star"
                type="button"
                class="top-rate-star-btn"
                :class="{ active: star <= selectedRating }"
                :aria-label="`Đánh giá ${star} sao`"
                @click="selectedRating = star"
              >
                ★
              </button>
            </div>
            <button
              type="button"
              class="top-rate-submit-btn"
              :disabled="selectedRating === 0"
              @click="submitRating"
            >
              Gửi đánh giá
            </button>
          </div>

          <ul class="top-meta">
            <li v-for="row in detailRows" :key="row.label">
              <span>{{ row.label }}:</span>
              <strong
                class="top-meta-value"
                :class="{ 'top-meta-value--instock': row.label === 'Tình trạng' && isInStockStatus(row.value) }"
                >{{ row.value }}</strong
              >
            </li>
          </ul>

          <div class="top-actions">
            <a href="#" class="add-cart-btn">Thêm vào giỏ hàng</a>
          </div>
        </div>

        <aside class="top-benefits">
          <div class="benefit-item">
            <strong>Giao hàng nhanh chóng</strong>
            <span>Hướng dẫn mua hàng</span>
          </div>
          <div class="benefit-item">
            <strong>Sản phẩm chính hãng</strong>
            <span>Cam kết chất lượng</span>
          </div>
          <div class="benefit-item">
            <strong>Hotline mua hàng</strong>
            <span>{{ COMPANY_HOTLINE_DISPLAY }} ({{ product.supportHours }})</span>
          </div>
          <div class="benefit-contact">
            <h3>Tư vấn đặt hàng</h3>
            <p class="benefit-contact-phones">
              <template v-for="(p, i) in COMPANY_PHONES" :key="p.tel">
                <a :href="`tel:${p.tel}`">{{ p.display }}</a>
                <span v-if="i < COMPANY_PHONES.length - 1" class="benefit-contact-sep" aria-hidden="true"> · </span>
              </template>
            </p>
          </div>
        </aside>
      </article>

      <article class="detail-tabs-wrap">
        <div class="detail-tabs-head">
          <button type="button" :class="{ active: activeTab === 'detail' }" @click="activeTab = 'detail'">
            THÔNG TIN CHI TIẾT
          </button>
          <button type="button" :class="{ active: activeTab === 'comment' }" @click="activeTab = 'comment'">
            BÌNH LUẬN
          </button>
        </div>

        <div v-if="activeTab === 'detail'" class="detail-tabs-content">
          <h2>Thông Tin {{ product.name }}</h2>
          <div
            v-if="product.description"
            class="detail-description-text"
          >
            {{ product.description }}
          </div>
          <ProductHighlightContact />
          <div class="spec-list">
            <div v-for="spec in product.specs" :key="spec.label" class="spec-item">
              <span>{{ spec.label }}</span>
              <strong>{{ spec.value }}</strong>
            </div>
          </div>
        </div>

        <div v-else class="detail-tabs-content">
          <div class="review-form-wrap">
            <h3>Gửi đánh giá sản phẩm</h3>
            <div class="review-form-stars">
              <button
                v-for="star in ratingOptions"
                :key="`review-${star}`"
                type="button"
                class="top-rate-star-btn"
                :class="{ active: star <= reviewStars }"
                :aria-label="`Chọn ${star} sao`"
                @click="reviewStars = star"
              >
                ★
              </button>
            </div>
            <input v-model.trim="reviewName" class="review-input" type="text" placeholder="Tên của bạn" />
            <textarea
              v-model.trim="reviewContent"
              class="review-textarea"
              rows="4"
              placeholder="Nhập nội dung đánh giá..."
            />
            <button type="button" class="top-rate-submit-btn" :disabled="!reviewContent" @click="submitReview">
              Gửi đánh giá
            </button>
          </div>

          <div class="review-list">
            <article v-for="(review, idx) in recentReviews" :key="`${review.createdAt}-${idx}`" class="review-item">
              <header>
                <strong>{{ review.fullName }}</strong>
                <span class="block-card-stars">{{ '★'.repeat(review.stars) }}{{ '☆'.repeat(5 - review.stars) }}</span>
              </header>
              <p>{{ review.content }}</p>
            </article>
            <p v-if="recentReviews.length === 0">Chưa có đánh giá nào.</p>
          </div>
        </div>
      </article>

      <section class="related-showcase">
        <h2>SẢN PHẨM THƯỜNG ĐƯỢC XEM CÙNG</h2>
        <div v-if="relatedProducts.length" class="related-showcase-list">
          <a
            v-for="(related, index) in relatedProducts"
            :key="`${related.name}-${index}`"
            :href="related.href"
            class="block-card block-card-link related-showcase-card"
          >
            <img :src="related.imageUrl" :alt="related.name" class="block-card-thumb" />
            <h3>{{ related.name }}</h3>
            <div class="block-card-meta">
              <span>Đã bán: {{ related.soldCount }}</span>
              <span class="block-card-stars"
                >{{ '★'.repeat(Math.round(related.rating ?? 0)) }}{{ '☆'.repeat(5 - Math.round(related.rating ?? 0)) }}
                ({{ (related.rating ?? 0).toFixed(1) }})</span
              >
            </div>
            <p>Giá: {{ related.price }}</p>
            <span class="quote-btn">Nhận Báo Giá</span>
          </a>
        </div>
        <p v-else class="related-showcase-empty">Chưa có sản phẩm liên quan.</p>
      </section>
    </div>

    <div
      v-if="isPreviewOpen"
      class="product-image-lightbox"
      role="dialog"
      aria-modal="true"
      @click.self="closePreview"
    >
      <button type="button" class="lightbox-close-btn" aria-label="Đóng xem ảnh" @click="closePreview">
        ×
      </button>
      <img :src="previewImage" :alt="`${product.name} - ảnh lớn`" class="lightbox-image" />
    </div>
  </section>
</template>
