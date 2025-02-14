// list.tsx displays a list of any items of type T
// The list with include an infinite scroll or pagination

// We import * as types to address naming conflicts with components
import * as type from '@/types'
// eslint-disable-next-line no-restricted-imports
import styles from './list.module.scss'

export default function List<T extends type.Identifiable>({
  items,
  Layout,
  className,
  layoutClassName,
  displayCounter = true,
}: type.ListProps<T>) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div
      className={`${styles.resultsContainer} ${(className && className) || ''}`}
    >
      {displayCounter && (
        <div className={styles.resultsInfoContainer}>
          <p className={styles.resultsCounter}>
            {`
              ${items.length} ${items.length === 1 ? 'post' : 'posts'} found
            `}
          </p>
        </div>
      )}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {items.map((item) => (
          <Layout layoutClassName={layoutClassName} key={item.id} item={item} />
        ))}
      </ul>
    </div>
  )
}
