/**
 * Hai số điện thoại / Zalo hiển thị thống nhất trên website.
 */
export const COMPANY_PHONE_PRIMARY = {
  display: '098 5493875',
  tel: '0985493875',
  zalo: 'https://zalo.me/84985493875',
} as const

export const COMPANY_PHONE_SECONDARY = {
  display: '096 1054936',
  tel: '0961054936',
  zalo: 'https://zalo.me/84961054936',
} as const

export const COMPANY_PHONES = [COMPANY_PHONE_PRIMARY, COMPANY_PHONE_SECONDARY] as const

/** Một chuỗi cho trường hotline đơn (sản phẩm, siteData) */
export const COMPANY_HOTLINE_DISPLAY = '098 5493875 — 096 1054936'
