import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Blog from "./pages/Blog";
import Blogs from "./pages/Blogs";
import Appbar from "./components/Appbar";
import {
  validateToken,
  AUTH_STATE_CHANGED,
  getAuthState,
} from "./hooks/api-client";
import Publish from "./components/Publish";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(getAuthState());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateToken();
      setIsAuthenticated(isValid);
      setLoading(false);
    };

    const handleAuthStateChange = (
      event: CustomEvent<{ isAuthenticated: boolean; error: string | null }>
    ) => {
      setIsAuthenticated(event.detail.isAuthenticated);
      setError(event.detail.error);
      setLoading(false);
    };

    checkAuth();

    window.addEventListener(
      AUTH_STATE_CHANGED,
      handleAuthStateChange as EventListener
    );

    return () => {
      window.removeEventListener(
        AUTH_STATE_CHANGED,
        handleAuthStateChange as EventListener
      );
    };
  }, []);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!isAuthenticated) {
      return <Navigate to='/signin' />;
    }
    return <>{children}</>;
  };

  return (
    <>
      <BrowserRouter>
        {isAuthenticated && <Appbar />}
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route
            path='/blogs'
            element={
              <ProtectedRoute>
                <Blogs />
              </ProtectedRoute>
            }
          />
          <Route
            path='/blog/:id'
            element={
              <ProtectedRoute>
                <Blog />
              </ProtectedRoute>
            }
          />
          <Route
            path='/publish'
            element={
              <ProtectedRoute>
                <Publish />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
