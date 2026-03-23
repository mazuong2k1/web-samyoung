<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

type ProductSpec = {
  label: string
  value: string
}

type RelatedProduct = {
  name: string
  imageUrl: string
}

type ProductDetail = {
  name: string
  code: string
  brand: string
  origin: string
  status: string
  views: string
  price: string
  imageUrl: string
  gallery: string[]
  hotline: string
  supportHours: string
  features: string[]
  specs: ProductSpec[]
  related: RelatedProduct[]
}

const props = defineProps<{
  product: ProductDetail
}>()

const router = useRouter()

const goHome = () => {
  void router.push({ name: 'home' })
}

const activeTab = ref<'detail' | 'comment'>('detail')
const activeImage = ref(props.product.imageUrl)
const productImageList = computed(() => [props.product.imageUrl, ...props.product.gallery])
const detailRows = computed(() => [
  { label: 'Mã sản phẩm', value: props.product.code },
  { label: 'Thương hiệu', value: props.product.brand },
  { label: 'Xuất xứ', value: props.product.origin },
  { label: 'Thuế', value: '-' },
  { label: 'Đơn vị', value: '-' },
  { label: 'Bảo hành', value: '-' },
  { label: 'Giao hàng', value: '-' },
  { label: 'Nhận hàng', value: '-' },
  { label: 'Tình trạng', value: props.product.status },
])
</script>

<template>
  <section class="product-detail-page">
    <div class="container">
      <nav class="detail-path">
        <button type="button" @click="goHome">Trang chủ</button>
        <span class="sep">/</span>
        <span>Dụng Cụ Cắt CNC - SAMYOUNG</span>
        <span class="sep">/</span>
        <span>Mũi Vát Mép</span>
      </nav>

      <article class="detail-top">
        <div class="top-gallery">
          <img :src="activeImage" :alt="product.name" class="top-main-image" />
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
          <p class="top-views">{{ product.views }} lượt xem</p>
          <p class="top-price">Giá: {{ product.price }}</p>

          <ul class="top-meta">
            <li v-for="row in detailRows" :key="row.label">
              <span>{{ row.label }}:</span>
              <strong>{{ row.value }}</strong>
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
            <span>{{ product.hotline }} ({{ product.supportHours }})</span>
          </div>
          <div class="benefit-contact">
            <h3>Tư vấn đặt hàng</h3>
            <a :href="`tel:${product.hotline.replaceAll(' ', '')}`">{{ product.hotline }}</a>
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
          <ul>
            <li v-for="feature in product.features" :key="feature">{{ feature }}</li>
          </ul>
          <div class="spec-list">
            <div v-for="spec in product.specs" :key="spec.label" class="spec-item">
              <span>{{ spec.label }}</span>
              <strong>{{ spec.value }}</strong>
            </div>
          </div>
        </div>

        <div v-else class="detail-tabs-content">
          <p>Chưa có bình luận. Hãy để lại thông tin, đội ngũ kỹ thuật sẽ liên hệ tư vấn sớm nhất.</p>
        </div>
      </article>
    </div>
  </section>
</template>
