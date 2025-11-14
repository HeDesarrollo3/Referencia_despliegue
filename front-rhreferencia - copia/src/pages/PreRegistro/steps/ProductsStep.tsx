import React, { forwardRef, useImperativeHandle } from "react";
import Select from "react-select";
import { PlusCircle } from "react-bootstrap-icons";

interface Product {
  productId: string;
  code: string;
  name: string;
  price?: number;
}

interface ProductsStepProps {
  products: { productId: string }[];
  productList: Product[]; // Ya viene filtrado según el plan seleccionado
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
}

// 🔹 Interfaz para exponer la validación al Wizard
export interface ProductsStepRef {
  validate: () => boolean;
}

const ProductsStep = forwardRef<ProductsStepRef, ProductsStepProps>(
  ({ products, productList, onChange, onAdd }, ref) => {
    // Opciones para React Select
    const productOptions = productList.map((p) => ({
      value: p.productId,
      label: `${p.code} - ${p.name} ($${Number(p.price || 0).toLocaleString("es-CO")})`,
      price: p.price || 0,
      code: p.code,
      name: p.name,
    }));

    // ✅ Validación: debe haber al menos un producto válido
    useImperativeHandle(ref, () => ({
      validate: () => {
        const hasValidProduct =
          products.length > 0 && products.some((p) => p.productId !== "");
        if (!hasValidProduct) {
          alert("⚠️ Debes agregar al menos un producto antes de continuar.");
          return false;
        }
        return true;
      },
    }));

    return (
      <div className="card p-4 shadow-sm border-0 rounded-4">
        <h5 className="mb-3 fw-bold text-secondary">🧪 Selección de Productos</h5>

        {productList.length === 0 && (
          <p className="text-muted">
            No hay productos disponibles para el plan seleccionado.
          </p>
        )}

        {products.map((prod, idx) => (
          <div key={idx} className="mb-3">
            <label className="form-label text-muted small">
              Producto #{idx + 1}
            </label>
            <Select
              options={productOptions}
              value={
                productOptions.find((opt) => opt.value === prod.productId) || null
              }
              onChange={(selected) => onChange(idx, selected?.value || "")}
              placeholder="Seleccione un producto..."
              isClearable
              isSearchable
              formatOptionLabel={(opt: any) => (
                <div className="d-flex justify-content-between">
                  <span>
                    {opt.code} - {opt.name}
                  </span>
                  <span className="text-primary fw-bold">
                    ${Number(opt.price).toLocaleString("es-CO")}
                  </span>
                </div>
              )}
            />
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 mt-2"
          onClick={onAdd}
        >
          <PlusCircle size={18} />
          Agregar otro producto
        </button>
      </div>
    );
  }
);

export default ProductsStep;





// // src/pages/PreRegistro/steps/ProductsStep.tsx
// import React from "react";
// import Select from "react-select";
// import { PlusCircle } from "react-bootstrap-icons";

// interface Product {
//   productId: string;
//   code: string;
//   name: string;
//   price?: number;
// }

// interface ProductsStepProps {
//   products: { productId: string }[];
//   productList: Product[]; // Ya viene filtrado según el plan seleccionado
//   onChange: (index: number, value: string) => void;
//   onAdd: () => void;
// }

// const ProductsStep: React.FC<ProductsStepProps> = ({
//   products,
//   productList,
//   onChange,
//   onAdd,
// }) => {
//   // Opciones para React Select
//   const productOptions = productList.map((p) => ({
//     value: p.productId,
//     label: `${p.code} - ${p.name} ($${Number(p.price || 0).toLocaleString("es-CO")})`,
//     price: p.price || 0,
//     code: p.code,
//     name: p.name,
//   }));

//   return (
//     <div className="card p-4 shadow-sm border-0 rounded-4">
//       <h5 className="mb-3 fw-bold text-secondary">🧪 Selección de Productos</h5>

//       {productList.length === 0 && (
//         <p className="text-muted">No hay productos disponibles para el plan seleccionado.</p>
//       )}

//       {products.map((prod, idx) => (
//         <div key={idx} className="mb-3">
//           <label className="form-label text-muted small">Producto #{idx + 1}</label>
//           <Select
//             options={productOptions}
//             value={productOptions.find((opt) => opt.value === prod.productId) || null}
//             onChange={(selected) => onChange(idx, selected?.value || "")}
//             placeholder="Seleccione un producto..."
//             isClearable
//             isSearchable
//             formatOptionLabel={(opt: any) => (
//               <div className="d-flex justify-content-between">
//                 <span>{opt.code} - {opt.name}</span>
//                 <span className="text-primary fw-bold">
//                   ${Number(opt.price).toLocaleString("es-CO")}
//                 </span>
//               </div>
//             )}
//           />
//         </div>
//       ))}

//       <button
//         type="button"
//         className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 mt-2"
//         onClick={onAdd}
//       >
//         <PlusCircle size={18} />
//         Agregar otro producto
//       </button>
//     </div>
//   );
// };

// export default ProductsStep;



 // src/pages/PreRegistro/steps/ProductsStep.tsx
// import React from "react";
// import Select from "react-select";
// import { PlusCircle } from "react-bootstrap-icons";

// interface Product {
//   productId: string;
//   code: string;
//   name: string;
//   price: number;
// }

// interface ProductsStepProps {
//   products: { productId: string }[];
//   productList: Product[];
//   onChange: (index: number, value: string) => void;
//   onAdd: () => void;
// }

// const ProductsStep: React.FC<ProductsStepProps> = ({
//   products,
//   productList,
//   onChange,
//   onAdd,
// }) => {
//   // Transformamos productList en formato compatible con react-select
//   console.log("PRODUCT LIST:", productList);

//   const productOptions = productList.map((p) => ({
//     value: p.productId,
//     label: `${p.code} - ${p.name} ($${Number(p.price || 0).toLocaleString("es-CO")})`,

//   }));

//   return (
//     <div className="card p-4 shadow-sm border-0 rounded-4">
//       <h5 className="mb-3 fw-bold text-secondary">
//         🧪 Selección de Productos
//       </h5>

//       {products.map((prod, idx) => (
//         <div key={idx} className="mb-3">
//           <label className="form-label text-muted small">
//             Producto #{idx + 1}
//           </label>
//           <Select
//             options={productOptions}
//             value={productOptions.find((opt) => opt.value === prod.productId) || null}
//             onChange={(selected) => onChange(idx, selected?.value || "")}
//             placeholder="Seleccione un producto..."
//             isClearable
//           />
//         </div>
//       ))}

//       <button
//         type="button"
//         className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 mt-2"
//         onClick={onAdd}
//       >
//         <PlusCircle size={18} />
//         Agregar otro producto
//       </button>
//     </div>
//   );
// };

// export default ProductsStep;
