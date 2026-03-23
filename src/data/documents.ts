import type { DocumentItem } from '../types/document'

/**
 * Danh sách tài liệu — thêm file vào `public/documents/` rồi cập nhật `fileUrl`.
 * Hoặc sau này thay bằng dữ liệu từ API.
 */
export const documentsSeed: DocumentItem[] = [
  {
    id: '1',
    title: 'Catalog tổng hợp sản phẩm Samyoung Vina',
    fileUrl: '/documents/catalog-samyoung-vina.pdf',
    downloadName: 'catalog-samyoung-vina.pdf',
  },
  {
    id: '2',
    title: 'Bảng thông số dụng cụ cắt gọt CNC',
    fileUrl: '/documents/bang-thong-so-dao-cnc.pdf',
    downloadName: 'bang-thong-so-dao-cnc.pdf',
  },
  {
    id: '3',
    title: 'Hướng dẫn lắp đặt & bảo dưỡng chuôi kẹp BT / HSK',
    fileUrl: '/documents/huong-dan-chuoi-kep.pdf',
    downloadName: 'huong-dan-chuoi-kep.pdf',
  },
  {
    id: '4',
    title: 'Tài liệu collet ER — lựa chọn và siết lực',
    fileUrl: '/documents/collet-er-tai-lieu.pdf',
    downloadName: 'collet-er-tai-lieu.pdf',
  },
]
