import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "./App"; // Home Page
import About from "./components/About";
import NotFound from "./components/NotFound";
import AWS_Network from "./components/AWS_Network";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/global.css";

/* Function to check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem("token"); // Check if token exists
};

// Clear localStorage when the user closes the website
window.addEventListener("beforeunload", () => {
  localStorage.removeItem("token"); // Remove token when page is closed
});*/

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute><App /></ProtectedRoute>,
  },
  {
    path: "/about",
    element: <ProtectedRoute><About /></ProtectedRoute>,
  },
  {
    path: "/AWS_Network",
    element: <ProtectedRoute><AWS_Network /></ProtectedRoute>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
