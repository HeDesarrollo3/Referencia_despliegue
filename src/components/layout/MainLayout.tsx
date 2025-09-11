// src/components/layout/MainLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

interface MainLayoutProps {
  children?: React.ReactNode;
  pageTitle?: string;
  userName?: string;
  onLogout?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  pageTitle = "",
  userName = "Usuario",
  onLogout,
}) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido derecho con margen */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: "250px" }}
      >
        {/* Topbar */}
        <Topbar
          pageTitle={pageTitle}
          userName={userName}
          onLogout={onLogout || (() => {})}
        />

        {/* Contenido dinámico */}
        <main className="flex-grow-1 p-4 bg-light">
          {children || <Outlet />}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
