import { computed, onMounted, ref } from 'vue'
import { sidebarCategories as sidebarCategoriesFallback } from '../data/siteData'
import { fetchFirebaseCategories } from '../services/firebaseApi'
import type { FirebaseCategoryRow } from '../services/firebaseApi'

export type PublicCategoryItem = {
  id: string
  name: string
}

/**
 * Danh mục sidebar trang chủ: ưu tiên API `category`, lỗi/rỗng thì dùng static trong siteData.
 */
export function usePublicCategories() {
  const rows = ref<FirebaseCategoryRow[]>([])
  const loading = ref(false)
  const loadFailed = ref(false)

  const load = async () => {
    loading.value = true
    loadFailed.value = false
    try {
      const data = await fetchFirebaseCategories()
      rows.value = [...data].sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    } catch {
      loadFailed.value = true
      rows.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void load()
  })

  const displayCategories = computed<PublicCategoryItem[]>(() => {
    if (rows.value.length > 0) {
      return rows.value.map((c) => ({ id: c.id, name: c.name }))
    }
    return sidebarCategoriesFallback.map((name, i) => ({
      id: `fallback-${i}`,
      name,
    }))
  })

  return {
    displayCategories,
    loading,
    loadFailed,
    reload: load,
  }
}
