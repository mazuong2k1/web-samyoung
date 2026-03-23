<script setup lang="ts">
import type { NewsItem } from '../../types/news'

defineProps<{
  items: NewsItem[]
  /** Bài đầu có viền nổi bật (như mẫu tham khảo) */
  featuredFirst?: boolean
}>()
</script>

<template>
  <ul class="news-list">
    <li v-for="(item, index) in items" :key="item.id" class="news-list-item">
      <article
        class="news-card"
        :class="{ 'news-card--featured': featuredFirst && index === 0 }"
      >
        <div class="news-card-thumb-wrap">
          <img :src="item.imageUrl" :alt="item.title" class="news-card-thumb" loading="lazy" />
        </div>
        <div class="news-card-body">
          <h2 class="news-card-title">{{ item.title }}</h2>
          <p class="news-card-meta">
            <svg class="news-card-clock" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
              <path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <time :datetime="item.date.replace(/\./g, '-')">{{ item.date }}</time>
          </p>
          <p class="news-card-excerpt">{{ item.excerpt }}</p>
        </div>
      </article>
    </li>
  </ul>
</template>
