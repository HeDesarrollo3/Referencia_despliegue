// src/components/Admin/OrderTable.tsx
import React, { useMemo } from "react";
import DataTable from "react-data-table-component";

interface OrderRow {
  orderId: string;
  orderNumber: string;
  state: string;
  creationDate: string;
  observation?: string;
  patientName: string;
}

interface Props {
  data: OrderRow[];
  onRowClick: (row: OrderRow) => void;
  searchText: string;
  onSearch: (text: string) => void;
  stateFilter: string;
  onStateFilterChange: (value: string) => void;
}

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#cfe2ff",
      fontWeight: 600,
      justifyContent: "center",
    },
  },
};

const OrderTable: React.FC<Props> = ({
  data,
  onRowClick,
  searchText,
  onSearch,
  stateFilter,
  onStateFilterChange,
}) => {
  const columns = useMemo(
    () => [
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
        name: "Fecha",
        selector: (row: any) => row.creationDate,
        sortable: true,
      },
      {
        name: "Paciente",
        selector: (row: any) => row.patientName,
      },
      {
        name: "Observación",
        selector: (row: any) => row.observation ?? "—",
      },
    ],
    []
  );

  return (
    <div>
      {/* FILTROS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <select
          value={stateFilter}
          onChange={(e) => onStateFilterChange(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            width: 200,
          }}
        >
          <option value="">Todos los estados</option>
          <option value="REGISTRADA">REGISTRADA</option>
          <option value="EN CURSO">EN CURSO</option>
          <option value="RECHAZADA">RECHAZADA</option>
          <option value="COMPLETADA">COMPLETADA</option>
        </select>

        <input
          placeholder="Buscar..."
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
          style={{
            padding: 8,
            width: 280,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* TABLA */}
      <DataTable
        columns={columns}
        data={data}
        pagination
        striped
        highlightOnHover
        customStyles={customStyles}
        onRowClicked={onRowClick}
        noDataComponent="No se encontraron órdenes."
      />
    </div>
  );
};

export default OrderTable;




// // FILE: src/components/Admin/OrderTable.tsx
// import React, { useMemo } from "react";
// import Table, { Column } from "../../components/common/Table"; // Ajusta la ruta según tu proyecto

// interface OrderRow {
//   orderId: string;
//   orderNumber: string;
//   state: string;
//   creationDate: string;
//   observation: string;
//   patientName: string;
// }

// interface Props {
//   data: OrderRow[];
//   onRowClick: (row: OrderRow) => void;

//   // Ahora vienen desde AdminPage, pero son manejados aquí
//   stateFilter: string;
//   onStateFilterChange: (value: string) => void;

//   searchText: string;
//   onSearch: (t: string) => void;
// }

// const OrderTable: React.FC<Props> = ({
//   data,
//   onRowClick,
//   searchText,
//   onSearch,
//   stateFilter,
//   onStateFilterChange,
// }) => {
  
//   // Columnas estilizadas usando tu Table
//   const columns: Column<OrderRow>[] = useMemo(
//     () => [
//       { header: "Número Orden", accessor: "orderNumber" },
//       { header: "Estado", accessor: "state" },
//       { header: "Fecha", accessor: "creationDate" },
//       { header: "Paciente", accessor: "patientName" },
//       { header: "Observación", accessor: "observation" },
//     ],
//     []
//   );

//   return (
//     <div>

//       {/* FILTROS SUPERIORES */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginBottom: 12,
//         }}
//       >
        
//         {/* 🔽 SELECT DE ESTADOS AHORA EN EL COMPONENTE */}
//         <div>
//           <select
//             value={stateFilter}
//             onChange={(e) => onStateFilterChange(e.target.value)}
//             style={{
//               padding: 8,
//               borderRadius: 6,
//               border: "1px solid #ccc",
//             }}
//           >
//             <option value="REGISTRADA">REGISTRADA</option>
//             <option value="EN CURSO">EN CURSO</option>
//             <option value="RECHAZADA">RECHAZADA</option>
//             <option value="COMPLETADA">COMPLETADA</option>
//           </select>
//         </div>

//         {/* 🔎 Búsqueda */}
//         <div style={{ display: "flex", gap: 8 }}>
//           <input
//             placeholder="Buscar..."
//             value={searchText}
//             onChange={(e) => onSearch(e.target.value)}
//             style={{
//               padding: 8,
//               width: 280,
//               borderRadius: 6,
//               border: "1px solid #ccc",
//             }}
//           />
//         </div>
//       </div>

//       {/* Tabla con diseño unificado */}
//       <Table<OrderRow>
//         columns={columns}
//         data={data}
//         striped
//         hover
//         onRowClick={onRowClick}
//       />
//     </div>
//   );
// };

// export default OrderTable;



// // FILE: src/components/Admin/OrderTable.tsx
// import React from "react";
// import DataTable from "react-data-table-component";


// interface OrderRow {
// orderId: string;
// orderNumber: string;
// state: string;
// creationDate: string;
// observation: string;
// patientName: string;
// }


// interface Props {
// data: OrderRow[];
// onRowClick: (row: any) => void;
// searchText: string;
// onSearch: (t: string) => void;
// }


// const columns = [
// { name: "Número Orden", selector: (row: any) => row.orderNumber, sortable: true },
// { name: "Estado", selector: (row: any) => row.state, sortable: true },
// { name: "Fecha", selector: (row: any) => row.creationDate, sortable: true },
// { name: "Paciente", selector: (row: any) => row.patientName },
// { name: "Observación", selector: (row: any) => row.observation },
// ];


// const OrderTable: React.FC<Props> = ({ data, onRowClick, searchText, onSearch }) => {
// return (
// <div>
// <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>



// {/* <input
// type="text"
// placeholder="Buscar..."
// value={searchText}
// onChange={(e) => onSearch(e.target.value)}
// style={{ padding: 8, width: 300, borderRadius: 6, border: '1px solid #ccc' }}
// /> */}
// </div>


// <DataTable
//   columns={columns}
//   data={data}
//   pagination
//   highlightOnHover
//   onRowClicked={onRowClick}
//   customStyles={{
//     rows: {
//       style: {
//         paddingTop: "6px",
//         paddingBottom: "6px",
//       },
//     },
//   }}
//   conditionalRowStyles={[
//     {
//       when: () => true, // todas las filas
//       classNames: ["table-row-hover"],
//     },
//   ]}
//   noDataComponent={<div>No se encontraron órdenes.</div>}
// />

// </div>
// );
// };


// export default OrderTable;
