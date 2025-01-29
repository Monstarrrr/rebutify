import { UserInfo } from '@/types'
import { createSlice } from '@reduxjs/toolkit'

const initialState: UserInfo = {
  email: '???@???.com',
  id: '',
  refresh: '',
  access: '',
  username: 'Guest',
  reputation: 0,
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
