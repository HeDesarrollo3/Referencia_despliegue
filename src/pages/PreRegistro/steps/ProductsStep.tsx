// src/pages/PreRegistro/steps/ProductsStep.tsx
import React from "react";

interface ProductsStepProps {
  products: { productId: string }[];
  productList: any[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
}

const ProductsStep: React.FC<ProductsStepProps> = ({ products, productList, onChange, onAdd }) => {
  return (
    <div>
      <h5>🧪 Selección de Productos</h5>
      {products.map((prod, idx) => (
        <select
          key={idx}
          className="form-select mb-2"
          value={prod.productId}
          onChange={(e) => onChange(idx, e.target.value)}
        >
          <option value="">Seleccione un producto</option>
          {productList.map((p) => (
            <option key={p.productId} value={p.productId}>
              {p.code} - {p.name} (${p.price})
            </option>
          ))}
        </select>
      ))}
      <button className="btn btn-outline-secondary btn-sm" type="button" onClick={onAdd}>
        + Agregar producto
      </button>
    </div>
  );
};

export default ProductsStep;
