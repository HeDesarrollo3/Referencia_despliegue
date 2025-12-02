// // FILE: src/pages/Admin/AdminPage.tsx
// import React, { useEffect, useState } from "react";
// import OrderTable from "../../components/Admin/OrderTable";
// import OrderModal from "../../components/Admin/OrderModal";
// import {
//   fetchOrdersByState,
//   fetchAccountsByCustomer,
//   patchOrder,
//   changeOrderState,
// } from "../../services/apiAdmin";
// import {  Spinner, Alert } from "react-bootstrap";

// const AdminPage: React.FC = () => {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [filtered, setFiltered] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [stateFilter, setStateFilter] = useState("REGISTRADA");
//   const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchText, setSearchText] = useState("");

//   // ⛔ Antes podía ser null — ahora siempre será string
//   const token = localStorage.getItem("token") || "";

//   // ---------------------------------------------
//   // VALIDAR TOKEN ANTES DE CONSULTAR API
//   // ---------------------------------------------
//   useEffect(() => {
//     if (!token) {
//       console.warn("⚠ No hay token — redirigiendo al login...");
//       window.location.href = "/login";
//       return;
//     }

//     load(stateFilter);
//   }, [stateFilter]);

//   // ---------------------------------------------
//   // Cargar órdenes por estado
//   // ---------------------------------------------
//   const load = async (state: string) => {
//     if (!token) return; // seguridad extra

//     try {
//       setLoading(true);
//       const data = await fetchOrdersByState(token, state);
//       setOrders(data);
//       setFiltered(data);
//     } catch (err) {
//       console.error("❌ Error fetching orders", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------------------------------------
//   // Buscador
//   // ---------------------------------------------
//   const onSearch = (text: string) => {
//     setSearchText(text);

//     if (!text) return setFiltered(orders);

//     const lower = text.toLowerCase();
//     const f = orders.filter((o: any) =>
//       (o.patientName || "").toLowerCase().includes(lower) ||
//       (o.orderNumber || "").toLowerCase().includes(lower) ||
//       (o.customerName || "").toLowerCase().includes(lower)
//     );

//     setFiltered(f);
//   };

//   // ---------------------------------------------
//   // Abrir modal de detalles
//   // ---------------------------------------------
//   const openDetails = async (row: any) => {
//     if (!token) return;

//     setSelectedOrder(row);

//     try {
//       const accounts = await fetchAccountsByCustomer(token, row.customerId);
//       console.log("accounts", accounts);
//     } catch (err) {
//       console.warn("⚠ No se pudieron cargar cuentas", err);
//     }

//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedOrder(null);
//   };

//   // ---------------------------------------------
//   // Eliminar producto de la orden
//   // ---------------------------------------------
//   const deleteProduct = async (orderProductId: string) => {
//     if (!selectedOrder || !token) return;

//     const orderId = selectedOrder.orderId;

//     const remaining = (selectedOrder.products || []).filter(
//       (p: any) => p.orderProductId !== orderProductId
//     );

//     const body = {
//       cie10: selectedOrder.cie10,
//       priority: selectedOrder.priority,
//       observation: selectedOrder.observation,
//       patientId: selectedOrder.patientId,
//       customerAccountId: selectedOrder.customerAccountId,
//       tariffId: selectedOrder.tariffId,
//       products: remaining.map((p: any) => ({ productId: p.productId })),
//     };

//     try {
//       await patchOrder(token, orderId, body);

//       // actualizar UI
//       setSelectedOrder((prev: any) =>
//         prev ? { ...prev, products: remaining } : prev
//       );

//       setOrders((prev) =>
//         prev.map((o) =>
//           o.orderId === orderId ? { ...o, products: remaining } : o
//         )
//       );

//       setFiltered((prev) =>
//         prev.map((o) =>
//           o.orderId === orderId ? { ...o, products: remaining } : o
//         )
//       );
//     } catch (err) {
//       console.error("❌ Error deleting product", err);
//     }
//   };

//   // ---------------------------------------------
//   // Guardar cambios en la orden
//   // ---------------------------------------------
//   const saveOrder = async () => {
//     if (!selectedOrder || !token) return;

//     const body = {
//       cie10: selectedOrder.cie10,
//       priority: selectedOrder.priority,
//       observation: selectedOrder.observation,
//       patientId: selectedOrder.patientId,
//       customerAccountId: selectedOrder.customerAccountId,
//       tariffId: selectedOrder.tariffId,
//       products: (selectedOrder.products || []).map((p: any) => ({
//         productId: p.productId,
//       })),
//     };

//     try {
//       await patchOrder(token, selectedOrder.orderId, body);

//       // Cambiar estado de la orden
//       await changeOrderState(token, selectedOrder.orderId, "EN CURSO");

//       await load(stateFilter);
//       closeModal();
//     } catch (err) {
//       console.error("❌ Error saving order", err);
//     }
//   };

//   // ---------------------------------------------
//   // Render
//   // ---------------------------------------------
//   return (
//     <div className="container mt-4">
//       <h3>Órdenes</h3>

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginBottom: 12,
//         }}
//       >
//         {/* <div>
//           <select
//             value={stateFilter}
//             onChange={(e) => setStateFilter(e.target.value)}
//           >
//             <option value="REGISTRADA">REGISTRADA</option>
//             <option value="EN CURSO">EN CURSO</option>
//             <option value="RECHAZADA">RECHAZADA</option>
//             <option value="COMPLETADA">COMPLETADA</option>
//           </select>
//         </div> */}

//         {/* <div style={{ display: "flex", gap: 8 }}>
//           <input
//             placeholder="Buscar..."
//             value={searchText}
//             onChange={(e) => onSearch(e.target.value)}
//           />
//           {loading && <Spinner animation="border" size="sm" />}
//         </div> */}
//       </div>

//       {loading ? (
//         <Alert>Cargando...</Alert>
//       ) : (
//       <OrderTable
//   data={filtered}
//   onRowClick={openDetails}
//   searchText={searchText}
//   onSearch={onSearch}
//   stateFilter={stateFilter}
//   onStateFilterChange={(v) => setStateFilter(v)}
// />

//       )}

//       <OrderModal
//         show={isModalOpen}
//         order={selectedOrder}
//         onClose={closeModal}
//         onSave={saveOrder}
//         onDeleteProduct={deleteProduct}
//       />
//     </div>
//   );
// };

// export default AdminPage;





// import React, { useEffect, useState } from "react";
// import {
//   fetchOrdersByState,
//   patchOrder,
//   changeOrderState,
// } from "../../services/apiAdmin";

// import OrderModal from "../../components/Admin/OrderModal";
// import OrderTable from "../../components/Admin/OrderTable";

// const Admin = () => {
//   const token = localStorage.getItem("token");

//   const [orders, setOrders] = useState<any[]>([]);
//   const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
//   const [stateFilter, setStateFilter] = useState("REGISTRADA");
//   const [searchText, setSearchText] = useState("");

//   const [selectedOrder, setSelectedOrder] = useState<any>(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   // =====================================================
//   // CARGAR ÓRDENES DESDE API
//   // =====================================================
//   const loadOrders = async () => {
//     try {
//       const response = await fetchOrdersByState(token, stateFilter);
//       setOrders(response);
//     } catch (err) {
//       console.error("❌ Error cargando órdenes:", err);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, [stateFilter]);

//   // =====================================================
//   // APLICAR FILTROS DE BÚSQUEDA
//   // =====================================================
//   useEffect(() => {
//     let data = [...orders];

//     if (searchText.trim()) {
//       data = data.filter(
//         (o) =>
//           o.orderNumber.includes(searchText) ||
//           o.patientName.toLowerCase().includes(searchText.toLowerCase())
//       );
//     }

//     setFilteredOrders(data);
//   }, [searchText, orders]);

//   // =====================================================
//   // ABRIR Y CERRAR MODAL
//   // =====================================================
//   const openOrder = (order: any) => {
//     setSelectedOrder(order);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedOrder(null);
//     setModalOpen(false);
//   };

//   // =====================================================
//   // GUARDAR CAMBIOS DE ORDEN
//   // =====================================================
//   const saveOrder = async () => {
//     if (!selectedOrder) return;

//     const payload = {
//       cie10: selectedOrder.cie10 || "",
//       priority: selectedOrder.priority || "3",
//       observation: selectedOrder.observation || "",
//       patientId: selectedOrder.patientId,
//       customerAccountId: selectedOrder.customerAccountId,
//       tariffId: selectedOrder.tariffId,
//       products: selectedOrder.products?.map((p: any) => ({
//         productId: p.productId,
//       })),
//     };

//     try {
//       await patchOrder(token!, selectedOrder.orderId, payload);
//       alert("✅ Orden actualizada correctamente");
//       loadOrders();
//       closeModal();
//     } catch (err: any) {
//       console.error("❌ Error al guardar:", err.response?.data || err);
//       alert("Error al guardar la orden");
//     }
//   };

//   // =====================================================
//   // CAMBIAR ESTADO DE ORDEN
//   // =====================================================
//   const updateState = async (newState: string) => {
//     if (!selectedOrder) return;

//     try {
//       await changeOrderState(token!, selectedOrder.orderId, newState);

//       alert(`Estado cambiado a ${newState}`);
//       loadOrders();
//       closeModal();
//     } catch (err: any) {
//       console.error("❌ Error cambiando estado:", err.response?.data || err);
//       alert("No se pudo cambiar el estado");
//     }
//   };

//   return (
//     <>
//       <h2 className="mb-3">Administración de Órdenes</h2>

//       {/* TABLA */}
//       <OrderTable
//         data={filteredOrders}
//         onRowClick={openOrder}
//         searchText={searchText}
//         onSearch={setSearchText}
//         stateFilter={stateFilter}
//         onStateFilterChange={setStateFilter}
//       />

//       {/* MODAL */}
//       <OrderModal
//         show={modalOpen}
//         order={selectedOrder}
//         onClose={closeModal}
//         //  onSave={saveOrder}
//         onChangeState={updateState}  
//       />
//     </>
//   );
// };

// export default Admin;


// src/pages/Admin/AdminPage.tsx
// // FILE: src/pages/Admin/Admin.tsx

// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import {
//   fetchOrdersByState,
//   changeOrderState,
// } from "../../services/apiAdmin";
// import OrderModal from "../../components/Admin/OrderModal";

// const Admin: React.FC = () => {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const token = localStorage.getItem("token");

//   // ============================================================
//   // CARGAR ÓRDENES POR ESTADO
//   // ============================================================
//   const loadOrders = async (state = "REGISTRADA") => {
//     try {
//       const data = await fetchOrdersByState(token, state);
//       setOrders(data);
//     } catch (err) {
//       console.error("Error cargando órdenes:", err);
//       Swal.fire("Error", "No se pudo cargar la lista de órdenes", "error");
//     }
//   };

//   useEffect(() => {
//     loadOrders("REGISTRADA");
//   }, []);

//   // ============================================================
//   // ABRIR MODAL CON LA ORDEN SELECCIONADA
//   // ============================================================
//   const openModal = (order: any) => {
//     setSelectedOrder(order);
//     setShowModal(true);
//   };

//   // ============================================================
//   // Cerrar modal
//   // ============================================================
//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedOrder(null);
//   };

//   // ============================================================
//   // CAMBIAR ESTADO DE LA ORDEN
//   // ============================================================
//   const handleChangeOrderState = async (newState: string) => {
//     try {
//       if (!selectedOrder) return;

//       await changeOrderState(
//         token!,                  // ✔ token
//         selectedOrder.orderId,   // ✔ ID de la orden
//         newState                 // ✔ nuevo estado
//       );

//       Swal.fire("Listo", "Orden actualizada exitosamente", "success");

//       setShowModal(false);
//       loadOrders("REGISTRADA");

//     } catch (error) {
//       console.error("Error actualizando estado:", error);
//       Swal.fire("Error", "No se pudo actualizar la orden.", "error");
//     }
//   };

//   // ============================================================
//   // RENDER PRINCIPAL DE ÓRDENES
//   // ============================================================
//   return (
//     <div className="container mt-4">
//       <h3 className="mb-4">Administración de Órdenes</h3>

//       {/* LISTADO */}
//       <div className="card shadow-sm">
//         <div className="card-header bg-primary text-white fw-bold">
//           Órdenes Registradas
//         </div>

//         <ul className="list-group list-group-flush">
//           {orders.map((order) => (
//             <li
//               key={order.orderId}
//               className="list-group-item d-flex justify-content-between align-items-center"
//             >
//               <div>
//                 <b>#{order.orderNumber}</b> — {order.patientName}
//                 <br />
//                 <small className="text-muted">
//                   {order.identification} • {order.state}
//                 </small>
//               </div>

//               <button
//                 className="btn btn-sm btn-info"
//                 onClick={() => openModal(order)}
//               >
//                 Ver Detalle
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* MODAL */}
//       <OrderModal
//         {...({
//           show: showModal,
//           order: selectedOrder,
//           onClose: closeModal,
//           onChangeState: handleChangeOrderState, // ✔ ENVÍA SOLO EL ESTADO
//         } as any)}
//       />
//     </div>
//   );
// };

// export default Admin;



import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import {
  Modal,
  Button,
  Card,
  ListGroup,
  Row,
  Col,
} from "react-bootstrap";

const API_URL = `${process.env.REACT_APP_API_URL}api/v1/higuera-escalante/orders/by-term`;

interface Product {
  orderProductId: string;
  productId: string;
  name: string;
  price: number;
  pendingPayments: number;
  code: string;
  altCode: string;
}

interface Order {
  orderId: string;
  orderNumber: string;
  cie10: string;
  priority: string;
  observation: string;
  patientId: string;
  customerAccountId: string;
  customerAccountName: string;
  state: string;
  creationDate: string;
  patientName: string;
  identification: string;
  identificationType: string;
  customerName: string;
  tariffName: string;
  products: Product[];
  tariffId: string;
  email: string;
  gender: string;
  mobileNumber: string;
  birthDate: string;
}

const Page1: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchText, setSearchText] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  // ---------------------------
  // Cargar órdenes por estado
  // ---------------------------
  const fetchOrders = async (orderState: string) => {
    try {
      const response = await axios.post(
        API_URL,
        { orderState },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const ordersData = response.data.data;

      const result = ordersData.flatMap((patient: any) =>
        (patient.orders || []).map((order: any) => ({
          orderId: order.orderId,
          orderNumber: order.orderNumber || "N/A",
          state: order.state,
          creationDate: order.creationDate,
          observation: order.observation,
          patientName: `${patient.firstName} ${patient.middleName || ""} ${patient.lastName} ${patient.surName}`.trim(),
          identification: patient.identification,
          identificationType: patient.identificationType,
          customerName: order.customer?.name || "N/A",
          customerId: order.customer?.customerId || "N/A",
          customerAccountId: order.customerAccount?.customerAccountId || "N/A",
          customerAccountName: order.customerAccount?.name || "N/A",
          tariffName: order.tariff?.name || "N/A",
          tariffId: order.tariff?.tariffId || "N/A",
          cie10: order.cie10,
          priority: order.priority,
          patientId: patient.patientId,
          email: patient.email,
          gender: patient.gender,
          mobileNumber: patient.mobileNumber,
          birthDate: patient.birthDate,
          products: order.products.map((product: any) => ({
            orderProductId: product.orderProductId,
            productId: product.product.productId,
            name: product.product.name,
            price: product.price,
            pendingPayments: product.pendingPayment,
            code: product.product.code,
            altCode: product.product.altCode,
          })),
        }))
      );

      setOrders(result);
      setFilteredOrders(result);
    } catch (err) {
      console.error("Error:", err);
      setOrders([]);
      setFilteredOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders("REGISTRADA");
  }, []);

  // ---------------------------
  // BUSCAR EN TABLA
  // ---------------------------
  const handleSearch = (text: string) => {
    setSearchText(text);

    const filtered = orders.filter((order) =>
      Object.values(order).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(text.toLowerCase())
      )
    );

    setFilteredOrders(filtered);
  };

  // ---------------------------
  // ABRIR MODAL
  // ---------------------------
  const handleDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // ---------------------------
  // ELIMINAR PRODUCTO
  // ---------------------------
  const handleDeleteProduct = async (orderProductId: string) => {
    if (!selectedOrder) return;

    const updatedProducts = selectedOrder.products.filter(
      (p) => p.orderProductId !== orderProductId
    );

    const body = {
      cie10: selectedOrder.cie10,
      priority: selectedOrder.priority,
      observation: selectedOrder.observation,
      patientId: selectedOrder.patientId,
      customerAccountId: selectedOrder.customerAccountId,
      tariffId: selectedOrder.tariffId,
      products: updatedProducts.map((p) => ({ productId: p.productId })),
    };

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}api/v1/higuera-escalante/orders/${selectedOrder.orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        Swal.fire("Error", error.message, "error");
        return;
      }

      setSelectedOrder({ ...selectedOrder, products: updatedProducts });
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === selectedOrder.orderId
            ? { ...o, products: updatedProducts }
            : o
        )
      );
      setFilteredOrders((prev) =>
        prev.map((o) =>
          o.orderId === selectedOrder.orderId
            ? { ...o, products: updatedProducts }
            : o
        )
      );

      Swal.fire("Producto eliminado", "", "success");
    } catch (e) {
      console.error(e);
    }
  };

  // ---------------------------
  // GUARDAR (ACTUALIZAR ESTADO)
  // ---------------------------
  const handleSave = async () => {
    if (!selectedOrder) return;

    const { value: newState } = await Swal.fire({
      title: "Selecciona el nuevo estado",
      input: "select",
      inputOptions: {
        "EN CURSO": "EN CURSO",
        RECHAZADA: "RECHAZADA",
      },
      showCancelButton: true,
    });

    if (!newState) return;

    try {
      const url = `${process.env.REACT_APP_API_URL}api/v1/higuera-escalante/orders/${selectedOrder.orderId}/change-state?state=${newState}`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        Swal.fire("Error", err.message, "error");
        return;
      }

      Swal.fire("Estado actualizado", "", "success");
      closeModal();
      fetchOrders("REGISTRADA");
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------
  // COLUMNAS TABLA
  // ---------------------------
  const columns = [
    { name: "Orden", selector: (row: Order) => row.orderNumber },
    { name: "Paciente", selector: (row: Order) => row.patientName },
    { name: "Estado", selector: (row: Order) => row.state },
    {
      name: "Acciones",
      cell: (row: Order) => (
        <Button variant="primary" onClick={() => handleDetails(row)}>
          Detalles
        </Button>
      ),
    },
  ];

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <>
      <h3>Gestión de Órdenes</h3>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar..."
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <DataTable columns={columns} data={filteredOrders} pagination />

      {/* MODAL */}
      <Modal show={isModalOpen} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Orden</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedOrder && (
            <>
              <Card>
                <Card.Body>
                  <p>
                    <strong>Paciente:</strong> {selectedOrder.patientName}
                  </p>
                  <p>
                    <strong>Identificación:</strong>{" "}
                    {selectedOrder.identification}
                  </p>
                  <p>
                    <strong>Estado:</strong> {selectedOrder.state}
                  </p>
                </Card.Body>
              </Card>

              <h5 className="mt-3">Productos</h5>
              <ListGroup>
                {selectedOrder.products.map((product) => (
                  <ListGroup.Item key={product.orderProductId}>
                    <Row>
                      <Col>{product.name}</Col>
                      <Col className="text-end">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteProduct(product.orderProductId)}
                        >
                          Eliminar
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
          <Button variant="success" onClick={handleSave}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Page1;
