<script setup lang="ts">
import { ref } from 'vue'
import AppBreadcrumbs from '../components/layout/AppBreadcrumbs.vue'
import PartnerGrid from '../components/sections/PartnerGrid.vue'
import BestSellingSidebar from '../components/sections/BestSellingSidebar.vue'
import { partnersSeed } from '../data/partners'
import { bestSellingProducts } from '../data/siteData'
import type { PartnerItem } from '../types/partner'

/**
 * Sau khi có API: const res = await fetch('/api/partners'); partners.value = await res.json()
 */
const partners = ref<PartnerItem[]>(partnersSeed)
</script>

<template>
  <section class="partners-page">
    <div class="container">
      <AppBreadcrumbs
        :items="[
          { label: 'Trang chủ', to: '/' },
          { label: 'Đối tác' },
        ]"
      />

      <h1 class="page-main-title">Đối tác</h1>

      <div class="about-layout">
        <div class="partners-main">
          <div class="partners-intro">
            <p>
              <strong>Công ty TNHH CNC Samyoung Vina</strong> cam kết mang đến cho khách hàng các sản phẩm
              dụng cụ cắt gọt, phụ kiện máy CNC và giải pháp kỹ thuật đạt tiêu chuẩn chất lượng, có nguồn gốc
              rõ ràng và đồng bộ với nhu cầu gia công thực tế.
            </p>
            <p>
              Chúng tôi hợp tác với các thương hiệu và nhà sản xuất uy tín từ nhiều quốc gia như Thụy Điển,
              Đức, Đài Loan, Hàn Quốc và khu vực — nhằm đa dạng hóa danh mục, đảm bảo hiệu năng cắt gọt ổn định
              và hỗ trợ tư vấn lựa chọn dao cụ phù hợp từng loại vật liệu và máy gia công.
            </p>
          </div>

          <PartnerGrid :partners="partners" />
        </div>

        <BestSellingSidebar :items="bestSellingProducts" />
      </div>
    </div>
  </section>
</template>
