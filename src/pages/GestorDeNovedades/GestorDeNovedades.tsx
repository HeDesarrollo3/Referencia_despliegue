// src/pages/GestorDeNovedades/GestorDeNovedades.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../../components/common/Table";
import Alert from "react-bootstrap/Alert";

interface ProductData {
  identification: string;
  orderId: string;
  orderNumber: string | null;
  cie10: string;
  priority: string;
  observation: string;
  patientId: string;
  patientName: string;
  customerAccountId: string;
  tariffId: string;
  orderProductId: string;
  quantity: number;
  pendingPayment: boolean;
  productCode: string;
  productName: string;
  price: number;
  products: { productId: string }[];
}

const API_URL =
  "http://localhost:3000/api/v1/higuera-escalante/orders/by-term";

const GestorDeNovedades: React.FC = () => {
  const [data, setData] = useState<ProductData[]>([]);
  const [filteredData, setFilteredData] = useState<ProductData[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ProductData | null>(null);
  const [showModal, setShowModal] = useState(false);

  // filtros
  const [filterIdentification, setFilterIdentification] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterOrderNumber, setFilterOrderNumber] = useState("");
  const [filterState, setFilterState] = useState("");

  // 🔄 Transformar respuesta API → ProductData[]
  const transformResponse = (result: any[]): ProductData[] => {
    return result.flatMap((patient: any) =>
      patient.orders.flatMap((order: any) =>
        order.products.map((p: any) => ({
          orderId: order.orderId,
          orderNumber: order.orderNumber || "",
          cie10: order.cie10 || "",
          priority: order.priority || "",
          observation: order.observation || "",
          patientId: patient.patientId, // 👈 este es el id real
          identification: patient.identification || "", // 👈 documento del paciente
          patientName: `${patient.firstName || ""} ${patient.lastName || ""}`,
          customerAccountId: order.customerAccount?.customerAccountId || "",
          tariffId: order.tariff?.tariffId || "",
          orderProductId: p.orderProductId || "",
          quantity: p.quantity || 0,
          pendingPayment: p.pendingPayment || false,
          productCode: p.product?.code || "",
          productName: p.product?.name || "",
          price: p.price || 0,
          products: order.products.map((prod: any) => ({
            productId: prod.product?.productId,
          })),
        }))
      )
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token, por favor inicie sesión");

        const res = await axios.post(
          API_URL,
          { term: "" }, // 👈 listar todo
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const transformed = transformResponse(res.data);
        setData(transformed);
        setFilteredData(transformed);
        console.log("Órdenes cargadas:", transformed);
      } catch (error) {
        console.error("Error cargando órdenes", error);
      }
    };

    fetchData();
  }, []);

  // aplicar filtros en frontend
  useEffect(() => {
    let filtered = data;

    if (filterIdentification) {
      filtered = filtered.filter((o) =>
        o.identification.toLowerCase().includes(filterIdentification.toLowerCase())
      );
    }
    if (filterName) {
      filtered = filtered.filter((o) =>
        o.patientName.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    if (filterOrderNumber) {
      filtered = filtered.filter((o) =>
        (o.orderNumber || "").toLowerCase().includes(filterOrderNumber.toLowerCase())
      );
    }
    if (filterState) {
      filtered = filtered.filter((o) =>
        (o.priority || "").toLowerCase().includes(filterState.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [filterIdentification, filterName, filterOrderNumber, filterState, data]);

  const handleRowClick = (order: ProductData) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedOrder) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token, por favor inicie sesión");

      const body = {
        cie10: selectedOrder.cie10,
        priority: selectedOrder.priority,
        observation: selectedOrder.observation,
        patientId: selectedOrder.patientId, // 👈 enviar id del paciente
        customerAccountId: selectedOrder.customerAccountId,
        tariffId: selectedOrder.tariffId,
        products: selectedOrder.products.map((p) => ({
          productId: p.productId,
        })),
      };

      console.log("📤 PATCH body:", body);

      await axios.patch(
        `http://localhost:3000/api/v1/higuera-escalante/orders/${selectedOrder.orderId}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Orden actualizada correctamente ✅");
      setShowModal(false);

      setData((prev) =>
        prev.map((o) => (o.orderId === selectedOrder.orderId ? selectedOrder : o))
      );
    } catch (error: any) {
      console.error("❌ Error al actualizar:", error.response?.data || error);
      alert("Error al actualizar la orden ❌");
    }
  };

  const columns = [
    { header: "Número Orden", accessor: "orderNumber" },
    { header: "Paciente", accessor: "patientName" },
    { header: "Documento", accessor: "identification" },
    { header: "CIE10", accessor: "cie10" },
    { header: "Prioridad", accessor: "priority" },
    { header: "Observación", accessor: "observation" },
    { header: "Código Producto", accessor: "productCode" },
    { header: "Nombre Producto", accessor: "productName" },
    { header: "Cantidad", accessor: "quantity" },
    { header: "Pendiente Pago", accessor: "pendingPayment" },
    { header: "Precio", accessor: "price" },
  ];

  return (
    <div className="container mt-4">
      <h2>Gestor de Novedades</h2>

      {/* 🔎 Filtros */}
      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por identificación"
            value={filterIdentification}
            onChange={(e) => setFilterIdentification(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por nombre"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por número de orden"
            value={filterOrderNumber}
            onChange={(e) => setFilterOrderNumber(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por estado"
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
          />
        </div>
      </div>

      {filteredData.length === 0 ? (
        <Alert variant="warning">No hay resultados disponibles</Alert>
      ) : (
        <Table<ProductData>
          columns={columns}
          data={filteredData}
          onRowClick={handleRowClick}
        />
      )}

      {/* Modal de actualización (igual al tuyo) */}
      {showModal && selectedOrder && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Actualizar Orden {selectedOrder.orderNumber}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><b>Paciente:</b> {selectedOrder.patientName}</p>
                <p><b>Documento:</b> {selectedOrder.identification}</p>
                <p><b>Código Producto:</b> {selectedOrder.productCode}</p>
                <p><b>Nombre Producto:</b> {selectedOrder.productName}</p>
                <p><b>Cantidad:</b> {selectedOrder.quantity}</p>
                <p><b>Precio:</b> {selectedOrder.price}</p>
                <p><b>Pendiente Pago:</b> {selectedOrder.pendingPayment ? "Sí" : "No"}</p>

                <div className="mb-3">
                  <label className="form-label">CIE10</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedOrder.cie10}
                    onChange={(e) =>
                      setSelectedOrder({
                        ...selectedOrder,
                        cie10: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Prioridad</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedOrder.priority}
                    onChange={(e) =>
                      setSelectedOrder({
                        ...selectedOrder,
                        priority: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Observación</label>
                  <textarea
                    className="form-control"
                    value={selectedOrder.observation}
                    onChange={(e) =>
                      setSelectedOrder({
                        ...selectedOrder,
                        observation: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
                </button>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestorDeNovedades;
