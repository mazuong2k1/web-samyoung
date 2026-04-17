<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppBreadcrumbs from '../components/layout/AppBreadcrumbs.vue'
import ProductBlocks from '../components/sections/ProductBlocks.vue'
import { useProductCatalog } from '../composables/useProductCatalog'
import { toSlug } from '../data/siteData'
import type { ProductItem } from '../types/product'

const route = useRoute()
const { productBlocks } = useProductCatalog()

const categorySlug = computed(() => (route.params.slug as string) ?? '')
const searchQuery = computed(() => {
  const q = route.query.q
  return typeof q === 'string' ? q.trim() : ''
})
const categoryLabel = computed(() => {
  const fromQuery = route.query.label
  if (typeof fromQuery === 'string' && fromQuery.trim()) return fromQuery.trim()
  return categorySlug.value.replace(/-/g, ' ').toUpperCase()
})

const getDetailPath = (item: ProductItem) => {
  if (item.href) {
    const h = item.href.replace(/^\//, '')
    if (h.startsWith('san-pham/')) return `/${h}`
    return `/san-pham/${h}`
  }
  return `/san-pham/${toSlug(item.name)}`
}

const dedupeProducts = (items: ProductItem[]) => {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = item.id?.trim() || item.href?.trim() || toSlug(item.name)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const categoryMatchedItems = computed(() => {
  const slug = categorySlug.value
  if (!slug) return [] as ProductItem[]
  if (slug === 'tat-ca') {
    return dedupeProducts(
      productBlocks.value.flatMap((block) =>
        block.items.map((item) => ({
          ...item,
          href: getDetailPath(item),
        })),
      ),
    )
  }

  return dedupeProducts(
    productBlocks.value.flatMap((block) =>
      block.items
        .filter((item) => {
          const inTitle = toSlug(block.title).includes(slug)
          const inTab = toSlug(item.tab ?? '').includes(slug)
          const inName = toSlug(item.name).includes(slug)
          return inTitle || inTab || inName
        })
        .map((item) => ({
          ...item,
          href: getDetailPath(item),
        })),
    ),
  )
})

const filteredItems = computed(() => {
  const q = toSlug(searchQuery.value)
  if (!q) return categoryMatchedItems.value
  return categoryMatchedItems.value.filter((item) => {
    const inName = toSlug(item.name).includes(q)
    const inTab = toSlug(item.tab ?? '').includes(q)
    const inHref = toSlug(item.href ?? '').includes(q)
    return inName || inTab || inHref
  })
})

const categoryBlock = computed(() => [
  {
    title: searchQuery.value
      ? `KẾT QUẢ TÌM KIẾM: "${searchQuery.value}"`
      : `DANH MỤC: ${categoryLabel.value}`,
    items: filteredItems.value,
  },
])
</script>

<template>
  <section class="simple-page">
    <div class="container">
      <AppBreadcrumbs
        :items="[
          { label: 'Trang chủ', to: '/' },
          { label: 'Danh mục sản phẩm' },
          { label: categoryLabel },
        ]"
      />

      <h1 class="page-main-title">Sản phẩm: {{ categoryLabel }}</h1>

      <ProductBlocks v-if="filteredItems.length > 0" :blocks="categoryBlock" />
      <div v-else class="category-empty" role="status">
        <span class="category-empty-icon" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M8 7V5a4 4 0 0 1 8 0v2" />
            <rect x="3" y="7" width="18" height="14" rx="2" />
            <path d="M3 12h18" />
          </svg>
        </span>
        <p class="category-empty-text">Chưa có sản phẩm cho danh mục này.</p>
      </div>
    </div>
  </section>
</template>
