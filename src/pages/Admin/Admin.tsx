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





import React, { useEffect, useState } from "react";
import {
  fetchOrdersByState,
  patchOrder,
  changeOrderState,
} from "../../services/apiAdmin";

import OrderModal from "../../components/Admin/OrderModal";
import OrderTable from "../../components/Admin/OrderTable";

const Admin = () => {
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [stateFilter, setStateFilter] = useState("REGISTRADA");
  const [searchText, setSearchText] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // =====================================================
  // CARGAR ÓRDENES DESDE API
  // =====================================================
  const loadOrders = async () => {
    try {
      const response = await fetchOrdersByState(token, stateFilter);
      setOrders(response);
    } catch (err) {
      console.error("❌ Error cargando órdenes:", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [stateFilter]);

  // =====================================================
  // APLICAR FILTROS DE BÚSQUEDA
  // =====================================================
  useEffect(() => {
    let data = [...orders];

    if (searchText.trim()) {
      data = data.filter(
        (o) =>
          o.orderNumber.includes(searchText) ||
          o.patientName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredOrders(data);
  }, [searchText, orders]);

  // =====================================================
  // ABRIR Y CERRAR MODAL
  // =====================================================
  const openOrder = (order: any) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalOpen(false);
  };

  // =====================================================
  // GUARDAR CAMBIOS DE ORDEN
  // =====================================================
  const saveOrder = async () => {
    if (!selectedOrder) return;

    const payload = {
      cie10: selectedOrder.cie10 || "",
      priority: selectedOrder.priority || "3",
      observation: selectedOrder.observation || "",
      patientId: selectedOrder.patientId,
      customerAccountId: selectedOrder.customerAccountId,
      tariffId: selectedOrder.tariffId,
      products: selectedOrder.products?.map((p: any) => ({
        productId: p.productId,
      })),
    };

    try {
      await patchOrder(token!, selectedOrder.orderId, payload);
      alert("✅ Orden actualizada correctamente");
      loadOrders();
      closeModal();
    } catch (err: any) {
      console.error("❌ Error al guardar:", err.response?.data || err);
      alert("Error al guardar la orden");
    }
  };

  // =====================================================
  // CAMBIAR ESTADO DE ORDEN
  // =====================================================
  const updateState = async (newState: string) => {
    if (!selectedOrder) return;

    try {
      await changeOrderState(token!, selectedOrder.orderId, newState);

      alert(`Estado cambiado a ${newState}`);
      loadOrders();
      closeModal();
    } catch (err: any) {
      console.error("❌ Error cambiando estado:", err.response?.data || err);
      alert("No se pudo cambiar el estado");
    }
  };

  return (
    <>
      <h2 className="mb-3">Administración de Órdenes</h2>

      {/* TABLA */}
      <OrderTable
        data={filteredOrders}
        onRowClick={openOrder}
        searchText={searchText}
        onSearch={setSearchText}
        stateFilter={stateFilter}
        onStateFilterChange={setStateFilter}
      />

      {/* MODAL */}
      <OrderModal
        show={modalOpen}
        order={selectedOrder}
        onClose={closeModal}
        //  onSave={saveOrder}
        onChangeState={updateState}  
      />
    </>
  );
};

export default Admin;
