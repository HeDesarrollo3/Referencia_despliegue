import React, { useState } from "react";
import { Button, Spinner, Card, Row, Col, ListGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { registerOrder } from "../../../services/api";

interface SummaryStepProps {
  token: string;
  formData: any;
  productList: any[];
  cie10List: any[];
  onOrderRegistered: (order: any) => void;
}






const SummaryStep: React.FC<SummaryStepProps> = ({
  token,
  formData,
  productList,
  cie10List,
  onOrderRegistered,
}) => {



const [openExamIndex, setOpenExamIndex] = useState<number | null>(null);

const toggleExam = (index: number) => {
  setOpenExamIndex(openExamIndex === index ? null : index);
};




  const [loading, setLoading] = useState(false);

  const selectedAccount = productList.find(
    (acc) => acc.customerAccountId === formData.customerAccountId
  );
  const planProducts = selectedAccount?.tariff?.products || [];

  const selectedProducts = formData.products
    .map((p: any) => planProducts.find((prod: any) => prod.productId === p.productId))
    .filter((p: any) => p);

  const total = selectedProducts.reduce((sum: number, prod: any) => sum + (prod?.price || 0), 0);

  const priorityMap: Record<string, string> = {
    NORMAL: "3",
    URGENTE: "1",
  };

  const handleSave = async () => {
    setLoading(true);

    if (!formData.patientId) {
      Swal.fire({
        icon: "error",
        title: "Paciente no seleccionado",
        text: "Debe seleccionar un paciente antes de continuar.",
        confirmButtonColor: "#d33",
      });
      setLoading(false);
      return;
    }

    const payload = {
      cie10: formData.cie10,
      priority: priorityMap[formData.priority] || formData.priority,
      observation: formData.observation,
      patientId: formData.patientId,
      customerAccountId: formData.customerAccountId,
      tariffId: formData.tariffId,
      products: formData.products
        .filter((p: any) => p.productId)
        .map((p: any) => ({ productId: p.productId })),
    };

    try {
      const order = await registerOrder(token, payload);

      Swal.fire({
        icon: "success",
        title: "Orden registrada",
        text: "✅ La PreOrden fue guardada correctamente.",
        confirmButtonColor: "#28a745",
        timer: 2000,
        showConfirmButton: false,
      });

      onOrderRegistered(order);
    } catch (err: any) {
      console.error("❌ Error al registrar orden:", err.response?.data || err.message);
      const text = err.response?.data?.message?.[0] || "Error al registrar la orden";

      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text,
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <h5 className="fw-bold mb-4 text-center text-primary">
        📋 Resumen de la PreOrden
      </h5>

      <Row className="g-4">
        {/* DATOS DEL PLAN */}
        <Col md={100}>
          <Card className="shadow-p-3 border-0">
            <Card.Header className="bg-info text-white fw-semibold">
              🏥 Plan / Entidad
            </Card.Header>
            <Card.Body>
              <p>
                <b>Entidad:</b> {selectedAccount?.name || "No seleccionado"}
              </p>
              <p>
                <b>Código del plan:</b> {selectedAccount?.code || "—"}
              </p>
            </Card.Body>
          </Card>

          {/* DATOS DEL PACIENTE */}
          <Col md={12}>
            <Card className="shadow-sm border-0 mt-3">
              <Card.Header className="bg-primary text-white fw-semibold">
                👤 Datos del Paciente
              </Card.Header>
              <Card.Body>
                <Row className="mb-2">
                  <Col md={6}>
                    <p className="mb-1">
                      <b>Nombre:</b> {formData.firstName} {formData.middleName}{" "}
                      {formData.lastName} {formData.surName}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1">
                      <b>Identificación:</b> {formData.identificationType}-
                      {formData.identificationNumber}
                    </p>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col md={6}>
                    <p className="mb-1">
                      <b>Fecha de nacimiento:</b>{" "}
                      {formData.birthDate
                        ? new Date(formData.birthDate).toLocaleDateString("es-CO")
                        : "—"}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1">
                      <b>Sexo:</b> {formData.gender || "—"}
                    </p>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col md={6}>
                    <p className="mb-1">
                      <b>Correo:</b> {formData.email || "—"}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1">
                      <b>Teléfono:</b> {formData.mobileNumber || "—"}
                    </p>
                  </Col>
                </Row>

                <p className="mb-1">
                  <b>Prioridad:</b>{" "}
                  <span
                    className={`badge ${
                      formData.priority === "3" ? "bg-danger" : "bg-success"
                    }`}
                  >
                    {formData.priority === "3" ? "Urgente" : "Normal"}
                  </span>
                </p>

                <p className="mb-1">
                  <b>CIE10:</b> {formData.cie10} -{" "}
                  {cie10List.find((c) => c.code === formData.cie10)?.description || ""}
                </p>

                <p>
                  <b>Observación:</b>{" "}
                  {formData.observation || <i>Sin observaciones</i>}
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* EXÁMENES */}
          <Card className="shadow-sm border-0 mt-3">
            <Card.Header className="bg-secondary text-white fw-semibold">
              🧪 Exámenes Solicitados
            </Card.Header>

{/* ///esta es la original que estaba bien */}

            {/* <ListGroup variant="flush">
              {selectedProducts.length > 0 ? (
                selectedProducts.map((p: any, idx: number) => (
                  <ListGroup.Item key={idx}>
                    <div className="d-flex justify-content-between">
                      <span>{p.name}</span>
                      <b>${p.price?.toLocaleString("es-CO")}</b>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No se seleccionaron productos.</ListGroup.Item>
              )}
            </ListGroup> */}
<ListGroup variant="flush">
  {selectedProducts.length > 0 ? (
    selectedProducts.map((p: any, idx: number) => (
      <ListGroup.Item key={idx} className="p-0">
        {/* HEADER CLICABLE */}
        <div
          className="d-flex justify-content-between align-items-center p-3 cursor-pointer"
          style={{ cursor: "pointer" }}
          onClick={() => toggleExam(idx)}
        >
          <span className="fw-semibold">{p.name}</span>
          <div>
            <b className="me-3">${p.price?.toLocaleString("es-CO")}</b>
            <span className="text-primary">
              {openExamIndex === idx ? "▲" : "▼"}
            </span>
          </div>
        </div>

        {/* CONTENIDO DESPLEGABLE */}
       {openExamIndex === idx && (
  <div className="px-4 pb-3 pt-2 bg-light border-top small">

    {/* MUESTRA */}
    <div className="mb-2">
      <p className="fw-bold mb-1">🧪 Muestra</p>
      <ul className="mb-1 ps-3">
        <li>
          <b>Tipo:</b> {p.tests?.[0]?.sampleTypes || "—"}
        </li>
        <li>
          <b>Cantidad:</b> {p.tests?.[0]?.quantity || "—"}
        </li>
        <li>
          <b>Estabilidad:</b> {p.tests?.[0]?.stability || "—"}
        </li>
        <li>
          <b>Condiciones:</b> {p.tests?.[0]?.temperature || "—"}
        </li>
      </ul>
    </div>

    {/* REQUERIMIENTOS */}
    <div>
      <p className="fw-bold mb-1">📌 Requerimientos adicionales</p>
      {p.tests?.[0]?.terms ? (
        <ul className="ps-3 mb-0">
          <li>{p.tests[0].terms}</li>
        </ul>
      ) : (
        <p className="mb-0 fst-italic">
          No presenta requerimientos adicionales
        </p>
      )}
    </div>

  </div>
)}


      </ListGroup.Item>
    ))
  ) : (
    <ListGroup.Item>No se seleccionaron productos.</ListGroup.Item>
  )}
</ListGroup>

            



            <Card.Footer className="bg-light text-end fw-bold text-success">
              💰 Total: ${total.toLocaleString("es-CO")}
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* BOTÓN FINAL */}
      <div className="text-center mt-4">
        <Button
          variant="success"
          size="lg"
          className="px-4 fw-semibold shadow-sm"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Guardando...
            </>
          ) : (
            "✅ Guardar PreOrden"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SummaryStep;
