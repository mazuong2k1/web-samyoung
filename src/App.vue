<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteFooter from './components/layout/SiteFooter.vue'
import FloatingContact from './components/layout/FloatingContact.vue'
import SiteHeader from './components/layout/SiteHeader.vue'
import { menuItems } from './data/siteData'

const logoUrl = '/logo.jpg'
</script>

<template>
  <div class="site-shell">
    <SiteHeader :menu-items="menuItems" :logo-url="logoUrl" />

    <main>
      <RouterView />
    </main>

    <FloatingContact />

    <SiteFooter />
  </div>
</template>
