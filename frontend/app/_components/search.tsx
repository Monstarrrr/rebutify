'use client'
import Icon from '@/components/icon'
// eslint-disable-next-line no-restricted-imports
import styles from './search.module.scss'
import { tokens } from '@/styles/tokens'

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
      <div className={styles.inputContainer}>
        <Icon
          name='search'
          className={styles.icon}
          color={tokens.color.secondaryWeak}
        />
        <input
          type='text'
          id='search'
          placeholder={placeholder ?? 'Search...'}
          className={styles.input}
        />
      </div>
    </div>
  )
}
