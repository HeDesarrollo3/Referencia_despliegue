// src/pages/Notificaciones/Notificaciones.tsx
import React, { useEffect, useState } from "react";
import { socket } from "../../socket/socket";

const Notificaciones: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 WebSocket conectado en Notificaciones");

      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const customerId = payload.customerId;

        socket.emit("registerClient", { customerId });
      }
    });

    socket.on("orderCompleted", (message: string) => {
      console.log("🔔 Notificación recibida:", message);

      setNotifications((prev) => [
        {
          id: Date.now(),
          message,
          date: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("orderCompleted");
      socket.off("connect");
    };
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="text-primary mb-3">🔔 Todas las notificaciones</h4>

      {notifications.length === 0 && (
        <p className="text-muted">No hay notificaciones por ahora...</p>
      )}

      {notifications.map((n) => (
        <div key={n.id} className="alert alert-info shadow-sm mb-2">
          <div className="fw-semibold">{n.message}</div>
          <small className="text-muted">{n.date}</small>
        </div>
      ))}
    </div>
  );
};

export default Notificaciones;
