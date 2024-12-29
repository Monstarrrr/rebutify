// postCard.tsx displays a single clickable post preview

'use client'
import type { Post } from '@/types'
import Link from 'next/link'
import 'globals.css'
import styles from './postCard.module.css'

const PostCard: React.FC<{ item: Post }> = ({ item }) => {
  const { title, type, id, upvotes, downvotes, updated } = item

  const date = new Date(updated)
  const day = String(date.getDate()).padStart(2, '0') // Ensure two digits
  const month = date.toLocaleString('en-US', { month: 'short' }) // Abbreviated month
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return (
    <Link className={styles.link} href={`/${type}/${id}`}>
      <div className={`sectionStyle ${styles.sectionStyleOverride}`}>
        <div className={styles.voteCount}>{upvotes - downvotes} votes</div>
        <div className={styles.title}>
          <h3>{title}</h3>
        </div>
        <div className={styles.date}>
          {`${day} ${month} ${year} (${hours}:${minutes})`}
        </div>
      </div>
    </Link>
  )
}

export default PostCard
