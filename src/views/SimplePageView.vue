<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => (route.meta.title as string) ?? 'Trang')
</script>

<template>
  <section class="simple-page">
    <div class="container">
      <h1 class="simple-page-title">{{ title }}</h1>
      <p class="simple-page-text">Nội dung trang đang được cập nhật.</p>
    </div>
  </section>
</template>
