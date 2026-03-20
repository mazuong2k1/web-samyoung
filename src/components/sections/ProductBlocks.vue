<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive } from 'vue'

type ProductItem = {
  name: string
  imageUrl: string
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
const emit = defineEmits<{
  (event: 'navigate', path: string): void
}>()

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

const getDetailPath = (item: ProductItem) => {
  if (item.href) return item.href
  return `/san-pham/${toSlug(item.name)}`
}

const handleNavigate = (item: ProductItem) => {
  emit('navigate', getDetailPath(item))
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
              <img :src="item.imageUrl" :alt="item.name" class="block-card-thumb" />
              <h3>{{ item.name }}</h3>
              <p>Giá: Liên hệ</p>
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
            <img :src="item.imageUrl" :alt="item.name" class="block-card-thumb" />
            <h3>{{ item.name }}</h3>
            <p>Giá: Liên hệ</p>
            <a href="#" class="quote-btn" @click.stop>Nhận Báo Giá</a>
          </article>
        </div>
      </article>
    </div>
  </section>
</template>
