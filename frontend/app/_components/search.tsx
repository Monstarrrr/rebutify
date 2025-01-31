'use client'
import { Button, Icon } from '@/components'
// eslint-disable-next-line no-restricted-imports
import styles from './search.module.scss'
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
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
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (q) {
      setSearchQuery(q)
    }
  }, [q])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams)
    console.log(`# params :`, params)
    console.log(`# searchQuery :`, searchQuery)
    if (searchQuery) {
      params.set('q', searchQuery)
    } else {
      params.delete('q')
    }

    // Reset to first page when searching
    // params.set('page', '1')

    router.replace(`${pathname}?${params.toString()}`)
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
          onKeyDown={handleKeyDown}
        />
        <div className={styles.inputButtonContainer}>
          <Button label='Search' className={styles.inputButton} />
        </div>
      </form>
    </div>
  )
}
