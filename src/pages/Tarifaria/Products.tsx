import React from "react";

interface Product {
  productId: string;
  code: string;
  name: string;
  price: number;
}

interface ProductsStepProps {
  selectedProductId: string; 
  productList: Product[];
  onSelect: (productId: string) => void; 
}

const Products: React.FC<ProductsStepProps> = ({ selectedProductId, productList, onSelect }) => {
  // 🔹 La corrección está aquí: usamos `?.` para prevenir el error.
  // Esto asegura que `find` solo se ejecute si `productList` no es nulo o indefinido.
  const getProductInfo = (id: string) =>
    productList?.find((p) => p.productId === id);

  const selectedProduct = getProductInfo(selectedProductId);

  return (
    <div>
      <h5>🧪 Selección de Producto</h5>

      {/* Select para elegir un producto */}
      <select
        className="form-select mb-2"
        value={selectedProductId}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Seleccione un producto</option>
        {/* 🔹 También usamos `?.` aquí para el mapeo */}
        {productList?.map((p) => (
          <option key={p.productId} value={p.productId}>
            {p.code} - {p.name}
          </option>
        ))}
      </select>

      {/* Mostrar detalles del producto seleccionado */}
      {selectedProduct && (
        <div className="p-2 bg-light rounded">
          <p className="mb-1">
            <strong>Código:</strong> {selectedProduct.code}
          </p>
          <p className="mb-1">
            <strong>Nombre:</strong> {selectedProduct.name}
          </p>
          <p className="mb-0">
            <strong>Precio:</strong> ${selectedProduct.price}
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;