import { UserInfo } from '@/types'
import { createSlice } from '@reduxjs/toolkit'

const initialState: UserInfo = {
  email: '',
  id: null,
  refresh: '',
  access: '',
  username: '',
  upvotedPosts: '',
  downvotedPosts: '',
}

const userSlice = createSlice({
  initialState,
  name: 'user',
  reducers: {
    removeUser() {
      return initialState
    },
    updateUser(state, action: { payload: UserInfo }) {
      return { ...state, ...action.payload }
    },
  },
})

export const { updateUser, removeUser } = userSlice.actions
export default userSlice.reducer
