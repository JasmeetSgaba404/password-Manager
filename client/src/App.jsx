import "./App.css";
import { createBrowserRouter, Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Vault from "../components/vault";
import Login from "../components/login";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import authThunk from "../Store/authThunk";

const Spinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
    </div>
  );
};

function App() {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth.checkAuth)
    const { isAuthenticated } = useSelector((state) => state.auth);


 


      useEffect(() => {
      dispatch(authThunk())
      }, []);


 


  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {auth ? (<Spinner />) : isAuthenticated ? (<Outlet />) : (<Login />) }
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, //by default renders the Vault as the first page
        element: <Vault />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default App;
