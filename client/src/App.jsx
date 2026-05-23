import "./App.css";
import { createBrowserRouter, Outlet } from "react-router";
import { useSelector } from "react-redux";
import Vault from "../components/vault";
import Login from "../components/login";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    
  },[isAuthenticated])

  return <>
  <Toaster position="top-center" reverseOrder={false} />
  {isAuthenticated ? <Outlet /> : <Login />}
  
  
  
  </>;
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
        path: '/login',
        element: <Login />
      }
    ],
  },
]);

export default App;
