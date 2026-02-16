import React, { createContext, useContext, useState, useEffect } from "react";
import { PRODUCTS } from "../data/products";

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const localProducts = localStorage.getItem("eshop_products");
      return localProducts ? JSON.parse(localProducts) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  useEffect(() => {
    localStorage.setItem("eshop_products", JSON.stringify(products));
  }, [products]);

  const updateProduct = (productId, updates) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const addProduct = (productData) => {
    const newProduct = {
      id: Math.max(...products.map((p) => p.id), 0) + 1,
      ...productData,
      inStock: true,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const getProductById = (id) => {
    return products.find((p) => p.id === parseInt(id));
  };

  const getProductsByCategory = (category) => {
    return products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  };

  const getAllProducts = () => products;

  return (
    <ProductContext.Provider
      value={{
        products,
        updateProduct,
        deleteProduct,
        addProduct,
        getProductById,
        getProductsByCategory,
        getAllProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
