<script setup lang="ts">
import type { FirebaseProductRow } from '../../services/firebaseApi'
import { useRouter } from 'vue-router'
import { toSlug } from '../../data/siteData'

defineProps<{
  dashboard: { totalBlocks: number; totalProducts: number; withTabs: number }
  loadingRows: boolean
  rows: FirebaseProductRow[]
  currentPage: number
  pageSize: number
  total: number
}>()

const TAG_META: Record<number, { label: string; tone: 'new' | 'top' | 'hot' | 'default' }> = {
  1: { label: 'NEW', tone: 'new' },
  2: { label: 'TOP BÁN CHẠY', tone: 'top' },
  3: { label: 'HOT', tone: 'hot' },
}

const normalizeTagIds = (tags: unknown) => {
  if (!Array.isArray(tags)) return [] as number[]
  return tags.map((tag) => Number(tag)).filter((tag) => Number.isFinite(tag))
}

const tagItems = (tags: unknown) =>
  normalizeTagIds(tags).map((id) => ({
    label: TAG_META[id]?.label ?? `TAG ${id}`,
    tone: TAG_META[id]?.tone ?? 'default',
  }))

const emit = defineEmits<{
  (event: 'create'): void
  (event: 'reload'): void
  (event: 'edit', id: string): void
  (event: 'delete', id: string, name: string): void
  (event: 'page-change', page: number): void
}>()
const router = useRouter()

const onPageChange = (page: number) => {
  emit('page-change', page)
}

const getDetailPath = (item: FirebaseProductRow) => {
  if (item.href?.trim()) {
    const h = item.href.trim().replace(/^\//, '')
    if (h.startsWith('san-pham/')) return `/${h}`
    return `/san-pham/${h}`
  }
  if (item.slug?.trim()) return `/san-pham/${item.slug.trim()}`
  if (item.code?.trim()) return `/san-pham/${toSlug(item.code)}`
  return `/san-pham/${toSlug(item.name)}`
}

const openDetail = (item: FirebaseProductRow) => {
  void router.push(getDetailPath(item))
}
</script>

<template>
  <div class="admin-stats">
    <article class="admin-stat-card">
      <p>Tổng nhóm sản phẩm</p>
      <strong>{{ dashboard.totalBlocks }}</strong>
    </article>
    <article class="admin-stat-card">
      <p>Tổng sản phẩm</p>
      <strong>{{ dashboard.totalProducts }}</strong>
    </article>
    <article class="admin-stat-card">
      <p>Sản phẩm có tab</p>
      <strong>{{ dashboard.withTabs }}</strong>
    </article>
  </div>

  <div class="admin-toolbar">
    <a-button type="primary" @click="emit('create')">+ Thêm sản phẩm</a-button>
    <a-popconfirm
      title="Tải lại danh sách product?"
      description="Dữ liệu sẽ được đồng bộ lại"
      ok-text="Tải lại"
      cancel-text="Hủy bỏ"
      @confirm="emit('reload')"
    >
      <a-button :loading="loadingRows">Tải lại</a-button>
    </a-popconfirm>
  </div>

  <div class="admin-table-wrap">
    <div v-if="loadingRows" class="admin-table-loading">
      <a-spin size="large" />
      <span>Đang tải dữ liệu sản phẩm...</span>
    </div>
    <table class="admin-table admin-table--products">
      <thead>
        <tr>
          <th>Ảnh</th>
          <th>Tên sản phẩm</th>
          <th>Mã</th>
          <th>Giá</th>
          <th>Thương hiệu</th>
          <th>Nhóm</th>
          <th>Tag</th>
          <th>Tab</th>
          <th>Xem / Bán</th>
          <th>Đánh giá</th>
          <th>Tồn kho</th>
          <th>Đường dẫn</th>
          <th>Tạo lúc</th>
          <th>Cập nhật</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in rows" :key="item.id" class="admin-row-clickable" @click="openDetail(item)">
          <td><img :src="item.imageUrl" :alt="item.name" class="admin-thumb" /></td>
          <td>{{ item.name }}</td>
          <td>{{ item.code || '-' }}</td>
          <td>{{ item.priceIsContact === false ? (item.price || '-') : 'Liên hệ' }}</td>
          <td>{{ item.brand || '-' }}</td>
          <td>{{ item.blockTitle }}</td>
          <td>
            <div v-if="tagItems(item.tags).length" class="admin-tag-list">
              <span
                v-for="tag in tagItems(item.tags)"
                :key="`${item.id}-${tag.label}`"
                class="admin-tag-chip"
                :class="`is-${tag.tone}`"
              >
                {{ tag.label }}
              </span>
            </div>
            <span v-else>-</span>
          </td>
          <td>{{ item.tab || '-' }}</td>
          <td>{{ Number(item.views ?? 0) }} / {{ Number(item.soldCount ?? 0) }}</td>
          <td>{{ Number(item.rating ?? 0).toFixed(1) }} ({{ Number(item.ratingCount ?? 0) }})</td>
          <td>{{ item.stockStatus || '-' }}</td>
          <td>{{ item.href || '-' }}</td>
          <td>{{ item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '-' }}</td>
          <td>{{ item.updatedAt ? new Date(item.updatedAt).toLocaleString('vi-VN') : '-' }}</td>
          <td class="admin-actions" @click.stop>
            <div class="admin-actions-inner">
              <a-button size="small" class="admin-action-btn admin-action-btn--edit" @click="emit('edit', item.id)">
                <span aria-hidden="true">✏️</span>
                <span>Sửa</span>
              </a-button>
              <a-popconfirm
                :title="`Xóa sản phẩm '${item.name}'?`"
                ok-text="Xóa"
                cancel-text="Hủy bỏ"
                @confirm="emit('delete', item.id, item.name)"
              >
                <a-button size="small" danger class="admin-action-btn admin-action-btn--delete">
                  <span aria-hidden="true">🗑️</span>
                  <span>Xóa</span>
                </a-button>
              </a-popconfirm>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <a-pagination
    class="admin-pagination"
    :current="currentPage"
    :page-size="pageSize"
    :total="total"
    :show-size-changer="false"
    @change="onPageChange"
  />
</template>
