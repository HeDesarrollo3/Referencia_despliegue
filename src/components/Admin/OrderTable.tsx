// FILE: src/components/Admin/OrderTable.tsx
import React, { useMemo } from "react";
import DataTable from "react-data-table-component";

interface OrderRow {
  orderId: string;
  orderNumber: string;
  state: string;
  creationDate: string;
  observation: string;
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
      { name: "Número Orden", selector: (row: any) => row.orderNumber, sortable: true },
      { name: "Estado", selector: (row: any) => row.state, sortable: true },
      { name: "Fecha", selector: (row: any) => row.creationDate, sortable: true },
      { name: "Paciente", selector: (row: any) => row.patientName },
      { name: "Observación", selector: (row: any) => row.observation },
    ],
    []
  );

  return (
    <div>
      {/* Filtros */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <select
          value={stateFilter}
          onChange={(e) => onStateFilterChange(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option value="REGISTRADA">REGISTRADA</option>
          <option value="EN CURSO">EN CURSO</option>
          <option value="RECHAZADA">RECHAZADA</option>
          <option value="COMPLETADA">COMPLETADA</option>
        </select>

        <input
          placeholder="Buscar..."
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
          style={{ padding: 8, width: 280, borderRadius: 6, border: "1px solid #ccc" }}
        />
      </div>

      {/* Tabla */}
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        onRowClicked={onRowClick}
        noDataComponent="No se encontraron órdenes."
      />
    </div>
  );
};

export default OrderTable;
