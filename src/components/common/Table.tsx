// import React from "react";
// import { Table as BootstrapTable } from "react-bootstrap";

// export interface Column<T> {
//   header: string;
//   accessor: keyof T | string;
// }

// interface Props<T> {
//   columns: Column<T>[];
//   data: T[];
//   onRowClick?: (row: T) => void; // 👈 ahora acepta esta prop
// }

// function Table<T>({ columns, data, onRowClick }: Props<T>) {
//   return (
//     <BootstrapTable striped bordered hover responsive>
//       <thead>
//         <tr>
//           {columns.map((col, idx) => (
//             <th key={idx}>{col.header}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((row, rowIndex) => (
//           <tr
//             key={rowIndex}
//             style={{ cursor: onRowClick ? "pointer" : "default" }}
//             onClick={() => onRowClick && onRowClick(row)} // 👈 click fila
//           >
//             {columns.map((col, colIndex) => (
//               <td key={colIndex}>
//                 {/* @ts-ignore para string en accessor */}
//                 {row[col.accessor as keyof T]}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </BootstrapTable>
//   );
// }

// export default Table;


import React from "react";

export interface Column<T> {
  header: string;
 accessor: keyof T ; // <- permite string libre
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  striped?: boolean;
  hover?: boolean;
  onRowClick?: (row: T) => void; // 👈 agregado
}

function Table<T>({ columns, data, striped, hover, onRowClick }: TableProps<T>) {
  return (
    <div className="table-responsive shadow-sm rounded">
      <table
        className={`table align-middle ${striped ? "table-striped" : ""} ${
          hover ? "table-hover" : ""
        }`}
      >
        <thead className="table-danger bg-light">
          <tr>
            {columns.map((col, cIdx) => (
              <th key={cIdx} className="text-center text-nowrap"
                scope="col"
                style={{
                  fontSize: "0.85rem", // 👈 un poco más pequeña
                  fontWeight: 600, // 👈 semi-bold
                }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              style={{ cursor: onRowClick ? "pointer" : "default" }}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col, cIdx) => (
                <td
                 key={cIdx}
                  className="text-justify text-nowrap" // 👈 centramos también las celdas
                  style={{
                    color: "#333",
                    verticalAlign: "middle",
                    fontSize: "0.85rem", // 👈 mismo tamaño que títulos
                  }}
                >
                  {col.render
                    ? col.render(row)
                    : col.accessor
                    ? (row[col.accessor] as React.ReactNode)
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;