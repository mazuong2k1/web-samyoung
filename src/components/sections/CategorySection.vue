<script setup lang="ts">
defineProps<{
  categories: string[]
}>()
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-heading">
        <h2>Danh mục nổi bật</h2>
        <p>Tổ chức theo nhóm sản phẩm để khách hàng dễ tìm kiếm.</p>
      </div>

      <div class="category-grid">
        <article v-for="item in categories" :key="item" class="card">
          <h3>{{ item }}</h3>
          <p>Giá: Liên hệ</p>
          <a href="#" class="card-link">Xem thêm</a>
        </article>
      </div>
    </div>
  </section>
</template>
