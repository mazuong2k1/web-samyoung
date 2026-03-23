import type { NewsItem } from '../types/news'

/**
 * Tin tức mẫu — thay bằng API sau.
 * Ảnh: đặt trong `public/` hoặc URL đầy đủ.
 */
export const newsSeed: NewsItem[] = [
  {
    id: '1',
    slug: 'gioi-thieu-dong-dao-phay-samyoung',
    title: 'Giới thiệu dòng dao phay CNC Samyoung — hiệu năng ổn định trên thép và inox',
    date: '2024.03.15',
    excerpt:
      'Samyoung Vina cập nhật danh mục mũi phay ngón, phay mặt và phay ren phù hợp gia công khuôn mẫu, linh kiện chính xác. Thông số cắt gợi ý và chính sách bảo hành được công bố rõ ràng theo từng nhóm vật liệu.',
    imageUrl: '/banner/product.jpeg',
  },
  {
    id: '2',
    slug: 'huong-dan-chon-collet-er',
    title: 'Hướng dẫn chọn collet ER & lực siết phù hợp chuôi kẹp BT',
    date: '2024.02.28',
    excerpt:
      'Collet đóng vai trò truyền mô-men và độ đồng tâm khi gia công tốc độ cao. Bài viết tóm tắt cách đọc ký hiệu, kiểm tra độ mòn và lưu ý khi kết hợp với đầu kẹp ER trên máy phay CNC.',
    imageUrl: '/banner/banner.jpg',
  },
  {
    id: '3',
    slug: 'bao-tri-chuoi-kep-dinh-ky',
    title: 'Bảo trì định kỳ chuôi kẹp BT / HSK — kéo dài tuổi thọ dụng cụ',
    date: '2024.01.10',
    excerpt:
      'Vệ sinh cone, kiểm tra độ rung và thay phụ kiện đúng hạn giúp giảm phế phẩm và tránh hỏng dao. Samyoung Vina khuyến nghị quy trình kiểm tra cơ bản cho xưởng gia công quy mô vừa và nhỏ.',
    imageUrl: '/banner/product.jpeg',
  },
  {
    id: '4',
    slug: 'lien-he-bao-gia-nhanh',
    title: 'Liên hệ báo giá nhanh — hotline & email hỗ trợ kỹ thuật',
    date: '2023.12.05',
    excerpt:
      'Khách hàng có thể gửi mã sản phẩm, số lượng và yêu cầu giao hàng qua form liên hệ hoặc Zalo. Đội ngũ tư vấn phản hồi trong giờ hành chính và hỗ trợ chọn dao theo máy và vật liệu.',
    imageUrl: '/banner/banner.jpg',
  },
]
