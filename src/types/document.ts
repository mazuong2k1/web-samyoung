export type DocumentItem = {
  id: string
  title: string
  /** File trong `public/` (vd. `/documents/catalog.pdf`) hoặc URL đầy đủ */
  fileUrl: string
  /** Thuộc tính `download` — chỉ hiệu quả khi cùng origin */
  downloadName?: string
}
