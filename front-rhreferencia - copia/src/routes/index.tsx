// src/routes/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../pages/Dashboard/Dashboard";
// import Preregistro from "../pages/PreRegistro/Preregistro";
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

function AppRoutes() {
  return (
    <Routes>
       <Route path="/" element={<Navigate to="/login" />} />
 <Route path="/login" element={<Login />} />
  <Route path="/RegistroUsuarios" element={<RegistroUsuarios />} />
  <Route path="/recuperar-password" element={<RecuperarPassword />} />

  <Route path="/notificaciones" element={<NotificationsPage />} />




  <Route path="/profile" element={<ProfilePage />} />
<Route path="/settings" element={<UserSettingsPage />} />

      <Route
        path="/dashboard"
        element={
          <MainLayout pageTitle="Inicio"  onLogout={() => console.log("Logout")}>
            <DashboardPage />
          </MainLayout>
        }
      />
      <Route
        path="/PreRegistroWizard"
        element={
         <MainLayout pageTitle="PreOrden" onLogout={() => console.log("Logout")}>
  <PreRegistroWizard />
</MainLayout>
        }
      />
      <Route
        path="/resultados"
        element={
          <MainLayout pageTitle="Resultados"  onLogout={() => console.log("Logout")}>
            <ResultadosPage />
          </MainLayout>
        }
      />
      <Route
        path="/GestorDeNovedades"
        element={
          <MainLayout pageTitle="Novedades"  onLogout={() => console.log("Logout")}>
            <GestorNovedadesPage />
          </MainLayout>
        }
      />
      <Route
        path="/portafolio"
        element={
          <MainLayout pageTitle="Portafolio"  onLogout={() => console.log("Logout")}>
            <PortafolioPage />
          </MainLayout>
        }
      />
      <Route
        path="/tarifaria"
        element={
          <MainLayout pageTitle="Tarifaria"  onLogout={() => console.log("Logout")}>
            <TarifariaPage />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
