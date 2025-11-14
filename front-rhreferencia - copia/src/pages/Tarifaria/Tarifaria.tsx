// import React, { useEffect, useState, useMemo } from "react";
// import { Spinner, InputGroup, FormControl } from "react-bootstrap";
// import { getTariffProducts } from "../../services/api";
// import PlanStep from "../PreRegistro/steps/PlanStep";

// interface Product {
//   productId: string;
//   code: string;
//   altCode: string;
//   name: string;
//   shortName: string;
//   price: number;
//   state: string;
// }

// interface Tariff {
//   tariffId: string;
//   name: string;
//   state: string;
//   products: Product[];
// }

// interface Account {
//   customerAccountId: string;
//   code: string;
//   altCode: string;
//   name: string;
//   state: string;
//   tariff: Tariff;
// }

// function Tarifaria() {
//   const [accounts, setAccounts] = useState<Account[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedAccountId, setSelectedAccountId] = useState("");
//   const [selectedTariffId, setSelectedTariffId] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   // 🔹 Cargar tarifas desde el backend
//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("token") || "";
//         const data = await getTariffProducts(token);
//         setAccounts(data);
//       } catch (error) {
//         console.error("❌ Error cargando tarifas:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAccounts();
//   }, []);

//   // 🔹 Seleccionar cuenta y tarifa
//   const handlePlanSelect = (accountId: string, tariffId: string) => {
//     setSelectedAccountId(accountId);
//     setSelectedTariffId(tariffId);
//   };

//   // 🔹 Obtener cuenta y productos seleccionados
//   const selectedAccount = useMemo(
//     () => accounts.find((acc) => acc.customerAccountId === selectedAccountId),
//     [accounts, selectedAccountId]
//   );

//   const selectedTariff = selectedAccount?.tariff;

//   // 🔹 Filtrar productos (con memoización para rendimiento)
//   const filteredProducts = useMemo(() => {
//     if (!selectedTariff) return [];
//     const term = searchTerm.toLowerCase();
//     return selectedTariff.products.filter(
//       (p) =>
//         p.name.toLowerCase().includes(term) ||
//         p.code.toLowerCase().includes(term)
//     );
//   }, [selectedTariff, searchTerm]);

//   return (
//     <div className="container mt-3">
//       <h2 className="mb-3">💰 Tarifario</h2>

//       {loading ? (
//         <div className="text-center py-4">
//           <Spinner animation="border" role="status" />
//           <p className="mt-2">Cargando información...</p>
//         </div>
//       ) : (
//         <>
//           <PlanStep
//               customerAccountId={selectedAccountId}
//               tariffId={selectedTariffId}
//               accounts={accounts}
//               onSelect={handlePlanSelect} loading={false}          />

//           {selectedAccount && selectedTariff && (
//             <div className="mt-4">
//               <h5>📋 Detalles del Plan Seleccionado</h5>
//               <p>
//                 <b>Cuenta:</b> {selectedAccount.name} ({selectedAccount.code})
//               </p>
//               <p>
//                 <b>Tarifa:</b> {selectedTariff.name}
//               </p>

//               {/* Buscador */}
//               <InputGroup className="mb-3" style={{ maxWidth: "400px" }}>
//                 <FormControl
//                   placeholder="Buscar por código o nombre..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </InputGroup>

//               {/* Tabla de productos */}
//               <div
//                 style={{
//                   maxHeight: "350px",
//                   overflowY: "auto",
//                   border: "1px solid #ddd",
//                   borderRadius: "5px",
//                   padding: "10px",
//                 }}
//               >
//                 <table
//                   className="table table-hover table-sm align-middle"
//                   style={{ borderCollapse: "collapse", width: "100%" }}
//                 >
//                   <thead className="table-light" style={{ position: "sticky", top: 0 }}>
//                     <tr>
//                       <th style={{ width: "20%" }}>Código</th>
//                       <th>Nombre</th>
//                       <th style={{ width: "20%" }}>Precio</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredProducts.length > 0 ? (
//                       filteredProducts.map((prod) => (
//                         <tr key={prod.productId}>
//                           <td>{prod.code}</td>
//                           <td>{prod.shortName || prod.name}</td>
//                           <td>${prod.price.toLocaleString("es-CO")}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan={3} className="text-center py-3">
//                           No se encontraron productos.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default Tarifaria;


import React, { useEffect, useState, useMemo } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import { getTariffProducts } from "../../services/api";
import PlanStep from "../PreRegistro/steps/PlanStep";
import LoadingSpinner from "../../components/LoadingSpinner"; // 👈 Importa el nuevo spinner

interface Product {
  productId: string;
  code: string;
  altCode: string;
  name: string;
  shortName: string;
  price: number;
  state: string;
}

interface Tariff {
  tariffId: string;
  name: string;
  state: string;
  products: Product[];
}

interface Account {
  customerAccountId: string;
  code: string;
  altCode: string;
  name: string;
  state: string;
  tariff: Tariff;
}

function Tarifaria() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [selectedTariffId, setSelectedTariffId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Cargar tarifas desde el backend
  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || "";
        const data = await getTariffProducts(token);
        setAccounts(data);
      } catch (error) {
        console.error("❌ Error cargando tarifas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // 🔹 Seleccionar cuenta y tarifa
  const handlePlanSelect = (accountId: string, tariffId: string) => {
    setSelectedAccountId(accountId);
    setSelectedTariffId(tariffId);
  };

  // 🔹 Obtener cuenta y productos seleccionados
  const selectedAccount = useMemo(
    () => accounts.find((acc) => acc.customerAccountId === selectedAccountId),
    [accounts, selectedAccountId]
  );

  const selectedTariff = selectedAccount?.tariff;

  // 🔹 Filtrar productos
  const filteredProducts = useMemo(() => {
    if (!selectedTariff) return [];
    const term = searchTerm.toLowerCase();
    return selectedTariff.products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term)
    );
  }, [selectedTariff, searchTerm]);

  return (
    <div className="container mt-3">
      <h2 className="mb-3">💰 Tarifario</h2>

      {loading ? (
        <div className="text-center py-4">
          <LoadingSpinner /> {/* 👈 Aquí usamos la animación personalizada */}
        </div>
      ) : (
        <>
          <PlanStep
            customerAccountId={selectedAccountId}
            tariffId={selectedTariffId}
            accounts={accounts}
            onSelect={handlePlanSelect}
            loading={false}
          />

          {selectedAccount && selectedTariff && (
            <div className="mt-4">
              <h5>📋 Detalles del Plan Seleccionado</h5>
              <p>
                <b>Cuenta:</b> {selectedAccount.name} ({selectedAccount.code})
              </p>
              <p>
                <b>Tarifa:</b> {selectedTariff.name}
              </p>

              <InputGroup className="mb-3" style={{ maxWidth: "400px" }}>
                <FormControl
                  placeholder="Buscar por código o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <div
                style={{
                  maxHeight: "350px",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "10px",
                }}
              >
                <table
                  className="table table-hover table-sm align-middle"
                  style={{ borderCollapse: "collapse", width: "100%" }}
                >
                  <thead
                    className="table-light"
                    style={{ position: "sticky", top: 0 }}
                  >
                    <tr>
                      <th style={{ width: "20%" }}>Código</th>
                      <th>Nombre</th>
                      <th style={{ width: "20%" }}>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((prod) => (
                        <tr key={prod.productId}>
                          <td>{prod.code}</td>
                          <td>{prod.shortName || prod.name}</td>
                          <td>${prod.price.toLocaleString("es-CO")}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-3">
                          No se encontraron productos.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Tarifaria;
