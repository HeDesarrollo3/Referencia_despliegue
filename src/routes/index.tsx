// src/routes/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../pages/Dashboard/Dashboard";
import PreRegistroWizard from "../pages/PreRegistro/PreRegistroWizard";
import ResultadosPage from "../pages/Resultados/Resultados";
import GestorNovedadesPage from "../pages/GestorDeNovedades/GestorDeNovedades";
import PortafolioPage from "../pages/Portafolio/PortafolioPage";
import TarifariaPage from "../pages/Tarifaria/Tarifaria";
import Login from "../pages/Login/Login";
import RegistroUsuarios from "../pages/RegistroUsuarios/RegistroUsuarios";
import ProfilePage from "../pages/Profile/ProfilePage";
import UserSettingsPage from "../pages/UserSettings/UserSettingsPage";
import RecuperarPassword from "../pages/RecuperarPassword/RecuperarPassword";
import NotificationsPage from "../pages/Notificaciones/Notificaciones";
import AdminPage from "../pages/Admin/Admin";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>

      {/* Redirección inicial */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/RegistroUsuarios" element={<RegistroUsuarios />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />
      <Route path="/notificaciones" element={<NotificationsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<UserSettingsPage />} />

      {/* Rutas protegidas (requiere login) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout pageTitle="Inicio" onLogout={() => console.log("Logout")}>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/PreRegistroWizard"
        element={
          <ProtectedRoute>
            <MainLayout pageTitle="PreOrden" onLogout={() => console.log("Logout")}>
              <PreRegistroWizard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/resultados"
        element={
          <ProtectedRoute>
            <MainLayout pageTitle="Resultados" onLogout={() => console.log("Logout")}>
              <ResultadosPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/GestorDeNovedades"
        element={
          <ProtectedRoute>
            <MainLayout pageTitle="Novedades" onLogout={() => console.log("Logout")}>
              <GestorNovedadesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/portafolio"
        element={
          <ProtectedRoute>
            <MainLayout pageTitle="Portafolio" onLogout={() => console.log("Logout")}>
              <PortafolioPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tarifaria"
        element={
          <ProtectedRoute>
            <MainLayout pageTitle="Tarifaria" onLogout={() => console.log("Logout")}>
              <TarifariaPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* SOLO ADMIN */}
      <Route
  path="/admin"
  element={
    <ProtectedRoute role="ADMINISTRADOR">
      <MainLayout pageTitle="Administración" onLogout={() => console.log("Logout")}>
        <AdminPage />
      </MainLayout>
    </ProtectedRoute>
  }
/>


    </Routes>
  );
}

export default AppRoutes;
