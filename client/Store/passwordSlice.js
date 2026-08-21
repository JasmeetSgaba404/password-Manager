import { createSlice } from "@reduxjs/toolkit";
import fetchVault from "./token";
import postVault from "./postVault";
import editVault from "./editVault";
import deleteVault from "./deleteVault";


const passwordSlice = createSlice({

    name: "password",
    initialState: {
        items: [],
        isLoading: false,
    },
    reducers: {
        addPassword: (state, action) => {
            state.site_name = action.payload || null;
            state.password = action.payload || null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVault.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchVault.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload
            })
            .addCase(fetchVault.rejected, (state) => {
                state.isLoading = false;
                state.items = []
            })
            .addCase(postVault.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(postVault.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items.push(action.payload)
            })
            .addCase(postVault.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(editVault.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(editVault.fulfilled, (state, action) => {
                state.isLoading = false;
               state.items = state.items.map(item => item.id === action.payload.id ? action.payload : item)
            })
            .addCase(editVault.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(deleteVault.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteVault.fulfilled, (state, action) => {
                state.isLoading = false;
               state.items =  state.items.filter(s => s.id !== action.payload.id)
            })
            .addCase(deleteVault.rejected, (state) => {
                state.isLoading = false;
            })

    }
})



export default passwordSlice.reducer;