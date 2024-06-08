import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  initialState: {
    name: 'John Doe',
  },
  name: 'user',
  reducers: {
    updateUser(state, action) {
      return action.payload
    },
  },
})

export const { updateUser } = userSlice.actions
export default userSlice.reducer
