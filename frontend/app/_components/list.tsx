// list.tsx displays a list of any items of type T
// The list with include an infinite scroll or pagination

'use client'
// We import * as types to address naming conflicts with components
import * as type from '@/types'

export default function List<T extends type.Identifiable>({
  items,
  Layout,
}: type.ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <Layout key={item.id} item={item} />
      ))}
    </ul>
  )
}
