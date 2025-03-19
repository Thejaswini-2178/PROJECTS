// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//   user: null,
//   token: null,
// }

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     loginSuccess: (state, action) => {
//       state.user = action.payload.user
//       state.token = action.payload.token
//     },
//     logout: (state) => {
//       state.user = null
//       state.token = null
//     },
//   },
// })

// export const { loginSuccess, logout } = userSlice.actions

// export default userSlice.reducer


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  age: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.age = action.payload.age;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

