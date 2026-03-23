<script setup lang="ts">
import { RouterLink } from 'vue-router'

export type BreadcrumbItem = {
  label: string
  /** Trang hiện tại: không truyền `to` */
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav class="app-breadcrumbs" aria-label="Breadcrumb">
    <ol class="app-breadcrumbs-list">
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`" class="app-breadcrumbs-item">
        <RouterLink v-if="item.to" :to="item.to" class="app-breadcrumbs-link">{{ item.label }}</RouterLink>
        <span v-else class="app-breadcrumbs-current">{{ item.label }}</span>
        <span v-if="index < items.length - 1" class="app-breadcrumbs-sep" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>
