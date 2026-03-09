import React, { createContext, useContext, useState } from "react";

const BuyNowContext = createContext();

export const useBuyNow = () => useContext(BuyNowContext);

export const BuyNowProvider = ({ children }) => {
  const [buyNowItem, setBuyNowItem] = useState(null);

  const setBuyNowProduct = (product) => {
    setBuyNowItem(product);
  };

  const clearBuyNow = () => {
    setBuyNowItem(null);
  };

  return (
    <BuyNowContext.Provider
      value={{
        buyNowItem,
        setBuyNowProduct,
        clearBuyNow,
      }}
    >
      {children}
    </BuyNowContext.Provider>
  );
};
