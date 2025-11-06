// // src/pages/Resultados/Resultados.tsx
// import React, { useState, useEffect } from "react";
// import { Spinner, Alert, Form, InputGroup } from "react-bootstrap";
// import Table from "../../components/common/Table";


// interface ProductData {
//   orderId: string;
//   orderNumber: string | null;
//   patientName: string;
//   patientId: string;
//   orderProductId: string;
//   price: number;
//   quantity: number;
//   pendingPayment: number;
//   productName: string;
//   productCode: string;
// }

// const API_URL = "http://localhost:3000/api/v1/higuera-escalante/orders/by-term";

// const Resultados: React.FC = () => {
//   const [data, setData] = useState<ProductData[]>([]);
//   const [filteredData, setFilteredData] = useState<ProductData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // 🔄 Adaptar respuesta API → ProductData[]
//   const transformResponse = (result: any[]): ProductData[] => {
//     return result.flatMap((patient: any) =>
//       patient.orders.flatMap((order: any) =>
//         order.products.map((prod: any) => ({
//           orderId: order.orderId,
//           orderNumber: order.orderNumber,
//           patientName: `${patient.firstName} ${patient.lastName} ${patient.surName || ""}`.trim(),
//           patientId: patient.identification,
//           orderProductId: prod.orderProductId,
//           price: prod.price,
//           quantity: prod.quantity,
//           pendingPayment: prod.pendingPayment,
//           productName: prod.product.name,
//           productCode: prod.product.code,
//         }))
//       )
//     );
//   };

//   // 📌 Cargar todo al inicio
//   const fetchAllResults = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No hay token, por favor inicie sesión");

//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ term: "" }), // 👈 siempre carga todo
//       });

//       if (!response.ok) throw new Error("Error al consultar la API");

//       const result = await response.json();
//       const transformed = transformResponse(result);

//       setData(transformed);
//       setFilteredData(transformed); // 👈 inicializa también el filtrado
//     } catch (err: any) {
//       setError(err.message || "Error desconocido");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllResults();
//   }, []);

//   // 🔎 Filtrado en memoria
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredData(data);
//     } else {
//       const term = searchTerm.toLowerCase();
//       const newFiltered = data.filter(
//         (item) =>
//           item.patientId.toLowerCase().includes(term) ||
//           item.patientName.toLowerCase().includes(term) ||
//           (item.orderNumber || "").toLowerCase().includes(term) ||
//           item.productName.toLowerCase().includes(term) ||
//           item.productCode.toLowerCase().includes(term)
//       );
//       setFilteredData(newFiltered);
//     }
//   }, [searchTerm, data]);

//   // 📋 Columnas para Table
//   const columns = [
//     { header: "ID Orden", accessor: "orderId" },
//     { header: "Número Orden", accessor: "orderNumber" },
//     { header: "Paciente", accessor: "patientName" },
//     { header: "Documento", accessor: "patientId" },
//     { header: "ID Producto", accessor: "orderProductId" },
//     { header: "Precio", accessor: "price" },
//     { header: "Cantidad", accessor: "quantity" },
//     { header: "Pendiente Pago", accessor: "pendingPayment" },
//     { header: "Código Producto", accessor: "productCode" },
//     { header: "Nombre Producto", accessor: "productName" },
//   ];

//   return (
//     <div className="container mt-4">
//       <h3>Resultados</h3>

//       {/* Campo de búsqueda */}
//       <InputGroup className="mb-3">
//         <Form.Control
//           placeholder="Buscar por documento, nombre de paciente, número de orden o prueba..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </InputGroup>

//       {error && <Alert variant="danger">{error}</Alert>}
//       {loading && <Spinner animation="border" />}
//       {!loading && filteredData.length === 0 && !error && (
//         <Alert variant="warning">No hay resultados disponibles</Alert>
//       )}
//       {filteredData.length > 0 && (
//         <Table<ProductData> columns={columns} data={filteredData} />
//       )}
//     </div>
//   );
// };

// export default Resultados;
import React, { useState, useEffect, useCallback } from "react";
import { Spinner, Alert, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import Table, { Column } from "../../components/common/Table";
import { getPreRegistros } from "../../services/api";

interface OrderData {
  orderId: string;
  orderNumber: string;
  orderState: string;
  patientName: string;
  identification: string;
  identificationType: string;
  orderCreationDate: string;
}

const Resultados: React.FC = () => {
  const [data, setData] = useState<OrderData[]>([]);
  const [filteredData, setFilteredData] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllResults = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token, por favor inicie sesión nuevamente.");
      }

      const registros = await getPreRegistros(token);
      console.log("✅ Registros obtenidos:", registros);

      if (!Array.isArray(registros)) {
        throw new Error("El servidor no devolvió datos válidos.");
      }

      // 🔹 Aseguramos valores legibles si vienen nulos o vacíos
      const cleaned = registros.map((r: any) => ({
        orderId: r.orderId ?? "",
        orderNumber: r.orderNumber && r.orderNumber.trim() !== "" 
          ? r.orderNumber 
          : "SIN NÚMERO",
        orderState: r.orderState ?? "SIN ESTADO",
        patientName: r.patientName ?? "Sin nombre",
        identification: r.identification ?? "N/A",
        identificationType: r.identificationType ?? "N/A",
        orderCreationDate: r.orderCreationDate
          ? new Date(r.orderCreationDate).toLocaleString("es-CO")
          : "Sin fecha",
      }));

      setData(cleaned);
      setFilteredData(cleaned);
    } catch (err: any) {
      console.error("❌ Error cargando resultados:", err);

      if (err.response?.status === 401) {
        setError("Sesión expirada o no autorizada. Por favor, inicie sesión nuevamente.");
        localStorage.removeItem("token");
        setTimeout(() => (window.location.href = "/login"), 2500);
      } else {
        setError(err.message || "Error desconocido al obtener los datos.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllResults();
  }, [fetchAllResults]);

  // 🔍 Búsqueda dinámica
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredData(
        data.filter((item) =>
          [
            item.patientName,
            item.identification,
            item.orderNumber,
            item.orderState,
          ]
            .join(" ")
            .toLowerCase()
            .includes(term)
        )
      );
    }
  }, [searchTerm, data]);

  // 🧱 Columnas de la tabla
  const columns: Column<OrderData>[] = [
    { header: "N° Orden", accessor: "orderNumber" },
    { header: "Estado", accessor: "orderState" },
    { header: "Paciente", accessor: "patientName" },
    { header: "Tipo Doc", accessor: "identificationType" },
    { header: "Documento", accessor: "identification" },
    { header: "Fecha Creación", accessor: "orderCreationDate" },
  ];

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📋 Listado de Órdenes</h3>

      <InputGroup className="mb-3 shadow-sm rounded">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Buscar por paciente, documento, orden o estado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading && (
        <div className="text-center">
          <Spinner animation="border" /> Cargando datos...
        </div>
      )}

      {!loading && filteredData.length === 0 && !error && (
        <Alert variant="warning">No hay órdenes disponibles</Alert>
      )}

      {!loading && filteredData.length > 0 && (
        <Table<OrderData> columns={columns} data={filteredData} striped hover />
      )}
    </div>
  );
};

export default Resultados;




// // src/pages/Resultados/Resultados.tsx
// import React, { useState, useEffect, useCallback } from "react";
// import { Spinner, Alert, Form, InputGroup } from "react-bootstrap";
// import { FaSearch } from "react-icons/fa";
// import Table from "../../components/common/Table";
// import { Column } from '../../components/common/Table';
// import {getPreRegistros} from '../../services/api';


// interface ProductData {
//   // orderId: string;
//   orderNumber: string | null;
//   patientName: string;
//   patientId: string;
//   // orderProductId: string;
//   price: number;
//   quantity: number;
//   pendingPayment: number;
//   productName: string;
//   productCode: string;
// }

// const API_URL ="http://192.168.11.14:3000/api/v1/higuera-escalante/orders/by-term";

// const Resultados: React.FC = () => {
//   const [data, setData] = useState<ProductData[]>([]);
//   const [filteredData, setFilteredData] = useState<ProductData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // // 🔄 Adaptar respuesta API → ProductData[]
//   // const transformResponse = (result: any[]): ProductData[] => {
//   //   return result.flatMap((patient: any) =>
//   //     patient.orders.flatMap((order: any) =>
//   //       order.products.map((prod: any) => ({
//   //         orderId: order.orderId,
//   //         orderNumber: order.orderNumber,
//   //         patientName: `${patient.firstName} ${patient.lastName} ${
//   //           patient.surName || ""
//   //         }`.trim(),
//   //         patientId: patient.identification,
//   //         orderProductId: prod.orderProductId,
//   //         price: prod.price,
//   //         quantity: prod.quantity,
//   //         pendingPayment: prod.pendingPayment,
//   //         productName: prod.product.name,
//   //         productCode: prod.product.code,
//   //       }))
//   //     )
//   //   );
//   // };

//   // 📌 Cargar todo al inicio
//   const fetchAllResults = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No hay token, por favor inicie sesión");

//       // const response = await fetch(API_URL, {
//       //   method: "POST",
//       //   headers: {
//       //     "Content-Type": "application/json",
//       //     Authorization: `Bearer ${token}`,
//       //   },
//       //   body: JSON.stringify({ term: "" }),
//       // });

//       const result = await getPreRegistros(token);
//       console.log("✅ Resultado crudo del backend:", result);
//       // const transformed = transformResponse(result);

//        setData(result);
//     setFilteredData(result);

//       // if (!token) throw new Error("Error al consultar la API");

//       // const result = await response.json();
//       // const transformed = transformResponse(result);

//       // setData(transformed);
//       // setFilteredData(transformed);
//     } catch (err: any) {
//       setError(err.message || "Error desconocido");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAllResults();
//   }, [fetchAllResults]);

//   // 🔎 Filtrado en memoria
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredData(data);
//     } else {
//       const term = searchTerm.toLowerCase();
//       const newFiltered = data.filter(
//         (item) =>
//           item.patientId.toLowerCase().includes(term) ||
//           item.patientName.toLowerCase().includes(term) ||
//           (item.orderNumber || "").toLowerCase().includes(term) ||
//           item.productName.toLowerCase().includes(term) ||
//           item.productCode.toLowerCase().includes(term)
//       );
//       setFilteredData(newFiltered);
//     }
//   }, [searchTerm, data]);

//   // 📋 Columnas con mejoras visuales
//  const columns: Column<ProductData>[] = [
//   // { header: "ID Orden", accessor: "orderId" },
//   { header: "N. Orden", accessor: "orderNumber" },
//   { header: "Paciente", accessor: "patientName" },
//   { header: "Documento", accessor: "patientId" },
//   // { header: "ID Producto", accessor: "orderProductId" },
//   {
//     header: "Precio",
//     accessor: "price",
//     render: (row: ProductData) =>
//       `$${row.price.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`,
//   },
//   { header: "Cantidad", accessor: "quantity" },
//   {
//     header: "Estado Pago",
//     accessor: "pendingPayment",
//     render: (row: ProductData) =>
//       row.pendingPayment > 0 ? (
//         <span className="badge bg-danger">Pendiente</span>
//       ) : (
//         <span className="badge bg-success">Pagado</span>
//       ),
//   },
//   { header: "Código Producto", accessor: "productCode" },
//   { header: "Nombre Producto", accessor: "productName" },
// ];


//   return (
//     <div className="container mt-4">
//       <h3 className="mb-3">📊 Resultados</h3>

//       {/* Campo de búsqueda con ícono */}
//       <InputGroup className="mb-3 shadow-sm rounded">
//         <InputGroup.Text>
//           <FaSearch />
//         </InputGroup.Text>
//         <Form.Control
//           placeholder="Buscar por documento, nombre de paciente, número de orden o prueba..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </InputGroup>

//       {error && <Alert variant="danger">{error}</Alert>}
//       {loading && <Spinner animation="border" />}
//       {!loading && filteredData.length === 0 && !error && (
//         <Alert variant="warning">No hay resultados disponibles</Alert>
//       )}
//       {filteredData.length > 0 && (
//         <Table<ProductData> columns={columns} data={filteredData} striped hover />
//       )}
//     </div>
//   );
// };

// export default Resultados;
