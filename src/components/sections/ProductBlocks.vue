<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

type ProductItem = {
  name: string
  imageUrl: string
  price?: string
  soldCount?: number
  rating?: number
  tags?: string[]
  tab?: string
  href?: string
}

type ProductBlock = {
  title: string
  tabs?: string[]
  items: ProductItem[]
  autoSlide?: boolean
}

const props = defineProps<{
  blocks: ProductBlock[]
}>()

const router = useRouter()

const activeTabs = reactive<Record<string, string>>({})
const sliderRefs = reactive<Record<string, HTMLElement | null>>({})
const manualPauseUntil = reactive<Record<string, number>>({})

const getActiveTab = (block: ProductBlock) => activeTabs[block.title] ?? 'TẤT CẢ'

const setActiveTab = (block: ProductBlock, tab: string) => {
  activeTabs[block.title] = tab
}

const getVisibleItems = (block: ProductBlock) => {
  const activeTab = getActiveTab(block)
  if (activeTab === 'TẤT CẢ') {
    return block.items
  }
  return block.items.filter((item) => item.tab === activeTab)
}

const setSliderRef = (title: string, el: HTMLElement | null) => {
  sliderRefs[title] = el
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

/** Đường dẫn chuẩn: /san-pham/:slug (Vue Router) */
const getDetailPath = (item: ProductItem) => {
  if (item.href) {
    const h = item.href.replace(/^\//, '')
    if (h.startsWith('san-pham/')) return `/${h}`
    return `/san-pham/${h}`
  }
  return `/san-pham/${toSlug(item.name)}`
}

const handleNavigate = (item: ProductItem) => {
  void router.push(getDetailPath(item))
}

const badgeClass = (tag: string) => {
  const key = tag
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  if (key.includes('new') || key.includes('moi')) return 'is-new'
  if (key.includes('top') || key.includes('ban chay')) return 'is-top'
  if (key.includes('hot')) return 'is-hot'
  return 'is-default'
}

const displayTags = (block: ProductBlock, item: ProductItem) => {
  if (item.tags?.length) return item.tags
  const blockKey = block.title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  if (blockKey.includes('san pham moi nhat')) return ['NEW']
  return []
}

const displayPrice = (item: ProductItem) => {
  const value = item.price?.trim()
  return value || 'Liên hệ'
}

const displaySold = (item: ProductItem) => {
  const sold = typeof item.soldCount === 'number' && !Number.isNaN(item.soldCount) ? item.soldCount : 0
  return Math.max(0, sold)
}

const normalizeRating = (item: ProductItem) => {
  const rating = typeof item.rating === 'number' && !Number.isNaN(item.rating) ? item.rating : 0
  return Math.min(5, Math.max(0, rating))
}

const ratingStars = (item: ProductItem) => {
  const rating = normalizeRating(item)
  const full = Math.round(rating)
  return `${'★'.repeat(full)}${'☆'.repeat(5 - full)}`
}

const scrollSliderByCard = (title: string, direction: 'prev' | 'next') => {
  const sliderEl = sliderRefs[title]
  if (!sliderEl) return

  const firstCard = sliderEl.querySelector<HTMLElement>('.block-card')
  const cardWidth = firstCard?.offsetWidth ?? 260
  const step = cardWidth + 12
  const maxScroll = sliderEl.scrollWidth - sliderEl.clientWidth

  // Pause auto-slide briefly so click interaction feels responsive.
  manualPauseUntil[title] = Date.now() + 1200

  if (direction === 'prev') {
    if (sliderEl.scrollLeft <= 2) {
      sliderEl.scrollTo({ left: maxScroll, behavior: 'smooth' })
    } else {
      sliderEl.scrollBy({ left: -step, behavior: 'smooth' })
    }
    return
  }

  if (sliderEl.scrollLeft >= maxScroll - 2) {
    sliderEl.scrollTo({ left: 0, behavior: 'smooth' })
  } else {
    sliderEl.scrollBy({ left: step, behavior: 'smooth' })
  }
}

let frameId: number | null = null

const animate = () => {
  props.blocks
    .filter((block) => block.autoSlide)
    .forEach((block) => {
      const sliderEl = sliderRefs[block.title]
      if (!sliderEl) return
      if (Date.now() < (manualPauseUntil[block.title] ?? 0)) return

      const maxScroll = sliderEl.scrollWidth - sliderEl.clientWidth
      if (maxScroll <= 0) return

      sliderEl.scrollLeft += 0.9
      if (sliderEl.scrollLeft >= maxScroll) {
        sliderEl.scrollLeft = 0
      }
    })

  frameId = window.requestAnimationFrame(animate)
}

onMounted(() => {
  frameId = window.requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  if (frameId !== null) {
    window.cancelAnimationFrame(frameId)
  }
})
</script>

<template>
  <section class="product-blocks">
    <div class="container">
      <article v-for="block in blocks" :key="block.title" class="product-block">
        <header class="block-header">
          <h2>{{ block.title }}</h2>
          <div v-if="block.tabs?.length" class="block-tabs">
            <button
              type="button"
              class="block-tab-btn"
              :class="{ active: getActiveTab(block) === 'TẤT CẢ' }"
              @click="setActiveTab(block, 'TẤT CẢ')"
            >
              TẤT CẢ
            </button>
            <button
              v-for="tab in block.tabs"
              :key="tab"
              type="button"
              class="block-tab-btn"
              :class="{ active: getActiveTab(block) === tab }"
              @click="setActiveTab(block, tab)"
            >
              {{ tab }}
            </button>
          </div>
        </header>

        <div
          v-if="block.autoSlide"
          class="block-slider-wrap"
        >
          <button
            type="button"
            class="slider-arrow slider-arrow-prev"
            @click="scrollSliderByCard(block.title, 'prev')"
          >
            ‹
          </button>
          <div class="block-slider" :ref="(el) => setSliderRef(block.title, el as HTMLElement | null)">
            <article
              v-for="item in block.items"
              :key="item.name"
              class="block-card"
              :class="{ 'block-card-link': Boolean(item.href) }"
              @click="handleNavigate(item)"
            >
              <div v-if="displayTags(block, item).length" class="block-card-badges">
                <span
                  v-for="tag in displayTags(block, item)"
                  :key="`${item.name}-${tag}`"
                  class="block-badge"
                  :class="badgeClass(tag)"
                >
                  {{ tag }}
                </span>
              </div>
              <img :src="item.imageUrl" :alt="item.name" class="block-card-thumb" />
              <h3>{{ item.name }}</h3>
              <div class="block-card-meta">
                <span>Đã bán: {{ displaySold(item) }}</span>
                <span class="block-card-stars">{{ ratingStars(item) }} ({{ normalizeRating(item).toFixed(1) }})</span>
              </div>
              <p>Giá: {{ displayPrice(item) }}</p>
              <a href="#" class="quote-btn" @click.stop>Nhận Báo Giá</a>
            </article>
          </div>
          <button
            type="button"
            class="slider-arrow slider-arrow-next"
            @click="scrollSliderByCard(block.title, 'next')"
          >
            ›
          </button>
        </div>

        <div v-else class="block-grid">
          <article
            v-for="item in getVisibleItems(block)"
            :key="item.name"
            class="block-card"
            :class="{ 'block-card-link': Boolean(item.href) }"
            @click="handleNavigate(item)"
          >
            <div v-if="displayTags(block, item).length" class="block-card-badges">
              <span
                v-for="tag in displayTags(block, item)"
                :key="`${item.name}-${tag}`"
                class="block-badge"
                :class="badgeClass(tag)"
              >
                {{ tag }}
              </span>
            </div>
            <img :src="item.imageUrl" :alt="item.name" class="block-card-thumb" />
            <h3>{{ item.name }}</h3>
            <div class="block-card-meta">
              <span>Đã bán: {{ displaySold(item) }}</span>
              <span class="block-card-stars">{{ ratingStars(item) }} ({{ normalizeRating(item).toFixed(1) }})</span>
            </div>
            <p>Giá: {{ displayPrice(item) }}</p>
            <a href="#" class="quote-btn" @click.stop>Nhận Báo Giá</a>
          </article>
        </div>
      </article>
    </div>
  </section>
</template>
