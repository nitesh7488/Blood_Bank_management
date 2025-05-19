import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import API from "../../services/API";
import { getCurrentUser } from "../../redux/features/auth/authActions";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    isAuthenticated: false
  });

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthStatus({ loading: false, isAuthenticated: false });
        return;
      }

      const { data } = await API.get("/auth/current-user");
      
      if (data?.user) {  // Changed from data?.success to data?.user
        dispatch(getCurrentUser(data.user));  // Pass data.user instead of data
        setAuthStatus({ loading: false, isAuthenticated: true });
      } else {
        localStorage.clear();
        setAuthStatus({ loading: false, isAuthenticated: false });
      }
    } catch (error) {
      localStorage.clear();
      setAuthStatus({ loading: false, isAuthenticated: false });
      console.error("Authentication error:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (authStatus.loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return authStatus.isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;