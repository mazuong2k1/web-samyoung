<script setup lang="ts">
import type { FirebaseCategoryRow } from '../../services/firebaseApi'

defineProps<{
  totalCategories: number
  loadingCategories: boolean
  categories: FirebaseCategoryRow[]
  currentPage: number
  pageSize: number
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
  <div class="admin-stats admin-stats--contacts">
    <article class="admin-stat-card">
      <p>Tổng danh mục</p>
      <strong>{{ totalCategories }}</strong>
    </article>
    <article class="admin-stat-card">
      <p>Trạng thái dữ liệu</p>
      <strong>{{ loadingCategories ? 'Đang tải...' : 'Sẵn sàng' }}</strong>
    </article>
  </div>

  <div class="admin-toolbar">
    <a-button type="primary" @click="emit('create')">+ Thêm danh mục</a-button>
    <a-button :loading="loadingCategories" @click="emit('reload')">Tải lại danh mục</a-button>
  </div>

  <div class="admin-table-wrap">
    <table class="admin-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Tên danh mục / nhóm</th>
          <th>Tạo lúc</th>
          <th>Cập nhật</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in categories" :key="item.id">
          <td>{{ (currentPage - 1) * pageSize + idx + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '-' }}</td>
          <td>{{ item.updatedAt ? new Date(item.updatedAt).toLocaleString('vi-VN') : '-' }}</td>
          <td class="admin-actions">
            <div class="admin-actions-inner">
              <a-button size="small" @click="emit('edit', item.id)">Sửa</a-button>
              <a-popconfirm
                :title="`Xóa danh mục '${item.name}'?`"
                ok-text="Xóa"
                cancel-text="Hủy"
                @confirm="emit('delete', item.id, item.name)"
              >
                <a-button size="small" danger>Xóa</a-button>
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
    :total="totalCategories"
    :show-size-changer="false"
    @change="onPageChange"
  />
</template>
