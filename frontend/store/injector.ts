import { AppStore } from '@/store/store'

/* 
  Use this store injection to prevent circular dependencies in files 
  that use the store outside the components tree.
*/

let store: AppStore | undefined

export const injectStore = (_store: AppStore): void => {
  store = _store
}

export const getInjectedStore = (): AppStore | undefined => {
  return store
}
