<script setup lang="ts">
import AppBreadcrumbs from '../components/layout/AppBreadcrumbs.vue'
import BestSellingSidebar from '../components/sections/BestSellingSidebar.vue'
import { useBestSellingProducts } from '../composables/useBestSellingProducts'

/**
 * Ảnh giới thiệu: copy file vào `public/` (vd. `public/images/gioi-thieu.jpg`) rồi gán:
 * const aboutIntroImage = '/images/gioi-thieu.jpg'
 * Để '' = hiển thị khung placeholder cho đến khi có ảnh.
 */
const aboutIntroImage = ''
const { items: bestSellingProducts } = useBestSellingProducts()
</script>

<template>
  <section class="about-page">
    <div class="container">
      <AppBreadcrumbs
        :items="[
          { label: 'Trang chủ', to: '/' },
          { label: 'Về chúng tôi' },
        ]"
      />
      <h1 class="page-main-title">VỀ CHÚNG TÔI</h1>

      <div class="about-layout">
        <article class="about-main">
          <h2 class="about-subtitle">
            Giới thiệu chung Công ty TNHH CNC Samyoung Vina
          </h2>

          <div class="about-prose">
            <p>
              <strong>Công ty TNHH CNC Samyoung Vina</strong> (Samyoung Vina CNC Company Limited) hoạt động
              trong lĩnh vực thiết bị cơ khí chính xác, máy công cụ, dụng cụ cắt gọt kim loại và phụ kiện
              máy CNC. Chúng tôi hướng tới việc đồng hành cùng khách hàng trong gia công khuôn mẫu, cơ khí
              chế tạo và sản xuất linh kiện với chất lượng ổn định, hiệu suất cao.
            </p>
            <p>
              Đội ngũ tư vấn kỹ thuật hỗ trợ lựa chọn dao phay, mũi khoan, taro, chuôi kẹp, collet và các
              giải pháp gá kẹp phù hợp từng loại vật liệu và máy gia công. Sản phẩm được kiểm soát nguồn gốc,
              rõ ràng thông số kỹ thuật và chính sách bảo hành theo từng nhóm hàng.
            </p>
          </div>

          <figure class="about-figure">
            <img
              v-if="aboutIntroImage"
              :src="aboutIntroImage"
              alt="Dụng cụ cắt gọt và phụ kiện máy CNC Samyoung Vina"
              class="about-figure-img"
            />
            <div
              v-else
              class="about-figure-placeholder"
              role="img"
              aria-label="Ảnh giới thiệu sẽ được cập nhật"
            >
              <span class="about-figure-placeholder-icon" aria-hidden="true">📷</span>
              <p class="about-figure-placeholder-text">Ảnh giới thiệu sẽ được cập nhật.</p>
            </div>
            <figcaption>Hệ thống dụng cụ cắt gọt &amp; phụ kiện máy CNC</figcaption>
          </figure>

          <div class="about-prose">
            <p>
              Trụ sở đặt tại <strong>Thôn Sáp Mai, Xã Thiên Lộc, Thành phố Hà Nội</strong>. Khách hàng có thể
              liên hệ trực tiếp qua hotline
              <a href="tel:0985493875">098 5493875</a> —
              <a href="tel:0961054936">096 1054936</a>
              hoặc email
              <a href="mailto:cncsamyoungvina@gmail.com">cncsamyoungvina@gmail.com</a> để nhận báo giá và hỗ trợ
              kỹ thuật.
            </p>
            <p class="about-prose-en">
              (Samyoung Vina CNC Company Limited supplies industrial cutting tools, precision toolholders, and
              technical consulting for CNC machining — focusing on reliability, traceability, and long-term
              partnership with manufacturing customers.)
            </p>
          </div>
        </article>

        <BestSellingSidebar :items="bestSellingProducts" />
      </div>
    </div>
  </section>
</template>
