import React, { createContext, useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import RegistroUsuarios from "./pages/RegistroUsuarios/RegistroUsuarios";
import Dashboard from "./pages/Dashboard/Dashboard";
import PreRegistro from "./pages/PreRegistro/Preregistro";
import Resultados from "./pages/Resultados/Resultados";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

// =============================
// Contexto de autenticación
// =============================
interface AuthContextType {
  isAuthenticated: boolean;
  handleLogin: (token: string, name: string) => void;
  handleLogout: () => void;
  userName: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// =============================
// Componente para rutas privadas
// =============================
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  if (!auth) return null;

  return auth.isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// =============================
// Layout principal con Sidebar + Topbar
// =============================
const MainLayout: React.FC = () => {
  const location = useLocation();
  const auth = useContext(AuthContext)!;

  const { userName, handleLogout } = auth;

  // Títulos dinámicos según la ruta
  const getPageTitle = (path: string) => {
    switch (path) {
      case "/dashboard":
        return "Panel de Control";
      case "/resultados":
        return "Resultados de Exámenes";
      case "/preregistro":
        return "Pre-Registro de Pacientes";
      default:
        return "Panel";
    }
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="d-flex flex-column flex-grow-1">
        <Topbar pageTitle={pageTitle} userName={userName} onLogout={handleLogout} />

        {/* Contenido dinámico */}
        <main className="p-4 bg-light flex-grow-1">
          <Outlet />
        </main>

        {/* Footer */}
        {/* <footer className="bg-dark text-white text-center py-3 mt-auto">
          Creado por Sistemas HE
        </footer> */}
      </div>
    </div>
  );
};

// =============================
// App principal
// =============================
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName");

    if (token) {
      setIsAuthenticated(true);
      setUserName(storedUserName || "Usuario");
    }
  }, []); // ✅ Solo se ejecuta al montar

  const handleLogin = (token: string, name: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", name);
    setIsAuthenticated(true);
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setUserName("");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, handleLogin, handleLogout, userName }}>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro-usuarios" element={<RegistroUsuarios />} />
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            }
          />

          {/* Rutas privadas con layout */}
          <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resultados" element={<Resultados />} />
            <Route path="/preregistro" element={<PreRegistro />} />
          </Route>

          {/* Página 404 */}
          <Route
            path="*"
            element={<h2 className="text-center mt-5">404 - Página no encontrada</h2>}
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
