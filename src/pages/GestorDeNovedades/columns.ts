import { Column } from "../../components/common/Table";

export const patientColumns: Column<any>[] = [
    {
    header: "Orden",
    accessor: "orderNumber",
    // render: (row) => row.orders?.[0]?.orderNumber ?? "—",
  },
  {
    header: "Estado Orden",
    // accessor: "state",
   render: (row) => row.orderState || "—",
  },
  {
    header: "Nombre",
    accessor: "patientName",
    // render: (row) => {
    //   const nombres = [row.firstName, row.middleName, row.lastName, row.surName]
    //     .filter(Boolean)
    //     .join(" ");
    //   return nombres || "—";
    // },
  },
  { header: "Identificación", accessor: "identification" },
  { header: "Tipo Doc.", accessor: "identificationType" },
  
  { header: "Sexo", accessor: "gender" },
//   {
//     header: " Fecha de Nacimiento",
//     render: (row) =>
//       row.birthDate
//         ? new Date(row.birthDate).toLocaleDateString("es-CO")
//         : "—",
//   },
//   { header: "Teléfono", accessor: "mobileNumber" },
//   { header: "Email", accessor: "email" },
 
//   {
//     header: "Cliente",
//     render: (row) => row.orders?.[0]?.customer?.name ?? "—",
//   },
//   {
//     header: "Cuenta",
//     render: (row) => row.orders?.[0]?.customerAccount?.name ?? "—",
//   },
//   {
//     header: "Tarifa",
//     render: (row) => row.orders?.[0]?.tariff?.name ?? "—",
//   },
  {
    header: "CIE10",
    render: (row) => row.orderCie10 || "—",
    // render:(row)=>{if(!row.orders?.length) return "—";
    // return row.orders[0].description || "—"}
    
    // render: (row) => row.orders?.[0]?.cie10 ?? "—",
  },
   {
    header: "Observación",
    render: (row) => row.orderObservation || "—",
  },
  
  {
    header: "Producto",
     render: (row) => {
      if (!row.products?.length) return "—";
      // Mostrar los nombres de los productos separados por coma
      return row.products
        .map((p: any) => p.product?.name ?? "—")
        .join(", ");
    },
  
    // accessor: "product.productName",
    // render: (row) =>
    //   row.orders?.[0]?.products?.[0]?.product?.name ?? "—",
  },
   {
    header: "Precio",
    render: (row) => {
      if (!row.products?.length) return "—";
      const total = row.products.reduce(
        (sum: number, p: any) => sum + (p.price ?? 0),
        0
      );
      return total.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
    },
  },
];
