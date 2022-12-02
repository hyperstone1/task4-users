import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  token: null,
  id: null,
  name: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.id = action.payload.id;
    },
    removeUser(state) {
      state.email = null;
      state.token = null;
      state.id = null;
      state.name = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
