import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  initialState: {
    name: 'John Doe',
  },
  name: 'user',
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
