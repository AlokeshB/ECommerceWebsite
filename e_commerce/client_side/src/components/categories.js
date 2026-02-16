import { Shirt, User, Baby, DollarSign, Ruler } from 'lucide-react';

export const CATEGORIES = ["Men", "Women", "Kids"];

export const SUB_CATEGORIES = {
  Men: ["Topwear", "Bottomwear"],
  Women: ["Topwear", "Bottomwear", "Winterwear"],
  Kids: ["Topwear"],
};

export const CATEGORY_DATA = [
  {
    id: 'men',
    title: 'Men',
    icon: Shirt,
    subcategories: [
      { name: 'Topwear', types: ['T-Shirts', 'Shirts', 'Hoodies', 'Sweaters'] },
      { name: 'Bottomwear', types: ['Jeans', 'Trousers', 'Shorts', 'Chinos'] }
    ]
  },
  {
    id: 'women',
    title: 'Women',
    icon: User,
    subcategories: [
      { name: 'Topwear', types: ['T-Shirts', 'Shirts', 'Blouses', 'Crop Tops'] },
      { name: 'Bottomwear', types: ['Jeans', 'Trousers', 'Skirts', 'Shorts'] },
      { name: 'Winterwear', types: ['Jackets', 'Coats', 'Sweaters', 'Cardigans'] }
    ]
  },
  {
    id: 'kids',
    title: 'Kids',
    icon: Baby,
    subcategories: [
      { name: 'Topwear', types: ['T-Shirts', 'Shirts', 'Hoodies', 'Sweaters'] }
    ]
  }
];

export const TECHNICAL_FILTERS = [
  { title: 'Size', icon: Ruler, options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { title: 'Price', icon: DollarSign, options: ['Under ₹1000', '₹1000 - ₹2000', '₹2000 - ₹3000', '₹3000 - ₹5000', 'Above ₹5000'] }
];