import { products as assetsProducts } from "../assets/assets";

const calculatePrice = (price, minPrice = 1000, maxPrice = 10000) => {
  const scaledPrice = minPrice + (price % (maxPrice - minPrice));
  return Math.round(Math.max(minPrice, Math.min(maxPrice, scaledPrice)));
};

export const PRODUCTS = assetsProducts.map((product, index) => {
  const finalPrice = calculatePrice(product.price);
  return {
    id: index + 1,
    name: product.name,
    category: product.category.toLowerCase(),
    image: product.image[0],
    price: finalPrice,
    old_price: Math.round(finalPrice * 1.3),
    description: product.description,
    rating: 4.5,
    reviews: Math.floor(Math.random() * 200) + 50,
    inStock: true,
    sizes: product.sizes,
    subCategory: product.subCategory,
    images: product.image,
  };
});

export const getProductById = (id) => PRODUCTS.find((p) => p.id === parseInt(id));

export const getProductsByCategory = (category) =>
  PRODUCTS.filter((p) => p.category.toLowerCase() === category.toLowerCase());