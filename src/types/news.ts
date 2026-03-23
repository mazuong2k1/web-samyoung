export type NewsItem = {
  id: string
  title: string
  /** Hiển thị dạng 2024.03.15 */
  date: string
  excerpt: string
  imageUrl: string
  /** Dùng cho trang chi tiết sau này */
  slug?: string
}
