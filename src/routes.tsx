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
import ChangeUserRole from "./pages/admin/ChangeUserRole";
import LoadingPage from "./utils/loading-page";

import FeedbackPage from "@/pages/FeedbackPage";
import VolunteerEventPage from "@/pages/VolunteerEventPage";
import { UserRole } from "./lib/constants/server-constants";
import ContactUsPage from "./pages/ConactUsPage";
import ParticipantRegistration from "./pages/ParticipantRegistration";
import SpectatorRegistration from "./pages/SpectatorRegistration";
import { useAppSelector } from "./store";

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
const WebMasterRoutes = () => {
  const [user, loading] = useAuthState(auth);
  if (loading) return <LoadingPage />;
  const u = useAppSelector((u) => u.user);
  if (!u || !user) return <Navigate to="/" />;

  return u.role === UserRole.ADMIN || u.role == UserRole.WEBMASTER ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};
const AdminRoutes = () => {
  const [user, loading] = useAuthState(auth);
  if (loading) return <LoadingPage />;
  const u = useAppSelector((u) => u.user);
  if (!u || !user) return <Navigate to="/" />;

  return u.role === UserRole.ADMIN ? <Outlet /> : <Navigate to="/" />;
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
        <Route
          path="/volunteer/register/:eventId"
          element={
            <Layout>
              <EventRegistrationVolunteerPage />
            </Layout>
          }
        />
        <Route element={<WebMasterRoutes />}>
          <Route
            path="/admin"
            element={
              <Layout>
                <AdminDashboardPage />
              </Layout>
            }
          />
        </Route>
        <Route
          path="/admin/events/create"
          element={
            <Layout>
              <EventCreationPage />
            </Layout>
          }
        />
        <Route element={<WebMasterRoutes />}>
          <Route
            path="/admin/events/manage"
            element={
              <Layout>
                <EventManagementPage />
              </Layout>
            }
          />
        </Route>
        <Route
          path="/donate"
          element={
            <Layout>
              <DonatePage />
            </Layout>
          }
        />
        <Route
          path="/contactus"
          element={
            <Layout>
              <ContactUsPage />
            </Layout>
          }
        />
        <Route
          path="/participant/register"
          element={
            <Layout>
              <ParticipantRegistration />
            </Layout>
          }
        />
        <Route
          path="/spectator/register"
          element={
            <Layout>
              <SpectatorRegistration />
            </Layout>
          }
        />
        <Route element={<AdminRoutes />}>
          <Route
            path="/admin/changeroles"
            element={
              <Layout>
                <ChangeUserRole />
              </Layout>
            }
          />
        </Route>
        <Route
          path="/feedback/:eventId"
          element={
            <Layout>
              <FeedbackPage />
            </Layout>
          }
        />
        <Route
          path="/volunteer/event/:eventId"
          element={
            <Layout>
              <VolunteerEventPage />
            </Layout>
          }
        />
      </Route>
    </Routes>
  );
}
