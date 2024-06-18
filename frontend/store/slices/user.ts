import { UserType } from '@/types'
import { createSlice } from '@reduxjs/toolkit'

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
