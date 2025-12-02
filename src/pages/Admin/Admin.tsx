import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';
import { Modal, Button, Card, ListGroup, Col, Row } from "react-bootstrap";
import { Console } from "console";


const API_URL = `${process.env.REACT_APP_API_URL}`;

const AdminPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [state, setState] = useState<string>("REGISTRADA");
  const [searchText, setSearchText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  //const [selectedOrder, setSelectedOrder] = useState<any>(null); // Estado para la orden seleccionada
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Estado para el modal
  const token = localStorage.getItem("token");
  const user_role = localStorage.getItem("user_role");
  const [accounts, setAccounts] = useState<any[]>([]); // Inicializa como un array vacío
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

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
    customerName: string;
    tariffName: string;
    products: Product[];
    tariffId: string;
    email: string;
    gender: string;
    mobileNumber: string;
    identificationType: string;
    birthDate: string;
    // Agrega otros campos según sea necesario
  }
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#cfe2ff', // Fondo azul claro para los títulos
        fontSize: '0.95rem', // Tamaño de fuente
        fontWeight: 600, // Peso de la fuente
        color: '#222', // Color del texto
        justifyContent: 'center', // Centrar el contenido
      },
    },
    cells: {
      style: {
        fontSize: '0.95rem', // Tamaño de fuente
        color: '#444', // Color del texto
        verticalAlign: 'middle', // Alineación vertical
      },
    },
    rows: {
      style: {
        fontSize: '0.95rem', // Tamaño de fuente para las filas
        color: '#444', // Color del texto
        cursor: 'pointer', // Cambiar el cursor al pasar sobre las filas
      },
      stripedStyle: {
        backgroundColor: '#f2f2f2', // Fondo alternado para filas
      },
      hoverStyle: {
        backgroundColor: '#f8f9fa', // Fondo al pasar el ratón
      },
    },
  };


  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Función para obtener órdenes por estado
  const fetchOrders = async (orderState: string) => {
    console.log(`${API_URL}/orders/by-term`);
    try {
      const response = await axios.post(
        `${API_URL}/orders/by-term` ,
        { orderState },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ordersData = response.data.data;

      const transformedOrders = ordersData.flatMap((patient: any) =>
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
      //console.log("✅ Órdenes transformadas:", transformedOrders);
      setOrders(transformedOrders);
      setFilteredOrders(transformedOrders);
      setErrorMessage(null);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setOrders([]);
        setFilteredOrders([]);
        setErrorMessage("No hay registros disponibles.");
      } else {
        console.error("❌ Error al obtener órdenes:", error);
        setErrorMessage("Ocurrió un error al obtener las órdenes.");
      }
    }
  };

  // Cargar órdenes con estado "REGISTRADA" al cargar la página
  useEffect(() => {
    fetchOrders("REGISTRADA");
  }, []);

  // Función para manejar el texto de búsqueda
  const handleSearch = (text: string) => {
    setSearchText(text);

    const filtered = orders.filter((order) =>
      Object.values(order).some((value) =>
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(text.toLowerCase())
      )
    );

    setFilteredOrders(filtered);
  };

  // Función para manejar el botón "Detalles"
  //const handleDetails = (order: any) => {
  //  console.log("Detalles de la orden:", order);
  //   setSelectedOrder(order); // Guardar la orden seleccionada
  //  setIsModalOpen(true); // Abrir el modal
  // };
  const handleDetails = (order: any) => {
    console.log("Detalles de la orden:", order);
    setSelectedOrder(order); // Guardar la orden seleccionada
    fetchAccounts(order.customerId); // Obtener las cuentas para el cliente seleccionado
    setIsModalOpen(true); // Abrir el modal
  };


  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Función para manejar el botón "Eliminar producto"
  const handleDeleteProduct = async (orderProductId: string) => {
    const orderId = selectedOrder?.orderId; // Asegúrate de que selectedOrder no sea null
    if (!selectedOrder) return; // Maneja el caso donde selectedOrder es null

    const { cie10, priority, observation, patientId, customerAccountId, tariffId } = selectedOrder;

    // Filtrar los productos para excluir el que se va a eliminar
    const filteredProducts = selectedOrder.products.filter((product: Product) => product.orderProductId !== orderProductId);

    // Crear el objeto que se enviará a la API
    const requestBody = {
      cie10,
      priority,
      observation,
      patientId,
      customerAccountId,
      tariffId,
      products: filteredProducts.map((product: Product) => ({
        productId: product.productId // Solo incluir productId de los productos restantes
      }))
    };
    //console.log('Producto eliminado:', requestBody);
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Leer el cuerpo de la respuesta
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al eliminar el producto: ' + errorData.message
        });
        console.error('Error en la solicitud:', errorData);
        return;
      } else {
        const data = await response.json();
        console.log('Respuesta exitosa:', data);
      }

      if (!response || !response.ok) {
        console.log('Producto eliminado:', response);

        throw new Error('Error al eliminar el producto');
      }

      const data = await response.json();
      console.log('Producto eliminado:', data);

      // Actualizar el estado de selectedOrder con los productos filtrados
      setSelectedOrder(prevOrder => ({
        ...prevOrder!,
        products: filteredProducts // Actualiza la lista de productos
      }));

      // Aquí puedes actualizar el estado de orders y filteredOrders si es necesario
      setOrders(prevOrders => prevOrders.map(order =>
        order.orderId === orderId ? { ...order, products: filteredProducts } : order
      ));
      setFilteredOrders(prevFilteredOrders => prevFilteredOrders.map(order =>
        order.orderId === orderId ? { ...order, products: filteredProducts } : order
      ));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    if (!selectedOrder) return; // Asegúrate de que selectedOrder no sea nulo

    // Solicitar al usuario el nuevo estado
    //const newState = prompt("Ingrese el nuevo estado de la orden (EN CURSO o RECHAZADA):", selectedOrder.state);

    // Validar que el estado ingresado sea correcto
    // if (newState !== "EN CURSO" && newState !== "RECHAZADA") {
    //  alert("Estado no válido. Debe ser 'EN CURSO' o 'RECHAZADA'.");
    //  return;
    // }
    //Usar SweetAlert para solicitar el nuevo estado
    const { value: newState } = await Swal.fire({
      title: 'Selecciona el nuevo estado de la orden',
      input: 'select',
      inputOptions: {
        'EN CURSO': 'EN CURSO',
        'RECHAZADA': 'RECHAZADA'
      },
      inputPlaceholder: 'Selecciona un estado',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes seleccionar un estado!';
        }
      }
    });

    // Si el usuario cancela, no hacer nada
    if (!newState) return;

    const { cie10, priority, observation, patientId, customerAccountId, tariffId, products } = selectedOrder;

    // Crear el objeto que se enviará a la API para actualizar los productos
    const requestBody = {
      cie10,
      priority,
      observation,
      patientId,
      customerAccountId,
      tariffId,
      products: products.map((product: Product) => ({
        productId: product.productId // Incluir todos los productos
      })),
    };
    console.log('Cuerpo de la solicitud para guardar:', requestBody);
    try {
      // Actualizar los productos
      const orderId = selectedOrder.orderId;

      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        //alert('Error al actualizar los productos: ' + errorData.message);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar los productos: ' + errorData.message
        });
        return;
        //console.error('Error en la solicitud1:', errorData);
        //return;
      }

      // Cambiar el estado de la orden
      const changeStateResponse = await fetch(`${API_URL}/orders/${orderId}/change-state?state=${newState}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        //body: JSON.stringify({ orderState: newState }), // Enviar el nuevo estado
      });

      if (!changeStateResponse.ok) {
        const errorData = await changeStateResponse.json();
        //alert('Error al cambiar el estado de la orden: ' + errorData.message);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cambiar el estado de la orden: ' + errorData.message
        });
        console.error('Error en la solicitud2:', errorData);
        return;
      }

      const updatedOrderData = await changeStateResponse.json();
      
      console.log('Estado de la orden actualizado:', updatedOrderData);

      // Aquí puedes actualizar el estado de orders y filteredOrders si es necesario
      // Por ejemplo, podrías volver a llamar a fetchOrders con el estado actual
      fetchOrders(selectedOrder.state); // O el nuevo estado si es necesario

      //alert('Orden actualizada con éxito.');
      setState(newState); // Actualizar el estado local
      fetchOrders(newState); // Refrescar las órdenes con el nuevo estado
      await Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Orden actualizada con éxito.'
      });
      closeModal(); // Cerrar el modal después de guardar
    } catch (error) {
      //console.error('Error:', error);
      //alert('Ocurrió un error al guardar los cambios.');
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar los cambios.'
      });

    }
  };


  const fetchAccounts = async (customerId: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/tariff-product/by-account/${customerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Asegúrate de que la respuesta sea un array
      if (Array.isArray(response.data.customerAccounts)) {
        setAccounts(response.data.customerAccounts);
        //setSelectedAccount(response.data[0]); // Selecciona la primera cuenta por defecto
      } else {
        console.error("La respuesta no es un array:", response.data.customerAccounts);
        setAccounts([]); // Establecer como un array vacío si no es un array
      }
    } catch (error) {
      console.error("Error al obtener cuentas:", error);
      setAccounts([]); // Establece como un array vacío en caso de error
    }
  };




  // Definir las columnas para React DataTable
  const columns = [
    {
      name: "Número Orden",
      selector: (row: any) => row.orderNumber,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row: any) => row.state,
      sortable: true,
    },
    {
      name: "Fecha de Creación",
      selector: (row: any) => row.creationDate,
      sortable: true,
    },
    {
      name: "Observación",
      selector: (row: any) => row.observation,
    },
    {
      name: "Paciente",
      selector: (row: any) => row.patientName,
    },
  ];

  return (
    <div>
      <h1>Ordenes registradas</h1>
      <p>Consulta de órdenes por estado</p>

      {/* Contenedor para el selector y el buscador */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <label htmlFor="state" style={{ marginRight: "10px" }}>Estado:</label>
          <select
            id="state"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              fetchOrders(e.target.value); // Llama a fetchOrders con el nuevo valor
            }}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <option value="REGISTRADA">REGISTRADA</option>
            <option value="EN CURSO">EN CURSO</option>
            <option value="RECHAZADA">RECHAZADA</option>
            <option value="COMPLETADA">COMPLETADA</option>
          </select>
          {/* <button
            onClick={() => fetchOrders(state)}
            style={{
              marginLeft: "10px",
              padding: "10px 15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Buscar
          </button> */}
        </div>

        <div>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              padding: "10px",
              width: "300px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </div>
      </div>


      {/* Tabla con React DataTable */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        pagination
        highlightOnHover
        noDataComponent={errorMessage || "No se encontraron órdenes."}
        onRowClicked={handleDetails} // Similar a `onRowClick`
        customStyles={customStyles} // Aplica los estilos personalizados
        className="shadow-sm table-hover table-striped"
      />

      <Modal
        show={isModalOpen}
        onHide={closeModal}
        size="lg"
        centered
        enforceFocus={false}
      >
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
                        <br /> <b>ESTADO:</b> {selectedOrder.state}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1">
                        <b>Documento:</b> {selectedOrder.identification}
                      </p>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col md={6}>
                      {<p className="mb-1"><b>Fecha de nacimiento:</b> {selectedOrder.birthDate ? new Date(selectedOrder.birthDate).toLocaleDateString("es-CO") : "—"}</p>}
                    </Col>
                    <Col md={6}>
                      {<p className="mb-1"><b>Sexo:</b> {selectedOrder.gender || "—"}</p>}
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
                  <p><b>Cuenta:</b>
                    {selectedOrder?.state === "REGISTRADA" ? (
                      <select
                        id="accountId"
                        name="accountId"
                        value={selectedAccount?.customerAccountId || ""}
                        onChange={(e) => {
                          const account = accounts.find(acc => acc.customerAccountId === e.target.value);
                          selectedOrder.tariffName = account.tariff.name;
                          selectedOrder.tariffId = account.tariff.tariffId;
                          setSelectedAccount(account);
                        }}
                        style={{
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }}
                      >
                        {accounts.map((account) => (
                          <option key={account.customerAccountId} value={account.customerAccountId}>
                            {account.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{selectedOrder.customerAccountName || "—"}</span>
                    )}
                  </p>
                  <p><b>Tarifa:</b> {selectedOrder.tariffName || "—"}</p>
                  <p><b>Estado:</b> {selectedOrder.state || "—"}</p>
                  <p><b>Observación:</b> {selectedOrder.observation || "Sin observaciones"}</p>
                </Card.Body>
              </Card>

              {/* EXÁMENES SOLICITADOS */}
              <Card className="shadow-sm border-0 mb-3">
                <Card.Header className="bg-secondary text-white fw-semibold">
                  🧪 Exámenes Solicitados

                </Card.Header>
                <ListGroup variant="flush">
                  {selectedOrder.products?.length ? (
                    selectedOrder.products.map((product, index) => (
                      <ListGroup.Item key={index}>
                        <div className="d-flex justify-content-between align-items-center">
                          {/* Nombre del producto con límite de 65 caracteres */}
                          <span>
                            {product.name?.length > 65
                              ? product.name.slice(0, 65) + "..."
                              : product.name ?? "—"}
                          </span>

                          {/* Precio alineado a la derecha */}
                          <b className="ms-auto me-3">
                            {product.pendingPayments?.toLocaleString("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                            })}
                          </b>

                          {/* Botón de eliminar */}
                          {selectedOrder && selectedOrder.state === "REGISTRADA" && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.orderProductId)}
                            >
                              🗑️
                            </Button>
                          )}

                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item>No se seleccionaron productos.</ListGroup.Item>
                  )}
                </ListGroup>
                {selectedOrder?.state === "REGISTRADA" ? (
                  <Card.Footer className="bg-light text-end fw-bold text-success" style={{ padding: "0px 68px", }}>
                    💰 Total:{" "}
                    {selectedOrder.products?.reduce(
                      (sum, p) => sum + (p.price || 0),
                      0
                    ).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
                  </Card.Footer>
                ) : (
                  <Card.Footer className="bg-light text-end fw-bold text-success" style={{ padding: "0px 30px", }}>
                    💰 Total:{" "}
                    {selectedOrder.products?.reduce(
                      (sum, p) => sum + (p.price || 0),
                      0
                    ).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
                  </Card.Footer>
                )}

              </Card>
            </>
          ) : (
            <p>No hay detalles para mostrar.</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          {/* Botón Guardar: solo se muestra si el estado de la orden es "REGISTRADA" */}
          {selectedOrder && selectedOrder.state === "REGISTRADA" && (
            <Button
              variant="success"
              onClick={handleSave}
              id="btnGuardar"
            >
              Guardar
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={closeModal}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default AdminPage;