'use client'
import { Button, Icon } from '@/components'
// eslint-disable-next-line no-restricted-imports
import styles from './search.module.scss'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { tokens } from '@/styles/tokens'

type SearchProps = {
  className?: string
  placeholder?: string
  label?: string
}

export default function Search({ className, placeholder, label }: SearchProps) {
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
      {label && (
        <label className={styles.label} htmlFor='search'>
          {label}
        </label>
      )}
      <form className={styles.inputContainer} onSubmit={handleSubmit}>
        <Icon
          name='search'
          className={styles.icon}
          color={tokens.color.secondaryWeaker}
        />
        <input
          type='text'
          id='search'
          placeholder={placeholder ?? 'Search...'}
          className={styles.input}
          value={searchQuery}
          onChange={handleChange}
        />
        <div className={styles.inputButtonContainer}>
          <Button label='Search' className={styles.inputButton} />
        </div>
      </form>
    </div>
  )
}
