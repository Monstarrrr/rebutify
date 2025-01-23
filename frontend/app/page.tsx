import { List, PostCard, Search, ArgumentCreation } from '@/components'
// eslint-disable-next-line no-restricted-imports
import styles from './page.module.scss'
import { fetchPosts } from '@/api/posts'
import { Suspense } from 'react'

export default async function Home() {
  const allArguments = await fetchPosts('argument')

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={styles.outerContainer}>
        <div className={styles.innerContainer}>
          <div className={styles.topContainer}>
            <h2 className={styles.title}>Which argument are you looking for ?</h2>
            <Search
              placeholder='e.g. "Plants feel pain tho"'
              className={styles.search}
            />
            <ArgumentCreation />
          </div>
          <div className={styles.resultsInfoContainer}>
            <p className={styles.resultsCounter}>
              {`
                ${allArguments.length} ${allArguments.length === 1 ? 'post' : 'posts'} found
              `}
            </p>
          </div>
          {/* PostCard must be server component or be called directly as a node to avoid hydration errors */}
          <List items={allArguments || []} Layout={PostCard} />
        </div>
      </div>
    </Suspense>
  )
}
