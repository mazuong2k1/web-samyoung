<script setup lang="ts">
import type { FirebaseContactRow } from '../../services/firebaseApi'

defineProps<{
  totalContacts: number
  loadingContacts: boolean
  contacts: FirebaseContactRow[]
  currentPage: number
  pageSize: number
}>()

const emit = defineEmits<{
  (event: 'reload'): void
  (event: 'delete', id: string, fullName: string): void
  (event: 'page-change', page: number): void
}>()

const onPageChange = (page: number) => {
  emit('page-change', page)
}
</script>

<template>
  <div class="admin-stats admin-stats--contacts">
    <article class="admin-stat-card">
      <p>Tổng liên hệ</p>
      <strong>{{ totalContacts }}</strong>
    </article>
    <article class="admin-stat-card">
      <p>Trạng thái dữ liệu</p>
      <strong>{{ loadingContacts ? 'Đang tải...' : 'Sẵn sàng' }}</strong>
    </article>
  </div>

  <div class="admin-toolbar">
    <a-button :loading="loadingContacts" @click="emit('reload')">Tải lại liên hệ</a-button>
  </div>

  <div class="admin-table-wrap">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Họ tên</th>
          <th>Điện thoại</th>
          <th>Email</th>
          <th>Địa chỉ</th>
          <th>Nội dung</th>
          <th>Tạo lúc</th>
          <th>Cập nhật</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contact in contacts" :key="contact.id">
          <td>{{ contact.fullName }}</td>
          <td>{{ contact.phone }}</td>
          <td>{{ contact.email || '-' }}</td>
          <td>{{ contact.address || '-' }}</td>
          <td>{{ contact.message }}</td>
          <td>{{ contact.createdAt ? new Date(contact.createdAt).toLocaleString('vi-VN') : '-' }}</td>
          <td>{{ contact.updatedAt ? new Date(contact.updatedAt).toLocaleString('vi-VN') : '-' }}</td>
          <td class="admin-actions">
            <div class="admin-actions-inner">
              <a-popconfirm
                :title="`Xóa liên hệ của '${contact.fullName}'?`"
                ok-text="Xóa"
                cancel-text="Hủy"
                @confirm="emit('delete', contact.id, contact.fullName)"
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
    :total="totalContacts"
    :show-size-changer="false"
    @change="onPageChange"
  />
</template>
