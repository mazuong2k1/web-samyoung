<script setup lang="ts">
import HomeShowcase from '../components/sections/HomeShowcase.vue'
import ProductBlocks from '../components/sections/ProductBlocks.vue'
import { useProductCatalog } from '../composables/useProductCatalog'
import { usePublicCategories } from '../composables/usePublicCategories'
import { quickTiles } from '../data/siteData'

const { productBlocks } = useProductCatalog()
const { displayCategories } = usePublicCategories()
</script>

<template>
  <div>
    <HomeShowcase :category-items="displayCategories" :quick-tiles="quickTiles" />
    <ProductBlocks :blocks="productBlocks" />
  </div>
</template>
