<script setup lang="ts">
import type { DocumentItem } from '../../types/document'

defineProps<{
  documents: DocumentItem[]
  sectionTitle?: string
}>()

const isExternal = (url: string) => /^https?:\/\//i.test(url)
</script>

<template>
  <div class="docs-panel">
    <div class="docs-section-head">{{ sectionTitle ?? 'CATALOG SAMYOUNG VINA' }}</div>
    <ul class="docs-list">
      <li v-for="doc in documents" :key="doc.id" class="docs-row">
        <span class="docs-row-icon" aria-hidden="true">
          <svg class="docs-file-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
        </span>
        <span class="docs-row-title">{{ doc.title }}</span>
        <a
          :href="doc.fileUrl"
          class="docs-download"
          :download="!isExternal(doc.fileUrl) ? doc.downloadName ?? '' : undefined"
          :target="isExternal(doc.fileUrl) ? '_blank' : undefined"
          rel="noopener noreferrer"
        >
          <svg class="docs-download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Tải về
        </a>
      </li>
    </ul>
  </div>
</template>
