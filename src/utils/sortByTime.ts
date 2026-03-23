/**
 * Sắp xếp theo createdAt (mới nhất lên đầu). Bản ghi thiếu createdAt xuống cuối.
 */
export function sortByCreatedAtDesc<T extends { createdAt?: string; name?: string }>(a: T, b: T): number {
  const ta = a.createdAt ? Date.parse(a.createdAt) : 0
  const tb = b.createdAt ? Date.parse(b.createdAt) : 0
  if (tb !== ta) return tb - ta
  return (a.name ?? '').localeCompare(b.name ?? '', 'vi')
}
