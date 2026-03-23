<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppBreadcrumbs from '../components/layout/AppBreadcrumbs.vue'
</script>

<template>
  <section class="not-found">
    <div class="container not-found-wrap">
      <AppBreadcrumbs
        :items="[
          { label: 'Trang chủ', to: '/' },
          { label: 'Không tìm thấy trang' },
        ]"
      />
      <div class="not-found-inner">
      <p class="not-found-code">404</p>
      <h1>Không tìm thấy trang</h1>
      <p class="not-found-text">
        Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.
      </p>
      <RouterLink to="/" class="not-found-btn">Về trang chủ</RouterLink>
      </div>
    </div>
  </section>
</template>
