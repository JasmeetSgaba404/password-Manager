import { createAsyncThunk } from "@reduxjs/toolkit";


const deleteVault = createAsyncThunk('/vault/delete/:id', async (id, thunkAPI) => {

    const state = thunkAPI.getState();

    try {
        const response = await fetch(`/vault/${id}`, {
            method: 'DELETE',
            credentials: "include",
        })
        if (response.ok) {

            const result = await response.json();
            return result;
        }

        return thunkAPI.rejectWithValue("Something Wrong")

    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

export default deleteVault;