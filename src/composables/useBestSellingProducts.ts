import { computed, onMounted, ref } from 'vue'
import { fetchFirebaseProducts } from '../services/firebaseApi'
import type { FirebaseProductRow } from '../services/firebaseApi'

type BestSellingItem = {
  name: string
  imageUrl: string
}

const toBestSellingItem = (row: FirebaseProductRow): BestSellingItem => ({
  name: row.name?.trim() || 'Sản phẩm',
  imageUrl: row.imageUrl?.trim() || '/banner/product.jpeg',
})

export const useBestSellingProducts = () => {
  const rows = ref<FirebaseProductRow[]>([])
  const loading = ref(false)

  const load = async () => {
    loading.value = true
    try {
      rows.value = await fetchFirebaseProducts()
    } catch {
      rows.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void load()
  })

  const items = computed<BestSellingItem[]>(() => {
    const sorted = [...rows.value].sort((a, b) => {
      const soldA = typeof a.soldCount === 'number' ? a.soldCount : Number(a.soldCount) || 0
      const soldB = typeof b.soldCount === 'number' ? b.soldCount : Number(b.soldCount) || 0
      return soldB - soldA
    })
    return sorted.slice(0, 3).map(toBestSellingItem)
  })

  return {
    items,
    loading,
    reload: load,
  }
}
