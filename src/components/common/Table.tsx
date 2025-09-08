// src/components/common/Table.tsx
import React from "react";

type Column<T> = {
  header: string;
  accessor: string; // ahora es string, no solo keyof T (permite "product.name")
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
};

// Función para obtener valores anidados usando "dot notation"
function getValueByAccessor(obj: any, accessor: string): any {
  return accessor.split(".").reduce((acc, key) => acc?.[key], obj);
}

function Table<T extends object>({ columns, data }: Props<T>) {
  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rIdx) => (
          <tr key={rIdx}>
            {columns.map((col, cIdx) => (
              <td key={cIdx}>{String(getValueByAccessor(row, col.accessor) ?? "")}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
