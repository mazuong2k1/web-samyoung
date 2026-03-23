<script setup lang="ts">
import { ref } from 'vue'
import AppBreadcrumbs from '../components/layout/AppBreadcrumbs.vue'
import DocumentList from '../components/sections/DocumentList.vue'
import BestSellingSidebar from '../components/sections/BestSellingSidebar.vue'
import { documentsSeed } from '../data/documents'
import { bestSellingProducts } from '../data/siteData'
import type { DocumentItem } from '../types/document'

/** Sau có API: documents.value = await fetch(...).then(r => r.json()) */
const documents = ref<DocumentItem[]>(documentsSeed)
</script>

<template>
  <section class="docs-page">
    <div class="container">
      <AppBreadcrumbs
        :items="[
          { label: 'Trang chủ', to: '/' },
          { label: 'Tài liệu' },
        ]"
      />

      <h1 class="page-main-title">Tài liệu</h1>

      <div class="about-layout">
        <div class="docs-main">
          <DocumentList :documents="documents" section-title="CATALOG SAMYOUNG VINA" />
        </div>

        <BestSellingSidebar :items="bestSellingProducts" />
      </div>
    </div>
  </section>
</template>
