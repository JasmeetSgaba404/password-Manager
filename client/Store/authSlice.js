import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({

    name: "auth",
    initialState: {
        derivedKey: null,
        isAuthenticated: false
    },
    reducers: {
        setKey: (state, action) => {
            state.derivedKey = action.payload || null;
            if (state.derivedKey) {
                state.isAuthenticated = true;
            }
        },
        clearAuth: (state) => {
            state.derivedKey = null,
                state.isAuthenticated = false
        }
    }

})

export const { setKey, clearAuth } = authSlice.actions;

export default authSlice.reducer;

