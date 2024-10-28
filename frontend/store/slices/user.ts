import { UserInfo } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
    updatePostDownvotes(
      state,
      action: PayloadAction<['add' | 'remove', string]>,
    ): UserInfo {
      const actionType = action.payload[0]
      const postId = action.payload[1].toString() // because postId turns into a string smh
      if (actionType === 'add') {
        if (state.downvotedPosts.includes(postId)) return state
        return {
          ...state,
          downvotedPosts: `${state.downvotedPosts} ${postId}`,
        }
      } else {
        if (!state.downvotedPosts.includes(postId)) return state
        const downvotedPostsArray = state.downvotedPosts.split(' ')
        const downvotedArray = downvotedPostsArray.filter((id) => id !== postId)
        const updatedDownvotedPosts = downvotedArray.join(' ')
        return {
          ...state,
          downvotedPosts: updatedDownvotedPosts,
        }
      }
    },
    updatePostUpvotes(
      state,
      action: PayloadAction<['add' | 'remove', string]>,
    ): UserInfo {
      const actionType = action.payload[0]
      const postId = action.payload[1].toString() // because postId turns into a number smh
      if (actionType === 'add') {
        // verify that postId doesn't already exists in upvotedPosts
        if (state.upvotedPosts.includes(postId)) return state
        return {
          ...state,
          upvotedPosts: `${state.upvotedPosts} ${postId}`,
        }
      } else {
        if (!state.upvotedPosts.includes(postId)) return state
        const upvotedPostsArray = state.upvotedPosts.split(' ')
        const upvotedArray = upvotedPostsArray.filter((id) => id !== postId)
        const updatedUpvotedPosts = upvotedArray.join(' ')
        return {
          ...state,
          upvotedPosts: updatedUpvotedPosts,
        }
      }
    },
  },
})

export const { updateUser, removeUser, updatePostDownvotes, updatePostUpvotes } =
  userSlice.actions
export default userSlice.reducer
