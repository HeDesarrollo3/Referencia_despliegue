import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';
import { Modal, Button, Card, ListGroup, Col, Row } from "react-bootstrap";
import { Console } from "console";
import AsyncSelect from "react-select/async"; // Asegúrate de instalar react-select
import { getTariffProducts, getCustomer, getCustomerTariffProducts } from "../../services/api";
import * as XLSX from 'xlsx';


const API_URL = `${process.env.REACT_APP_API_URL}`;

const AdminPage: React.FC = () => {



  document.title = " Ordenes- HE";



  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [state, setState] = useState<string>("REGISTRADA");
  const [searchText, setSearchText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  //const [selectedOrder, setSelectedOrder] = useState<any>(null); // Estado para la orden seleccionada
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Estado para el modal
  const user_role = localStorage.getItem("user_role");
  const [accounts, setAccounts] = useState<any[]>([]); // Inicializa como un array vacío
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [startDate, setStartDate] = useState(''); // Estado para la fecha inicial
  const [endDate, setEndDate] = useState(''); // Estado para la fecha final
  const [customers, setCustomers] = useState<Customer[]>([]);
  const token = localStorage.getItem("token") || "";
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [NamePriority, setSelectedNamePriority] = useState<string | null>(null);

  



  interface Product {
    orderProductId: string;
    productId: string;
    name: string;
    price: number;
    pendingPayments: number;
    code: string;
    altCode: string;
    state: string;
    comments: string;
  }
  interface Customer {
    customerId: string;
    name: string;
  }
  interface Account {
    customerAccountId: string;
    code: string;
    altCode: string;
    name: string;
    state: string;
    tariff: Tariff;
  }
  interface Tariff {
    tariffId: string;
    name: string;
    state: string;
    products: Product[];
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
  interface ProductExel {
  orderProductId: string;
  productId: string;
  name: string;
  price: number;
  pendingPayments: number;
  code: string;
  altCode: string;
}

interface OrderExcel {
  orderId: string;
  orderNumber: string;
  state: string;
  creationDate: string;
  observation: string;
  patientName: string;
  identification: string;
  identificationType: string;
  customerName: string;
  customerId: string;
  customerAccountId: string;
  customerAccountName: string;
  tariffName: string;
  tariffId: string;
  cie10: string;
  priority: string;
  patientId: string;
  email: string;
  gender: string;
  mobileNumber: string;
  birthDate: string;
  products: Product[];
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

  const handleCustomerSelect = async (selected: any) => {
    const customerId = selected?.value || "";
    setSelectedCustomerId(customerId === "" ? null : customerId);
    //console.log("Cliente seleccionado ID:", customerId); // Mostrar el ID del cliente seleccionado
  };

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
  function getLocalIP(callback: (ip: string) => void): void  {
    const rtc = new RTCPeerConnection({ iceServers: [] });
    rtc.createDataChannel('');
    rtc.createOffer().then(offer => rtc.setLocalDescription(offer));
    
    rtc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) return;
        const parts = ice.candidate.candidate.split(' ');
        const ip = parts[4];
        callback(ip);
        rtc.close();
    };
}


  // Función para obtener órdenes por estado
  const fetchOrders = async (orderState: string) => {
    //console.log(`${API_URL}/orders/by-term`);
    //console.log("estado ordenes:", orderState);
    try {
      var response =null
      if (orderState === "TODOS") { 
        response= await axios.post(
          `${API_URL}/orders/by-term`,
          {
              startDate: startDate,   // Debe estar en formato yyyy-mm-dd
              endDate: endDate,
              customerId : selectedCustomerId        // Debe estar en formato yyyy-mm-dd
            },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }else{
        response= await axios.post(
          `${API_URL}/orders/by-term`,
          {
              orderState: orderState, // Asegúrate de que esto sea una cadena válida
              startDate: startDate,   // Debe estar en formato yyyy-mm-dd
              endDate: endDate,
              customerId : selectedCustomerId        // Debe estar en formato yyyy-mm-dd
            },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      }

      

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
      setOrders(transformedOrders);
      setFilteredOrders(transformedOrders);
      setErrorMessage(null);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setOrders([]);
        setFilteredOrders([]);
        setErrorMessage("No hay registros disponibles.");
      } else {
        //console.error("❌ Error al obtener órdenes:", error);
        setErrorMessage("Ocurrió un error al obtener las órdenes.");
      }
    }
  };

  // Cargar órdenes con estado "REGISTRADA" al cargar la página
  useEffect(() => {

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Formato yyyy-mm-dd

    setStartDate(formattedDate);
    setEndDate(formattedDate);
    
    //console.log("Fecha de hoy establecida en:", formattedDate);
    //console.log("Fechas:", startDate );
    const fetchAccountsAndCustomers = async () => {
      try {
        const customersData = await getCustomer(token);
        setCustomers(customersData); // Cargar clientes 
      } catch (error) {
        //console.error("❌ Error cargando tarifas o clientes:", error);
      } finally {
      }
    };
    fetchAccountsAndCustomers();
  }, []);

    useEffect(() => {
    //console.log("fechas useEffect:", startDate); // Aquí verás el valor actualizado
    //console.log("selectedCustomerId useEffect:", selectedCustomerId); // Aquí verás el valor actualizado
    fetchOrders(state);
  }, [startDate, endDate,selectedCustomerId]); // Dependencia en startDate

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
    if (order.priority === '1') {
      setSelectedNamePriority('URGENTE'); // Clase para urgente
    } else if (order.priority === '3') {
      setSelectedNamePriority('NORMAL'); // Clase para normal
    }
    fetchAccounts(order.customerId); // Obtener las cuentas para el cliente seleccionado
    setIsModalOpen(true); // Abrir el modal
  };

  const downloadExcel = () => {
    // Aplanar los datos
    const flattenedData = filteredOrders.flatMap((order: OrderExcel) => {
      return order.products.map((product: ProductExel) => ({
       // orderId: order.orderId,
        'NumeroOrden': order.orderNumber,
        state: order.state,
        'FechaCreacion': order.creationDate,
        observation: order.observation,
        identificationType: order.identificationType,
        identification: order.identification,
        patientName: order.patientName,
        'Cliente': order.customerName,
        //customerId: order.customerId,
        //customerAccountId: order.customerAccountId,
        'Cuenta': order.customerAccountName,
        //tariffName: order.tariffName,
        //tariffId: order.tariffId,
        cie10: order.cie10,
        priority: order.priority,
        //patientId: order.patientId,
        email: order.email,
        gender: order.gender,
        mobileNumber: order.mobileNumber,
        birthDate: order.birthDate,
        //productId: product.productId,
        'Producto': product.name,
        'Precio': product.price,
        'Codigo': product.code,
        'Cups': product.altCode,
      }));
    });

    // Crea una hoja de trabajo a partir de los datos aplanados
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Órdenes");

    // Genera el archivo Excel y desencadena la descarga
    XLSX.writeFile(workbook, "ordenes.xlsx");
  };



  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Función para manejar el botón "Eliminar producto"
  const handleDeleteProduct2 = async (orderProductId: string) => {
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

  // Función para manejar el botón "Eliminar producto"
 const handleDeleteProduct = async (orderProductId: string) => {
    const orderId = selectedOrder?.orderId; // Asegúrate de que selectedOrder no sea null
    if (!selectedOrder) return; // Maneja el caso donde selectedOrder es null

    const { cie10, priority, patientId, customerAccountId, tariffId } = selectedOrder;

    // Solicitar la observación al usuario
    const observation = await Swal.fire({
        title: 'Observación',
        input: 'textarea',
        inputPlaceholder: 'Escribe la razón para eliminar el producto...',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar'
    }).then(result => result.value);

    if (!observation) return; // Si el usuario cancela, no hacer nada

    // Crear el nuevo arreglo de productos
    const updatedProducts = selectedOrder.products.map((product: Product) => {
        if (product.orderProductId === orderProductId) {
            return {
                ...product,
                state: 'X', // Marcar el producto seleccionado con 'X'
                comments: observation // Agregar la observación
            };
        } else {
            return {
                ...product,
                state: 'A', // Marcar los demás productos con 'A'
                comments: '' // Comentarios vacíos para los demás
            };
        }
    });

    // Crear el objeto que se enviará a la API
    const requestBody = {
        cie10,
        priority,
        observation, // Usar la observación proporcionada
        patientId,
        customerAccountId,
        tariffId,
        products: updatedProducts.map((product: Product) => ({
            orderProductId: product.orderProductId,
            productId: product.productId,
            state: product.state,
            comments: product.comments
        }))
    };
    console.log('Cuerpo de la solicitud para eliminar producto:', requestBody);

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
        }

        const data = await response.json();
        await Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Orden actualizada con éxito.'
        });
        //console.log('Producto actualizado:', data);

        // Actualizar el estado de selectedOrder con los productos filtrados
        setSelectedOrder(prevOrder => ({
            ...prevOrder!,
            products: updatedProducts.filter(product => product.state === 'A') // Filtrar por estado 'A'
        }));

        // Aquí puedes actualizar el estado de orders y filteredOrders si es necesario
        setOrders(prevOrders => prevOrders.map(order =>
            order.orderId === orderId ? { ...order, products: updatedProducts.filter(product => product.state === 'A') } : order
        ));
        setFilteredOrders(prevFilteredOrders => prevFilteredOrders.map(order =>
            order.orderId === orderId ? { ...order, products: updatedProducts.filter(product => product.state === 'A') } : order
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

    // Inicializar la variable comment
let comment = '';

// Si el nuevo estado es "RECHAZADA", solicitar la razón
if (newState === 'RECHAZADA') {
    const { value: rejectionReason } = await Swal.fire({
        title: 'Razón del rechazo',
        input: 'textarea',
        inputPlaceholder: 'Escribe la razón del rechazo...',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Debes proporcionar una razón para el rechazo!';
            }
        }
    });

    // Si el usuario cancela, no hacer nada
    if (!rejectionReason) return;

    // Asignar la razón a la variable comment
    comment = rejectionReason;
}

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
        orderProductId: product.orderProductId,
        productId: product.productId, // Incluir todos los productos
        state: 'A', // Marcar los demás productos con 'A'
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
      const changeStateResponse = await fetch(`${API_URL}/orders/${orderId}/change-state`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          { 
            state: newState,
            comments: comment // Comentarios vacíos para los demás
          }
        ), // Enviar el nuevo estado
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
      <h2>Ordenes registradas</h2>
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
              marginRight: "10px", // Espacio entre el select y el siguiente elemento
              minWidth: "150px", // Ancho mínimo para el select
            }}
          >
            <option value="REGISTRADA">REGISTRADA</option>
            <option value="EN CURSO">EN CURSO</option>
            <option value="RECHAZADA">RECHAZADA</option>
            <option value="COMPLETADA">COMPLETADA</option>
            <option value="TODOS">TODOS</option>
          </select>

          <label htmlFor="startDate" style={{ marginRight: "10px" }}>Fecha Inicial:</label>
          <input
            type="date"
            id="startDate"
            value={startDate} // Usa el estado startDate
            onChange={(e) => setStartDate(e.target.value)} // Asegúrate de tener una función setStartDate
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              marginRight: "10px", // Espacio entre el input y el siguiente elemento
            }}
          />

          <label htmlFor="endDate" style={{ marginRight: "10px" }}>Fecha Final:</label>
          <input
            type="date"
            id="endDate"
            value={endDate} // Usa el estado endDate
            onChange={(e) => setEndDate(e.target.value)} // Asegúrate de tener una función setEndDate
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              marginRight: "10px", // Espacio entre el input y el siguiente elemento
            }}
          />

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
            styles={{
              container: (provided) => ({
                ...provided,
                minWidth: '250px', // Ancho mínimo para el AsyncSelect
                marginRight: "10px", // Espacio entre el AsyncSelect y el siguiente elemento
              }),
              control: (provided) => ({
                ...provided,
                minWidth: '250px', // Mantener un ancho mínimo
                width: '100%', // Asegurarse de que el control use el 100% del contenedor
              }),
              menu: (provided) => ({
                ...provided,
                minWidth: '250px', // Mantener el ancho mínimo del menú desplegable
              }),
            }}
          />
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
      {/* <button onClick={downloadExcel} className="btn btn-primary mb-3">
        Descargar Excel
      </button> */}
      <Button variant="outline-success" onClick={downloadExcel}>
        <i className="bi bi-file-earmark-excel"></i> Descargar Excel
      </Button>
      <br />  <br />  
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
                  <p>
                    <b>Prioridad:</b>{' '}
                    <span style={{ color: NamePriority === 'URGENTE' ? 'red' : 'blue' }}>
                      {NamePriority}
                    </span>
                  </p>
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