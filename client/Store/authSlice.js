import { createSlice } from "@reduxjs/toolkit"
import authThunk from "./authThunk";

const authSlice = createSlice({

    name: "auth",
    initialState: {
        derivedKey: null,
        isAuthenticated: false,
        user: null,
        checkAuth: false,
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
            state.isAuthenticated = false,
            state.user = null
        },
        setUser: (state, action) => {
            state.user = action.payload
        }
    },
      extraReducers: (builder) => {
        builder
        .addCase(authThunk.pending, (state) => {
            state.checkAuth = true
        })
        .addCase(authThunk.fulfilled, (state, action) => {
            state.checkAuth = false,
            state.isAuthenticated = true,
            state.user = action.payload
        })
        .addCase(authThunk.rejected, (state) => {
             state.checkAuth = false,
            state.isAuthenticated = false,
            state.user = null,
            state.derivedKey = null
        })

      }

})

export const { setKey, clearAuth, setUser } = authSlice.actions;

export default authSlice.reducer;

