import React from "react";
import { Table as BootstrapTable } from "react-bootstrap";

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void; // 👈 ahora acepta esta prop
}

function Table<T>({ columns, data, onRowClick }: Props<T>) {
  return (
    <BootstrapTable striped bordered hover responsive>
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            style={{ cursor: onRowClick ? "pointer" : "default" }}
            onClick={() => onRowClick && onRowClick(row)} // 👈 click fila
          >
            {columns.map((col, colIndex) => (
              <td key={colIndex}>
                {/* @ts-ignore para string en accessor */}
                {row[col.accessor as keyof T]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </BootstrapTable>
  );
}

export default Table;
