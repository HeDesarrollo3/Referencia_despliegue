// src/pages/Resultados/Resultados.tsx
import React, { useState, useEffect } from "react";
import { Spinner, Alert, Form, InputGroup, Button } from "react-bootstrap";
import Table from "../../components/common/Table";

interface ProductData {
  orderId: string;
  orderNumber: string | null;
  patientName: string;
  patientId: string;
  orderProductId: string;
  price: number;
  quantity: number;
  pendingPayment: number;
  productName: string;
  productCode: string;
}

const API_URL = "http://localhost:3000/api/v1/higuera-escalante/orders/by-term";

const Resultados: React.FC = () => {
  const [data, setData] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔄 Adaptar respuesta API → ProductData[]
  const transformResponse = (result: any[]): ProductData[] => {
    return result.flatMap((patient: any) =>
      patient.orders.flatMap((order: any) =>
        order.products.map((prod: any) => ({
          orderId: order.orderId,
          orderNumber: order.orderNumber,
          patientName: `${patient.firstName} ${patient.lastName} ${patient.surName || ""}`.trim(),
          patientId: patient.identification,
          orderProductId: prod.orderProductId,
          price: prod.price,
          quantity: prod.quantity,
          pendingPayment: prod.pendingPayment,
          productName: prod.product.name,
          productCode: prod.product.code,
        }))
      )
    );
  };

  // 🔎 Buscar / cargar resultados
  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token, por favor inicie sesión");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          searchTerm.trim() ? { term: searchTerm } : { term: "" } // 👈 si no hay búsqueda, manda vacío
        ),
      });

      if (!response.ok) throw new Error("Error al consultar la API");

      const result = await response.json();
      console.log("API response:", result);

      setData(transformResponse(result));
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Cargar todo al inicio
  useEffect(() => {
    handleSearch();
  }, []);

  // 📋 Columnas para Table
  const columns = [
    { header: "ID Orden", accessor: "orderId" },
    { header: "Número Orden", accessor: "orderNumber" },
    { header: "Paciente", accessor: "patientName" },
    { header: "Documento", accessor: "patientId" },
    { header: "ID Producto", accessor: "orderProductId" },
    { header: "Precio", accessor: "price" },
    { header: "Cantidad", accessor: "quantity" },
    { header: "Pendiente Pago", accessor: "pendingPayment" },
    { header: "Código Producto", accessor: "productCode" },
    { header: "Nombre Producto", accessor: "productName" },
  ];

  return (
    <div className="container mt-4">
      <h3>Resultados</h3>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Buscar por documento, nombre de paciente, prueba o número de orden..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" onClick={handleSearch} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Buscar"}
        </Button>
      </InputGroup>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner animation="border" />}
      {!loading && data.length === 0 && !error && (
        <Alert variant="warning">No hay resultados disponibles</Alert>
      )}
      {data.length > 0 && <Table<ProductData> columns={columns} data={data} />}
    </div>
  );
};

export default Resultados;
