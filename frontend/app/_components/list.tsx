// list.tsx displays a list of any items of type T

'use client'
// We import * as types to address naming conflicts with components
import * as type from '@/types'

export default function List<T extends type.Identifiable>({
  items,
  Layout,
}: type.ListProps<T>) {
  return (
    <div>
      {items.map((item) => (
        <Layout key={item.id} item={item} />
      ))}
    </div>
  )
}
