import { 
  Shirt, User, Baby, Star, RefreshCw, 
  Scissors, Layers, Activity, Snowflake, Globe 
} from 'lucide-react';

export const CATEGORY_DATA = [
  {
    id: 'women',
    title: 'Women',
    icon: User, // Lucide Component reference
    subcategories: [
      { name: 'Dresses', types: ['A-Line', 'Bodycon', 'Wrap', 'Shift', 'Shirt Dress', 'Blazer Dress', 'Maxi', 'Slip', 'Babydoll'] },
      { name: 'Top Wear', types: ['T-Shirts', 'Shirts', 'Crop Tops', 'Blouses', 'Bodysuits'] },
      { name: 'Bottom Wear', types: ['Jeans', 'Trousers', 'Skirts', 'Shorts'] }
    ]
  },
  {
    id: 'men',
    title: 'Men',
    icon: Shirt,
    subcategories: [
      { name: 'Top Wear', types: ['T-Shirts', 'Formal Shirts', 'Flannel', 'Polo'] },
      { name: 'Bottom Wear', types: ['Jeans', 'Chinos', 'Formal Slacks', 'Cargos'] },
      { name: 'Outerwear', types: ['Denim Jackets', 'Bomber', 'Coats'] }
    ]
  },
  {
    id: 'kids',
    title: 'Kids',
    icon: Baby,
    subcategories: [
      { name: 'Age Groups', types: ['Infants (0-2Y)', 'Toddlers (2-5Y)', 'Teens (13+)'] },
      { name: 'Clothing', types: ['Onesies', 'School Gear', 'Party Wear'] }
    ]
  },
  {
    id: 'occasion',
    title: 'Occasion',
    icon: Star,
    subcategories: [
      { name: 'Events', types: ['Wedding Guest', 'Workwear', 'Vacation', 'Party'] }
    ]
  },
  {
    id: 'sustainability',
    title: 'Sustainability',
    icon: RefreshCw,
    subcategories: [
      { name: 'Eco-Friendly', types: ['Pre-loved', 'Organic Cotton', 'Upcycled'] }
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