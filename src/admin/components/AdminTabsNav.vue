<script setup lang="ts">
defineProps<{
  activeTab: 'products' | 'contacts' | 'categories'
}>()

const emit = defineEmits<{
  (event: 'change', key: 'products' | 'contacts' | 'categories'): void
}>()

const onTabChange = (key: string) => {
  emit('change', key as 'products' | 'contacts' | 'categories')
}
</script>

<template>
  <a-tabs :activeKey="activeTab" class="admin-tabs" @change="onTabChange">
    <a-tab-pane key="products" tab="Quản lý sản phẩm" />
    <a-tab-pane key="contacts" tab="Liên hệ khách hàng" />
    <a-tab-pane key="categories" tab="Danh mục" />
  </a-tabs>
</template>
