import { PopupProps } from '@/types'
import { createSlice } from '@reduxjs/toolkit'

const initialState: PopupProps = {
  isVisible: false,
  content: null,
}

const popupSlice = createSlice({
  initialState,
  name: 'popup',
  reducers: {
    showPopup(state, action: { payload: PopupProps }) {
      return { ...state, ...action.payload, isVisible: true }
    },
    hidePopup() {
      return { ...initialState }
    },
  },
})

export const { showPopup, hidePopup } = popupSlice.actions
export default popupSlice.reducer
