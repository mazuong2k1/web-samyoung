/** Chỉ lấy chữ số từ chuỗi */
export function digitsOnly(s: string): string {
  return s.replace(/\D/g, '')
}

/** Định dạng số nguyên VN: 1.234.567 đ */
export function formatVndFromDigitsString(digits: string): string {
  const d = digitsOnly(digits)
  if (!d) return ''
  const n = parseInt(d, 10)
  if (Number.isNaN(n)) return ''
  const withDots = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${withDots} đ`
}

/** Chuẩn hóa giá đã lưu (có/không có dấu chấm, đ) → hiển thị trong input */
export function normalizeStoredPriceForInput(stored: string): string {
  return formatVndFromDigitsString(digitsOnly(stored))
}
