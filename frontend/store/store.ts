import { configureStore } from '@reduxjs/toolkit'
import userSlice from '@/store/slices/user'
import popupSlice from '@/store/slices/popup'
/* 
  Next's multi-page architecture requires moving from defining store as a global 
  to instead defining a makeStore function that returns a new store for each request.
*/
export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add reducers here
      user: userSlice,
      popup: popupSlice,
    },
  })
}
// Create a store for each request
export const store = makeStore()

export default store
// Infer the type of makeStore from the store itself
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
