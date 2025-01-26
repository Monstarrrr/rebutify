'use client'
import Icon from '@/components/icon'
// eslint-disable-next-line no-restricted-imports
import styles from './search.module.scss'
import { tokens } from '@/styles/tokens'
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

type SearchProps = {
  className?: string
  placeholder?: string
}

export default function Search({ className, placeholder }: SearchProps) {
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
      <label className={styles.label} htmlFor='search'>
        Search
      </label>
      {/* Todo: switch to custom <Form> */}
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
          onKeyDown={handleKeyDown}
        />
      </form>
    </div>
  )
}
