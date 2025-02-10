import { createSlice } from "@reduxjs/toolkit";

const initialState = {  // ✅ Corrected "initialstate" to "initialState"
    currentuser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,  // ✅ Corrected reference here
    reducers: {
        signinstart: (state) => {
            state.loading = true;
        },
        signinsuccess: (state, action) => {
            state.currentuser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signinfailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { signinstart, signinsuccess, signinfailure } = userSlice.actions;
export default userSlice.reducer;
