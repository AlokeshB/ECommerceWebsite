import { Shirt, User, Baby, DollarSign, Ruler } from 'lucide-react';

export const CATEGORIES = ["Men", "Women", "Kids"];

export const SUB_CATEGORIES = {
  Men: ["Topwear", "Bottomwear"],
  Women: ["Topwear", "Bottomwear", "Winterwear"],
  Kids: ["Topwear"],
};

// Size options for different categories
export const SIZE_OPTIONS = {
  Men: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  Women: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  Kids: [
    '0-6 months',
    '6-12 months',
    '12-18 months',
    '18-24 months',
    '2-3 years',
    '3-4 years',
    '4-5 years',
    '5-6 years',
    '6-7 years',
    '7-8 years',
    '8-9 years',
    '9-10 years',
    '10-11 years',
    '11-12 years'
  ]
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