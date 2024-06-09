import { createSlice } from '@reduxjs/toolkit'

export type UserType = {
  access?: string
  email: string
  id: number
  username: string
  refresh?: string
}

const initialState: UserType = {
  access: '',
  email: 'guest@guest.com',
  id: 0,
  refresh: '',
  username: 'Guest',
}

const userSlice = createSlice({
  initialState,
  name: 'user',
  reducers: {
    updateUser(state, { payload }) {
      return { ...state, ...payload }
    },
  },
})

export const { updateUser } = userSlice.actions
export default userSlice.reducer
