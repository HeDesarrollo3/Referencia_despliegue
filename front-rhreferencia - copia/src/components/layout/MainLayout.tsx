import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

interface MainLayoutProps {
  children?: React.ReactNode;
  pageTitle?: string;
  onLogout?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  pageTitle = "",
  onLogout,
}) => {
  return (
    <div className="app-container d-flex flex-column min-vh-100 bg-white">

      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido derecho */}
      <div
        className=" main-content flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: "250px",
          transition: "margin-left 0.3s ease",
          backgroundColor: "#fff",
        }}
      >
        {/* Topbar */}
        <Topbar pageTitle={pageTitle} onLogout={onLogout || (() => {})} />

        {/* Contenido principal */}
        <main
          className="flex-grow-1 p-4"
          style={{
             backgroundColor: "#f8f9fa",
    minHeight: "calc(100vh - 60px)",
    paddingBottom: "60px", // 🔹 espacio para el footer fijo
            // backgroundColor: "#f8f9fa",
            // minHeight: "calc(100vh - 120px)",
          }}
        >
          {children || <Outlet />}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
