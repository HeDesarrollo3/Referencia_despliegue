import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Modal, Button, Card, Row, Col } from "react-bootstrap";
import Swal from 'sweetalert2';



const API_URL = `${process.env.REACT_APP_API_URL}`;


interface User {
  userId: string;
  specialty: string;
  identificationType: string;
  identification: string;
  names: string;
  lastName: string;
  surName: string;
  email: string;
  state: string;
  registerDate: string;
  customer: {
    customerId: string;
    name: string;
    legalName: string;
    identification: string;
    commercialAddress: string;
    email: string;
  };
}

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showAccountFields, setShowAccountFields] = useState(false);
  const token = localStorage.getItem("token");
  const [state, setState] = useState<string>("P");
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user_role = localStorage.getItem("user_role");
  const ADMIN_ROLE_ID = "EBE2C0F1-84C3-4143-8FF8-9B0F888A2272";

  // Define la interfaz o tipo para la estructura del rol que devuelve la API
  interface UserRole {
    userRoleId: string;
    name: string;
    description: string;
    creationDate: string;
    creationUserName: string;
  }
  // Interfaz para la respuesta completa de la API
  interface RolesResponse {
    roles: UserRole[];
  }

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#cfe2ff",
        fontSize: "0.95rem",
        fontWeight: 600,
        color: "#222",
        justifyContent: "center",
      },
    },
    cells: {
      style: {
        fontSize: "0.95rem",
        color: "#444",
        verticalAlign: "middle",
      },
    },
    rows: {
      style: {
        fontSize: "0.95rem",
        color: "#444",
        cursor: "pointer",
      },
      stripedStyle: {
        backgroundColor: "#f2f2f2",
      },
      hoverStyle: {
        backgroundColor: "#f8f9fa",
      },
    },
  };
  {
    useEffect(() => {

      
       
          document.title = "Usuarios - HE";
        
      
      // Cuando se abre el modal, deshabilitar el botón Guardar
      toggleSaveButton(false);
    }, [isModalOpen])
  }
  const updateEstatusUser = async () => {
    if (!selectedUser) return; // Asegúrate de que selectedOrder no sea nulo

    const newStateEl = document.getElementById(`State-select-modal`) as HTMLSelectElement | null;
    if (!newStateEl) return;
    const newState = newStateEl.value;

    try {
      let changeStateResponse: any;
      if (newState === "X") {
        // Cambiar el estado del usuario
        console.log("Cambiando estado del usuario a:", newState);
        changeStateResponse = await fetch(
          `${API_URL}/users/${selectedUser.userId}/change-state`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            // body: JSON.stringify({ orderState: newState }), // Enviar el nuevo estado si el backend lo requiere
          }
        );

        if (!changeStateResponse.ok) {
          const errorData = await changeStateResponse.json();
          //alert("Error al cambiar el estado del usuario: " + (errorData?.message || ""));
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cambiar el estado del usuario: ' + (errorData?.message || "")
          });
          console.error("Error en la solicitud2:", errorData);
          return;
        }
      } else {
        // Para mantener el flujo del código fuera de este bloque (que espera .json()),
        // creamos una respuesta simulada cuando no se realiza la petición.
        //changeStateResponse = { ok: true, json: async () => ({ message: "No se realizó cambio de estado" }) };
        const roleSelectEl = document.getElementById(`role-select-modal`) as HTMLSelectElement | null;
        const passwordEl = document.getElementById(`pwd-${selectedUser?.userId}`) as HTMLInputElement | null;
        const rolSeleccionado = roleSelectEl?.value || '';
        const claveIngresada = passwordEl?.value || '';
        if (!rolSeleccionado || !claveIngresada) {
          //alert("Debe seleccionar un Tipo de cuenta y proporcionar la Clave/Confirmación para crear el login.");
          await Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Debe seleccionar un Tipo de cuenta y proporcionar la Clave/Confirmación para crear el login.'
          });
          return;
        }
        changeStateResponse = await fetch(
          `${API_URL}/users/${selectedUser.userId}/create-login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              passwordHash: claveIngresada, // Clave ingresada
              userRoleId: rolSeleccionado   // Rol seleccionado del select
            }),
          }
        );
        if (!changeStateResponse.ok) {
          const errorData = await changeStateResponse.json();
          //alert("Error al actualizar el usuario: " + (errorData?.message || "Error desconocido"));
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar el usuario: ' + (errorData?.message || "Error desconocido")
          });
          console.error("Error en la solicitud:", errorData);
          return;
        }

      }

      const updatedOrderData = await changeStateResponse.json();
      console.log('Estado del usuario actualizado:', updatedOrderData);

      // Aquí puedes actualizar el estado de orders y filteredOrders si es necesario
      // Por ejemplo, podrías volver a llamar a fetchOrders con el estado actual
      fetchUsers(newState); // O el nuevo estado si es necesario
      setState(newState);
      //alert('Usuario actualizado con éxito.');
      await Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Usuario actualizado con éxito.'
      });
      closeModal(); // Cerrar el modal después de guardar
    } catch (error) {
      console.error('Error:', error);
      //alert('Ocurrió un error al guardar los cambios.');
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar los cambios.'
      });
    }
  };



  // Función para habilitar/deshabilitar el botón Guardar según el match de claves
  const toggleSaveButton = (match: boolean) => {
    const saveBtn = document.getElementById("btnGuardar") as HTMLButtonElement | null;
    if (saveBtn) saveBtn.disabled = !match
  };



  const validatePassword = (password: string): boolean => {
    // 1. Longitud: Más de 8 caracteres (.{8,})
    // 2. Mayúscula: Al menos una letra mayúscula (?=.*[A-Z])
    // 3. Número: Al menos un dígito (?=.*\d)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  // Función para obtener los usuarios
  const fetchUsers = async (state: string) => {

    try {
      const response = await axios.post(
        `${API_URL}/users?state=${state}`, // Pasar el estado como query parameter
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      setUsers([]); // Dejar vacío si no hay resultados
      setFilteredUsers([]);
      console.error("Error al obtener usuarios:", error);
    }
  };

  const fetchRoles = async () => {
    console.log(`${API_URL}/user-role`);
    try {
      const response = await axios.post<RolesResponse>(
        `${API_URL}/user-role`, // RUTA ESPECIFICADA
        {}, // Cuerpo de la petición (vacío si no se requiere)
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRoles(response.data.roles);
      setError(null);
    } catch (error) {
      console.error("Error al obtener los roles:", error);
      setError("Error al cargar los tipos de cuenta.");

    }
  };



  // Cargar usuarios al montar el componente
  useEffect(() => {

    fetchUsers("P");
    fetchRoles();

  }, []);

  // Función para manejar el texto de búsqueda
  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = users.filter((user) =>
      Object.values(user).some((value) =>
        value?.toString().toLowerCase().includes(text.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
  };

  // Función para manejar la selección de un usuario
  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);

  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    toggleSaveButton(false);
    setShowAccountFields("X" === "X" ? false : false); // Resetear campos de cuenta
  };

  // Definir las columnas para React DataTable
  const columns = [
    {
      name: "Nombre",
      selector: (row: User) => `${row.names} ${row.lastName} ${row.surName}`,
      sortable: true,
    },
    {
      name: "Documento",
      selector: (row: User) =>
        `${row.identificationType} ${row.identification}`,
      sortable: true,
    },
    {
      name: "Cliente",
      selector: (row: User) => row.customer.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: User) => row.email,
    },
    // {
    //   name: "Estado",
    //   selector: (row: User) => row.state,
    //   sortable: true,
    // },
    {
      name: "Fecha de Registro",
      selector: (row: User) =>
        new Date(row.registerDate).toLocaleDateString("es-CO"),
      sortable: true,
    },
  ];



  return (
    <div>
      <h1>Usuarios</h1>
      <p>Consulta de usuarios</p>

      {/* Filtros */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <label htmlFor="state" style={{ marginRight: "10px" }}>
            Estado:
          </label>
          <select
            id="state-select"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              fetchUsers(e.target.value);
            }}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <option value="P">Pendiente</option>
            <option value="A">Activo</option>
            <option value="X">Rechazado</option>
          </select>
        </div>

        <div>
          <form autoComplete="off" style={{ margin: 0 }}>
            <input
              id="user-search"
              name="user-search"
              type="text"
              placeholder="Buscar..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              data-lpignore="true"
              aria-label="Buscar usuarios"
              style={{
                padding: "10px",
                width: "300px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </form>
        </div>
      </div>

      {/* Tabla */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination
        highlightOnHover
        noDataComponent="No se encontraron usuarios."
        onRowClicked={handleRowClick}
        customStyles={customStyles}
        className="shadow-sm table-hover table-striped"
      />

      {/* Modal */}
      <Modal show={isModalOpen} onHide={closeModal} size="lg" centered enforceFocus={false}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <>
              <Card className="mb-3">
                <Card.Header className="bg-primary text-white">
                  Información Personal
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Nombre:</strong>{" "}
                        {`${selectedUser.names} ${selectedUser.lastName} ${selectedUser.surName}`}
                      </p>
                      <p>
                        <strong>Documento:</strong>{" "}
                        {`${selectedUser.identificationType} ${selectedUser.identification}`}
                      </p>
                      <p>
                        <strong>Especialidad:</strong>{" "}
                        {selectedUser.specialty || "—"}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Email:</strong> {selectedUser.email || "—"}
                      </p>
                      <p>
                        <strong>Estado:</strong> {selectedUser.state || "—"}
                      </p>
                      <p>
                        <strong>Fecha de Registro:</strong>{" "}
                        {new Date(selectedUser.registerDate).toLocaleDateString(
                          "es-CO"
                        )}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header className="bg-secondary text-white">
                  Información del Cliente
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Cliente:</strong>{" "}
                        {selectedUser.customer.name || "—"}
                      </p>

                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>NIT:</strong> {selectedUser.customer.identification || "—"}
                      </p>

                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Header className="bg-secondary text-white">
                  Información Inicio Sesión
                </Card.Header>
                <Card.Body>
                  {/* Sección: Inicio de sesión / cambio de clave */}
                  <div>
                    {/* Select para Estado Usuario */}
                    <div className="mb-3">
                      <label htmlFor={`State-select-modal`}><strong>Estado Usuario:</strong></label>
                      <select
                        id={`State-select-modal`}
                        className="form-control"
                        defaultValue=""
                        style={{ marginTop: 8 }}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          // Mostrar campos solo si el estado es "Aceptado"
                          setShowAccountFields(selectedValue === "A");
                          // Lógica para habilitar/deshabilitar el botón Guardar:
                          // - Sin selección -> deshabilitado
                          // - Rechazado ("X") -> habilitado
                          // - Aceptado ("A") -> deshabilitado
                          if (!selectedValue) {
                            toggleSaveButton(false);
                          } else if (selectedValue === "X") {
                            toggleSaveButton(true);
                          } else if (selectedValue === "A") {
                            toggleSaveButton(false);
                          } else {
                            toggleSaveButton(false);
                          }
                        }}
                      >
                        <option value="" disabled>Seleccione una opción...</option>
                        <option value="A">Aceptado</option>
                        <option value="X">Rechazado</option>
                      </select>
                    </div>

                    {/* Mostrar los campos solo si el estado es "Aceptado" */}
                    {showAccountFields && (
                      <>
                        <div className="mb-3">
                          <label htmlFor={`role-select-modal`}><strong>Tipo de cuenta:</strong></label>
                          <select
                            id={`role-select-modal`}
                            className="form-control"
                            defaultValue=""
                            style={{ marginTop: 8 }}
                          >
                            <option value="" disabled>
                              {isLoading ? "Cargando roles..." : (error ? "Error de carga" : "Seleccione una opción...")}
                            </option>

                            {/* Ajuste la lógica aquí:
                            Filtramos la lista de roles antes de mapearla.
                            */}
                            {roles
                              .filter(role => {
                                // Si el rol que estamos iterando NO es el de ADMINISTRADOR, lo incluimos.
                                //console.log("Verificando rol de sesión:", user_role);
                                if (role.userRoleId !== ADMIN_ROLE_ID) {
                                  return true;
                                }
                                // Si el rol es ADMINISTRADOR, solo lo incluimos si el usuario de la sesión
                                // también tiene el rol de administrador.
                                // Nota: Asumo que user_role almacena el userRoleId del usuario logueado.
                                //console.log("Verificando rol de sesión:", user_role);
                                return user_role === ADMIN_ROLE_ID;
                              })
                              .map((role) => (
                                <option key={role.userRoleId} value={role.userRoleId}>
                                  {role.name}
                                </option>
                              ))}
                          </select>

                          {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
                        </div>

                        <div className="mb-3">
                          <label htmlFor={`pwd-${selectedUser?.userId}`}><strong>Clave:</strong></label>
                          <input
                            id={`pwd-${selectedUser?.userId}`}
                            type="password"
                            className="form-control"
                            placeholder="Ingrese la clave"
                            onInput={() => {
                              const p = document.getElementById(`pwd-${selectedUser?.userId}`) as HTMLInputElement | null;
                              const c = document.getElementById(`confirm-pwd-${selectedUser?.userId}`) as HTMLInputElement | null;
                              const msg = document.getElementById(`pwd-msg-${selectedUser?.userId}`) as HTMLElement | null;

                              if (p && c && msg) {
                                const passwordIsValid = validatePassword(p.value); // <--- NUEVA VALIDACIÓN DE REQUISITOS
                                const passwordsMatch = p.value === c.value;

                                // La validación final requiere que: 1. Coincidan, Y 2. Cumplan con los requisitos de seguridad.
                                const finalMatch = passwordsMatch && passwordIsValid;

                                if (!passwordIsValid) {
                                  msg.textContent = "La clave debe tener más de 8 caracteres, al menos una mayúscula y un número.";
                                } else if (!passwordsMatch) {
                                  msg.textContent = "Las claves no coinciden.";
                                } else {
                                  msg.textContent = "";
                                }

                                console.log("Match de claves:", finalMatch);
                                toggleSaveButton(finalMatch);
                              }
                            }}
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor={`confirm-pwd-${selectedUser?.userId}`}><strong>Confirmar clave:</strong></label>
                          <input
                            id={`confirm-pwd-${selectedUser?.userId}`}
                            type="password"
                            className="form-control"
                            placeholder="Confirme la clave"
                            onInput={() => {
                              // Se repite la misma lógica de validación
                              const p = document.getElementById(`pwd-${selectedUser?.userId}`) as HTMLInputElement | null;
                              const c = document.getElementById(`confirm-pwd-${selectedUser?.userId}`) as HTMLInputElement | null;
                              const msg = document.getElementById(`pwd-msg-${selectedUser?.userId}`) as HTMLElement | null;

                              if (p && c && msg) {
                                const passwordIsValid = validatePassword(p.value); // <--- NUEVA VALIDACIÓN DE REQUISITOS
                                const passwordsMatch = p.value === c.value;

                                // La validación final requiere que: 1. Coincidan, Y 2. Cumplan con los requisitos de seguridad.
                                const finalMatch = passwordsMatch && passwordIsValid;

                                if (!passwordIsValid) {
                                  msg.textContent = "La clave debe tener más de 8 caracteres, al menos una mayúscula y un número.";
                                } else if (!passwordsMatch) {
                                  msg.textContent = "Las claves no coinciden.";
                                } else {
                                  msg.textContent = "";
                                }

                                console.log("Match de claves:", finalMatch);
                                toggleSaveButton(finalMatch);
                              }
                            }}
                          />
                        </div>

                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`show-pwd-${selectedUser?.userId}`}
                            onChange={(e) => {
                              const show = (e.target as HTMLInputElement).checked;
                              const p = document.getElementById(`pwd-${selectedUser?.userId}`) as HTMLInputElement | null;
                              const c = document.getElementById(`confirm-pwd-${selectedUser?.userId}`) as HTMLInputElement | null;
                              if (p) p.type = show ? "text" : "password";
                              if (c) c.type = show ? "text" : "password";
                            }}
                          />
                          <label className="form-check-label" htmlFor={`show-pwd-${selectedUser?.userId}`}>
                            Mostrar clave
                          </label>
                        </div>

                        <div id={`pwd-msg-${selectedUser?.userId}`} style={{ color: "red", minHeight: 18 }} />
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>

            </>
          ) : (
            <p>No hay detalles disponibles.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {/* Botón Guardar: solo se muestra si el estado de la orden es "REGISTRADA" */}
          {selectedUser && selectedUser.state === "P" && (
            <Button
              variant="success"
              onClick={updateEstatusUser}
              id="btnGuardar"
            >
              Guardar
            </Button>
          )}
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
};

export default UserPage;