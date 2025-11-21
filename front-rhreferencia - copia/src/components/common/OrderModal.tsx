// src/pages/PreRegistro/components/OrderModal.tsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

const OrderModal = ({ show, onHide, responseData }: any) => (
  <Modal show={show} onHide={onHide} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>✅ Orden Registrada</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {responseData && (
        <>
          <h6>👤 Paciente</h6>
          <p>
            <strong>{responseData.firstName} {responseData.lastName}</strong> - {responseData.identification}
          </p>

          <h6>📑 Órdenes</h6>
          {responseData.orders.map((order: any) => (
            <div key={order.orderId} className="mb-3">
              <p><strong>Observación:</strong> {order.observation}</p>
              <p><strong>Estado:</strong> {order.state}</p>
            </div>
          ))}
        </>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>Cerrar</Button>
    </Modal.Footer>
  </Modal>
);

export default OrderModal;
