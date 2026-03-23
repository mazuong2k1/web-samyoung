<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { toSlug } from '../../data/siteData'

defineProps<{
  items: { name: string; imageUrl: string }[]
  logoSrc?: string
  logoAlt?: string
}>()

const productHref = (name: string) => ({
  name: 'product-detail' as const,
  params: { slug: toSlug(name) },
})
</script>

<template>
  <aside class="about-sidebar" aria-label="Sản phẩm bán chạy">
    <div class="about-bestsell-head">SẢN PHẨM BÁN CHẠY</div>
    <ul class="about-bestsell-list">
      <li v-for="item in items" :key="item.name">
        <RouterLink :to="productHref(item.name)" class="about-bestsell-card about-bestsell-card--stacked">
          <div class="about-bestsell-card-body">
            <div class="about-bestsell-brand">
              <img
                :src="logoSrc ?? '/logo.jpg'"
                :alt="logoAlt ?? 'Samyoung Vina'"
                class="about-bestsell-logo"
              />
            </div>
            <div class="about-bestsell-thumb-wrap">
              <img :src="item.imageUrl" :alt="item.name" class="about-bestsell-thumb" />
            </div>
          </div>
          <div class="about-bestsell-titlebar">
            <h3 class="about-bestsell-name">{{ item.name }}</h3>
          </div>
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>
