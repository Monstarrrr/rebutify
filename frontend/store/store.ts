import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/user'
/* 
  Next's multi-page architecture requires moving from defining store as a global 
  to instead defining a makeStore function that returns a new store for each request.
*/
export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add reducers here
      user: userSlice,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
