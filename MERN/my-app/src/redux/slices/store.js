// import { configureStore } from '@reduxjs/toolkit'
// import userReducer from './slices/userSlice'

// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
// })

// import { configureStore } from '@reduxjs/toolkit';

// const store = configureStore({
//   reducer: {},
// });

// export default store;

// import { configureStore } from '@reduxjs/toolkit';
// import eventReducer from './eventSlice';

// export const store = configureStore({
//   reducer: {
//     events: eventReducer,
//   },
// });

// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./userSlice";

// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
// });

import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import menuReducer from './slices/menuSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    menu: menuReducer,
  },
})




