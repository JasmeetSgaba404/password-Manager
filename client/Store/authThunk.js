import { createAsyncThunk } from "@reduxjs/toolkit";


const authThunk = createAsyncThunk("auth/me", async (__, thunkAPI) => {


    try {
        const response = await fetch('/me', {
            method: "GET",
            credentials: "include",
        })

        const result = await response.json();

        console.log(result);

        if(response.ok){

            return result;
        }

        return thunkAPI.rejectWithValue("Something Wrong")
    } catch (error) {
          return thunkAPI.rejectWithValue(error.message)
    }
})

export default authThunk;