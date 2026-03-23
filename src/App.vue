<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import { RouterView } from 'vue-router'
import SiteFooter from './components/layout/SiteFooter.vue'
import FloatingContact from './components/layout/FloatingContact.vue'
import SiteHeader from './components/layout/SiteHeader.vue'
import { menuItems } from './data/siteData'

const logoUrl = '/logo.jpg'

/** Đồng bộ Ant Design với theme site (navy + lỗi đỏ) */
const antTheme = {
  token: {
    colorPrimary: '#1f4e79',
    colorError: '#dc2626',
    colorErrorHover: '#b91c1c',
    borderRadius: 8,
  },
}
</script>

<template>
  <ConfigProvider :theme="antTheme">
    <div class="site-shell">
      <SiteHeader :menu-items="menuItems" :logo-url="logoUrl" />

      <main>
        <RouterView />
      </main>

      <FloatingContact />

      <SiteFooter />
    </div>
  </ConfigProvider>
</template>
