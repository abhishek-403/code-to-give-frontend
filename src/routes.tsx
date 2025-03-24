import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Outlet, Route, Routes } from "react-router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

import DonatePage from "./pages/DonatePage";

import EventRegistrationVolunteerPage from "./pages/EventRegistrationVolunteerPage";
import UserProfilePage from "./pages/UserProfilePage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import EventCreationPage from "./pages/admin/EventCreationPage";
import EventManagementPage from "./pages/admin/EventManagementPage";

import { auth } from "./lib/firebaseConfig";
import LoadingPage from "./utils/loading-page";
import ChangeUserRole from "./pages/admin/ChangeUserRole";

import FeedbackPage from "@/pages/FeedbackPage";

const ProtectedRoute = () => {
  const [user, loading] = useAuthState(auth);
  if (loading) return <LoadingPage />;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

const NotLoggedIn = () => {
  const [user, loading] = useAuthState(auth);
  if (loading) return <LoadingPage />;

  return user ? <Navigate to="/" /> : <Outlet />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route element={<NotLoggedIn />}>
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout>
              <SignupPage />
            </Layout>
          }
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route
          path="/profile"
          element={
            <Layout>
              <UserProfilePage />
            </Layout>
          }
        />
      </Route>
      <Route
        path="/volunteer/register/:eventId"
        element={
          <Layout>
            <EventRegistrationVolunteerPage />
          </Layout>
        }
      />

      <Route
        path="/admin"
        element={
          <Layout>
            <AdminDashboardPage />
          </Layout>
        }
      />
      <Route
        path="/admin/events/create"
        element={
          <Layout>
            <EventCreationPage />
          </Layout>
        }
      />
      <Route
        path="/admin/events/manage"
        element={
          <Layout>
            <EventManagementPage />
          </Layout>
        }
      />
 donate_and_changerole
      <Route
        path="/donate"
        element={
          <Layout>
            <DonatePage />
          </Layout>
        }
      />
      <Route
        path="/admin/changeroles"
        element={
          <Layout>
            <ChangeUserRole />


      <Route
        path="/feedback/:eventId"
        element={
          <Layout>
            <FeedbackPage />
 main
          </Layout>
        }
      />
    </Routes>
  );
}
