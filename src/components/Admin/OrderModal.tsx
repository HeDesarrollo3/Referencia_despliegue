// FILE: src/components/Admin/OrderModal.tsx
import React from "react";
import { Modal, Button, Card, ListGroup, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";

interface Product {
  orderProductId: string;
  name: string;
  price: number;
  pendingPayments?: number;
}

interface Account {
  customerAccountId: string;
  name: string;
  tariff: {
    name: string;
    tariffId: string;
  };
}

interface Order {
  orderId: string;
  orderNumber: string;
  state: string;
  observation?: string;
  patientName?: string;
  identification?: string;
  birthDate?: string;
  gender?: string;
  products?: Product[];
  customerName?: string;
  customerAccountName?: string;
  tariffName?: string;
}

interface Props {
  show: boolean;
  order: Order | null;
  onClose: () => void;
  onSave: () => void;
  onDeleteProduct: (orderProductId: string) => void;
  onChangeState: (newState: string) => Promise<void>;
  accounts?: Account[];
  selectedAccount?: Account | null;
  onSelectAccount?: (accountId: string) => void;
}

const OrderModal: React.FC<Props> = ({
  show,
  order,
  onClose,
  onSave,
  onDeleteProduct,
  onChangeState,
  accounts = [],
  selectedAccount,
  onSelectAccount,
}) => {
  if (!order) return null;

  const handleStateChange = async () => {
    if (!order) return;

    const { value: newState } = await Swal.fire({
      title: "Selecciona el nuevo estado de la orden",
      input: "select",
      inputOptions: {
        REGISTRADA: "REGISTRADA",
        "EN CURSO": "EN CURSO",
        RECHAZADA: "RECHAZADA",
        COMPLETADA: "COMPLETADA",
      },
      inputPlaceholder: "Seleccione un estado",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) return "¡Debes seleccionar un estado!";
      },
    });

    if (!newState) return;

    await onChangeState(newState);

    Swal.fire({
      icon: "success",
      title: "Estado actualizado",
      text: `La orden pasó al estado: ${newState}`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered enforceFocus={false}>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold text-primary">
          🧾 Detalle de Orden #{order.orderNumber || "—"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-3">
        {order ? (
          <>
            {/* DATOS DEL PACIENTE */}
            <Card className="shadow-sm border-0 mb-3">
              <Card.Header className="bg-primary text-white fw-semibold">
                👤 Datos del Paciente
              </Card.Header>
              <Card.Body>
                <Row className="mb-2">
                  <Col md={6}>
                    <p className="mb-1">
                      <b>Nombre:</b> {order.patientName}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1">
                      <b>Documento:</b> {order.identification}
                    </p>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <p className="mb-1">
                      <b>Fecha de nacimiento:</b>{" "}
                      {order.birthDate
                        ? new Date(order.birthDate).toLocaleDateString("es-CO")
                        : "—"}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1">
                      <b>Sexo:</b> {order.gender || "—"}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* PLAN / ENTIDAD */}
            <Card className="shadow-sm border-0 mb-3">
              <Card.Header className="bg-info text-white fw-semibold">
                🏥 Plan / Entidad
              </Card.Header>
              <Card.Body>
                <p><b>Cliente:</b> {order.customerName || "—"}</p>
                <p>
                  <b>Cuenta:</b>{" "}
                  {order.state === "REGISTRADA" ? (
                    <select
                      id="accountId"
                      name="accountId"
                      value={selectedAccount?.customerAccountId || ""}
                      onChange={(e) => {
                        if (onSelectAccount) {
                          onSelectAccount(e.target.value);
                        }
                      }}
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    >
                      {accounts.map((account) => (
                        <option
                          key={account.customerAccountId}
                          value={account.customerAccountId}
                        >
                          {account.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{order.customerAccountName || "—"}</span>
                  )}
                </p>
                <p><b>Tarifa:</b> {order.tariffName || "—"}</p>
                <p><b>Estado:</b> {order.state || "—"}</p>
                <p><b>Observación:</b> {order.observation || "Sin observaciones"}</p>
              </Card.Body>
            </Card>

            {/* EXÁMENES SOLICITADOS */}
            <Card className="shadow-sm border-0 mb-3">
              <Card.Header className="bg-secondary text-white fw-semibold">
                🧪 Exámenes Solicitados
              </Card.Header>
              <ListGroup variant="flush">
                {order.products?.length ? (
                  order.products.map((product, index) => (
                    <ListGroup.Item key={index}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>
                          {product.name?.length > 65
                            ? product.name.slice(0, 65) + "..."
                            : product.name ?? "—"}
                        </span>
                        <b className="ms-auto me-3">
                          {product.pendingPayments?.toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0,
                          })}
                        </b>
                        {order.state === "REGISTRADA" && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              onDeleteProduct(product.orderProductId)
                            }
                          >
                            🗑️
                          </Button>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No se seleccionaron productos.</ListGroup.Item>
                )}
              </ListGroup>
              <Card.Footer
                className="bg-light text-end fw-bold text-success"
                style={{ padding: "0px 30px" }}
              >
                💰 Total:{" "}
                {order.products
                  ?.reduce((sum, p) => sum + (p.price || 0), 0)
                  .toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  })}
              </Card.Footer>
            </Card>
          </>
        ) : (
          <p>No hay detalles para mostrar.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        {order.state === "REGISTRADA" && (
          <Button variant="success" onClick={onSave}>
            Guardar
          </Button>
        )}
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleStateChange}>
          Cambiar Estado
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderModal;
