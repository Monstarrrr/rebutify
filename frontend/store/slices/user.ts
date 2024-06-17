import { createSlice } from '@reduxjs/toolkit'

export type UserType = {
  access?: string
  email: string
  id: number | null
  refresh?: string
  username: string
}

const initialState: UserType = {
  email: '',
  id: null,
  username: '',
}

const userSlice = createSlice({
  initialState,
  name: 'user',
  reducers: {
    removeUser() {
      return initialState
    },
    updateUser(state, { payload }) {
      return { ...state, ...payload }
    },
  },
})

export const { updateUser, removeUser } = userSlice.actions
export default userSlice.reducer
