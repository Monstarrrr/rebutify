import { List, PostCard, Search, ArgumentCreation } from '@/components'
// eslint-disable-next-line no-restricted-imports
import styles from './page.module.scss'
import { fetchPosts } from '@/api/posts'
import { Suspense } from 'react'

export default async function Home({
  searchParams,
}: {
  searchParams: {
    q?: string
  }
}) {
  const query = searchParams?.q || ''
  const allArguments = await fetchPosts('argument', query)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={styles.outerContainer}>
        <div className={styles.innerContainer}>
          <div className={styles.topContainer}>
            <h2 className={styles.title}>
              Search an argument, see its rebuttals, and create your own !
            </h2>
            <Search
              placeholder='e.g. "Plants feel pain tho"'
              className={styles.search}
            />
            <ArgumentCreation />
          </div>
          {/* PostCard must be server component or be called directly as a node to avoid hydration errors */}
          <List items={allArguments || []} Layout={PostCard} />
        </div>
      </div>
    </Suspense>
  )
}
