'use client'
// eslint-disable-next-line no-restricted-imports
import styles from './search.module.scss'

type SearchProps = {
  className?: string
  placeholder?: string
}

export default function Search({ className, placeholder }: SearchProps) {
  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <label className={styles.label} htmlFor='search'>
        Search
      </label>
      <input
        type='text'
        id='search'
        placeholder={placeholder ?? 'Search...'}
        className={styles.input}
      />
    </div>
  )
}
