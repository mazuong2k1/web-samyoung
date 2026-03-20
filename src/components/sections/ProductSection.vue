<script setup lang="ts">
type Product = {
  name: string
  brand: string
}

defineProps<{
  featuredProducts: Product[]
}>()
</script>

<template>
  <section class="section section-muted">
    <div class="container">
      <div class="section-heading">
        <h2>Sản phẩm mới nhất</h2>
        <p>Danh sách sản phẩm mẫu để bạn thay bằng dữ liệu thực tế.</p>
      </div>

      <div class="product-grid">
        <article
          v-for="product in featuredProducts"
          :key="product.name"
          class="product-item"
        >
          <div class="thumb">{{ product.brand }}</div>
          <h3>{{ product.name }}</h3>
          <p>Giá: Liên hệ</p>
          <a href="#" class="card-link">Nhận Báo Giá</a>
        </article>
      </div>
    </div>
  </section>
</template>
