// src/routes/index.tsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../pages/Dashboard/Dashboard";
import PreregistroPage from "../pages/PreRegistro/Preregistro";
import ResultadosPage from "../pages/Resultados/Resultados";
import GestorNovedadesPage from "../pages/GestorDeNovedades/GestorDeNovedades";
import PortafolioPage from "../pages/Portafolio/PortafolioPage";
import TarifariaPage from "../pages/Tarifaria/Tarifaria";
import Login from "../pages/Login/Login";
import RegistroUsuarios from "../pages/RegistroUsuarios/RegistroUsuarios";

function AppRoutes() {
  return (
    <Routes>
 <Route path="/login" element={<Login />} />
  <Route path="/RegistroUsuarios" element={<RegistroUsuarios />} />

      <Route
        path="/dashboard"
        element={
          <MainLayout pageTitle="Inicio" userName="Usuario" onLogout={() => console.log("Logout")}>
            <DashboardPage />
          </MainLayout>
        }
      />
      <Route
        path="/preregistro"
        element={
          <MainLayout pageTitle="Preregistro" userName="Usuario" onLogout={() => console.log("Logout")}>
            <PreregistroPage />
          </MainLayout>
        }
      />
      <Route
        path="/resultados"
        element={
          <MainLayout pageTitle="Resultados" userName="Usuario" onLogout={() => console.log("Logout")}>
            <ResultadosPage />
          </MainLayout>
        }
      />
      <Route
        path="/GestorDeNovedades"
        element={
          <MainLayout pageTitle="Novedades" userName="Usuario" onLogout={() => console.log("Logout")}>
            <GestorNovedadesPage />
          </MainLayout>
        }
      />
      <Route
        path="/portafolio"
        element={
          <MainLayout pageTitle="Portafolio" userName="Usuario" onLogout={() => console.log("Logout")}>
            <PortafolioPage />
          </MainLayout>
        }
      />
      <Route
        path="/tarifaria"
        element={
          <MainLayout pageTitle="Tarifaria" userName="Usuario" onLogout={() => console.log("Logout")}>
            <TarifariaPage />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
