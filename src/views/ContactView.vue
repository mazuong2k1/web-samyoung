<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import AppBreadcrumbs from '../components/layout/AppBreadcrumbs.vue'
import { createFirebaseContact } from '../services/firebaseApi'
import { COMPANY_PHONES } from '../data/companyPhones'

const form = reactive({
  fullName: '',
  address: '',
  phone: '',
  email: '',
  message: '',
})

const submitted = ref(false)
const submitting = ref(false)

const rules: Record<string, Rule[]> = {
  fullName: [
    {
      validator: async (_rule, value) => {
        if (!value || !String(value).trim()) {
          return Promise.reject(new Error('Vui lòng nhập họ tên.'))
        }
        return Promise.resolve()
      },
      trigger: ['change', 'blur'],
    },
  ],
  phone: [
    {
      validator: async (_rule, value) => {
        if (!value || !String(value).trim()) {
          return Promise.reject(new Error('Vui lòng nhập số điện thoại.'))
        }
        const digits = String(value).replace(/\D/g, '')
        if (digits.length < 8 || digits.length > 12) {
          return Promise.reject(new Error('Số điện thoại chưa hợp lệ (8–12 chữ số).'))
        }
        return Promise.resolve()
      },
      trigger: ['change', 'blur'],
    },
  ],
  email: [
    {
      validator: async (_rule, value) => {
        if (!value || !String(value).trim()) {
          return Promise.resolve()
        }
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!re.test(String(value).trim())) {
          return Promise.reject(new Error('Email chưa đúng định dạng.'))
        }
        return Promise.resolve()
      },
      trigger: ['change', 'blur'],
    },
  ],
  message: [
    {
      validator: async (_rule, value) => {
        if (!value || !String(value).trim()) {
          return Promise.reject(new Error('Vui lòng nhập nội dung.'))
        }
        return Promise.resolve()
      },
      trigger: ['change', 'blur'],
    },
  ],
}

const onFinish = async () => {
  submitting.value = true
  try {
    await createFirebaseContact({
      fullName: form.fullName.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    })

    submitted.value = true
    form.fullName = ''
    form.address = ''
    form.phone = ''
    form.email = ''
    form.message = ''

    void message.success('Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm.')
    window.setTimeout(() => {
      submitted.value = false
    }, 4000)
  } catch (error) {
    const text = error instanceof Error ? error.message : 'Lỗi không xác định'
    void message.error(`Không thể gửi liên hệ: ${text}`)
  } finally {
    submitting.value = false
  }
}

const company = {
  name: 'CÔNG TY TNHH CNC SAMYOUNG VINA',
  nameEn: 'SAMYOUNG VINA CNC COMPANY LIMITED',
  address: 'Thôn Sáp Mai, Xã Thiên Lộc, Thành phố Hà Nội, Việt Nam',
  email: 'cncsamyoungvina@gmail.com',
  taxId: '0111346229',
  representative: 'ĐẶNG THỊ HIỀN – Giám đốc',
}

const socials = [
  ...COMPANY_PHONES.map((p) => ({
    label: 'Zalo',
    href: p.zalo,
    icon: 'zalo' as const,
    phoneHint: p.display,
  })),
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1EexnLvRh5/?mibextid=wwXIfr',
    icon: 'fb' as const,
  },
  {
    label: 'Messenger',
    href: 'https://www.facebook.com/share/1LGj4X8hWB/?mibextid=wwXIfr',
    icon: 'mess' as const,
  },
]
</script>

<template>
  <section class="contact-page">
    <div class="container">
      <AppBreadcrumbs
        :items="[
          { label: 'Trang chủ', to: '/' },
          { label: 'Liên hệ' },
        ]"
      />
      <header class="contact-hero">
        <h1 class="page-main-title">Liên hệ</h1>
        <p>Để lại thông tin — đội ngũ tư vấn sẽ phản hồi sớm nhất có thể.</p>
      </header>

      <div class="contact-layout">
        <!-- Cột trái: thông tin công ty -->
        <div class="contact-card contact-card-info">
          <h2 class="contact-card-title">{{ company.name }}</h2>
          <p class="contact-company-en">{{ company.nameEn }}</p>

          <ul class="contact-info-list">
            <li class="contact-info-item">
              <span class="contact-info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10Z" />
                  <circle cx="12" cy="11" r="2.5" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <div>
                <strong>Trụ sở chính</strong>
                <span>{{ company.address }}</span>
              </div>
            </li>
            <li class="contact-info-item">
              <span class="contact-info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path
                    d="M6.62 10.79a15 15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A16 16 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.21Z"
                  />
                </svg>
              </span>
              <div>
                <strong>Điện thoại / Hotline</strong>
                <span class="contact-phones-row">
                  <template v-for="(p, i) in COMPANY_PHONES" :key="p.tel">
                    <a :href="`tel:${p.tel}`" class="contact-link-phone">{{ p.display }}</a>
                    <span v-if="i < COMPANY_PHONES.length - 1" class="contact-phone-sep" aria-hidden="true">
                      —
                    </span>
                  </template>
                </span>
              </div>
            </li>
            <li class="contact-info-item">
              <span class="contact-info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <div>
                <strong>Email</strong>
                <a :href="`mailto:${company.email}`">{{ company.email }}</a>
              </div>
            </li>
            <li class="contact-info-item">
              <span class="contact-info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
              </span>
              <div>
                <strong>Mã số doanh nghiệp</strong>
                <span>{{ company.taxId }}</span>
              </div>
            </li>
            <li class="contact-info-item">
              <span class="contact-info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <div>
                <strong>Người đại diện theo pháp luật</strong>
                <span>{{ company.representative }}</span>
              </div>
            </li>
          </ul>

          <div class="contact-social">
            <span class="contact-social-label">Liên hệ nhanh</span>
            <div class="contact-social-btns">
              <a
                v-for="s in socials"
                :key="`${s.label}-${s.href}`"
                :href="s.href"
                class="contact-social-btn"
                :class="`is-${s.icon}`"
                target="_blank"
                rel="noopener noreferrer"
                :title="'phoneHint' in s && s.phoneHint ? `Zalo ${s.phoneHint}` : undefined"
              >
                <span v-if="s.icon === 'zalo'">Zalo</span>
                <span v-else-if="s.icon === 'fb'">f</span>
                <span v-else>M</span>
              </a>
            </div>
          </div>

          <p class="contact-note">
            * Hãy để lại
            <strong>số điện thoại</strong> và <strong>nội dung</strong> sản phẩm cần tìm — chúng tôi sẽ liên hệ
            báo giá sớm nhất.
          </p>
        </div>

        <!-- Cột phải: form Ant Design Vue -->
        <div class="contact-card contact-card-form">
          <h2 class="contact-card-title">Gửi yêu cầu</h2>
          <p class="contact-form-intro">Các trường có dấu <span class="req">*</span> là bắt buộc.</p>

          <a-form
            :model="form"
            :rules="rules"
            layout="vertical"
            class="contact-ant-form"
            autocomplete="off"
            @finish="onFinish"
          >
            <a-form-item name="fullName">
              <template #label>
                <span>Họ tên <span class="req">*</span></span>
              </template>
              <a-input v-model:value="form.fullName" placeholder="Nguyễn Văn A" autocomplete="name" />
            </a-form-item>

            <a-form-item label="Địa chỉ" name="address">
              <a-input
                v-model:value="form.address"
                placeholder="Tỉnh / Thành phố"
                autocomplete="street-address"
              />
            </a-form-item>

            <a-form-item name="phone">
              <template #label>
                <span>Điện thoại <span class="req">*</span></span>
              </template>
              <a-input
                v-model:value="form.phone"
                placeholder="09xx xxx xxx"
                autocomplete="tel"
                inputmode="tel"
              />
            </a-form-item>

            <a-form-item label="Email" name="email">
              <a-input v-model:value="form.email" placeholder="email@domain.com" autocomplete="email" />
            </a-form-item>

            <a-form-item name="message">
              <template #label>
                <span>Nội dung <span class="req">*</span></span>
              </template>
              <a-textarea
                v-model:value="form.message"
                :rows="5"
                placeholder="Mô tả sản phẩm, số lượng, hoặc yêu cầu kỹ thuật..."
              />
            </a-form-item>

            <p v-if="submitted" class="contact-success" role="status">
              Cảm ơn bạn! Chúng tôi đã nhận thông tin và sẽ phản hồi trong thời gian sớm nhất.
            </p>

            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                class="contact-submit contact-submit-ant"
                :loading="submitting"
              >
                Gửi đi
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </section>
</template>
