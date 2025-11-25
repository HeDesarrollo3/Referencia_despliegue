import React from "react";
import { Modal, Button, Card, ListGroup, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";

interface Product {
  orderProductId: string;
  name: string;
  price: number;
  pendingPayment?: number;
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
  email?: string;
  products?: Product[];
  customerName?: string;
  customerAccountName?: string;
  tariffName?: string;
}

interface Props {
  show: boolean;
  order: Order | null;
  onClose: () => void;
  onChangeState: (newState: string) => Promise<void>; // ahora async
}

const OrderModal: React.FC<Props> = ({
  show,
  order,
  onClose,
  onChangeState,
}) => {

  const handleAccept = async () => {
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
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold text-primary">
          🧾 Detalle de Orden #{order?.orderNumber || "—"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!order ? (
          <div>No hay detalles para mostrar.</div>
        ) : (
          <>
            {/* DATOS DEL PACIENTE */}
            <Card className="mb-3">
              <Card.Header className="bg-primary text-white">
                👤 Datos del Paciente
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}><b>Nombre:</b> {order.patientName}</Col>
                  <Col md={6}><b>Documento:</b> {order.identification}</Col>
                </Row>

                <Row className="mt-2">
                  <Col md={6}>
                    <b>Fecha Nac.:</b>{" "}
                    {order.birthDate
                      ? new Date(order.birthDate).toLocaleDateString("es-CO")
                      : "—"}
                  </Col>
                  <Col md={6}><b>Sexo:</b> {order.gender || "—"}</Col>
                </Row>
              </Card.Body>
            </Card>

            {/* PLAN */}
            <Card className="mb-3">
              <Card.Header className="bg-info text-white">
                🏥 Plan / Entidad
              </Card.Header>
              <Card.Body>
                <p><b>Cliente:</b> {order.customerName}</p>
                <p><b>Cuenta:</b> {order.customerAccountName}</p>
                <p><b>Tarifa:</b> {order.tariffName}</p>
                <p><b>Estado:</b> {order.state}</p>
                <p><b>Observación:</b> {order.observation}</p>
              </Card.Body>
            </Card>

            {/* EXÁMENES */}
            <Card className="mb-3">
              <Card.Header className="bg-secondary text-white">
                🧪 Exámenes Solicitados
              </Card.Header>
              <ListGroup variant="flush">
                {order.products?.map((p) => (
                  <ListGroup.Item key={p.orderProductId}>
                    <div className="d-flex justify-content-between">
                      <div>{p.name}</div>
                      <b>
                        {(p.pendingPayment ?? p.price).toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          maximumFractionDigits: 0,
                        })}
                      </b>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        {order && (
          <Button variant="primary" onClick={handleAccept}>
            Cambiar Estado
          </Button>
        )}
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderModal;



//src/components/Admin/OrderModal.tsx
// import React from "react";
// import { Modal, Button, Card, ListGroup, Row, Col } from "react-bootstrap";


// interface Product { orderProductId: string; name: string; price: number; pendingPayment?: number }
// interface Order {
// orderId: string;
// orderNumber: string;
// state: string;
// observation?: string;
// patientName?: string;
// identification?: string;
// birthDate?: string;
// gender?: string;
// email?: string;
// products?: Product[];
// customerName?: string;
// customerAccountName?: string;
// tariffName?: string;
// }


// interface Props {
// show: boolean;
// order: Order | null;
// onClose: () => void;
// onSave?: () => void;
// onDeleteProduct?: (orderProductId: string) => void;
// accounts?: any[];
// selectedAccount?: any;
// onSelectAccount?: (accountId: string) => void;
// }

// const OrderModal: React.FC<Props> = ({ show, order, onClose, onSave, onDeleteProduct, accounts = [], selectedAccount, onSelectAccount }) => {
// return (
// <Modal show={show} onHide={onClose} size="lg" centered>
// <Modal.Header closeButton className="bg-light">
// <Modal.Title className="fw-bold text-primary">🧾 Detalle de Orden #{order?.orderNumber || '—'}</Modal.Title>
// </Modal.Header>
// <Modal.Body>
// {order ? (
// <>
// <Card className="mb-3">
// <Card.Header className="bg-primary text-white">👤 Datos del Paciente</Card.Header>
// <Card.Body>
// <Row>
// <Col md={6}><b>Nombre:</b> {order.patientName}</Col>
// <Col md={6}><b>Documento:</b> {order.identification}</Col>
// </Row>
// <Row className="mt-2">
// <Col md={6}><b>Fecha Nac.:</b> {order.birthDate ? new Date(order.birthDate).toLocaleDateString('es-CO') : '—'}</Col>
// <Col md={6}><b>Sexo:</b> {order.gender || '—'}</Col>
// </Row>
// </Card.Body>
// </Card>


// <Card className="mb-3">
// <Card.Header className="bg-info text-white">🏥 Plan / Entidad</Card.Header>
// <Card.Body>
// <p><b>Cliente:</b> {order.customerName || '—'}</p>
// <p><b>Cuenta:</b> {order.customerAccountName || '—'}</p>
// <p><b>Tarifa:</b> {order.tariffName || '—'}</p>
// <p><b>Estado:</b> {order.state || '—'}</p>
// <p><b>Observación:</b> {order.observation || '—'}</p>
// </Card.Body>
// </Card>
// <Card className="mb-3">
// <Card.Header className="bg-secondary text-white">🧪 Exámenes Solicitados</Card.Header>
// <ListGroup variant="flush">
// {order.products && order.products.length ? (
// order.products.map((p) => (
// <ListGroup.Item key={p.orderProductId} className="d-flex justify-content-between align-items-center">
// <div style={{ maxWidth: '70%' }}>{p.name}</div>
// <div>
// <b className="me-3">{(p.pendingPayment ?? p.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</b>
// {order.state === 'REGISTRADA' && onDeleteProduct && (
// <Button size="sm" variant="danger" onClick={() => onDeleteProduct(p.orderProductId)}>Eliminar</Button>
// )}
// </div>
// </ListGroup.Item>
// ))
// ) : (
// <ListGroup.Item>No se seleccionaron productos.</ListGroup.Item>
// )}
// </ListGroup>
// </Card>
// </>
// ) : (
// <div>No hay detalles para mostrar.</div>
// )}
// </Modal.Body>
// <Modal.Footer>
// {order && order.state === 'REGISTRADA' && onSave && <Button variant="success" onClick={onSave}>Guardar</Button>}
// <Button variant="secondary" onClick={onClose}>Cerrar</Button>
// </Modal.Footer>
// </Modal>
// );
// };


// export default OrderModal;