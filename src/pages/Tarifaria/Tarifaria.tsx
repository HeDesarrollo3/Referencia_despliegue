// src/pages/Tarifaria.tsx
import React, { useEffect, useState } from "react";
import { getTariffProducts } from "../../services/api";
import PlanStep from "../PreRegistro/steps/PlanStep";

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

  // Estado para el plan seleccionado
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [selectedTariffId, setSelectedTariffId] = useState<string>("");

  // Estado para el buscador
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const data = await getTariffProducts(token);
        setAccounts(data);
      } catch (error) {
        console.error("Error cargando cuentas/tarifas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Manejo de selección de plan
  const handlePlanSelect = (accountId: string, tariffId: string) => {
    setSelectedAccountId(accountId);
    setSelectedTariffId(tariffId);
    console.log(`Plan seleccionado: ${accountId}, Tarifa: ${tariffId}`);
  };

  if (loading) return <p>Cargando cuentas...</p>;

  // Encontrar cuenta y tarifa seleccionada
  const selectedAccount = accounts.find((acc) => acc.customerAccountId === selectedAccountId);
  const selectedTariff = selectedAccount?.tariff;

  // Filtrar productos según búsqueda
  const filteredProducts = selectedTariff?.products.filter(
    (prod) =>
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div>
      <h2>Tarifaria</h2>
      <p>Seleccione un plan de la lista:</p>

      {/* Renderizar lista de planes */}
      <PlanStep
        customerAccountId={selectedAccountId}
        tariffId={selectedTariffId}
        accounts={accounts}
        onSelect={handlePlanSelect}
        patientId={undefined}
        firstName={undefined}
      />

      {/* Mostrar detalles del plan seleccionado */}
      {selectedAccount && selectedTariff && (
        <div style={{ marginTop: "20px" }}>
          <h4>Detalles del Plan Seleccionado:</h4>
          <p>
            <b>Cuenta:</b> {selectedAccount.name} ({selectedAccount.code})
          </p>
          <p>
            <b>Tarifa:</b> {selectedTariff.name}
          </p>

          <h5>Productos incluidos:</h5>

          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              marginBottom: "10px",
              padding: "8px",
              width: "100%",
              maxWidth: "400px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />

          {/* Cuadro con scroll */}
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "10px",
              marginTop: "10px",
            }}
          >
            <table
              border={1}
              cellPadding={6}
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead style={{ background: "#f4f4f4", position: "sticky", top: 0 }}>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => (
                    <tr key={prod.productId}>
                      <td>{prod.code}</td>
                      <td>{prod.shortName}</td>
                      <td>${prod.price.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: "10px" }}>
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tarifaria;
