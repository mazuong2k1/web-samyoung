<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailPage from '../components/sections/ProductDetailPage.vue'
import { productBlocks, productDetail, toSlug } from '../data/siteData'

const route = useRoute()

const slug = computed(() => (route.params.slug as string) ?? '')

const findItemBySlug = (s: string) => {
  const allItems = productBlocks.flatMap((block) => block.items)
  return allItems.find((entry) => {
    if (entry.href) {
      const h = entry.href.replace(/^\//, '').replace(/^san-pham\//, '')
      return h === s
    }
    return toSlug(entry.name) === s
  })
}

const resolvedProduct = computed(() => {
  const s = slug.value
  if (!s) return productDetail
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
  }
})
</script>

<template>
  <ProductDetailPage :product="resolvedProduct" />
</template>
