<script setup lang="ts">
import type { PartnerItem } from '../../types/partner'

defineProps<{
  partners: PartnerItem[]
}>()
</script>

<template>
  <ul class="partner-grid">
    <li v-for="p in partners" :key="p.id" class="partner-grid-item">
      <article class="partner-card">
        <div class="partner-card-logo-wrap">
          <img
            v-if="p.logoUrl"
            :src="p.logoUrl"
            :alt="`Logo ${p.name}`"
            class="partner-card-logo"
            loading="lazy"
          />
          <div v-else class="partner-card-placeholder" aria-hidden="true">
            <span class="partner-card-placeholder-text">{{ p.name }}</span>
          </div>
        </div>
        <p class="partner-card-name">{{ p.name }}</p>
      </article>
    </li>
  </ul>
</template>
