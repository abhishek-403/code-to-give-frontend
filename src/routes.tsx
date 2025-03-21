import { Navigate, Outlet, Route, Routes } from "react-router";
import { useAuth } from "./lib/hooks/useAuth";
import Home from "./pages/Home";
import Loader from "./utils/loader";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Loader />;

  return user ? <Outlet /> : <Navigate to="/login" />;
};

const NotLoggedIn = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Loader />;

  return user ? <Navigate to="/" /> : <Outlet />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route element={<NotLoggedIn />}>
        <Route path="/login" element={<AuthPage />} />
      </Route> */}

      {/* <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route> */}
    </Routes>
  );
}
