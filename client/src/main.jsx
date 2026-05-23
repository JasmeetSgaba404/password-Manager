import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { router } from './App.jsx'
import store from '../Store/store.js'
import {Provider} from 'react-redux'
import { RouterProvider } from "react-router";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}>
    <App />
    </RouterProvider>
    </Provider>
  </StrictMode>,
)
