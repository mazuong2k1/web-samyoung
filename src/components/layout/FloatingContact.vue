<script setup lang="ts">
import { COMPANY_PHONE_PRIMARY } from '../../data/companyPhones'
import { PRODUCT_HIGHLIGHT_FACEBOOK_URL } from '../../data/defaultProductHighlight'
</script>

<template>
  <div class="floating-contact" aria-hidden="true">
    <a
      :href="`tel:${COMPANY_PHONE_PRIMARY.tel}`"
      class="float-icon float-phone"
      :aria-label="`Gọi ${COMPANY_PHONE_PRIMARY.display}`"
    >
      <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
        <path
          d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2Z"
          fill="currentColor"
        />
      </svg>
    </a>

    <a
      :href="COMPANY_PHONE_PRIMARY.zalo"
      class="float-icon float-zalo"
      :aria-label="`Zalo ${COMPANY_PHONE_PRIMARY.display}`"
      :title="`Zalo ${COMPANY_PHONE_PRIMARY.display}`"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>Zalo</span>
    </a>

    <a
      :href="PRODUCT_HIGHLIGHT_FACEBOOK_URL"
      class="float-icon float-messenger"
      aria-label="Facebook"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
        <path
          d="M12 2C6.48 2 2 6.15 2 11.26c0 2.9 1.44 5.49 3.69 7.18V22l3.3-1.82c.88.24 1.82.37 2.81.37 5.52 0 10-4.15 10-9.26S17.52 2 12 2Zm1.06 12.43-2.55-2.72-4.97 2.72 5.46-5.79 2.49 2.72 5.03-2.72-5.46 5.79Z"
          fill="currentColor"
        />
      </svg>
    </a>
  </div>
</template>
