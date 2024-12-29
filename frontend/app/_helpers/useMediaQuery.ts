import { useState, useEffect } from 'react'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  const formattedQuery = `(max-width: ${query}px)`

  useEffect(() => {
    const mediaQuery = window.matchMedia(formattedQuery)
    const handleChange = () => {
      setMatches(mediaQuery.matches)
    }
    // Set the initial value
    handleChange()

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [formattedQuery])

  return matches
}

export default useMediaQuery
