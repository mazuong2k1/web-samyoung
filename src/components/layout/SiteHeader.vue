<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { sidebarCategories, toSlug } from '../../data/siteData'

type MenuItem = {
  label: string
  path: string
}

const { menuItems, logoUrl } = defineProps<{
  menuItems: MenuItem[]
  logoUrl?: string
}>()
const router = useRouter()
const route = useRoute()

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

const isCategoryOpen = ref(false)

const openCategoryMenu = () => {
  isCategoryOpen.value = true
}

const closeCategoryMenu = () => {
  isCategoryOpen.value = false
}

const toggleCategoryMenu = () => {
  isCategoryOpen.value = !isCategoryOpen.value
}

const searchKeyword = ref('')

const runSearch = () => {
  const q = searchKeyword.value.trim()
  void router.push({
    name: 'product-category',
    params: { slug: 'tat-ca' },
    query: {
      label: 'TẤT CẢ SẢN PHẨM',
      ...(q ? { q } : {}),
    },
  })
}

watch(
  () => route.query.q,
  (q) => {
    searchKeyword.value = typeof q === 'string' ? q : ''
  },
  { immediate: true },
)
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
      <RouterLink to="/" class="logo-wrap" aria-label="Samyoung">
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
      </RouterLink>

      <div class="search-wrap">
        <select aria-label="Danh mục">
          <option>Tất cả</option>
        </select>
        <input
          v-model.trim="searchKeyword"
          type="text"
          placeholder="Tìm kiếm sản phẩm bạn mong muốn"
          @keydown.enter="runSearch"
        />
        <button type="button" aria-label="Tìm kiếm" @click="runSearch">🔍</button>
      </div>

      <a href="#" class="cart-btn">Giỏ hàng (0)</a>
    </div>
  </header>

  <nav class="navbar">
    <div class="container nav-inner">
      <div
        class="nav-category-wrap"
        @mouseenter="openCategoryMenu"
        @mouseleave="closeCategoryMenu"
      >
        <button
          type="button"
          class="nav-link nav-link-featured nav-category-trigger"
          :aria-expanded="isCategoryOpen"
          @click="toggleCategoryMenu"
        >
          ☰ DANH MỤC SẢN PHẨM
        </button>
        <ul v-show="isCategoryOpen" class="nav-category-dropdown">
          <li>
            <RouterLink
              :to="{ name: 'product-category', params: { slug: 'tat-ca' }, query: { label: 'TẤT CẢ SẢN PHẨM' } }"
              class="nav-category-item"
              @click="closeCategoryMenu"
            >
              TẤT CẢ SẢN PHẨM
            </RouterLink>
          </li>
          <li v-for="item in sidebarCategories" :key="item">
            <RouterLink
              :to="{ name: 'product-category', params: { slug: toSlug(item) }, query: { label: item } }"
              class="nav-category-item"
              @click="closeCategoryMenu"
            >
              {{ item }}
            </RouterLink>
          </li>
        </ul>
      </div>
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-link"
        active-class="nav-link-active"
      >
        {{ item.label }}
      </RouterLink>
    </div>
  </nav>
</template>
