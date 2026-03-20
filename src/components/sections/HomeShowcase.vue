<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type QuickTile = {
  title: string
  label: string
  imageUrl: string
}

defineProps<{
  sidebarCategories: string[]
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
    <div class="floating-contact" aria-hidden="true">
      <a href="tel:0985493875" class="float-icon float-phone" aria-label="Gọi điện">
        <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
          <path
            d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2Z"
            fill="currentColor"
          />
        </svg>
      </a>

      <a
        href="https://zalo.me/0985493875"
        class="float-icon float-zalo"
        aria-label="Zalo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Zalo</span>
      </a>

      <a
        href="https://www.facebook.com/share/1EexnLvRh5/?mibextid=wwXIfr"
        class="float-icon float-messenger"
        aria-label="Facebook 1"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
          <path
            d="M12 2C6.48 2 2 6.15 2 11.26c0 2.9 1.44 5.49 3.69 7.18V22l3.3-1.82c.88.24 1.82.37 2.81.37 5.52 0 10-4.15 10-9.26S17.52 2 12 2Zm1.06 12.43-2.55-2.72-4.97 2.72 5.46-5.79 2.49 2.72 5.03-2.72-5.46 5.79Z"
            fill="currentColor"
          />
        </svg>
      </a>

      <a
        href="https://www.facebook.com/share/1LGj4X8hWB/?mibextid=wwXIfr"
        class="float-icon float-messenger float-messenger-second"
        aria-label="Facebook 2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
          <path
            d="M12 2C6.48 2 2 6.15 2 11.26c0 2.9 1.44 5.49 3.69 7.18V22l3.3-1.82c.88.24 1.82.37 2.81.37 5.52 0 10-4.15 10-9.26S17.52 2 12 2Zm1.06 12.43-2.55-2.72-4.97 2.72 5.46-5.79 2.49 2.72 5.03-2.72-5.46 5.79Z"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>

    <div class="container showcase-grid">
      <aside class="sidebar">
        <ul>
          <li v-for="item in sidebarCategories" :key="item">
            <a href="#">{{ item }}</a>
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
            <img :src="tile.imageUrl" :alt="tile.title" class="tile-thumb" />
            <h3>{{ tile.title }}</h3>
            <p>{{ tile.label }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
