import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { BuyNowProvider } from "./context/BuyNowContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <BuyNowProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <OrderProvider>
                  <App />
                </OrderProvider>
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </BuyNowProvider>
      </AuthProvider>
    </NotificationProvider>
  </StrictMode>,
);
