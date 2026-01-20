import {
  Shirt, User, Baby, Star, RefreshCw,
  Scissors, Layers, Activity, Snowflake, Globe
} from 'lucide-react';
 
export const CATEGORY_DATA = [
  {
    id: 'women',
    title: 'Women',
    icon: User,
    subcategories: [
      { name: 'Blouses', types: ['Striped', 'Solid', 'Printed', 'Flutter Sleeve', 'Peplum', 'Wrap'] },
      { name: 'Top Wear', types: ['T-Shirts', 'Shirts', 'Crop Tops', 'Tunics'] },
      { name: 'Bottom Wear', types: ['Jeans', 'Trousers', 'Skirts', 'Shorts'] }
    ]
  },
  {
    id: 'men',
    title: 'Men',
    icon: Shirt,
    subcategories: [
      { name: 'Jackets & Outerwear', types: ['Bomber Jackets', 'Denim Jackets', 'Coats', 'Blazers'] },
      { name: 'Top Wear', types: ['T-Shirts', 'Formal Shirts', 'Polo Shirts', 'Hoodies'] },
      { name: 'Bottom Wear', types: ['Jeans', 'Chinos', 'Trousers', 'Shorts'] }
    ]
  },
  {
    id: 'kids',
    title: 'Kids',
    icon: Baby,
    subcategories: [
      { name: 'Sweatshirts & Hoodies', types: ['Hooded Sweatshirts', 'Crew Neck', 'Zip-up'] },
      { name: 'Clothing', types: ['T-Shirts', 'Shorts', 'Pants', 'Dresses'] },
      { name: 'Seasonal', types: ['Summer Wear', 'Winter Wear', 'Monsoon Wear'] }
    ]
  }
];

export const TECHNICAL_FILTERS = [
  {
    title: 'Fabric',
    icon: Layers,
    options: ['Cotton', 'Linen', 'Recycled Poly', 'Vegan Leather', 'Silk']
  },
  {
    title: 'Fit',
    icon: Scissors,
    options: ['Petite', 'Plus Size', 'Tall', 'Oversized', 'Slim Fit']
  },
  {
    title: 'Aesthetic',
    icon: Globe,
    options: ['Quiet Luxury', 'Streetwear', 'Y2K', 'Cottagecore', 'Minimalist']
  },
  {
    title: 'Pattern',
    icon: Activity,
    options: ['Floral', 'Solid', 'Animal Print', 'Striped', 'Checks']
  }
];