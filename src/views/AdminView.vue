<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import AppBreadcrumbs from '../components/layout/AppBreadcrumbs.vue'
import AdminCategoriesSection from '../admin/components/AdminCategoriesSection.vue'
import AdminContactsSection from '../admin/components/AdminContactsSection.vue'
import AdminProductsSection from '../admin/components/AdminProductsSection.vue'
import AdminTabsNav from '../admin/components/AdminTabsNav.vue'
import { productBlocks, toSlug } from '../data/siteData'
import { sortByCreatedAtDesc } from '../utils/sortByTime'
import { formatVndFromDigitsString, normalizeStoredPriceForInput } from '../utils/vndPriceInput'
import {
  createFirebaseCategory,
  createFirebaseProduct,
  deleteFirebaseCategory,
  deleteFirebaseContact,
  deleteFirebaseProduct,
  fetchFirebaseCategories,
  fetchFirebaseContacts,
  fetchFirebaseProducts,
  updateFirebaseCategory,
  type FirebaseCategoryRow,
  updateFirebaseProduct,
  type FirebaseContactRow,
  type FirebaseProductRow,
  type FirebaseProductSpec,
} from '../services/firebaseApi'

const router = useRouter()
const ADMIN_SESSION_KEY = 'admin:unlocked'

/**
 * TODO: Đưa mật khẩu sang biến môi trường/backend khi có API auth.
 */
const ADMIN_PASSWORD = '1'
const authOpen = ref(true)
const authPassword = ref('')
const authError = ref('')
const unlocked = ref(false)

const openModal = ref(false)
const isEdit = ref(false)
const editingId = ref('')
const formError = ref('')
const savingProduct = ref(false)
const savingCategory = ref(false)
const loadingRows = ref(false)
const loadingContacts = ref(false)
const loadingCategories = ref(false)
const PAGE_SIZE = 15
const currentPage = ref(1)
const contactPage = ref(1)
const categoryPage = ref(1)
const rows = ref<FirebaseProductRow[]>([])
const contactRows = ref<FirebaseContactRow[]>([])
const categoryRows = ref<FirebaseCategoryRow[]>([])
const adminTab = ref<'products' | 'contacts' | 'categories'>('products')
const openCategoryModal = ref(false)
const isEditCategory = ref(false)
const editingCategoryId = ref('')
const categoryName = ref('')
const categoryError = ref('')

const specRows = ref<FirebaseProductSpec[]>([{ label: '', value: '' }])
const galleryUploads = ref<string[]>([])

const form = reactive({
  blockTitle: '',
  name: '',
  imageUrl: '/banner/product.jpeg',
  tags: [] as number[],
  tab: '',
  href: '',
  slug: '',
  code: '',
  price: 'Liên hệ',
  priceIsContact: true,
  views: 0,
  soldCount: 0,
  rating: 0,
  ratingCount: 0,
  brand: 'SAMYOUNG',
  origin: 'Việt Nam',
  tax: '',
  unit: '',
  warranty: '',
  delivery: '',
  receipt: '',
  stockStatus: 'Còn hàng',
  description: '',
  featuresText: '',
  hotline: '0982 047 123',
  supportHours: '8h - 21h (T2-T7), Chủ Nhật đến 17h',
  note: '',
})
const tagOptions = [
  { label: 'NEW', value: 1 },
  { label: 'TOP BÁN CHẠY', value: 2 },
  { label: 'HOT', value: 3 },
]

const blockTitles = computed(() => {
  if (categoryRows.value.length > 0) {
    return [...categoryRows.value]
      .sort(sortByCreatedAtDesc)
      .map((item) => item.name)
      .filter((name) => Boolean(name.trim()))
  }
  return productBlocks.map((block) => block.title)
})
const sortedRows = computed(() => [...rows.value].sort(sortByCreatedAtDesc))
const totalItems = computed(() => sortedRows.value.length)
const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return sortedRows.value.slice(start, start + PAGE_SIZE)
})
const dashboard = computed(() => ({
  totalBlocks: new Set(rows.value.map((r) => r.blockTitle || 'Khác')).size,
  totalProducts: rows.value.length,
  withTabs: rows.value.filter((r) => Boolean(r.tab)).length,
}))
const sortedContacts = computed(() =>
  [...contactRows.value].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')),
)
const totalContacts = computed(() => sortedContacts.value.length)
const pagedContacts = computed(() => {
  const start = (contactPage.value - 1) * PAGE_SIZE
  return sortedContacts.value.slice(start, start + PAGE_SIZE)
})
const sortedCategories = computed(() =>
  [...categoryRows.value].sort((a, b) => a.name.localeCompare(b.name, 'vi')),
)
const totalCategories = computed(() => sortedCategories.value.length)
const pagedCategories = computed(() => {
  const start = (categoryPage.value - 1) * PAGE_SIZE
  return sortedCategories.value.slice(start, start + PAGE_SIZE)
})

const onPageChange = (page: number) => {
  currentPage.value = page
}
const onContactPageChange = (page: number) => {
  contactPage.value = page
}
const onCategoryPageChange = (page: number) => {
  categoryPage.value = page
}

const loadProducts = async () => {
  loadingRows.value = true
  try {
    rows.value = await fetchFirebaseProducts()
    const maxPage = Math.max(1, Math.ceil(totalItems.value / PAGE_SIZE))
    if (currentPage.value > maxPage) currentPage.value = maxPage
  } catch (error) {
    const text = error instanceof Error ? error.message : 'Lỗi không xác định'
    void message.error(`Không tải được danh sách product: ${text}`)
  } finally {
    loadingRows.value = false
  }
}

const loadContacts = async () => {
  loadingContacts.value = true
  try {
    contactRows.value = await fetchFirebaseContacts()
    const maxPage = Math.max(1, Math.ceil(totalContacts.value / PAGE_SIZE))
    if (contactPage.value > maxPage) contactPage.value = maxPage
  } catch (error) {
    const text = error instanceof Error ? error.message : 'Lỗi không xác định'
    void message.error(`Không tải được danh sách contact: ${text}`)
  } finally {
    loadingContacts.value = false
  }
}

const loadCategories = async () => {
  loadingCategories.value = true
  try {
    categoryRows.value = await fetchFirebaseCategories()
    const maxPage = Math.max(1, Math.ceil(totalCategories.value / PAGE_SIZE))
    if (categoryPage.value > maxPage) categoryPage.value = maxPage
  } catch (error) {
    const text = error instanceof Error ? error.message : 'Lỗi không xác định'
    void message.error(`Không tải được danh sách category: ${text}`)
  } finally {
    loadingCategories.value = false
  }
}

const listToLines = (arr: string[] | undefined) => (arr?.length ? arr.join('\n') : '')
const linesToList = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean)

const resetForm = () => {
  form.blockTitle = blockTitles.value[0] ?? ''
  form.name = ''
  form.imageUrl = '/banner/product.jpeg'
  form.tags = []
  form.tab = ''
  form.href = ''
  form.slug = ''
  form.code = ''
  form.price = 'Liên hệ'
  form.priceIsContact = true
  form.views = 0
  form.soldCount = 0
  form.rating = 0
  form.ratingCount = 0
  form.brand = 'SAMYOUNG'
  form.origin = 'Việt Nam'
  form.tax = ''
  form.unit = ''
  form.warranty = ''
  form.delivery = ''
  form.receipt = ''
  form.stockStatus = 'Còn hàng'
  form.description = ''
  form.featuresText = ''
  form.hotline = '0982 047 123'
  form.supportHours = '8h - 21h (T2-T7), Chủ Nhật đến 17h'
  form.note = ''
  galleryUploads.value = []
  specRows.value = [{ label: '', value: '' }]
  formError.value = ''
}

const addSpecRow = () => {
  specRows.value.push({ label: '', value: '' })
}
const removeSpecRow = (index: number) => {
  specRows.value.splice(index, 1)
  if (specRows.value.length === 0) specRows.value.push({ label: '', value: '' })
}

/** Chỉ số + format 1.234.567 đ khi gõ */
const onVndPriceInput = (val: string) => {
  form.price = formatVndFromDigitsString(val)
}

const onPriceContactModeChange = (checked: boolean) => {
  form.priceIsContact = checked
  form.price = checked ? 'Liên hệ' : ''
}

/** Hotline: chỉ cho nhập số và khoảng trắng */
const onHotlineInput = (val: string) => {
  form.hotline = val.replace(/[^\d\s]/g, '').replace(/\s{2,}/g, ' ').trimStart()
}

const parseNonNegativeInt = (value: unknown) => {
  const num = Number(value)
  if (!Number.isFinite(num)) return 0
  return Math.max(0, Math.floor(num))
}

const parseRatingValue = (value: unknown) => {
  const num = Number(value)
  if (!Number.isFinite(num)) return 0
  return Math.min(5, Math.max(0, Number(num.toFixed(1))))
}

const parseIntegerInput = (value: string | number) => String(value ?? '').replace(/[^\d]/g, '')
const parseRatingInput = (value: string | number) =>
  String(value ?? '')
    .replace(',', '.')
    .replace(/[^0-9.]/g, '')

const collectMissingRequiredFields = () => {
  const missing: string[] = []
  if (!form.blockTitle.trim()) missing.push('Nhóm sản phẩm')
  if (!form.code.trim()) missing.push('Mã sản phẩm')
  if (!form.name.trim()) missing.push('Tên sản phẩm')
  if (!form.imageUrl.trim()) missing.push('Ảnh chính')
  if (!form.brand.trim()) missing.push('Thương hiệu')
  if (!form.origin.trim()) missing.push('Xuất xứ')
  if (!form.stockStatus.trim()) missing.push('Tình trạng kho')
  if (!form.hotline.trim()) missing.push('Hotline')
  if (!form.priceIsContact && !form.price.trim()) missing.push('Giá hiển thị')
  if (!form.priceIsContact && !/\d/.test(form.price)) missing.push('Giá hiển thị hợp lệ')
  if (form.hotline.trim() && !/^[\d\s]+$/.test(form.hotline)) missing.push('Hotline hợp lệ (chỉ số)')
  return missing
}

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Không đọc được file ảnh.'))
    reader.readAsDataURL(file)
  })

const onMainImageSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    formError.value = 'Vui lòng chọn file ảnh hợp lệ.'
    return
  }
  try {
    const dataUrl = await fileToDataUrl(file)
    if (dataUrl) {
      form.imageUrl = dataUrl
      formError.value = ''
    }
  } catch {
    formError.value = 'Không thể tải ảnh lên.'
  } finally {
    // Cho phép chọn lại cùng 1 file.
    input.value = ''
  }
}

const onGalleryImagesSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  if (files.length === 0) return

  const imageFiles = files.filter((f) => f.type.startsWith('image/'))
  if (imageFiles.length !== files.length) {
    formError.value = 'Một số file không phải ảnh và đã bị bỏ qua.'
  }

  const available = Math.max(0, 5 - galleryUploads.value.length)
  const picked = imageFiles.slice(0, available)
  if (imageFiles.length > available) {
    formError.value = 'Tối đa 5 ảnh phụ.'
  }

  try {
    const uploaded = await Promise.all(picked.map((f) => fileToDataUrl(f)))
    galleryUploads.value.push(...uploaded.filter(Boolean))
    if (uploaded.length > 0 && formError.value === 'Không thể tải ảnh lên.') {
      formError.value = ''
    }
  } catch {
    formError.value = 'Không thể tải ảnh phụ lên.'
  } finally {
    input.value = ''
  }
}

const removeGalleryImage = (index: number) => {
  galleryUploads.value.splice(index, 1)
}

const toTags = (values: number[]) =>
  values
    .map((tag) => Number(tag))
    .filter((tag) => Number.isFinite(tag))

const normalizeTagIds = (tags: unknown) => {
  if (!Array.isArray(tags)) return [] as number[]
  return tags
    .map((tag) => Number(tag))
    .filter((tag) => Number.isFinite(tag))
}

const openCreate = () => {
  isEdit.value = false
  editingId.value = ''
  resetForm()
  openModal.value = true
}

const openEdit = (id: string) => {
  const item = rows.value.find((row) => row.id === id)
  if (!item) return

  isEdit.value = true
  editingId.value = id
  form.blockTitle = item.blockTitle ?? ''
  form.name = item.name
  form.imageUrl = item.imageUrl
  form.tags = normalizeTagIds(item.tags)
  form.tab = item.tab ?? ''
  form.href = item.href ?? ''
  form.slug = item.slug ?? ''
  form.code = item.code ?? ''
  form.priceIsContact = item.priceIsContact !== false
  form.price =
    item.priceIsContact === false
      ? normalizeStoredPriceForInput(item.price ?? '')
      : (item.price ?? 'Liên hệ')
  form.views = typeof item.views === 'number' ? item.views : Number(item.views) || 0
  form.soldCount = typeof item.soldCount === 'number' ? item.soldCount : Number(item.soldCount) || 0
  form.rating = typeof item.rating === 'number' ? item.rating : Number(item.rating) || 0
  form.ratingCount = typeof item.ratingCount === 'number' ? item.ratingCount : Number(item.ratingCount) || 0
  form.brand = item.brand ?? 'SAMYOUNG'
  form.origin = item.origin ?? 'Việt Nam'
  form.tax = item.tax ?? ''
  form.unit = item.unit ?? ''
  form.warranty = item.warranty ?? ''
  form.delivery = item.delivery ?? ''
  form.receipt = item.receipt ?? ''
  form.stockStatus = item.stockStatus ?? 'Còn hàng'
  galleryUploads.value = item.gallery?.slice(0, 5) ?? []
  form.description = item.description ?? ''
  form.featuresText = listToLines(item.features)
  form.hotline = item.hotline ?? '0982 047 123'
  form.supportHours = item.supportHours ?? '8h - 21h (T2-T7), Chủ Nhật đến 17h'
  form.note = item.note ?? ''
  specRows.value =
    item.specs && item.specs.length > 0 ? [...item.specs] : [{ label: '', value: '' }]
  formError.value = ''
  openModal.value = true
}

const submit = async () => {
  const missingFields = collectMissingRequiredFields()
  if (missingFields.length > 0) {
    formError.value = `Thiếu thông tin bắt buộc: ${missingFields.join(', ')}.`
    return
  }

  const slug = form.slug.trim() || toSlug(form.code.trim() || form.name.trim())
  const href = form.href.trim() || `san-pham/${slug}`
  const specs = specRows.value.filter((r) => r.label.trim() || r.value.trim())

  const payload = {
    blockTitle: form.blockTitle.trim(),
    name: form.name.trim(),
    imageUrl: form.imageUrl.trim(),
    tags: toTags(form.tags),
    tab: form.tab.trim(),
    href,
    slug,
    code: form.code.trim(),
    price: form.priceIsContact ? 'Liên hệ' : form.price.trim(),
    priceIsContact: form.priceIsContact,
    views: parseNonNegativeInt(form.views),
    soldCount: parseNonNegativeInt(form.soldCount),
    rating: parseRatingValue(form.rating),
    ratingCount: parseNonNegativeInt(form.ratingCount),
    brand: form.brand.trim(),
    origin: form.origin.trim(),
    tax: form.tax.trim(),
    unit: form.unit.trim(),
    warranty: form.warranty.trim(),
    delivery: form.delivery.trim(),
    receipt: form.receipt.trim(),
    stockStatus: form.stockStatus.trim(),
    gallery: [...galleryUploads.value],
    description: form.description.trim(),
    features: linesToList(form.featuresText),
    specs,
    hotline: form.hotline.trim(),
    supportHours: form.supportHours.trim(),
    note: form.note.trim(),
  }

  savingProduct.value = true
  try {
    if (isEdit.value && editingId.value) {
      await updateFirebaseProduct(editingId.value, payload)
      void message.success('Đã cập nhật sản phẩm.')
    } else {
      await createFirebaseProduct(payload)
      void message.success(`Đã thêm sản phẩm ${form.name}`)
    }
    await loadProducts()
    openModal.value = false
  } catch (error) {
    const text = error instanceof Error ? error.message : 'Lỗi không xác định'
    formError.value = `Không thể gửi Firebase: ${text}`
  } finally {
    savingProduct.value = false
  }
}

const removeItem = async (id: string, name: string) => {
  try {
    await deleteFirebaseProduct(id)
    rows.value = rows.value.filter((row) => row.id !== id)
    const maxPage = Math.max(1, Math.ceil(totalItems.value / PAGE_SIZE))
    if (currentPage.value > maxPage) currentPage.value = maxPage
    void message.success(`Đã xóa sản phẩm "${name}"`)
  } catch (error) {
    const text = error instanceof Error ? error.message : 'Lỗi không xác định'
    void message.error(`Không thể xóa sản phẩm: ${text}`)
  }
}

const resetAll = async () => {
  await loadProducts()
  currentPage.value = 1
  void message.success('Đã tải lại dữ liệu từ Firebase.')
}

const openCreateCategory = () => {
  isEditCategory.value = false
  editingCategoryId.value = ''
  categoryName.value = ''
  categoryError.value = ''
  openCategoryModal.value = true
}

const openEditCategory = (id: string) => {
  const item = categoryRows.value.find((row) => row.id === id)
  if (!item) return

  isEditCategory.value = true
  editingCategoryId.value = id
  categoryName.value = item.name
  categoryError.value = ''
  openCategoryModal.value = true
}

const submitCategory = async () => {
  if (!categoryName.value.trim()) {
    categoryError.value = 'Vui lòng nhập tên danh mục.'
    return
  }

  savingCategory.value = true
  try {
    if (isEditCategory.value && editingCategoryId.value) {
      await updateFirebaseCategory(editingCategoryId.value, categoryName.value)
      const idx = categoryRows.value.findIndex((row) => row.id === editingCategoryId.value)
      if (idx >= 0) {
        const now = new Date().toISOString()
        categoryRows.value[idx] = {
          ...categoryRows.value[idx],
          name: categoryName.value.trim(),
          updatedAt: now,
        }
      }
      void message.success('Đã cập nhật danh mục.')
    } else {
      const created = await createFirebaseCategory(categoryName.value)
      categoryRows.value.unshift({
        id: created.name,
        name: categoryName.value.trim(),
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      })
      void message.success('Đã thêm danh mục.')
    }
    openCategoryModal.value = false
  } catch (error) {
    const text = error instanceof Error ? error.message : 'Lỗi không xác định'
    categoryError.value = `Không thể gửi Firebase: ${text}`
  } finally {
    savingCategory.value = false
  }
}

const removeCategory = async (id: string, name: string) => {
  try {
    await deleteFirebaseCategory(id)
    categoryRows.value = categoryRows.value.filter((row) => row.id !== id)
    const maxPage = Math.max(1, Math.ceil(totalCategories.value / PAGE_SIZE))
    if (categoryPage.value > maxPage) categoryPage.value = maxPage
    void message.success(`Đã xóa danh mục "${name}"`)
  } catch (error) {
    const text = error instanceof Error ? error.message : 'Lỗi không xác định'
    void message.error(`Không thể xóa danh mục: ${text}`)
  }
}

const removeContact = async (id: string, fullName: string) => {
  try {
    await deleteFirebaseContact(id)
    contactRows.value = contactRows.value.filter((row) => row.id !== id)
    const maxPage = Math.max(1, Math.ceil(totalContacts.value / PAGE_SIZE))
    if (contactPage.value > maxPage) contactPage.value = maxPage
    void message.success(`Đã xóa liên hệ "${fullName}"`)
  } catch (error) {
    const text = error instanceof Error ? error.message : 'Lỗi không xác định'
    void message.error(`Không thể xóa liên hệ: ${text}`)
  }
}

const verifyAdmin = () => {
  if (authPassword.value === ADMIN_PASSWORD) {
    unlocked.value = true
    authOpen.value = false
    authError.value = ''
    authPassword.value = ''
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, '1')
    }
    return
  }
  authError.value = 'Mật khẩu không đúng.'
}

const cancelAdmin = () => {
  authOpen.value = false
  unlocked.value = false
  void router.replace('/')
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const wasUnlocked = window.sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'
    if (wasUnlocked) {
      unlocked.value = true
      authOpen.value = false
    }
  }
  void loadProducts()
  void loadContacts()
  void loadCategories()
})
</script>

<template>
  <section class="admin-page">
    <div v-if="unlocked" class="container">
      <AppBreadcrumbs
        :items="[
          { label: 'Trang chủ', to: '/' },
          { label: 'Admin' },
        ]"
      />

      <h1 class="page-main-title">Admin Dashboard</h1>
      <AdminTabsNav :active-tab="adminTab" @change="(key) => (adminTab = key)" />

      <AdminProductsSection
        v-if="adminTab === 'products'"
        :dashboard="dashboard"
        :loading-rows="loadingRows"
        :rows="pagedRows"
        :current-page="currentPage"
        :page-size="PAGE_SIZE"
        :total="totalItems"
        @create="openCreate"
        @reload="resetAll"
        @edit="openEdit"
        @delete="removeItem"
        @page-change="onPageChange"
      />

      <AdminContactsSection
        v-if="adminTab === 'contacts'"
        :total-contacts="totalContacts"
        :loading-contacts="loadingContacts"
        :contacts="pagedContacts"
        :current-page="contactPage"
        :page-size="PAGE_SIZE"
        @reload="loadContacts"
        @delete="removeContact"
        @page-change="onContactPageChange"
      />

      <AdminCategoriesSection
        v-if="adminTab === 'categories'"
        :total-categories="totalCategories"
        :loading-categories="loadingCategories"
        :categories="pagedCategories"
        :current-page="categoryPage"
        :page-size="PAGE_SIZE"
        @create="openCreateCategory"
        @reload="loadCategories"
        @edit="openEditCategory"
        @delete="removeCategory"
        @page-change="onCategoryPageChange"
      />
    </div>

    <a-modal
      v-model:open="authOpen"
      title="Xác thực quản trị"
      ok-text="Vào admin"
      cancel-text="Quay lại"
      :mask-closable="false"
      :closable="false"
      :keyboard="false"
      @ok="verifyAdmin"
      @cancel="cancelAdmin"
    >
      <a-form layout="vertical">
        <a-form-item label="Mật khẩu admin">
          <a-input-password
            v-model:value="authPassword"
            placeholder="Nhập mật khẩu"
            @pressEnter="verifyAdmin"
          />
        </a-form-item>
      </a-form>
      <p v-if="authError" class="admin-form-error">{{ authError }}</p>
    </a-modal>

    <a-modal
      v-model:open="openModal"
      :title="isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'"
      ok-text="Xác nhận"
      cancel-text="Hủy bỏ"
      :confirm-loading="savingProduct"
      width="min(92vw, 920px)"
      :body-style="{ maxHeight: 'min(78vh, 720px)', overflowY: 'auto', paddingTop: '8px' }"
      @ok="submit"
    >
      <a-form layout="vertical" class="admin-form admin-product-form">
        <p class="admin-form-section-title">Phân loại & đường dẫn</p>
        <div class="admin-product-form-grid">
          <a-form-item label="Nhóm sản phẩm (danh mục) *">
            <a-select
              v-model:value="form.blockTitle"
              :options="blockTitles.map((title) => ({ label: title, value: title }))"
            />
          </a-form-item>
          <a-form-item label="Slug URL (để trống sẽ tự tạo từ mã/tên)">
            <a-input v-model:value="form.slug" placeholder="vd: mam-cap-co-3-chau" />
          </a-form-item>
        </div>
        <div class="admin-product-form-grid">
          <a-form-item label="Mã sản phẩm *">
            <a-input v-model:value="form.code" placeholder="VD: MAM-CAP-CO-3-CHAU" />
          </a-form-item>
          <a-form-item label="Href (tùy chọn, mặc định san-pham/slug)">
            <a-input v-model:value="form.href" placeholder="san-pham/ten-san-pham" />
          </a-form-item>
        </div>

        <p class="admin-form-section-title">Thông tin hiển thị</p>
        <a-form-item label="Tên sản phẩm *">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <div class="admin-product-form-grid">
          <a-form-item label="Ảnh chính (upload file) *">
            <input
              type="file"
              accept="image/*"
              class="admin-file-input"
              @change="onMainImageSelect"
            />
            <div v-if="form.imageUrl" class="admin-image-preview">
              <img :src="form.imageUrl" alt="Preview" class="admin-image-preview-img" />
            </div>
          </a-form-item>
          <a-form-item label="Tag">
            <a-select
              v-model:value="form.tags"
              mode="multiple"
              :options="tagOptions"
              placeholder="Chọn tag"
            />
          </a-form-item>
        </div>
        <div class="admin-product-form-grid">
          <a-form-item label="Tab (nhóm con trong block)">
            <a-input v-model:value="form.tab" />
          </a-form-item>
          <a-form-item label="Lượt xem (số)">
            <a-input-number
              v-model:value="form.views"
              :min="0"
              :precision="0"
              :parser="parseIntegerInput"
              style="width: 100%"
            />
          </a-form-item>
        </div>
        <div class="admin-product-form-grid">
          <a-form-item label="Lượt bán">
            <a-input-number
              v-model:value="form.soldCount"
              :min="0"
              :precision="0"
              :parser="parseIntegerInput"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item label="Điểm đánh giá (0-5)">
            <a-input-number
              v-model:value="form.rating"
              :min="0"
              :max="5"
              :step="0.1"
              :parser="parseRatingInput"
              style="width: 100%"
            />
          </a-form-item>
        </div>
        <div class="admin-product-form-grid">
          <a-form-item label="Số lượt đánh giá">
            <a-input-number
              v-model:value="form.ratingCount"
              :min="0"
              :precision="0"
              :parser="parseIntegerInput"
              style="width: 100%"
            />
          </a-form-item>
          <div />
        </div>

        <p class="admin-form-section-title">Giá & tồn</p>
        <a-form-item>
          <a-checkbox
            :checked="form.priceIsContact"
            @update:checked="onPriceContactModeChange"
          >
            Hiển thị &quot;Liên hệ&quot; thay vì nhập giá
          </a-checkbox>
        </a-form-item>
        <a-form-item v-if="!form.priceIsContact" label="Giá hiển thị">
          <a-input
            :value="form.price"
            inputmode="numeric"
            autocomplete="off"
            placeholder="VD: 1.200.000 đ"
            @update:value="onVndPriceInput"
          />
        </a-form-item>
        <a-form-item label="Tình trạng kho / hiển thị *">
          <a-input v-model:value="form.stockStatus" placeholder="Còn hàng" />
        </a-form-item>

        <p class="admin-form-section-title">Thuộc tính</p>
        <div class="admin-product-form-grid">
          <a-form-item label="Thương hiệu *">
            <a-input v-model:value="form.brand" />
          </a-form-item>
          <a-form-item label="Xuất xứ *">
            <a-input v-model:value="form.origin" />
          </a-form-item>
        </div>
        <div class="admin-product-form-grid">
          <a-form-item label="Thuế">
            <a-input v-model:value="form.tax" />
          </a-form-item>
          <a-form-item label="Đơn vị">
            <a-input v-model:value="form.unit" />
          </a-form-item>
        </div>
        <div class="admin-product-form-grid">
          <a-form-item label="Bảo hành">
            <a-input v-model:value="form.warranty" />
          </a-form-item>
          <a-form-item label="Giao hàng">
            <a-input v-model:value="form.delivery" />
          </a-form-item>
        </div>
        <a-form-item label="Nhận hàng">
          <a-input v-model:value="form.receipt" />
        </a-form-item>

        <p class="admin-form-section-title">Media</p>
        <a-form-item label="Ảnh phụ (tối đa 5 ảnh)">
          <input
            type="file"
            accept="image/*"
            multiple
            class="admin-file-input"
            @change="onGalleryImagesSelect"
          />
          <div v-if="galleryUploads.length" class="admin-gallery-preview">
            <div
              v-for="(img, idx) in galleryUploads"
              :key="`${img}-${idx}`"
              class="admin-gallery-item"
            >
              <img :src="img" :alt="`Gallery ${idx + 1}`" class="admin-gallery-img" />
              <button type="button" class="admin-gallery-remove" @click="removeGalleryImage(idx)">
                X
              </button>
            </div>
          </div>
        </a-form-item>

        <p class="admin-form-section-title">Nội dung chi tiết</p>
        <a-form-item label="Mô tả / đoạn giới thiệu">
          <a-textarea v-model:value="form.description" :rows="4" placeholder="Hiển thị phần mô tả phía trên bullet..." />
        </a-form-item>
        <a-form-item label="Điểm nổi bật (mỗi dòng một gạch đầu dòng)">
          <a-textarea v-model:value="form.featuresText" :rows="5" />
        </a-form-item>

        <p class="admin-form-section-title">Thông số kỹ thuật</p>
        <div
          v-for="(row, idx) in specRows"
          :key="`spec-${idx}`"
          class="admin-spec-row"
        >
          <a-input v-model:value="row.label" placeholder="Tên thông số" />
          <a-input v-model:value="row.value" placeholder="Giá trị" />
          <a-button type="text" danger @click="removeSpecRow(idx)">Xóa</a-button>
        </div>
        <a-button type="dashed" block class="admin-add-row-btn" @click="addSpecRow">+ Thêm thông số</a-button>

        <p class="admin-form-section-title">Liên hệ & ghi chú</p>
        <div class="admin-product-form-grid">
          <a-form-item label="Hotline *">
            <a-input
              :value="form.hotline"
              inputmode="numeric"
              autocomplete="off"
              placeholder="VD: 0982 047 123"
              @update:value="onHotlineInput"
            />
          </a-form-item>
          <a-form-item label="Giờ hỗ trợ">
            <a-input v-model:value="form.supportHours" />
          </a-form-item>
        </div>
        <a-form-item label="Ghi chú nội bộ (note)">
          <a-input v-model:value="form.note" />
        </a-form-item>
      </a-form>
      <p v-if="formError" class="admin-form-error">{{ formError }}</p>
    </a-modal>

    <a-modal
      v-model:open="openCategoryModal"
      :title="isEditCategory ? 'Sửa danh mục' : 'Thêm danh mục'"
      ok-text="Xác nhận"
      cancel-text="Hủy bỏ"
      :confirm-loading="savingCategory"
      @ok="submitCategory"
    >
      <a-form layout="vertical">
        <a-form-item label="Tên danh mục">
          <a-input v-model:value="categoryName" placeholder="VD: DỤNG CỤ CẮT CNC - SAMYOUNG" />
        </a-form-item>
      </a-form>
      <p v-if="categoryError" class="admin-form-error">{{ categoryError }}</p>
    </a-modal>
  </section>
</template>
