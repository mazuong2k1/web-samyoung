<script setup lang="ts">
import { ref } from 'vue'
import AppBreadcrumbs from '../components/layout/AppBreadcrumbs.vue'
import NewsList from '../components/sections/NewsList.vue'
import BestSellingSidebar from '../components/sections/BestSellingSidebar.vue'
import { newsSeed } from '../data/news'
import { bestSellingProducts } from '../data/siteData'
import type { NewsItem } from '../types/news'

/** Sau có API: articles.value = await fetch(...).then(r => r.json()) */
const articles = ref<NewsItem[]>(newsSeed)
</script>

<template>
  <section class="news-page">
    <div class="container">
      <AppBreadcrumbs
        :items="[
          { label: 'Trang chủ', to: '/' },
          { label: 'Tin tức' },
        ]"
      />

      <h1 class="page-main-title">Tin tức</h1>

      <div class="about-layout">
        <div class="news-main">
          <NewsList :items="articles" :featured-first="true" />
        </div>

        <BestSellingSidebar :items="bestSellingProducts" />
      </div>
    </div>
  </section>
</template>
