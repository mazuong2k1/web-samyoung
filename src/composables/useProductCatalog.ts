import { computed, onMounted, ref, watch } from 'vue'
import { productBlocks as seedProductBlocks } from '../data/siteData'
import { fetchFirebaseProducts } from '../services/firebaseApi'
import type { FirebaseProductRow } from '../services/firebaseApi'
import type { ProductBlock, ProductItem } from '../types/product'

const STORAGE_KEY = 'samyoung:product-blocks:v1'
const TAG_LABEL_MAP: Record<number, string> = {
  1: 'NEW',
  2: 'TOP BÁN CHẠY',
  3: 'HOT',
}

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
let loadingFromApi: Promise<void> | null = null

const saveToStorage = () => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productBlocks.value))
}

const normalizeHref = (href: string | undefined, name: string) => {
  const raw = href?.trim()
  if (raw) {
    const normalized = raw.replace(/^\//, '')
    if (normalized.startsWith('san-pham/')) return normalized
    return `san-pham/${normalized}`
  }
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `san-pham/${slug}`
}

const rowToItem = (row: FirebaseProductRow): ProductItem => ({
  id: row.id,
  name: row.name?.trim() || 'Sản phẩm',
  imageUrl: row.imageUrl?.trim() || '/banner/product.jpeg',
  price: row.priceIsContact === false ? (row.price?.trim() || 'Liên hệ') : 'Liên hệ',
  soldCount: typeof row.soldCount === 'number' && !Number.isNaN(row.soldCount) ? Math.max(0, row.soldCount) : 0,
  rating: typeof row.rating === 'number' && !Number.isNaN(row.rating) ? Math.min(5, Math.max(0, row.rating)) : 0,
  tags: Array.isArray(row.tags)
    ? row.tags.map((tag) => TAG_LABEL_MAP[tag]).filter((tag): tag is string => Boolean(tag))
    : undefined,
  tab: row.tab?.trim() || undefined,
  href: normalizeHref(row.href, row.name || 'san-pham'),
})

const buildBlocksFromApi = (rows: FirebaseProductRow[]): ProductBlock[] => {
  const groups = new Map<string, ProductItem[]>()
  const latestTitle = 'SẢN PHẨM MỚI NHẤT'

  rows.forEach((row) => {
    const title = row.blockTitle?.trim() || latestTitle
    const nextItems = groups.get(title) ?? []
    nextItems.push(rowToItem(row))
    groups.set(title, nextItems)
  })

  // Block "SẢN PHẨM MỚI NHẤT" ưu tiên lấy theo tag NEW (id=1).
  const latestItems = rows
    .filter((row) => Array.isArray(row.tags) && row.tags.some((tag) => Number(tag) === 1))
    .map(rowToItem)
  if (latestItems.length > 0) {
    groups.set(latestTitle, latestItems)
  }

  const seedOrder = seedProductBlocks.map((b) => b.title)
  const dynamicOrder = [...groups.keys()].filter((title) => !seedOrder.includes(title))
  const titles = [...seedOrder, ...dynamicOrder].filter((title) => groups.has(title))

  return titles.map((title) => {
    const items = groups.get(title) ?? []
    const tabs = [...new Set(items.map((item) => item.tab).filter((tab): tab is string => Boolean(tab)))]
    return {
      title,
      autoSlide: title === 'SẢN PHẨM MỚI NHẤT',
      tabs: tabs.length > 0 ? tabs : undefined,
      items,
    }
  })
}

const hydrateFromApi = async () => {
  if (loadingFromApi) return loadingFromApi

  loadingFromApi = (async () => {
    try {
      const rows = await fetchFirebaseProducts()
      if (rows.length > 0) {
        productBlocks.value = normalizeBlocks(buildBlocksFromApi(rows))
      }
    } catch {
      // Giữ dữ liệu local/static khi API lỗi để tránh trắng trang.
    } finally {
      loadingFromApi = null
    }
  })()

  return loadingFromApi
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
  onMounted(() => {
    void hydrateFromApi()
  })

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
