// import React from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";

// interface MainLayoutProps {
//   onLogout: () => void;
//   userName: string;
//   pageTitle: string;
// }

// const MainLayout: React.FC<MainLayoutProps> = ({
//   pageTitle,
//   onLogout,
//   userName,
// }) => {
//   return (
//      <div className="d-flex min-vh-100">  
    
//       <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: "200px" }}>
//         {/* Topbar */}
//         <Topbar pageTitle={pageTitle} userName={userName} onLogout={onLogout} />

//         {/* Contenido dinámico */}
//         <main className="p-4 bg-light flex-grow-1">
//           <Outlet />
//         </main>

//         {/* Footer */}
//         <footer className="bg-dark text-white text-center py-3">
//          {/* Footer */}
//       <div className="mt-auto text-center text-secondary small">
//         <hr className="border-secondary" />
//         <p className="mb-0">&copy; 2025 Portal Clientes HE</p>
//         <p className="mb-0">Todos los derechos reservados</p>
//         <p className="mb-0 fw-light">v1.0.0-beta.1</p>
//       </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;


// src/components/layout/MainLayout.tsx
import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface MainLayoutProps {
  onLogout: () => void;
  userName: string;
  pageTitle: string;
  children: React.ReactNode; // 👈 Agregar children explícitamente
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  pageTitle,
  userName,
  onLogout,
}) => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        {/* ✅ Ahora Topbar recibe sus props */}
        <Topbar pageTitle={pageTitle} userName={userName} onLogout={onLogout} />
        
        <main className="flex-grow-1 p-4 bg-light">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
