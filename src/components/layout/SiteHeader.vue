<script setup lang="ts">
type HeaderMenuItem = {
  label: string
  path: string
}

const props = defineProps<{
  menuItems: HeaderMenuItem[]
  currentPath: string
  logoUrl?: string
}>()

const emit = defineEmits<{
  (event: 'navigate', path: string): void
}>()

const normalizePath = (path: string) => {
  const cleaned = path.replace(/\/+$/, '')
  return cleaned === '' ? '/' : cleaned
}

const isActive = (path: string) => normalizePath(props.currentPath) === normalizePath(path)

const navigateTo = (path: string) => {
  emit('navigate', path)
}

const topPerks = [
  {
    label: 'MIỄN PHÍ GIAO HÀNG',
    iconUrl: '/icons/ship.png',
  },
  {
    label: 'HỖ TRỢ KHÁCH HÀNG 24/7',
    iconUrl: '/icons/support.png',
  },
  {
    label: 'HOÀN TRẢ TIỀN TRONG 3 NGÀY',
    iconUrl: '/icons/refund.png',
  },
  {
    label: 'GIẢM GIÁ THEO ĐƠN HÀNG',
    iconUrl: '/icons/sale.png',
  },
]
</script>

<template>
  <div class="utility-bar">
    <div class="container utility-inner">
      <span v-for="perk in topPerks" :key="perk.label" class="perk-item">
        <img class="perk-icon" :src="perk.iconUrl" alt="" />
        <span>{{ perk.label }}</span>
      </span>
    </div>
  </div>

  <header class="topbar">
    <div class="container topbar-inner">
      <a href="/" class="logo-wrap" aria-label="Samyoung" @click.prevent="navigateTo('/')">
        <img
          v-if="logoUrl"
          :src="logoUrl"
          alt="Samyoung logo"
          class="logo-image"
        />
        <template v-else>
          <span class="logo-main">SAM</span>
          <span class="logo-text">YOUNG</span>
        </template>
      </a>

      <div class="search-wrap">
        <select aria-label="Danh mục">
          <option>Tất cả</option>
        </select>
        <input type="text" placeholder="Tìm kiếm sản phẩm bạn mong muốn" />
        <button type="button" aria-label="Tìm kiếm">🔍</button>
      </div>

      <a href="#" class="cart-btn">Giỏ hàng (0)</a>
    </div>
  </header>

  <nav class="navbar">
    <div class="container nav-inner">
      <a href="/" class="nav-link nav-link-featured" @click.prevent="navigateTo('/')">
        ☰ DANH MỤC SẢN PHẨM
      </a>
      <a
        v-for="item in menuItems"
        :key="item.path"
        :href="item.path"
        class="nav-link"
        :class="{ 'nav-link-active': isActive(item.path) }"
        @click.prevent="navigateTo(item.path)"
      >
        {{ item.label }}
      </a>
    </div>
  </nav>
</template>
