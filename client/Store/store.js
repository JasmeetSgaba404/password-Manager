import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import passwordReducer from './passwordSlice'

const store  = configureStore({
    reducer:{
        auth: authReducer,
        password: passwordReducer,
    }
})

export default store;