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
    addUpvote(state, action: { payload: string }) {
      return {
        ...state,
        upvotedPosts: `${state.upvotedPosts} ${action.payload}`,
      }
    },
    addDownvote(state, action: { payload: string }) {
      return {
        ...state,
        downvotedPosts: `${state.downvotedPosts} ${action.payload}`,
      }
    },
    removeUpvote(state, action: { payload: string }) {
      return {
        ...state,
        upvotedPosts: state.upvotedPosts.replace(`${action.payload} `, ''),
      }
    },
    removeDownvote(state, action: { payload: string }) {
      return {
        ...state,
        downvotedPosts: state.downvotedPosts.replace(`${action.payload} `, ''),
      }
    },
  },
})

export const {
  updateUser,
  removeUser,
  addUpvote,
  addDownvote,
  removeUpvote,
  removeDownvote,
} = userSlice.actions
export default userSlice.reducer
