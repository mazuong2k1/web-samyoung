import { computed, ref, watch } from 'vue'
import { productBlocks as seedProductBlocks } from '../data/siteData'
import type { ProductBlock, ProductItem } from '../types/product'

const STORAGE_KEY = 'samyoung:product-blocks:v1'

const genId = () => `p_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`

const cloneSeed = (): ProductBlock[] =>
  seedProductBlocks.map((block) => ({
    ...block,
    items: block.items.map((item) => ({ ...item })),
    tabs: block.tabs ? [...block.tabs] : undefined,
  }))

const normalizeBlocks = (blocks: ProductBlock[]): ProductBlock[] =>
  blocks.map((block) => ({
    ...block,
    tabs: block.tabs ? [...block.tabs] : undefined,
    items: block.items.map((item) => ({
      ...item,
      id: item.id ?? genId(),
    })),
  }))

const safeLoad = (): ProductBlock[] => {
  if (typeof window === 'undefined') return normalizeBlocks(cloneSeed())

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return normalizeBlocks(cloneSeed())

  try {
    const parsed = JSON.parse(raw) as ProductBlock[]
    if (!Array.isArray(parsed)) return normalizeBlocks(cloneSeed())
    return normalizeBlocks(parsed)
  } catch {
    return normalizeBlocks(cloneSeed())
  }
}

const productBlocks = ref<ProductBlock[]>(safeLoad())
let watching = false

const saveToStorage = () => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productBlocks.value))
}

export type AdminProductRow = ProductItem & {
  id: string
  blockTitle: string
}

export const useProductCatalog = () => {
  if (!watching) {
    watch(productBlocks, saveToStorage, { deep: true })
    watching = true
  }

  const allRows = computed<AdminProductRow[]>(() =>
    productBlocks.value.flatMap((block) =>
      block.items.map((item) => ({
        ...item,
        id: item.id ?? genId(),
        blockTitle: block.title,
      })),
    ),
  )

  const blockTitles = computed(() => productBlocks.value.map((block) => block.title))

  const dashboard = computed(() => {
    const totalBlocks = productBlocks.value.length
    const totalProducts = allRows.value.length
    const withTabs = allRows.value.filter((item) => Boolean(item.tab)).length

    return {
      totalBlocks,
      totalProducts,
      withTabs,
    }
  })

  const addProduct = (payload: {
    blockTitle: string
    name: string
    imageUrl: string
    tab?: string
    href?: string
  }) => {
    const block = productBlocks.value.find((b) => b.title === payload.blockTitle)
    if (!block) return

    block.items.unshift({
      id: genId(),
      name: payload.name.trim(),
      imageUrl: payload.imageUrl.trim(),
      tab: payload.tab?.trim() || undefined,
      href: payload.href?.trim() || undefined,
    })
  }

  const updateProduct = (
    id: string,
    payload: {
      blockTitle: string
      name: string
      imageUrl: string
      tab?: string
      href?: string
    },
  ) => {
    const sourceBlock = productBlocks.value.find((block) => block.items.some((item) => item.id === id))
    if (!sourceBlock) return

    const itemIndex = sourceBlock.items.findIndex((item) => item.id === id)
    if (itemIndex < 0) return

    const nextItem: ProductItem = {
      id,
      name: payload.name.trim(),
      imageUrl: payload.imageUrl.trim(),
      tab: payload.tab?.trim() || undefined,
      href: payload.href?.trim() || undefined,
    }

    if (sourceBlock.title === payload.blockTitle) {
      sourceBlock.items[itemIndex] = nextItem
      return
    }

    sourceBlock.items.splice(itemIndex, 1)
    const targetBlock = productBlocks.value.find((block) => block.title === payload.blockTitle)
    if (targetBlock) {
      targetBlock.items.unshift(nextItem)
    }
  }

  const deleteProduct = (id: string) => {
    const block = productBlocks.value.find((b) => b.items.some((item) => item.id === id))
    if (!block) return

    block.items = block.items.filter((item) => item.id !== id)
  }

  const resetCatalog = () => {
    productBlocks.value = normalizeBlocks(cloneSeed())
  }

  return {
    productBlocks,
    allRows,
    blockTitles,
    dashboard,
    addProduct,
    updateProduct,
    deleteProduct,
    resetCatalog,
  }
}
