import type { PartnerItem } from '../types/partner'

/**
 * Danh sách đối tác — hiện dùng dữ liệu tĩnh.
 * Sau này thay bằng: fetch('/api/partners') rồi gán vào state trong PartnersView.
 */
export const partnersSeed: PartnerItem[] = [
  { id: '1', name: 'Widin' },
  { id: '2', name: 'Mitutoyo' },
  { id: '3', name: 'Nachi' },
  { id: '4', name: 'Sandvik Coromant' },
  { id: '5', name: 'Kyocera' },
  { id: '6', name: 'ISCAR' },
]
