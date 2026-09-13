import React, {useState, useEffect} from "react"
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from "./firebase";
import { UserService } from "./services/UserService";
import type { UserModel } from "./models/UserModel";
import SignUpScreen from "./auth/SignUpScreen";
import SignInScreen from "./auth/SignInScreen";
import DashboardScreen from "./pages/DashboardScreen";


interface ProtectedRouteProps {
  isAuthenticated: boolean;
  loading: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated, loading, children
}) =>{
  if(loading){
    return(
      <div 
      className="min-h-screen w-full flex items-center justify-center p-4 font-sans text-gray-800"
      style={{background: "linear-gradient(135deg, #ffea85 0%, #ff7e5f 35%, #feb47b 65%, #ff416c 100%)"}}
      >
        <div 
            className="p-8 rounded-2xl flex flex-col items-center gap-4 text-white"
            style={{
              background: "rgba(255, 255, 255, 0.23)",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(3.4px)",
              WebkitBackdropFilter: "blur(3.4px)",
              border: "1px solid rgba(255, 255, 255, 0.51)",
          }}
        >
          <svg
          className="animate-spin h-8 w-8 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          >
           <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
           ></circle>
           <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
           ></path>  
          </svg>
          <p className="font-semibold text-sm">Authenticating...</p>          
        </div>
      </div>
    );
  }

  if(!isAuthenticated){
    return <Navigate to="/signup" replace/>
  }

  return <>{children}</>
}



export default function App() {

  return (
    <>
       <div>Priori Grid </div>
    </>
  )
}

