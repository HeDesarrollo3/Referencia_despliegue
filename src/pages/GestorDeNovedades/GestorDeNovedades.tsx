//16/12/2025 agregamos selct de estados y generador de informe 
import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { patientColumns } from "./columns";
import { getPreRegistros,getTariffProducts } from "../../services/api";
import {
  Modal,
  Button,
  Form,
  Spinner,
  Alert,
  Card,
  ListGroup,
  Col,
  Row,
} from "react-bootstrap";
import { FiDownload } from "react-icons/fi";


// import * as XLSX from "xlsx";
import * as XLSX from "xlsx-js-style";




interface Paciente {
  identification: string;
  identificationType: string;
  patientName: string;
  gender: string;
  birthDate: string;
  mobileNumber: string;
  email: string;
  customerName?: string;
  customerAccountName?: string;
  tariffName?: string;
  orderNumber?: string;
  orderCie10?: string;
  orderObservation?: string;
  orderState?: string;
  products?: any[];
  orderCreationDate?: string;
}

const GestorDeNovedades: React.FC = () => {
  const [registros, setRegistros] = useState<Paciente[]>([]);
  const [filtered, setFiltered] = useState<Paciente[]>([]);
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Paciente | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  //estas estados son apara generar el informe
  const [fechaInicio, setFechaInicio] = useState("");
const [fechaFin, setFechaFin] = useState("");


  const token = localStorage.getItem("token") || "";

  const [openExamIndex, setOpenExamIndex] = useState<number | null>(null);
  const toggleExam = (index: number) => {
  setOpenExamIndex(openExamIndex === index ? null : index);
};


  /* ================= PAGINACIÓN ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;


  /* ================= generacion de reportes ================= */
const handleExportExcel = () => {
  if (!filtered.length) {
    alert("No hay datos para exportar");
    return;
  }

  /* ================= ENCABEZADO ================= */
  const encabezado = [
    ["REPORTE DE ÓRDENES"],
    [`Cliente: ${filtered[0]?.customerName || ""}`],
    ["Laboratorio: Higuera Escalante"],
    [`Fecha generación: ${new Date().toLocaleString("es-CO")}`],
    [],
  ];

  /* ================= COLUMNAS ================= */
  const columnas = [
    "Orden",
    "Paciente",
    "Documento",
    "Estado",
    "Fecha de creación",
    "Cliente",
    "Tarifa",
  ];

  /* ================= FILAS ================= */
  const filas = filtered.map((r) => [
    r.orderNumber,
    r.patientName,
    `${r.identificationType} ${r.identification}`,
    r.orderState,
    r.orderCreationDate
      ? new Date(r.orderCreationDate).toLocaleDateString("es-CO")
      : "",
    r.customerName,
    r.tariffName,
  ]);

  /* ================= HOJA ================= */
  const worksheet = XLSX.utils.aoa_to_sheet([
    ...encabezado,
    columnas,
    ...filas,
  ]);

  /* ================= ESTILOS ================= */

  // Título
  const titleStyle = {
    font: { bold: true, sz: 14 },
  };

  // 🟢 Cliente (encabezado)
  const clienteHeaderStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: "39FF14" } }, // verde fosforescente
    alignment: { vertical: "center" },
  };

  // Encabezados de tabla
  const tableHeaderStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "0D6EFD" } },
    alignment: { horizontal: "center", vertical: "center" },
  };

  // 🟡 Columnas destacadas
  const highlightColumnStyle = {
    fill: { fgColor: { rgb: "27F56F" } }, // amarillo suave
  };

  /* ================= APLICAR ESTILOS ================= */

  // Título
  worksheet[XLSX.utils.encode_cell({ r: 0, c: 0 })].s = titleStyle;

  // 🟢 Cliente
  worksheet[XLSX.utils.encode_cell({ r: 1, c: 0 })].s = clienteHeaderStyle;

  // Encabezados de tabla
  const headerRowIndex = encabezado.length;
  columnas.forEach((_, colIndex) => {
    const cellRef = XLSX.utils.encode_cell({
      r: headerRowIndex,
      c: colIndex,
    });
    worksheet[cellRef].s = tableHeaderStyle;
  });

  // 🟡 Resaltar columnas: Orden (0), Estado (3), Fecha (4)
  filas.forEach((_, rowIndex) => {
    [0, 3, 4].forEach((colIndex) => {
      const cellRef = XLSX.utils.encode_cell({
        r: headerRowIndex + 1 + rowIndex,
        c: colIndex,
      });
      if (worksheet[cellRef]) {
        worksheet[cellRef].s = highlightColumnStyle;
      }
    });
  });

  /* ================= ANCHO DE COLUMNAS ================= */
  worksheet["!cols"] = [
    { wch: 15 },
    { wch: 35 },
    { wch: 22 },
    { wch: 15 },
    { wch: 20 },
    { wch: 30 },
    { wch: 30 },
  ];

  /* ================= EXPORTAR ================= */
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

  XLSX.writeFile(
    workbook,
    `reporte_ordenes_${Date.now()}.xlsx`
  );
};


  /* ================= CARGA ================= */
  useEffect(() => {

    document.title = "Muestras Registradas - HE";

    const fetchPreRegistros = async () => {
      try {
        const response = await getPreRegistros(token);
        setRegistros(response || []);
        setFiltered(response || []);
      } catch (error) {
        console.error("❌ Error cargando preregistros:", error);
        setMessage("Error cargando preregistros");
      } finally {
        setLoading(false);
      }
    };
    fetchPreRegistros();
  }, [token]);

  /* ================= FILTROS ================= */
  useEffect(() => {
    const term = search.toLowerCase();

    let data = registros.filter(
      (r) =>
        r.identification?.toLowerCase().includes(term) ||
        r.patientName?.toLowerCase().includes(term) ||
        r.orderNumber?.toLowerCase().includes(term) ||
        r.customerName?.toLowerCase().includes(term)
    );

     // FILTRO ESTADO
    if (estadoFiltro) {
      data = data.filter(
        (r) => r.orderState?.toUpperCase() === estadoFiltro
      );
    }

    // FILTRO FECHAS
    

  if (fechaInicio && fechaFin) {
  data = data.filter((r) => {
    if (!r.orderCreationDate) return false;

    const orderDate = new Date(r.orderCreationDate)
      .toISOString()
      .slice(0, 10); // YYYY-MM-DD

    return orderDate >= fechaInicio && orderDate <= fechaFin;
  });
}

  


    setFiltered(data);
    setCurrentPage(1);
  },[search, estadoFiltro, fechaInicio, fechaFin, registros]);

  /* ================= PAGINACIÓN ================= */
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filtered.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const handleRowClick = (row: Paciente) => {
    setSelectedOrder(row);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">

<Card className="shadow-sm border-0 mb-3 w-100">
  <Card.Header className="mb-3 fw-bold" style={{ fontFamily: "Arial, sans-serif" }}>
    <h3 >📊 Generación de Reportes</h3>    
      
   
    
  </Card.Header>

  <Card.Body>
    <Row className="g-3 align-items-end">
      {/* FECHA INICIO */}
      <Col md={3}>
        <Form.Group>
          <Form.Label className="fw-semibold">
            Fecha inicio
          </Form.Label>
          <Form.Control
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </Form.Group>
      </Col>

      {/* FECHA FIN */}
      <Col md={3}>
        <Form.Group>
          <Form.Label className="fw-semibold">
            Fecha fin
          </Form.Label>
          <Form.Control
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </Form.Group>
      </Col>

      {/* ESPACIADOR */}
      <Col md={3}></Col>

      {/* BOTÓN */}
      <Col
        md={3}
        className="d-flex justify-content-end"
      >
        <Button
          variant="outline-primary"
          disabled={!fechaInicio || !fechaFin}
          className="fw-semibold d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
          onClick={handleExportExcel}
        >
          <FiDownload size={17} />
          Exportar reporte
        </Button>
      </Col>
    </Row>
  </Card.Body>
</Card>




      <h3 className="mb-4 fw-bold" style={{ fontFamily: "Arial, sans-serif" }}>
        📋 Muestras Registradas
      </h3>

      {/* FILTROS */}
      <div className="d-flex gap-3 mb-3">
        {/* SELECT ESTADO */}
        <Form.Select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          style={{
            width: "220px",
            fontSize: "1rem",
            borderRadius: "0.5rem",
            borderColor: "#007BFF",
            padding: "0.75rem",
          }}
        >
          <option value="">Todos los estados</option>
          <option value="REGISTRADA">Registrada</option>
          <option value="EN CURSO">En curso</option>
          <option value="RECHAZADA">Rechazada</option>
        </Form.Select>

        {/* BUSCADOR */}
        <Form.Control
          type="text"
          placeholder="Buscar por nombre, identificación, orden o cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            fontSize: "1rem",
            borderRadius: "0.5rem",
            borderColor: "#007BFF",
            padding: "0.75rem",
          }}
        />
      </div>

      {message && <Alert variant="danger">{message}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" /> Cargando registros...
        </div>
      ) : (
        <>
          <Table
            columns={patientColumns}
            data={currentRows}
            striped
            hover
            onRowClick={handleRowClick}
          />

          {/* PAGINACIÓN */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button
              variant="outline-primary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ◀ Anterior
            </Button>

            <span>
              Página {currentPage} de {totalPages}
            </span>

            <Button
              variant="outline-primary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Siguiente ▶
            </Button>
          </div>
        </>
      )}

      {/* ================= MODAL ================= */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold text-primary">
            🧾 Detalle de Orden #{selectedOrder?.orderNumber || "—"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-3">
          {selectedOrder ? (
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
                        <b>Nombre:</b> {selectedOrder.patientName}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1">
                        <b>Documento:</b> {selectedOrder.identificationType}-{selectedOrder.identification}
                      </p>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col md={6}>
                      <p className="mb-1">
                        <b>Fecha de nacimiento:</b>{" "}
                        {selectedOrder.birthDate
                          ? new Date(selectedOrder.birthDate).toLocaleDateString("es-CO")
                          : "—"}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1">
                        <b>Sexo:</b> {selectedOrder.gender || "—"}
                      </p>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col md={6}>
                      <p className="mb-1">
                        <b>Email:</b> {selectedOrder.email || "—"}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1">
                        <b>Teléfono:</b> {selectedOrder.mobileNumber || "—"}
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
                  <p><b>Cliente:</b> {selectedOrder.customerName || "—"}</p>
                  <p><b>Cuenta:</b> {selectedOrder.customerAccountName || "—"}</p>
                  <p><b>Tarifa:</b> {selectedOrder.tariffName || "—"}</p>
                  <p><b>Estado:</b> {selectedOrder.orderState || "—"}</p>
                  <p><b>Observación:</b> {selectedOrder.orderObservation || "Sin observaciones"}</p>
                </Card.Body>
              </Card>

              {/* EXÁMENES SOLICITADOS */}
              {/* EXÁMENES SOLICITADOS */}
<Card className="shadow-sm border-0 mb-3">
  <Card.Header className="bg-secondary text-white fw-semibold">
    🧪 Exámenes Solicitados
  </Card.Header>

  <ListGroup variant="flush">
    {selectedOrder.products?.length ? (
      selectedOrder.products.map((p: any, idx: number) => {
        const product = p.product;

        return (
          <ListGroup.Item key={idx} className="p-0">
            {/* HEADER */}
            <div
              className="d-flex justify-content-between align-items-center p-3"
              style={{ cursor: "pointer" }}
              onClick={() => toggleExam(idx)}
            >
              <span className="fw-semibold">
                {product?.name || "—"}
              </span>

              <div>
                <b className="me-3">
                  {p.price?.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  })}
                </b>
                <span className="text-primary">
                  {openExamIndex === idx ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {/* CONTENIDO */}
            {openExamIndex === idx && (
              <div className="px-4 pb-3 pt-2 bg-light border-top small">
                {/* MUESTRA */}
                <div className="mb-2">
                  <p className="fw-bold mb-1">🧪 Muestra</p>
                  <ul className="ps-3 mb-1">
                    <li>
                      <b>Tipo:</b>{" "}
                      {product?.tests?.[0]?.sampleTypes || "—"}
                    </li>
                    <li>
                      <b>Cantidad:</b>{" "}
                      {product?.tests?.[0]?.quantity || "—"}
                    </li>
                    <li>
                      <b>Estabilidad:</b>{" "}
                      {product?.tests?.[0]?.stability || "—"}
                    </li>
                    <li>
                      <b>Condiciones:</b>{" "}
                      {product?.tests?.[0]?.temperature || "—"}
                    </li>
                  </ul>
                </div>

                {/* REQUERIMIENTOS */}
                <div>
                  <p className="fw-bold mb-1">
                    📌 Requerimientos adicionales
                  </p>
                  {product?.tests?.[0]?.terms ? (
                    <ul className="ps-3 mb-0">
                      <li>{product.tests[0].terms}</li>
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
        );
      })
    ) : (
      <ListGroup.Item>
        No se seleccionaron productos.
      </ListGroup.Item>
    )}
  </ListGroup>

  <Card.Footer className="bg-light text-end fw-bold text-success">
    💰 Total:{" "}
    {selectedOrder.products
      ?.reduce((sum, p) => sum + (p.price || 0), 0)
      .toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      })}
  </Card.Footer>
</Card>

            </>
          ) : (
            <p>No hay detalles para mostrar.</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestorDeNovedades;







// import React, { useEffect, useState } from "react";
// import Table from "../../components/common/Table";
// import { patientColumns } from "./columns";
// import { getPreRegistros } from "../../services/api";
// import { Modal, Button, Form, Spinner, Alert, Card, ListGroup, Col, Row } from "react-bootstrap";

// interface Paciente {
//   identification: string;
//   identificationType: string;
//   patientName: string;
//   gender: string;
//   birthDate: string;
//   mobileNumber: string;
//   email: string;
//   customerName?: string;
//   customerAccountName?: string;
//   tariffName?: string;
//   orderNumber?: string;
//   orderCie10?: string;
//   orderObservation?: string;
//   orderState?: string;
//   products?: any[];
// }

// const GestorDeNovedades: React.FC = () => {
//   const [registros, setRegistros] = useState<Paciente[]>([]);
//   const [filtered, setFiltered] = useState<Paciente[]>([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Paciente | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);

//   const token = localStorage.getItem("token") || "";

//   useEffect(() => {
//     const fetchPreRegistros = async () => {
//       try {
//         const response = await getPreRegistros(token);
//         setRegistros(response || []);
//         setFiltered(response || []);
//       } catch (error) {
//         console.error("❌ Error cargando preregistros:", error);
//         setMessage("Error cargando preregistros");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPreRegistros();
//   }, [token]);

//   useEffect(() => {
//     const term = search.toLowerCase();
//     setFiltered(
//       registros.filter(
//         (r) =>
//           r.identification?.toLowerCase().includes(term) ||
//           r.patientName?.toLowerCase().includes(term) ||
//           r.orderNumber?.toLowerCase().includes(term) ||
//           r.customerName?.toLowerCase().includes(term)
//       )
//     );
//   }, [search, registros]);

//   const handleRowClick = (row: Paciente) => {
//     setSelectedOrder(row);
//     setShowModal(true);
//   };

//   return (
//     <div className="container mt-4">
//       <h3 className="mb-4 fw-bold " style={{ fontFamily: "Arial, sans-serif" }}>
//         📋 Gestor de Novedades
//       </h3>

//       <Form.Control
//         type="text"
//         placeholder="Buscar por nombre, identificación, orden o cliente..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="mb-3"
//         style={{
//           fontSize: "1rem",
//           borderRadius: "0.5rem",
//           borderColor: "#007BFF",
//           padding: "0.75rem",
//         }}
//       />

//       {message && <Alert variant="danger">{message}</Alert>}

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" /> Cargando registros...
//         </div>
//       ) : (
//         <Table
//           columns={patientColumns}
//           data={filtered}
//           striped
//           hover
//           onRowClick={handleRowClick}
//         />
//       )}

//       <Modal
//   show={showModal}
//   onHide={() => setShowModal(false)}
//   size="lg"
//   centered
// >
//   <Modal.Header closeButton className="bg-light">
//     <Modal.Title className="fw-bold text-primary">
//       🧾 Detalle de Orden #{selectedOrder?.orderNumber || "—"}
//     </Modal.Title>
//   </Modal.Header>

//   <Modal.Body className="p-3">
//     {selectedOrder ? (
//       <>
//         {/* DATOS DEL PACIENTE */}
//         <Card className="shadow-sm border-0 mb-3">
//           <Card.Header className="bg-primary text-white fw-semibold">
//             👤 Datos del Paciente
//           </Card.Header>
//           <Card.Body>
//             <Row className="mb-2">
//               <Col md={6}>
//                 <p className="mb-1">
//                   <b>Nombre:</b> {selectedOrder.patientName}
//                 </p>
//               </Col>
//               <Col md={6}>
//                 <p className="mb-1">
//                   <b>Documento:</b> {selectedOrder.identificationType}-{selectedOrder.identification}
//                 </p>
//               </Col>
//             </Row>

//             <Row className="mb-2">
//               <Col md={6}>
//                 <p className="mb-1"><b>Fecha de nacimiento:</b> {selectedOrder.birthDate ? new Date(selectedOrder.birthDate).toLocaleDateString("es-CO") : "—"}</p>
//               </Col>
//               <Col md={6}>
//                 <p className="mb-1"><b>Sexo:</b> {selectedOrder.gender || "—"}</p>
//               </Col>
//             </Row>

//             <Row className="mb-2">
//               <Col md={6}>
//                 <p className="mb-1"><b>Email:</b> {selectedOrder.email || "—"}</p>
//               </Col>
//               <Col md={6}>
//                 <p className="mb-1"><b>Teléfono:</b> {selectedOrder.mobileNumber || "—"}</p>
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>

//         {/* PLAN / ENTIDAD */}
//         <Card className="shadow-sm border-0 mb-3">
//           <Card.Header className="bg-info text-white fw-semibold">
//             🏥 Plan / Entidad
//           </Card.Header>
//           <Card.Body>
//             <p><b>Cliente:</b> {selectedOrder.customerName || "—"}</p>
//             <p><b>Cuenta:</b> {selectedOrder.customerAccountName || "—"}</p>
//             <p><b>Tarifa:</b> {selectedOrder.tariffName || "—"}</p>
//             <p><b>Estado:</b> {selectedOrder.orderState || "—"}</p>
//             <p><b>Observación:</b> {selectedOrder.orderObservation || "Sin observaciones"}</p>
//           </Card.Body>
//         </Card>

//         {/* EXÁMENES SOLICITADOS */}
//         <Card className="shadow-sm border-0 mb-3">
//           <Card.Header className="bg-secondary text-white fw-semibold">
//             🧪 Exámenes Solicitados
//           </Card.Header>
//           <ListGroup variant="flush">
//             {selectedOrder.products?.length ? (
//               selectedOrder.products.map((p, i) => (
//                 <ListGroup.Item key={i}>
//                   <div className="d-flex justify-content-between">
//                     <span>{p.product?.name ?? "—"}</span>
//                     <b>
//                       {p.price?.toLocaleString("es-CO", {
//                         style: "currency",
//                         currency: "COP",
//                         minimumFractionDigits: 0,
//                       })}
//                     </b>
//                   </div>
//                 </ListGroup.Item>
//               ))
//             ) : (
//               <ListGroup.Item>No se seleccionaron productos.</ListGroup.Item>
//             )}
//           </ListGroup>
//           <Card.Footer className="bg-light text-end fw-bold text-success">
//             💰 Total:{" "}
//             {selectedOrder.products?.reduce(
//               (sum, p) => sum + (p.price || 0),
//               0
//             ).toLocaleString("es-CO", { style: "currency", currency: "COP" })}
//           </Card.Footer>
//         </Card>
//       </>
//     ) : (
//       <p>No hay detalles para mostrar.</p>
//     )}
//   </Modal.Body>

//   <Modal.Footer>
//     <Button variant="secondary" onClick={() => setShowModal(false)}>
//       Cerrar
//     </Button>
//   </Modal.Footer>
// </Modal>


//       {/* <Modal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         size="lg"
//         centered
//       >
//         <Modal.Header closeButton className="bg-light">
//           <Modal.Title>🧾 Detalle de Orden #{selectedOrder?.orderNumber || "—"}</Modal.Title>
//         </Modal.Header>

//         <Modal.Body className="p-3">
//           {selectedOrder ? (
//             <>
//               <h6 className="text-primary mb-3">👤 DATOS DEL PACIENTE</h6>
//               <p><b>Nombre:</b> {selectedOrder.patientName}</p>
//               <p><b>Documento:</b> {selectedOrder.identificationType}-{selectedOrder.identification}</p>
//               <p><b>Sexo:</b> {selectedOrder.gender}</p>
//               <p><b>Fecha de nacimiento:</b> {selectedOrder.birthDate ? new Date(selectedOrder.birthDate).toLocaleDateString("es-CO") : "—"}</p>
//               <p><b>Email:</b> {selectedOrder.email || "—"}</p>
//               <p><b>Teléfono:</b> {selectedOrder.mobileNumber || "—"}</p>

//               <h6 className="text-primary mt-4 mb-3">🏥 PLAN / ENTIDAD</h6>
//               <p><b>Cliente:</b> {selectedOrder.customerName || "—"}</p>
//               <p><b>Cuenta:</b> {selectedOrder.customerAccountName || "—"}</p>
//               <p><b>Tarifa:</b> {selectedOrder.tariffName || "—"}</p>
//               <p><b>Estado:</b> {selectedOrder.orderState || "—"}</p>
//               <p><b>Observación:</b> {selectedOrder.orderObservation || "Sin observaciones"}</p>

//               <h6 className="text-primary mt-4 mb-3">🧪 EXÁMENES SOLICITADOS</h6>
//               {selectedOrder.products?.length ? (
//                 <ul>
//                   {selectedOrder.products.map((p, i) => (
//                     <li key={i}>
//                       {p.product?.name ?? "—"} -{" "}
//                       {p.price?.toLocaleString("es-CO", {
//                         style: "currency",
//                         currency: "COP",
//                         minimumFractionDigits: 0,
//                       })}
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No se seleccionaron productos.</p>
//               )}
//             </>
//           ) : (
//             <p>No hay detalles para mostrar.</p>
//           )}
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Cerrar
//           </Button>
//         </Modal.Footer>
//       </Modal> */}
//     </div>
//   );
// };




//---6/10/2025// // src/pages/GestorDeNovedades/GestorDeNovedades.tsx
// import React, { useState, useEffect } from "react";
// import Alert from "react-bootstrap/Alert";

// import { getPreRegistros, updateOrder } from "../../services/api";

// interface Product {
//   productId: string;
//   code: string;
//   name: string;
//   price: number;
//   quantity: number;
//   pendingPayment: boolean;
// }

// interface Order {
//   orderId: string;
//   orderNumber: string;
//   cie10: string;
//   priority: string;
//   state: string;
//   observation: string;
//   customerAccountId: string;
//   tariffId: string;
//   products: Product[];
// }

// interface Patient {
//   patientId: string;
//   identification: string;
//   patientName: string;
//   orders: Order[];
// }

// const GestorDeNovedades: React.FC = () => {
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("No hay token, por favor inicie sesión");

//         const registros = await getPreRegistros(token);
//         console.log("✅ Data recibida:", registros);

//         setPatients(registros);
//       } catch (error) {
//         console.error("❌ Error cargando pre-registros", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleUpdate = async () => {
//     if (!selectedOrder) return;

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No hay token, por favor inicie sesión");

//       const body = {
//         cie10: selectedOrder.cie10,
//         priority: selectedOrder.priority,
//         observation: selectedOrder.observation,
//         patientId: patients.find(p => 
//           p.orders.some(o => o.orderId === selectedOrder.orderId)
//         )?.patientId,
//         customerAccountId: selectedOrder.customerAccountId,
//         tariffId: selectedOrder.tariffId,
//         products: selectedOrder.products.map((p) => ({ productId: p.productId })),
//       };

//       console.log("📤 PATCH body:", body);

//       await updateOrder(token, selectedOrder.orderId, body);

//       alert("Orden actualizada correctamente ✅");
//       setShowModal(false);
//     } catch (error: any) {
//       console.error("❌ Error al actualizar:", error);
//       alert("Error al actualizar la orden ❌");
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Gestor de Novedades</h2>

//       {patients.length === 0 ? (
//         <Alert variant="warning">No hay pacientes con órdenes disponibles</Alert>
//       ) : (
//         patients.map((patient) => (
//           <div key={patient.patientId} className="card mb-4 shadow-sm">
//             <div className="card-header bg-light">
//               <h5>
//                 {patient.patientName} - {patient.identification}
//               </h5>
//             </div>
//             <div className="card-body">
//               {patient.orders.map((order) => (
//                 <div key={order.orderId} className="border p-3 mb-3 rounded">
//                   <p><b>Orden:</b> {order.orderNumber}</p>
//                   <p><b>CIE10:</b> {order.cie10}</p>
//                   <p><b>Prioridad:</b> {order.priority}</p>
//                   <p><b>Estado:</b> {order.state}</p>
//                   <p><b>Observación:</b> {order.observation}</p>

//                   <h6>Productos</h6>
//                   <ul>
//                     {order.products.map((p) => (
//                       <li key={p.productId}>
//                         {p.name} ({p.code}) - Cant: {p.quantity} - ${p.price}{" "}
//                         {p.pendingPayment ? "(Pendiente)" : ""}
//                       </li>
//                     ))}
//                   </ul>

//                   <button
//                     className="btn btn-primary btn-sm"
//                     onClick={() => {
//                       setSelectedOrder(order);
//                       setShowModal(true);
//                     }}
//                   >
//                     Editar Orden
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))
//       )}

//       {/* Modal */}
//       {showModal && selectedOrder && (
//         <div className="modal show d-block" tabIndex={-1}>
//           <div className="modal-dialog modal-lg">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   Editar Orden {selectedOrder.orderNumber}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label className="form-label">CIE10</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={selectedOrder.cie10}
//                     onChange={(e) =>
//                       setSelectedOrder({ ...selectedOrder, cie10: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Prioridad</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={selectedOrder.priority}
//                     onChange={(e) =>
//                       setSelectedOrder({ ...selectedOrder, priority: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Observación</label>
//                   <textarea
//                     className="form-control"
//                     value={selectedOrder.observation}
//                     onChange={(e) =>
//                       setSelectedOrder({ ...selectedOrder, observation: e.target.value })
//                     }
//                   />
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cerrar
//                 </button>
//                 <button className="btn btn-primary" onClick={handleUpdate}>
//                   Guardar Cambios
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GestorDeNovedades;





// // src/pages/GestorDeNovedades/GestorDeNovedades.tsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Table from "../../components/common/Table";
// import Alert from "react-bootstrap/Alert";
//   import {
//   getCie10,
//   getTariffProducts,
//   registerOrder,
//   getPreRegistros,
//   updateOrder,  // servicio para actuializar orden
// } from "../../services/api";

// interface ProductData {
//   identification: string;
//   orderId: string;
//   orderNumber: string | null;
//   cie10: string;
//   priority: string;
//   stade: string;
//   observation: string;
//   patientId: string;
//   patientName: string;
//   customerAccountId: string;
//   tariffId: string;
//   orderProductId: string;
//   quantity: number;
//   pendingPayment: boolean;
//   productCode: string;
//   productName: string;
//   price: number;
//   products: { productId: string }[];
// }

// const API_URL =
//   "http://localhost:3000/api/v1/higuera-escalante/orders/by-term";

// const GestorDeNovedades: React.FC = () => {
//   const [data, setData] = useState<ProductData[]>([]);
//   const [filteredData, setFilteredData] = useState<ProductData[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<ProductData | null>(null);
//   const [showModal, setShowModal] = useState(false);

//   // filtros
//   const [filterIdentification, setFilterIdentification] = useState("");
//   const [filterName, setFilterName] = useState("");
//   const [filterOrderNumber, setFilterOrderNumber] = useState("");
//   const [filterState, setFilterState] = useState("");

//   // 🔄 Transformar respuesta API → ProductData[]
//   const transformResponse = (result: any[]): ProductData[] => {
//     return result.flatMap((patient: any) =>
//       patient.orders.flatMap((order: any) =>
//         order.products.map((p: any) => ({
//           orderId: order.orderId,
//           orderNumber: order.orderNumber || "",
//           cie10: order.cie10 || "",
//           priority: order.priority || "",
//           observation: order.observation || "",
//           patientId: patient.patientId, // este es el id real
//           identification: patient.identification || "", // documento del paciente
//           patientName: `${patient.firstName || ""} ${patient.lastName || ""}`,
//           customerAccountId: order.customerAccount?.customerAccountId || "",
//           tariffId: order.tariff?.tariffId || "",
//           orderProductId: p.orderProductId || "",
//           quantity: p.quantity || 0,
//           pendingPayment: p.pendingPayment || false,
//           productCode: p.product?.code || "",
//           productName: p.product?.name || "",
//           price: p.price || 0,
//           products: order.products.map((prod: any) => ({
//             productId: prod.product?.productId,
//           })),
//         }))
//       )
//     );
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("No hay token, por favor inicie sesión");

//         const res = await axios.post(
//           API_URL,
//           { term: "" }, // 👈 listar todo
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const transformed = transformResponse(res.data);
//         setData(transformed);
//         setFilteredData(transformed);
//         console.log("Órdenes cargadas:", transformed);
//       } catch (error) {
//         console.error("Error cargando órdenes", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // aplicar filtros en frontend
//   useEffect(() => {
//     let filtered = data;

//     if (filterIdentification) {
//       filtered = filtered.filter((o) =>
//         o.identification.toLowerCase().includes(filterIdentification.toLowerCase())
//       );
//     }
//     if (filterName) {
//       filtered = filtered.filter((o) =>
//         o.patientName.toLowerCase().includes(filterName.toLowerCase())
//       );
//     }
//     if (filterOrderNumber) {
//       filtered = filtered.filter((o) =>
//         (o.orderNumber || "").toLowerCase().includes(filterOrderNumber.toLowerCase())
//       );
//     }
//     if (filterState) {
//       filtered = filtered.filter((o) =>
//         (o.priority || "").toLowerCase().includes(filterState.toLowerCase())
//       );
//     }

//     setFilteredData(filtered);
//   }, [filterIdentification, filterName, filterOrderNumber, filterState, data]);

//   const handleRowClick = (order: ProductData) => {
//     setSelectedOrder(order);
//     setShowModal(true);
//   };

//   // const handleUpdate = async () => {
//   //   if (!selectedOrder) return;

//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     if (!token) throw new Error("No hay token, por favor inicie sesión");

//   //     const body = {
//   //       cie10: selectedOrder.cie10,
//   //       priority: selectedOrder.priority,
//   //       observation: selectedOrder.observation,
//   //       patientId: selectedOrder.patientId, // 👈 enviar id del paciente
//   //       customerAccountId: selectedOrder.customerAccountId,
//   //       tariffId: selectedOrder.tariffId,
//   //       products: selectedOrder.products.map((p) => ({
//   //         productId: p.productId,
//   //       })),
//   //     };

//   //     console.log("📤 PATCH body:", body);

//   //     await axios.patch(
//   //       `http://localhost:3000/api/v1/higuera-escalante/orders/${selectedOrder.orderId}`,
//   //       body,
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );

//   //     alert("Orden actualizada correctamente ✅");
//   //     setShowModal(false);

//   //     setData((prev) =>
//   //       prev.map((o) => (o.orderId === selectedOrder.orderId ? selectedOrder : o))
//   //     );
//   //   } catch (error: any) {
//   //     console.error("❌ Error al actualizar:", error.response?.data || error);
//   //     alert("Error al actualizar la orden ❌");
//   //   }
//   // };

//   const handleUpdate = async () => {
//   if (!selectedOrder) return;

//   try {
//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("No hay token, por favor inicie sesión");

//     const body = {
//       cie10: selectedOrder.cie10,
//       priority: selectedOrder.priority,
//       observation: selectedOrder.observation,
//       patientId: selectedOrder.patientId,
//       customerAccountId: selectedOrder.customerAccountId,
//       tariffId: selectedOrder.tariffId,
//       products: selectedOrder.products.map((p) => ({
//         productId: p.productId,
//       })),
//     };

//     console.log("📤 PATCH body:", body);

//     await updateOrder(token, selectedOrder.orderId, body);

//     alert("Orden actualizada correctamente ✅");
//     setShowModal(false);

//     // refrescar el estado en memoria
//     setData((prev) =>
//       prev.map((o) => (o.orderId === selectedOrder.orderId ? selectedOrder : o))
//     );
//   } catch (error: any) {
//     console.error("❌ Error al actualizar:", error.message);
//     alert("Error al actualizar la orden ❌");
//   }
// };

//   // const columns = [
//   //   { header: "Número Orden", accessor: "orderNumber" },
//   //   { header: "Paciente", accessor: "patientName" },
//   //   { header: "Documento", accessor: "identification" },
//   //   { header: "CIE10", accessor: "cie10" },
//   //   { header: "Prioridad", accessor: "priority" },
//   //   { header: "Observación", accessor: "observation" },
//   //   { header: "Código Producto", accessor: "productCode" },
//   //   { header: "Nombre Producto", accessor: "productName" },
//   //   { header: "Cantidad", accessor: "quantity" },
//   //   { header: "Pendiente Pago", accessor: "pendingPayment" },
//   //   { header: "Precio", accessor: "price" },
//   // ];
//   const columns = [
//   { header: "Número Orden", accessor: "orderNumber" as keyof ProductData },
//   { header: "Paciente", accessor: "patientName" as keyof ProductData },
//   { header: "Documento", accessor: "identification" as keyof ProductData },
//   { header: "CIE10", accessor: "cie10" as keyof ProductData },
//   { header: "Prioridad", accessor: "priority" as keyof ProductData },
//   { header: "Observación", accessor: "observation" as keyof ProductData },
//   { header: "Código Producto", accessor: "productCode" as keyof ProductData },
//   { header: "Nombre Producto", accessor: "productName" as keyof ProductData },
//   { header: "Cantidad", accessor: "quantity" as keyof ProductData },
//   { header: "Pendiente Pago", accessor: "pendingPayment" as keyof ProductData },
//   { header: "Precio", accessor: "price" as keyof ProductData },
// ];

//   return (
//     <div className="container mt-4">
//       <h2>Gestor de Novedades</h2>

//       {/* 🔎 Filtros */}
//       <div className="row mb-3">
//         <div className="col">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Filtrar por identificación"
//             value={filterIdentification}
//             onChange={(e) => setFilterIdentification(e.target.value)}
//           />
//         </div>
//         <div className="col">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Filtrar por nombre"
//             value={filterName}
//             onChange={(e) => setFilterName(e.target.value)}
//           />
//         </div>
//         <div className="col">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Filtrar por número de orden"
//             value={filterOrderNumber}
//             onChange={(e) => setFilterOrderNumber(e.target.value)}
//           />
//         </div>
//         <div className="col">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Filtrar por estado"
//             value={filterState}
//             onChange={(e) => setFilterState(e.target.value)}
//           />
//         </div>
//       </div>

//       {filteredData.length === 0 ? (
//         <Alert variant="warning">No hay resultados disponibles</Alert>
//       ) : (
//         <Table<ProductData>
//           columns={columns}
//           data={filteredData}
//           onRowClick={handleRowClick}
//         />
//       )}

//       {/* Modal de actualización (igual al tuyo) */}
//       {showModal && selectedOrder && (
//         <div className="modal show d-block" tabIndex={-1}>
//           <div className="modal-dialog modal-lg">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   Actualizar Orden {selectedOrder.orderNumber}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <p><b>Paciente:</b> {selectedOrder.patientName}</p>
//                 <p><b>Documento:</b> {selectedOrder.identification}</p>
//                 <p><b>Código Producto:</b> {selectedOrder.productCode}</p>
//                 <p><b>Nombre Producto:</b> {selectedOrder.productName}</p>
//                 <p><b>Cantidad:</b> {selectedOrder.quantity}</p>
//                 <p><b>Precio:</b> {selectedOrder.price}</p>
//                 <p><b>Pendiente Pago:</b> {selectedOrder.pendingPayment ? "Sí" : "No"}</p>

//                 <div className="mb-3">
//                   <label className="form-label">CIE10</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={selectedOrder.cie10}
//                     onChange={(e) =>
//                       setSelectedOrder({
//                         ...selectedOrder,
//                         cie10: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Prioridad</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={selectedOrder.priority}
//                     onChange={(e) =>
//                       setSelectedOrder({
//                         ...selectedOrder,
//                         priority: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Observación</label>
//                   <textarea
//                     className="form-control"
//                     value={selectedOrder.observation}
//                     onChange={(e) =>
//                       setSelectedOrder({
//                         ...selectedOrder,
//                         observation: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cerrar
//                 </button>
//                 <button className="btn btn-primary" onClick={handleUpdate}>
//                   Actualizar
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GestorDeNovedades;
