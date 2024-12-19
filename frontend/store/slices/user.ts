import { UserInfo } from '@/types'
import { createSlice } from '@reduxjs/toolkit'

const initialState: UserInfo = {
  email: '',
  id: '0',
  refresh: '',
  access: '',
  username: 'Guest',
  upvotedPosts: [],
  downvotedPosts: [],
  followedPosts: [],
}

const userSlice = createSlice({
  initialState,
  name: 'user',
  reducers: {
    removeUser() {
      return {
        ...initialState,
        id: null,
        username: '',
      }
    },
    updateUser(state, action: { payload: UserInfo }) {
      return { ...state, ...action.payload }
    },
  },
})

export const { updateUser, removeUser } = userSlice.actions
export default userSlice.reducer
