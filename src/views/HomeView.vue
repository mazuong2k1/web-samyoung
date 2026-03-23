<script setup lang="ts">
import HomeShowcase from '../components/sections/HomeShowcase.vue'
import ProductBlocks from '../components/sections/ProductBlocks.vue'
import { productBlocks, quickTiles, sidebarCategories } from '../data/siteData'
</script>

<template>
  <div>
    <HomeShowcase :sidebar-categories="sidebarCategories" :quick-tiles="quickTiles" />
    <ProductBlocks :blocks="productBlocks" />
  </div>
</template>
