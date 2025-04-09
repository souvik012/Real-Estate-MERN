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
            console.log("Redux received user:", action.payload);
            state.currentuser = action.payload;
            state.loading = false;
            state.error = null;
            console.log("Redux Updated - Current User:", action.payload); // ✅ Debugging

        },
        signinfailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateuserstart:(state) => {
            state.loading = true;
        },
        updateusersuccess:(state,action)=>{
            state.currentuser = action.payload;
            state.loading = false ;
            state.error = null;
        },
        updateuserfailure:(state,action)=>{
            state.error = action.payload
            state.loading = false
        },
        logout: (state) => {
            state.currentuser = null;
            state.loading = false;
            state.error = null;
          },
          
    },
});

export const { 
    signinstart,
    signinsuccess,
    signinfailure,
    updateuserstart,
    updateusersuccess,
    updateuserfailure,
    logout} = userSlice.actions;
export default userSlice.reducer;
