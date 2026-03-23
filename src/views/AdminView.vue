<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import AppBreadcrumbs from '../components/layout/AppBreadcrumbs.vue'
import AdminCategoriesSection from '../admin/components/AdminCategoriesSection.vue'
import AdminContactsSection from '../admin/components/AdminContactsSection.vue'
import AdminProductsSection from '../admin/components/AdminProductsSection.vue'
import AdminTabsNav from '../admin/components/AdminTabsNav.vue'
import { productBlocks } from '../data/siteData'
import { sortByCreatedAtDesc } from '../utils/sortByTime'
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

const form = reactive({
  blockTitle: '',
  name: '',
  imageUrl: '/banner/product.jpeg',
  tags: [] as number[],
  tab: '',
  href: '',
})
const tagOptions = [
  { label: 'NEW', value: 1 },
  { label: 'TOP BÁN CHẠY', value: 2 },
  { label: 'HOT', value: 3 },
]
const tagLabelMap: Record<number, string> = Object.fromEntries(tagOptions.map((t) => [t.value, t.label]))

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

const resetForm = () => {
  form.blockTitle = blockTitles.value[0] ?? ''
  form.name = ''
  form.imageUrl = '/banner/product.jpeg'
  form.tags = []
  form.tab = ''
  form.href = ''
  formError.value = ''
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

const formatTags = (tags: number[] | undefined) => {
  if (!tags || tags.length === 0) return '-'
  return tags.map((id) => tagLabelMap[id] ?? `TAG ${id}`).join(', ')
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
  formError.value = ''
  openModal.value = true
}

const submit = async () => {
  if (!form.blockTitle.trim() || !form.name.trim() || !form.imageUrl.trim()) {
    formError.value = 'Vui lòng nhập nhóm, tên sản phẩm và ảnh.'
    return
  }

  savingProduct.value = true
  try {
    if (isEdit.value && editingId.value) {
      await updateFirebaseProduct(editingId.value, {
        name: form.name.trim(),
        imageUrl: form.imageUrl.trim(),
        tags: toTags(form.tags),
        tab: form.tab.trim(),
        href: form.href.trim(),
        blockTitle: form.blockTitle.trim(),
      })
      const idx = rows.value.findIndex((item) => item.id === editingId.value)
      if (idx >= 0) {
        const now = new Date().toISOString()
        rows.value[idx] = {
          ...rows.value[idx],
          name: form.name.trim(),
          imageUrl: form.imageUrl.trim(),
          tags: toTags(form.tags),
          tab: form.tab.trim() || '',
          href: form.href.trim() || '',
          blockTitle: form.blockTitle.trim(),
          updatedAt: now,
        }
      }
      void message.success('Đã cập nhật sản phẩm.')
    } else {
      const created = await createFirebaseProduct({
        name: form.name.trim(),
        imageUrl: form.imageUrl.trim(),
        tags: toTags(form.tags),
        tab: form.tab.trim(),
        href: form.href.trim(), 
        blockTitle: form.blockTitle.trim(),
        note: 'Created from admin modal',
      })
      rows.value.unshift({
        id: created.name,
        name: form.name.trim(),
        imageUrl: form.imageUrl.trim(),
        tags: toTags(form.tags),
        tab: form.tab.trim() || '',
        href: form.href.trim() || '',
        blockTitle: form.blockTitle.trim(),
        note: 'Created from admin modal',
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      })
      void message.success(`Đã thêm sản phẩm ${form.name}`)
    }

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
        :format-tags="(tags) => formatTags(normalizeTagIds(tags))"
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
      :confirm-loading="savingProduct"
      @ok="submit"
    >
      <a-form layout="vertical" class="admin-form">
        <a-form-item label="Nhóm sản phẩm">
          <a-select v-model:value="form.blockTitle" :options="blockTitles.map((title) => ({ label: title, value: title }))" />
        </a-form-item>
        <a-form-item label="Tên sản phẩm">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item label="Ảnh (URL)">
          <a-input v-model:value="form.imageUrl" />
        </a-form-item>
        <a-form-item label="Tag">
          <a-select
            v-model:value="form.tags"
            mode="multiple"
            :options="tagOptions"
            placeholder="Chọn tag (gửi dạng number)"
          />
        </a-form-item>
        <a-form-item label="Tab (tùy chọn)">
          <a-input v-model:value="form.tab" />
        </a-form-item>
        <a-form-item label="Href (tùy chọn)">
          <a-input v-model:value="form.href" placeholder="/mui-vat-mep-centering-2cen hoặc san-pham/slug" />
        </a-form-item>
      </a-form>
      <p v-if="formError" class="admin-form-error">{{ formError }}</p>
    </a-modal>

    <a-modal
      v-model:open="openCategoryModal"
      :title="isEditCategory ? 'Sửa danh mục' : 'Thêm danh mục'"
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
