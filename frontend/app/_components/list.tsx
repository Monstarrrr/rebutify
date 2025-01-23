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
}: type.ListProps<T>) {
  if (!items || items.length === 0) {
    return null
  }

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
      {items.map((item) => (
        <Layout layoutClassName={layoutClassName} key={item.id} item={item} />
      ))}
    </ul>
  )
}
