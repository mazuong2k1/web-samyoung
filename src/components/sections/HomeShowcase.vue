<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { toSlug } from '../../data/siteData'

type QuickTile = {
  title: string
  label: string
  imageUrl: string
}

export type ShowcaseCategoryItem = {
  id: string
  name: string
}

defineProps<{
  categoryItems: ShowcaseCategoryItem[]
  quickTiles: QuickTile[]
}>()

const bannerImages = ['/banner/banner.jpg']
const currentSlide = ref(0)

const currentBannerImage = computed(() => bannerImages[currentSlide.value])

const goToNext = () => {
  currentSlide.value = (currentSlide.value + 1) % bannerImages.length
}

const goToPrev = () => {
  currentSlide.value =
    (currentSlide.value - 1 + bannerImages.length) % bannerImages.length
}

let intervalId: number | null = null

onMounted(() => {
  intervalId = window.setInterval(goToNext, 3500)
})

onBeforeUnmount(() => {
  if (intervalId !== null) {
    window.clearInterval(intervalId)
  }
})
</script>

<template>
  <section class="showcase">
    <div class="container showcase-grid">
      <aside class="sidebar">
        <ul>
          <li v-for="item in categoryItems" :key="item.id">
            <RouterLink
              :to="{
                name: 'product-category',
                params: { slug: toSlug(item.name) },
                query: { label: item.name },
              }"
            >
              {{ item.name }}
            </RouterLink>
          </li>
        </ul>
      </aside>

      <div class="showcase-main">
        <article class="banner">
          <img :src="currentBannerImage" alt="Banner quảng cáo" class="banner-image" />
          <button type="button" class="banner-nav banner-prev" @click="goToPrev">‹</button>
          <button type="button" class="banner-nav banner-next" @click="goToNext">›</button>
        </article>

        <div class="tile-grid">
          <article v-for="tile in quickTiles" :key="tile.title" class="tile-item">
            <div class="tile-thumb-wrap">
              <img :src="tile.imageUrl" :alt="tile.title" class="tile-thumb" />
            </div>
            <div class="tile-content">
              <h3>{{ tile.title }}</h3>
              <p>{{ tile.label }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
