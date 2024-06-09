import { createSlice } from '@reduxjs/toolkit'

export type UserType = {
  access?: string
  email: string
  id: number
  refresh?: string
  username: string
}

const initialState: UserType = {
  access: '',
  email: '',
  id: 0,
  refresh: '',
  username: '',
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
