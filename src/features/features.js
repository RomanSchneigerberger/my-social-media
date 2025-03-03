import { createSlice } from "@reduxjs/toolkit";

let initialUser = '';

const initialState = {
	user: localStorage.getItem("user") || initialUser, // pomenqtj
	token: localStorage.getItem("token") || null, // pomenqtj
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setToken: (state, action) => { // pomenqtj
			state.token = action.payload.token; // pomenqtj
			localStorage.setItem("token", action.payload.token); // pomenqtj
		},
	},
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
