import { createAsyncThunk } from "@reduxjs/toolkit";



const fetchVault = createAsyncThunk(`${import.meta.env.VITE_API_URL}/vault/fetchData`, async (_, thunkAPI) => {

    const state = thunkAPI.getState();


    try {

        const response = await fetch('/vault',
            {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        })

        const result = await response.json();

        return result;

    } catch (error) {
       return thunkAPI.rejectWithValue(error.message)
    }
})

export default fetchVault;