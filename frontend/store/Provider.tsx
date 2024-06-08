'use client'

import { ReactNode, useRef } from 'react'
import { AppStore, makeStore } from './store'
import { Provider } from 'react-redux'
import { injectStore } from '@/_api/api'

/* 
  We create a store if it doesn't exists,
  inject it into the API for use in the interceptors,
  provide it to the children for use in the app
*/
export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    storeRef.current = makeStore()
    injectStore(storeRef.current)
  }
  return <Provider store={storeRef.current}>{children}</Provider>
}
