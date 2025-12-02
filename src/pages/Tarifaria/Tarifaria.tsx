import React, { useEffect, useState, useMemo } from "react";
import { Spinner, InputGroup, FormControl } from "react-bootstrap";
import AsyncSelect from "react-select/async"; // Asegúrate de instalar react-select
import { getTariffProducts, getCustomer, getCustomerTariffProducts } from "../../services/api";
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

interface Customer {
  customerId: string;
  name: string;
}

function Tarifaria() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [selectedTariffId, setSelectedTariffId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [tariffProducts, setTariffProducts] = useState<Product[]>([]); // Estado para productos de tarifa

  // 🆕 Extraer el rol del usuario
  const user_role = localStorage.getItem("user_role");
  //console.log("Rol del usuario:", user_role);
  const isAdmin = user_role === "EBE2C0F1-84C3-4143-8FF8-9B0F888A2272"; // Variable booleana para simplificar la lógica
  const token = localStorage.getItem("token") || "";

  // 🔹 Cargar tarifas y clientes desde el backend
  useEffect(() => {
    const fetchAccountsAndCustomers = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          const customersData = await getCustomer(token);
          setCustomers(customersData); // Cargar clientes 
          //console.log("Clientes cargados para ADMINISTRADOR:", customersData);
        } else {
          const data = (await getTariffProducts(token)) as Account[] | undefined;
          setAccounts(data || []);
        }
      } catch (error) {
        console.error("❌ Error cargando tarifas o clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountsAndCustomers();
  }, [isAdmin, token]);

  // 🔹 Función para cargar opciones de clientes
  const loadCustomerOptions = async (inputValue: string) => {
    //console.log("Buscando clientes para:", inputValue); // Verifica el valor de inputValue
    try {
      // // Filtra los clientes que coincidan con el inputValue
      return customers
       .filter(customer => customer.name.toLowerCase().includes(inputValue.toLowerCase()))
       .map(customer => ({
         value: customer.customerId,
         label: customer.name,
       }));
    } catch (error) {
      console.error("Error al cargar opciones de clientes:", error);
      return []; // Devuelve un array vacío en caso de error
    }
  };

  // 🔹 Manejar selección de cliente
  const handleCustomerSelect = async (selected: any) => {
    const customerId = selected?.value || "";
    setSelectedCustomerId(customerId);
    //console.log("Cliente seleccionado ID:", customerId); // Mostrar el ID del cliente seleccionado


    // Llamar a getCustomerTariffProducts para obtener los productos de tarifa del cliente
    if (customerId) {
        try {
          //const data = await getTariffProducts(token);
          const data = (await getCustomerTariffProducts(token, customerId)) as Account[] | undefined;
          setAccounts(data || []);
            //const productsData = await getCustomerTariffProducts(token, customerId);
            //setTariffProducts(productsData); // Almacenar productos de tarifa en el estado
            //console.log("Productos de tarifa para el cliente:", productsData);
        } catch (error) {
            console.error("❌ Error al cargar productos de tarifa del cliente:", error);
        }
    }
};


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

  // 🔹 Filtrar productos (con memoización para rendimiento)
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
          <Spinner animation="border" role="status" />
          <p className="mt-2">Cargando información...</p>
        </div>
      ) : (
        <>
          {isAdmin && (
            <div className="mb-3">
              <label htmlFor="customerSelect" className="form-label">
                Selecciona un cliente:
              </label>
              <AsyncSelect
                cacheOptions
                loadOptions={loadCustomerOptions} // Cargar opciones de clientes
                defaultOptions
                placeholder="Buscar y seleccionar cliente..."
                value={
                  selectedCustomerId
                    ? {
                        value: selectedCustomerId,
                        label: customers.find((c) => c.customerId === selectedCustomerId)?.name || selectedCustomerId,
                      }
                    : null
                }
                onChange={handleCustomerSelect} // Manejar selección de cliente
                isClearable
              />
            </div>
          )}

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

              {/* Buscador */}
              <InputGroup className="mb-3" style={{ maxWidth: "400px" }}>
                <FormControl
                  placeholder="Buscar por código o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              {/* Tabla de productos */}
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
                  <thead className="table-light" style={{ position: "sticky", top: 0 }}>
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