import React from "react";

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  striped?: boolean;
  hover?: boolean;
  onRowClick?: (row: T) => void;
}

function Table<T>({ columns, data, striped, hover, onRowClick }: TableProps<T>) {
  return (
    <div className="table-responsive shadow-sm rounded">
      <table
        className={`table align-middle ${striped ? "table-striped" : ""} ${
          hover ? "table-hover" : ""
        }`}
      >
        <thead className="table-primary bg-light">
          <tr>
            {columns.map((col, cIdx) => (
              <th
                key={cIdx}
                className="text-center text-nowrap"
                style={{
                  fontSize: "0.95rem",        // 🔹 cambiar tamaño
                  fontWeight: 600,
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // 🔹 fuente
                  color: "#222",               // 🔹 color
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted py-3">
                No hay registros para mostrar
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col, cIdx) => (
                  <td
                    key={cIdx}
                    className="text-nowrap"
                    style={{
                      color: "#444",               // 🔹 color texto
                      verticalAlign: "middle",
                      fontSize: "0.95rem",          // 🔹 tamaño texto
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // 🔹 fuente
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


export default Table;
