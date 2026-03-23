<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailPage from '../components/sections/ProductDetailPage.vue'
import { useProductCatalog } from '../composables/useProductCatalog'
import { productDetail, toSlug } from '../data/siteData'
import { fetchFirebaseProducts } from '../services/firebaseApi'
import type { FirebaseProductRow } from '../services/firebaseApi'
import { mapFirebaseRowToProductDetail } from '../utils/mapFirebaseProductDetail'

const route = useRoute()
const { productBlocks } = useProductCatalog()
const firebaseProducts = ref<FirebaseProductRow[]>([])

const slug = computed(() => (route.params.slug as string) ?? '')

onMounted(() => {
  void (async () => {
    try {
      firebaseProducts.value = await fetchFirebaseProducts()
    } catch {
      firebaseProducts.value = []
    }
  })()
})

const matchesFirebaseSlug = (row: FirebaseProductRow, s: string) => {
  if (!s) return false
  if (row.slug?.trim() === s) return true
  if (row.href) {
    const h = row.href.replace(/^\//, '').replace(/^san-pham\//, '')
    if (h === s) return true
  }
  if (row.code && toSlug(row.code) === s) return true
  if (toSlug(row.name) === s) return true
  return false
}

const findItemBySlug = (s: string) => {
  const allItems = productBlocks.value.flatMap((block) => block.items)
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

  const fromApi = firebaseProducts.value.find((row) => matchesFirebaseSlug(row, s))
  if (fromApi) {
    return mapFirebaseRowToProductDetail(fromApi)
  }

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
