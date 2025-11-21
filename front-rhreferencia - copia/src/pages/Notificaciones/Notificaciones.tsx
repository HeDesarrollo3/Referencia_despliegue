// src/pages/NotificationsPage.tsx
import React from "react";

const NotificationsPage: React.FC = () => {
  return (
    <div className="container mt-4">
      <h4 className="text-primary mb-3">🔔 Todas las notificaciones</h4>
      <p>Aquí puedes ver el historial completo de tus notificaciones.</p>
      {/* Aquí puedes renderizar la lista desde la API */}
    </div>
  );
};

export default NotificationsPage;
