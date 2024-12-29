// list.tsx displays a list of any items of type T
// The list with include an infinite scroll or pagination

// We import * as types to address naming conflicts with components
import * as type from '@/types'

export default function List<T extends type.Identifiable>({
  items,
  Layout,
  styles,
  className,
  layoutClassName,
}: type.ListProps<T & { updated?: string }>) {
  const sortedItems = [...items].sort((a, b) => {
    if (a.updated && b.updated) {
      return new Date(b.updated).getTime() - new Date(a.updated).getTime()
    }
    return 0 // Keep the items order unchanged if "updated" is missing
  })
  return (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        ...styles,
      }}
      className={className}
    >
      {sortedItems.map((item) => (
        <Layout layoutClassName={layoutClassName} key={item.id} item={item} />
      ))}
    </ul>
  )
}
