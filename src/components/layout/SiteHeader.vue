<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { toSlug } from '../../data/siteData'
import { fetchFirebaseCategories } from '../../services/firebaseApi'

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
const CATEGORY_CACHE_KEY = 'samyoung.publicCategories.v1'

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
const sidebarCategories = ref<string[]>([])

const parseCachedCategories = (raw: string | null) => {
  if (!raw) return [] as string[]
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return [] as string[]
    return parsed
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .map((item) => item.trim())
  } catch {
    return [] as string[]
  }
}

const loadSidebarCategories = async () => {
  const cached = parseCachedCategories(localStorage.getItem(CATEGORY_CACHE_KEY))
  if (cached.length > 0) {
    sidebarCategories.value = cached
    return
  }

  try {
    const categories = await fetchFirebaseCategories()
    const names = categories
      .map((category) => category.name?.trim())
      .filter((name): name is string => Boolean(name))
      .sort((a, b) => a.localeCompare(b, 'vi'))

    if (names.length > 0) {
      sidebarCategories.value = names
      localStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify(names))
      return
    }
  } catch {
    sidebarCategories.value = []
  }
}

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

onMounted(() => {
  void loadSidebarCategories()
})
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
