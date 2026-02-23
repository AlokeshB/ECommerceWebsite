import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const API_URL = "http://localhost:5000/api";

  // Fetch products from backend on initialization
  useEffect(() => {
    fetchAllProductsFromBackend();
  }, []);

  // Fetch all products from backend
  const fetchAllProductsFromBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products from backend:", error);
    } finally {
      setIsInitialized(true);
    }
  };

  const updateProduct = useCallback(async (productId, updates) => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) return;

      // This would require an admin endpoint to update products
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? { ...product, ...updates } : product
        )
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }, []);

  const deleteProduct = useCallback(async (productId) => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) return;

      // This would require an admin endpoint to delete products
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }, []);

  const addProduct = useCallback(async (productData) => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) return null;

      // This would require an admin endpoint to create products
      const newProduct = {
        _id: Date.now().toString(),
        ...productData,
        inStock: true,
      };
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (error) {
      console.error("Error adding product:", error);
      return null;
    }
  }, []);

  const getProductById = useCallback(
    (id) => {
      return products.find(
        (p) => p._id === id || p._id === String(id) || p.id === parseInt(id)
      );
    },
    [products]
  );

  const getProductsByCategory = useCallback(
    (category) => {
      return products.filter(
        (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    },
    [products]
  );

  const getAllProducts = useCallback(() => products, [products]);

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
        fetchAllProductsFromBackend,
        isInitialized,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
