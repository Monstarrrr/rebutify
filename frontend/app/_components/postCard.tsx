// postCard.tsx displays a single clickable post preview

import type { Post } from '@/types'
import Link from 'next/link'
import 'globals.css'
// eslint-disable-next-line no-restricted-imports
import styles from './postCard.module.scss'
import { Tag } from '@/components'

const PostCard: React.FC<{ item: Post; layoutClassName?: string }> = ({
  item,
  layoutClassName,
}) => {
  const { title, type, id, updated, isPending = false, upvotes, downvotes } = item

  const date = new Date(updated)
  const day = String(date.getDate()).padStart(2, '0') // Ensure two digits
  const month = date.toLocaleString('en-US', { month: 'short' }) // Abbreviated month
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  // Temporary random data
  const randomBoolean = Math.random() < 0.5
  const randomNumber = Math.floor(Math.random() * 100)
  const random = randomBoolean ? randomNumber : 0

  // get first 20 characters of body
  const body = item.body
  const truncatedBody = body.length > 32 ? body.substring(0, 32) + '...' : body

  return (
    <Link
      className={`${styles.link} ${layoutClassName ?? ''}`}
      href={`/${type}/${id}`}
    >
      <div className={styles.wrapper}>
        {' '}
        <div className={styles.title}>
          {type === 'argument' ? title : truncatedBody}
        </div>
        {/* div used at (routes)\profile\page.module.scss */}
        {type === 'argument' && (
          <div className={styles.viewCount}>{random} views</div>
        )}
        {type === 'rebuttal' && (
          <div className={styles.viewCount}>{upvotes - downvotes} votes</div>
        )}
        {isPending && (
          <div className={styles.tag}>
            <Tag />
          </div>
        )}
        <div className={styles.date}>
          {`${day} ${month} ${year} (${hours}:${minutes})`}
        </div>
      </div>
    </Link>
  )
}

export default PostCard
