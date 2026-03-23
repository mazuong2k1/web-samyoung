<script setup lang="ts">
import type { FirebaseProductRow } from '../../services/firebaseApi'

defineProps<{
  dashboard: { totalBlocks: number; totalProducts: number; withTabs: number }
  loadingRows: boolean
  rows: FirebaseProductRow[]
  currentPage: number
  pageSize: number
  total: number
  formatTags: (tags: unknown) => string
}>()

const emit = defineEmits<{
  (event: 'create'): void
  (event: 'reload'): void
  (event: 'edit', id: string): void
  (event: 'delete', id: string, name: string): void
  (event: 'page-change', page: number): void
}>()

const onPageChange = (page: number) => {
  emit('page-change', page)
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
      description="Dữ liệu sẽ được đồng bộ lại từ Firebase."
      ok-text="Tải lại"
      cancel-text="Hủy"
      @confirm="emit('reload')"
    >
      <a-button :loading="loadingRows">Tải lại từ Firebase</a-button>
    </a-popconfirm>
  </div>

  <div class="admin-table-wrap">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Ảnh</th>
          <th>Tên sản phẩm</th>
          <th>Nhóm</th>
          <th>Tag</th>
          <th>Tab</th>
          <th>Đường dẫn</th>
          <th>Tạo lúc</th>
          <th>Cập nhật</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in rows" :key="item.id">
          <td><img :src="item.imageUrl" :alt="item.name" class="admin-thumb" /></td>
          <td>{{ item.name }}</td>
          <td>{{ item.blockTitle }}</td>
          <td>{{ formatTags(item.tags) }}</td>
          <td>{{ item.tab || '-' }}</td>
          <td>{{ item.href || '-' }}</td>
          <td>{{ item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '-' }}</td>
          <td>{{ item.updatedAt ? new Date(item.updatedAt).toLocaleString('vi-VN') : '-' }}</td>
          <td class="admin-actions">
            <a-button size="small" @click="emit('edit', item.id)">Sửa</a-button>
            <a-popconfirm
              :title="`Xóa sản phẩm '${item.name}'?`"
              ok-text="Xóa"
              cancel-text="Hủy"
              @confirm="emit('delete', item.id, item.name)"
            >
              <a-button size="small" danger>Xóa</a-button>
            </a-popconfirm>
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
