import { products as assetsProducts } from "../assets/assets";

// Map the assets products to our product format with unique numeric IDs
export const PRODUCTS = assetsProducts.map((product, index) => {
  // Calculate price between 1000-10000 rupees based on original price
  const minPrice = 1000;
  const maxPrice = 10000;
  const scaledPrice = minPrice + (product.price % (maxPrice - minPrice));
  const finalPrice = Math.max(minPrice, Math.min(maxPrice, scaledPrice));
  
  return {
    id: index + 1,
    name: product.name,
    category: product.category.toLowerCase(),
    image: product.image[0], // Use first image from the array
    price: Math.round(finalPrice),
    old_price: Math.round(finalPrice * 1.3), // Calculate old price as 30% more
    description: product.description,
    rating: 4.5,
    reviews: Math.floor(Math.random() * 200) + 50,
    inStock: true,
    sizes: product.sizes,
    subCategory: product.subCategory,
    images: product.image, // All images for the product
  };
});

export const getProductById = (id) => {
  return PRODUCTS.find((product) => product.id === parseInt(id));
};

export const getProductsByCategory = (category) => {
  return PRODUCTS.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
};
