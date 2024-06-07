'use client'

import { ReactNode, useRef } from 'react'
import { AppStore, makeStore } from './store'
import { Provider } from 'react-redux'

// We create a store if it doesn't exist, then provide it to the children
export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }
  return <Provider store={storeRef.current}>{children}</Provider>
}
