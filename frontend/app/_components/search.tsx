'use client'
import Icon from '@/components/icon'
// eslint-disable-next-line no-restricted-imports
import styles from './search.module.scss'
import { tokens } from '@/styles/tokens'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type SearchProps = {
  className?: string
  placeholder?: string
}

export default function Search({ className, placeholder }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const searchParams = useSearchParams()
  const q = searchParams.get('q')

  useEffect(() => {
    if (q) {
      setSearchQuery(q)
    }
  }, [q])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <label className={styles.label} htmlFor='search'>
        Search
      </label>
      <form className={styles.inputContainer} onSubmit={handleSubmit}>
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
          value={searchQuery}
          onChange={handleChange}
        />
      </form>
    </div>
  )
}
