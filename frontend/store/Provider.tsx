'use client'

import { ReactNode, useRef } from 'react'
import { AppStore, makeStore } from '@/store/store'
import { Provider } from 'react-redux'
import { injectStore } from '@/api/api'

type PropsType = Readonly<{
  children: ReactNode
}>

/* 
  We create a store if it doesn't exists,
  inject it into the API for use in the interceptors,
  provide it to the children for use in the app
*/
export default function StoreProvider({ children }: PropsType) {
  const storeRef = useRef<AppStore>()
  // Making sure we only create the store once
  if (!storeRef.current) {
    storeRef.current = makeStore()
    injectStore(storeRef.current)
  }
  return <Provider store={storeRef.current}>{children}</Provider>
}
