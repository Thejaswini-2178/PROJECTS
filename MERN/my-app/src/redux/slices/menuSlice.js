import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuItems: (state, action) => {
      state.items = action.payload
    },
  },
})

export const { setMenuItems } = menuSlice.actions

export default menuSlice.reducer
