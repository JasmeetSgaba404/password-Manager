import { createAsyncThunk } from "@reduxjs/toolkit";



const postVault = createAsyncThunk('/vault/post', async (data, thunkAPI) => {

    const state = thunkAPI.getState();


    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/vault`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
           credentials: "include",
            body: JSON.stringify(data)
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

export default postVault;



