<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const year = new Date().getFullYear()

/** Hiện nút lên đầu trang sau khi cuộn xuống (px) */
const BACK_TOP_SCROLL_THRESHOLD = 320

const showBackTop = ref(false)

const updateBackTopVisibility = () => {
  showBackTop.value = window.scrollY > BACK_TOP_SCROLL_THRESHOLD
}

onMounted(() => {
  updateBackTopVisibility()
  window.addEventListener('scroll', updateBackTopVisibility, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateBackTopVisibility)
})

const infoLinks = [
  { label: 'Cam kết chất lượng', to: '/ve-chung-toi' },
  { label: 'Thanh toán đa dạng', to: '/tai-lieu' },
  { label: 'Tư vấn miễn phí', to: '/lien-he' },
  { label: 'Free ship toàn quốc', to: '/tin-tuc' },
  { label: 'Chính sách bảo hành', to: '/tai-lieu' },
  { label: 'Chính sách vận chuyển', to: '/tai-lieu' },
  { label: 'Chính sách mua hàng', to: '/tai-lieu' },
  { label: 'Chính sách chung', to: '/ve-chung-toi' },
]

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1EexnLvRh5/?mibextid=wwXIfr',
    class: 'footer-social-fb',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/',
    class: 'footer-social-yt',
  },
  {
    label: 'Zalo',
    href: 'https://zalo.me/0985493875',
    class: 'footer-social-zalo',
  },
]

/** Thay bằng link embed YouTube thật khi có (vd: https://www.youtube.com/embed/VIDEO_ID) */
const videoEmbedUrl = ''

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="site-footer">
    <div class="footer-main">
      <div class="container footer-grid">
        <!-- Cột 1: Thông tin công ty -->
        <div class="footer-col footer-col-company">
          <h3 class="footer-heading">CÔNG TY TNHH CNC SAMYOUNG VINA</h3>
          <p class="footer-company-sub">
            SAMYOUNG VINA CNC COMPANY LIMITED
          </p>
          <div class="footer-body-text">
            <p>
              <strong>Địa chỉ trụ sở chính:</strong> Thôn Sáp Mai, Xã Thiên Lộc,
              Thành phố Hà Nội, Việt Nam
            </p>
            <p>
              <strong>Điện thoại:</strong>
              <a href="tel:0962750598" class="footer-hotline">0962750598</a>
            </p>
            <p>
              <strong>Thư điện tử:</strong>
              <a href="mailto:cncsamyoungvina@gmail.com">cncsamyoungvina@gmail.com</a>
            </p>
            <p><strong>Mã số doanh nghiệp:</strong> 0111346229</p>
            <p>
              <strong>Người đại diện theo pháp luật:</strong> ĐẶNG THỊ HIỀN –
              Giám đốc
            </p>
          </div>
          <div class="footer-social">
            <a
              v-for="s in socialLinks"
              :key="s.label"
              :href="s.href"
              class="footer-social-btn"
              :class="s.class"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="s.label"
            >
              <span v-if="s.label === 'Zalo'">Zalo</span>
              <span v-else-if="s.label === 'YouTube'" class="footer-social-icon-yt">▶</span>
              <span v-else class="footer-social-icon-fb">f</span>
            </a>
          </div>
        </div>

        <!-- Cột 2: Thông tin -->
        <div class="footer-col">
          <h3 class="footer-heading">THÔNG TIN</h3>
          <ul class="footer-link-list">
            <li v-for="link in infoLinks" :key="link.label">
              <RouterLink :to="link.to" class="footer-link">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </div>

        <!-- Cột 3: Video -->
        <div class="footer-col">
          <h3 class="footer-heading">VIDEO</h3>
          <div class="footer-video-wrap">
            <iframe
              v-if="videoEmbedUrl"
              :src="videoEmbedUrl"
              title="Video giới thiệu Samyoung Vina"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
            <div v-else class="footer-video-placeholder">
              <span class="footer-video-play">▶</span>
              <span>Video giới thiệu</span>
              <small>Đang cập nhật</small>
            </div>
          </div>
        </div>

        <!-- Cột 4: Facebook -->
        <div class="footer-col">
          <h3 class="footer-heading">FACEBOOK</h3>
          <div class="footer-fb-box">
            <p class="footer-fb-title">Samyoung Vina – Dụng cụ CNC</p>
            <p class="footer-fb-desc">Theo dõi trang để cập nhật sản phẩm &amp; khuyến mãi.</p>
            <a
              href="https://www.facebook.com/share/1EexnLvRh5/?mibextid=wwXIfr"
              class="footer-fb-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Theo dõi trang
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p class="footer-copyright">
          © Bản quyền thuộc về CÔNG TY TNHH CNC SAMYOUNG VINA © {{ year }} All Rights Reserved.
        </p>
      </div>
    </div>

    <button
      type="button"
      class="footer-back-top"
      :class="{ 'footer-back-top--visible': showBackTop }"
      aria-label="Lên đầu trang"
      @click="scrollToTop"
    >
      <svg
        class="footer-back-top-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.25"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V9M8 14l4-5 4 5" />
      </svg>
    </button>
  </footer>
</template>
