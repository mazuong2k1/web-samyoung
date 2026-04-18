<script setup lang="ts">
import { PRODUCT_HIGHLIGHT_FACEBOOK_URL } from '../../data/defaultProductHighlight'
import { COMPANY_PHONE_PRIMARY } from '../../data/companyPhones'

const email = 'cncsamyoungvina@gmail.com'
</script>

<template>
  <section class="product-highlight-contact" aria-labelledby="product-highlight-title">
    <h3 id="product-highlight-title" class="product-highlight-contact__title">Điểm nổi bật — Thông tin liên hệ</h3>
    <ul class="product-highlight-contact__list">
      <li>
        Thông tin liên hệ:
        <strong class="product-highlight-contact__company">CÔNG TY TNHH CNC SAMYOUNG VINA</strong>
      </li>
      <li>
        Địa chỉ: Thôn Sáp Mai, Xã Thiên Lộc, Thành phố Hà Nội, Việt Nam
      </li>
      <li class="product-highlight-contact__phones">
        <span>Hotline:</span>
        <a :href="`tel:${COMPANY_PHONE_PRIMARY.tel}`" class="product-highlight-contact__link">{{
          COMPANY_PHONE_PRIMARY.display
        }}</a>
      </li>
      <li>
        Email:
        <a :href="`mailto:${email}`" class="product-highlight-contact__link">{{ email }}</a>
      </li>
      <li class="product-highlight-contact__social-only">
        <div class="footer-social product-highlight-contact__social-inline">
          <a
            :href="PRODUCT_HIGHLIGHT_FACEBOOK_URL"
            class="footer-social-btn footer-social-fb"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook Samyoung Vina Cnc"
            title="Facebook"
          >
            <span class="footer-social-icon-fb">f</span>
          </a>
          <a
            :href="COMPANY_PHONE_PRIMARY.zalo"
            class="footer-social-btn footer-social-zalo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zalo 098 5493875"
            title="Zalo 098 5493875"
          >
            <span>Zalo</span>
          </a>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.product-highlight-contact {
  margin: 1.25rem 0 1.5rem;
  padding: 1.15rem 1.25rem 1.2rem;
  border-radius: 0 10px 10px 0;
  border-left: 4px solid #c62828;
  background: linear-gradient(120deg, rgba(255, 241, 241, 0.95) 0%, rgba(255, 252, 252, 0.98) 55%, #fff 100%);
  box-shadow: 0 2px 12px rgba(198, 40, 40, 0.08);
}

.product-highlight-contact__title {
  margin: 0 0 0.85rem;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #b71c1c;
  text-transform: uppercase;
}

.product-highlight-contact__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.product-highlight-contact__list li {
  margin: 0.55rem 0;
  line-height: 1.65;
  color: #c62828;
  font-size: 0.95rem;
}

.product-highlight-contact__phones {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.25rem;
}

.product-highlight-contact__company {
  display: inline;
  color: #b71c1c;
  font-weight: 700;
}

.product-highlight-contact__social-only {
  margin-top: 0.35rem;
}

.product-highlight-contact__social-inline.footer-social {
  margin-top: 0;
  align-items: center;
}

.product-highlight-contact__sep {
  color: rgba(183, 28, 28, 0.55);
  user-select: none;
}

.product-highlight-contact__link {
  color: #c62828;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid rgba(198, 40, 40, 0.35);
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.product-highlight-contact__link:hover {
  color: #8e0000;
  border-bottom-color: #8e0000;
}
</style>
