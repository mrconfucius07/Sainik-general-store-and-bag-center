export type ProductColor = { name: string; hex: string; imageIndex?: number };
export type ProductReview = {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: "Bags" | "Trolley" | "Stationery" | "Gifts" | "Accessories";
  subcategory: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  colors: ProductColor[];
  materials: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  inStock: boolean;
  stock: number;
  tags: string[];
  dimensions: string;
  weight: string;
  reviews: ProductReview[];
  specifications: { label: string; value: string }[];
};

export const categories = [
  { id: "Bags", name: "Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop", count: 12, description: "School, college & office" },
  { id: "Trolley", name: "Trolley Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80", count: 8, description: "Travel in style" },
  { id: "Stationery", name: "Stationery", image: "https://images.unsplash.com/photo-1516410529446-2c777cb7366d?w=800&auto=format&fit=crop", count: 10, description: "Pens, diaries & art" },
  { id: "Gifts", name: "Gift Items", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop", count: 9, description: "For every occasion" },
  { id: "Accessories", name: "Accessories", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop", count: 7, description: "Essentials & more" },
];

export const products: Product[] = [
  {
    id: "1",
    slug: "wildcraft-school-backpack-45l",
    name: "Wildcraft Bravo 45L School Backpack",
    description: "Rugged school backpack with rain cover & padded laptop sleeve. Built for all-weather Indian school runs.",
    longDescription: "The Sainik bestseller. Crafted with 900D water-resistant polyester, this backpack features 3 main compartments, ergonomic S-curve shoulder straps, chest strap, and a hidden rain cover at the base. Thoughtfully designed for Class 6-12 students carrying heavy books. Sweat-free back padding keeps you cool in summers.\n\nIncludes: 1 backpack, 1 rain cover, 2-year Wildcraft warranty card.",
    category: "Bags",
    subcategory: "School Bags",
    brand: "Wildcraft",
    price: 2199,
    originalPrice: 3499,
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546938576-6e6a64f458ae?w=900&auto=format&fit=crop",
    ],
    colors: [
      { name: "Navy Blue", hex: "#1e3a8a", imageIndex: 0 },
      { name: "Charcoal Black", hex: "#1f2937" },
      { name: "Olive Green", hex: "#3f6212" },
    ],
    materials: "900D Polyester + Rain Cover",
    rating: 4.7,
    reviewCount: 342,
    featured: true,
    bestseller: true,
    newArrival: false,
    inStock: true,
    stock: 48,
    tags: ["school", "waterproof", "laptop"],
    dimensions: "48 x 32 x 22 cm",
    weight: "850g",
    specifications: [
      { label: "Capacity", value: "45 Litres" },
      { label: "Compartments", value: "4 + Rain Cover" },
      { label: "Laptop Sleeve", value: "15.6 inch padded" },
      { label: "Warranty", value: "2 Years" },
    ],
    reviews: [
      { id: "r1", author: "Priya S.", avatar: "PS", rating: 5, title: "Perfect for my son", comment: "Bought for my son in 9th standard. Stitching is superb, rain cover saved books during Mumbai rains. Sainik General Store gave great discount!", date: "2024-12-02", verified: true },
      { id: "r2", author: "Amit K.", avatar: "AK", rating: 4, title: "Spacious", comment: "Can easily carry 10 books + lunch + bottle. Zips are smooth. Slightly heavy when empty but worth it.", date: "2024-11-18", verified: true },
    ],
  },
  {
    id: "2",
    slug: "safari-56cm-cabin-trolley",
    name: "Safari Pentagon 56cm Cabin Trolley",
    description: "Lightweight hard-shell cabin trolley with TSA lock & 8 spinner wheels. 3-year international warranty.",
    longDescription: "Fly light, fly smart. The Pentagon trolley is made from 100% Polycarbonate with a scratch-resistant texture. 8-wheel 360° spinner system glides silently through airports. Expands 20% extra space when needed. Interior cross-straps and mesh divider keep clothes neat.",
    category: "Trolley",
    subcategory: "Cabin Trolley",
    brand: "Safari",
    price: 4499,
    originalPrice: 8999,
    images: [
      "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&auto=format&fit=crop",
    ],
    colors: [
      { name: "Slate Grey", hex: "#6b7280" },
      { name: "Midnight Blue", hex: "#172554" },
      { name: "Wine Red", hex: "#881337" },
    ],
    materials: "100% Polycarbonate",
    rating: 4.8,
    reviewCount: 218,
    featured: true,
    bestseller: true,
    newArrival: true,
    inStock: true,
    stock: 22,
    tags: ["travel", "trolley", "cabin"],
    dimensions: "56 x 36 x 24 cm",
    weight: "2.6kg",
    specifications: [
      { label: "Material", value: "Polycarbonate Hard Shell" },
      { label: "Wheels", value: "8 Spinner 360°" },
      { label: "Lock", value: "TSA Combination" },
      { label: "Warranty", value: "3 Years Global" },
    ],
    reviews: [
      { id: "r3", author: "Rohan M.", avatar: "RM", rating: 5, title: "Airport eye-catcher", comment: "Used for Delhi-Goa flight, cabin approved, handled rough handling well. Wheels are butter smooth.", date: "2024-12-10", verified: true },
    ],
  },
  {
    id: "3",
    slug: "skybags-college-backpack",
    name: "Skybags Brat 28L College Backpack + Pouch",
    description: "Street-style college backpack with front organizer, bottle pockets & detachable coin pouch.",
    longDescription: "Made for campus life. The Brat series brings bold colors and reflective strips for night safety. Padded back, breathable mesh, and cushioned handle. Front zip organizer for chargers, keys, stationery. Includes matching detachable pouch for earbuds/cards.",
    category: "Bags",
    subcategory: "College Backpacks",
    brand: "Skybags",
    price: 1899,
    originalPrice: 2799,
    images: [
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=900&auto=format&fit=crop",
    ],
    colors: [
      { name: "Mustard Yellow", hex: "#ca8a04" },
      { name: "Coral Pink", hex: "#f472b6" },
      { name: "Jet Black", hex: "#111827" },
    ],
    materials: "Polyester + Mesh",
    rating: 4.5,
    reviewCount: 412,
    featured: true,
    bestseller: false,
    newArrival: true,
    inStock: true,
    stock: 65,
    tags: ["college", "youth", "pouch"],
    dimensions: "45 x 29 x 19 cm",
    weight: "650g",
    specifications: [
      { label: "Capacity", value: "28 Litres" },
      { label: "Laptop Compart", value: "14 inch" },
      { label: "Pockets", value: "5 inclusive" },
    ],
    reviews: [
      { id: "r4", author: "Sneha T.", avatar: "ST", rating: 5, title: "Stylish + Spacious", comment: "Got many compliments in college. Fits laptop + 3 notebooks easily. Sainik staff helped pick color.", date: "2024-12-01", verified: true },
    ],
  },
  {
    id: "4",
    slug: "american-tourister-75cm-large",
    name: "American Tourister Ivy 75cm Large Check-in",
    description: "Premium check-in spinner for family vacations. Expandable, anti-theft zippers, 5-year warranty.",
    longDescription: "The vacation workhorse. 75cm large size holds 15 days of family packing. Double-rod trolley handle, top & side grab handles. Interior laundry bag, shoe pocket. Tested for 200km trolley drag.",
    category: "Trolley",
    subcategory: "Large Check-in",
    brand: "American Tourister",
    price: 6999,
    originalPrice: 12499,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop",
    ],
    colors: [
      { name: "Forest Green", hex: "#14532d" },
      { name: "Navy", hex: "#1e1b4b" },
    ],
    materials: "Polypropylene + Polyester",
    rating: 4.9,
    reviewCount: 89,
    featured: true,
    bestseller: true,
    newArrival: false,
    inStock: true,
    stock: 14,
    tags: ["large", "family", "travel"],
    dimensions: "75 x 50 x 31 cm",
    weight: "3.9kg",
    specifications: [
      { label: "Capacity", value: "98 Litres" },
      { label: "Expandable", value: "Yes + 15%" },
      { label: "Wheels", value: "Double spinner" },
    ],
    reviews: [
      { id: "r5", author: "Vikram P.", avatar: "VP", rating: 5, title: "Dubai trip approved", comment: "Checked in this beast, zero damage. Huge space. Worth every rupee from Sainik store.", date: "2024-11-22", verified: true },
    ],
  },
  {
    id: "5",
    slug: "classmate-pulse-diary-gift-set",
    name: "Classmate Pulse Designer Diary Gift Set",
    description: "Hardbound A5 diary with premium pen + metal bookmark. Perfect corporate gifting idea under ₹1000.",
    longDescription: "Crafted for thinkers. 180 GSM natural shade paper, elastic closure, ribbon bookmark, pen loop. Includes Pulse metal ball pen with German ink. Ideal for New Year gifting, employee welcome kits, teachers day. Custom name printing available at Sainik store counter.",
    category: "Stationery",
    subcategory: "Diaries & Planners",
    brand: "Classmate",
    price: 849,
    originalPrice: 1199,
    images: [
      "https://images.unsplash.com/photo-1516410529446-2c777cb7366d?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=900&auto=format&fit=crop",
    ],
    colors: [
      { name: "Tan Brown", hex: "#92400e" },
      { name: "Midnight Black", hex: "#0f172a" },
    ],
    materials: "PU Leather + Paper",
    rating: 4.6,
    reviewCount: 156,
    featured: false,
    bestseller: true,
    newArrival: false,
    inStock: true,
    stock: 120,
    tags: ["diary", "gift", "corporate"],
    dimensions: "A5 - 21 x 14cm",
    weight: "420g",
    specifications: [
      { label: "Pages", value: "192 ruled" },
      { label: "Paper", value: "180 GSM Natural" },
      { label: "Includes", value: "Diary + Pen + Bookmark" },
    ],
    reviews: [
      { id: "r6", author: "Anjali R.", avatar: "AR", rating: 5, title: "Loved it", comment: "Gifted to my team, everyone loved quality. Paper doesn't bleed.", date: "2024-12-05", verified: true },
    ],
  },
  {
    id: "6",
    slug: "lavie-hobo-handbag-maroon",
    name: "Lavie Maroon Hobo Handbag – Gini Collection",
    description: "Chic hobo bag with detachable sling, gold hardware & 3 compartments. The festive essential.",
    longDescription: "Where traditional meets trendy. Soft faux leather with pebbled texture, anti-scratch lining, key hook, mobile pocket. Perfect for weddings, office and everyday ethnic wear. Comes in Lavie dustbag.",
    category: "Bags",
    subcategory: "Handbags",
    brand: "Lavie",
    price: 2799,
    originalPrice: 4999,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&auto=format&fit=crop",
    ],
    colors: [
      { name: "Wine Maroon", hex: "#7f1d1d" },
      { name: "Beige Nude", hex: "#d6c7b8" },
      { name: "Black", hex: "#000000" },
    ],
    materials: "Vegan Leather",
    rating: 4.7,
    reviewCount: 203,
    featured: true,
    bestseller: true,
    newArrival: true,
    inStock: true,
    stock: 37,
    tags: ["handbag", "women", "festive"],
    dimensions: "30 x 24 x 12 cm",
    weight: "580g",
    specifications: [
      { label: "Closure", value: "Magnetic + Zip" },
      { label: "Strap", value: "Detachable Sling" },
      { label: "Compartments", value: "3 + 2 pockets" },
    ],
    reviews: [
      { id: "r7", author: "Meera J.", avatar: "MJ", rating: 5, title: "Goes with saree", comment: "Wore for Diwali dinner, got many compliments. Quality top notch.", date: "2024-11-10", verified: true },
    ],
  },
  {
    id: "7",
    slug: "parker-jotter-pen-set",
    name: "Parker Jotter Stainless Steel Ball Pen Set",
    description: "Legendary Parker Jotter duo – Blue & Black. Ideal gift for promotions & farewells.",
    longDescription: "The gift that speaks respect. Parker Jotter with iconic arrow clip, stainless steel barrel, Quinkflow refill for ultra-smooth writing. Presented in premium Parker gift box. Engraving available at Sainik store.",
    category: "Stationery",
    subcategory: "Premium Pens",
    brand: "Parker",
    price: 3199,
    originalPrice: 3899,
    images: [
      "https://images.unsplash.com/photo-1583484963886-cfe2bff2945f?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568205612837-017257d2310a?w=900&auto=format&fit=crop",
    ],
    colors: [
      { name: "Stainless Steel", hex: "#9ca3af" },
      { name: "Matte Black", hex: "#111827" },
    ],
    materials: "Stainless Steel Brass",
    rating: 4.9,
    reviewCount: 98,
    featured: true,
    bestseller: false,
    newArrival: false,
    inStock: true,
    stock: 25,
    tags: ["parker", "gift", "pen"],
    dimensions: "13.8cm length",
    weight: "85g set",
    specifications: [
      { label: "Ink", value: "Blue + Black Quinkflow" },
      { label: "Box", value: "Premium Gift Box" },
      { label: "Engraving", value: "Free at store" },
    ],
    reviews: [
      { id: "r8", author: "Suresh B.", avatar: "SB", rating: 5, title: "Best boss gift", comment: "Gifted to my retiring boss, he was emotional. Parker never fails.", date: "2024-12-08", verified: true },
    ],
  },
  {
    id: "8",
    slug: "gift-hamper-festive-dry-fruit-box",
    name: "Sainik Special Dry Fruit & Choco Gift Hamper",
    description: "Curated festive hamper – 400g dry fruits, Ferrero Rocher, scented candle & greeting card in jute basket.",
    longDescription: "Our signature festive bestseller. Handmade jute basket with reusable design, almonds, cashews, raisins from Kashmir, 8 Ferrero Rocher, soy wax candle with vanilla scent, and handmade Diwali card. Same-day gift wrapping at store.",
    category: "Gifts",
    subcategory: "Festive Hampers",
    brand: "Sainik Special",
    price: 1499,
    originalPrice: 1999,
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=900&auto=format&fit=crop",
    ],
    colors: [
      { name: "Natural Jute", hex: "#d4a373" },
    ],
    materials: "Jute, Glass, Cardboard",
    rating: 4.8,
    reviewCount: 274,
    featured: true,
    bestseller: true,
    newArrival: true,
    inStock: true,
    stock: 40,
    tags: ["festive", "diwali", "hamper"],
    dimensions: "30 x 20 x 15 cm",
    weight: "1.2kg",
    specifications: [
      { label: "Contents", value: "Dry fruits + Choco + Candle" },
      { label: "Basket", value: "Reusable Jute" },
      { label: "Shelf Life", value: "6 months (dry fruits)" },
    ],
    reviews: [
      { id: "r9", author: "Kavita L.", avatar: "KL", rating: 5, title: "Client loved it", comment: "Ordered 12 hampers for clients, premium look. Sainik delivered on time.", date: "2024-11-15", verified: true },
    ],
  },
  {
    id: "9",
    slug: "wildcraft-wallet-brown",
    name: "Wildcraft RFID Leather Wallet – Whiskey Brown",
    description: "Genuine leather wallet with RFID blocking, 8 card slots & 2 hidden pockets.",
    longDescription: "Security meets style. Full-grain nappa leather, RFID blocking lining protects cards from skimming. Quick-access slot for metro card, hidden pocket for emergency cash. Ages beautifully. Comes in Wildcraft gift box.",
    category: "Accessories",
    subcategory: "Wallets",
    brand: "Wildcraft",
    price: 1299,
    originalPrice: 1999,
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop",
    ],
    colors: [
      { name: "Whiskey Brown", hex: "#78350f" },
      { name: "Classic Black", hex: "#111827" },
    ],
    materials: "Genuine Leather",
    rating: 4.6,
    reviewCount: 167,
    featured: false,
    bestseller: true,
    newArrival: false,
    inStock: true,
    stock: 80,
    tags: ["wallet", "men", "leather"],
    dimensions: "11.5 x 9 x 2 cm",
    weight: "120g",
    specifications: [
      { label: "Leather", value: "Nappa Full Grain" },
      { label: "Card Slots", value: "8 + 2" },
      { label: "RFID", value: "Yes, blocking" },
    ],
    reviews: [
      { id: "r10", author: "Deepak S.", avatar: "DS", rating: 4, title: "Good leather", comment: "Smells real, stitching good. Using daily since 3 months.", date: "2024-11-28", verified: true },
    ],
  },
  {
    id: "10",
    slug: "safari-kids-trolley-spiderman",
    name: "Safari Kids 14\" Trolley – Marvel Spider-Man",
    description: "Lightweight kids trolley with 3D Spider-Man face, wheels & retractable handle. Class 1-4 approved.",
    longDescription: "Make school fun. Hard front shell with 3D effect, soft back for comfort, reflective safety strips. Trolley handle retracts fully for backpack mode. Water bottle pockets both sides.",
    category: "Trolley",
    subcategory: "Kids Trolley",
    brand: "Safari",
    price: 2499,
    originalPrice: 3299,
    images: [
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&auto=format&fit=crop",
    ],
    colors: [
      { name: "Spider Red", hex: "#dc2626" },
      { name: "Batman Black", hex: "#1f2937" },
    ],
    materials: "EVA + Polyester",
    rating: 4.8,
    reviewCount: 321,
    featured: true,
    bestseller: true,
    newArrival: false,
    inStock: true,
    stock: 30,
    tags: ["kids", "trolley", "marvel"],
    dimensions: "36 x 28 x 16 cm",
    weight: "1.1kg",
    specifications: [
      { label: "Recommended", value: "Class 1-4" },
      { label: "Wheels", value: "2 roller skate wheels" },
      { label: "Character", value: "Licensed Marvel" },
    ],
    reviews: [
      { id: "r11", author: "Nisha G.", avatar: "NG", rating: 5, title: "Son loves it", comment: "My 7 yr old pulls it himself, light and cool Spider-Man design.", date: "2024-12-03", verified: true },
    ],
  },
  {
    id: "11",
    slug: "milton-lunch-box-office",
    name: "Milton ProLunch 3-Tier Office Tiffin + Bag",
    description: "Microwave-safe steel tiffin with insulated bag. Keeps food warm 4 hours. Office essential.",
    longDescription: "Ghar ka khana, garam. Stainless steel 304, BPA-free lids with silicone seal – no spills in bag. Insulated fabric bag with bottle pocket. Sainik top seller for office crowd.",
    category: "Accessories",
    subcategory: "Lunch Bags",
    brand: "Milton",
    price: 999,
    originalPrice: 1499,
    images: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&auto=format&fit=crop",
    ],
    colors: [
      { name: "Steel Silver", hex: "#d1d5db" },
      { name: "Blue Dot", hex: "#1e40af" },
    ],
    materials: "Steel + Fabric",
    rating: 4.5,
    reviewCount: 512,
    featured: false,
    bestseller: true,
    newArrival: false,
    inStock: true,
    stock: 95,
    tags: ["lunch", "office", "tiffin"],
    dimensions: "19 x 13 x 19 cm",
    weight: "840g",
    specifications: [
      { label: "Containers", value: "3 x 280ml" },
      { label: "Material", value: "304 Stainless Steel" },
      { label: "Insulation", value: "4 hours hot/cold" },
    ],
    reviews: [
      { id: "r12", author: "Ramesh K.", avatar: "RK", rating: 4, title: "No leak", comment: "Using for 6 months, no leak, bag quality good.", date: "2024-11-29", verified: true },
    ],
  },
  {
    id: "12",
    slug: "art-supply-acrylic-set-48",
    name: "Faber-Castell 48-Shade Acrylic Paint Set + Brushes",
    description: "Artist-grade acrylic colors with 3 brushes + palette. Gift for creative kids & adults.",
    longDescription: "Vibrant, non-toxic, quick-dry acrylics. Perfect for canvas, wood, terracotta. Kit includes 48 x 12ml tubes, flat + round + filbert brushes, palette knife and 35cm x 25cm palette. Recommended by art teachers.",
    category: "Stationery",
    subcategory: "Art Supplies",
    brand: "Faber-Castell",
    price: 2199,
    originalPrice: 3199,
    images: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=900&auto=format&fit=crop",
    ],
    colors: [
      { name: "Multi", hex: "#f59e0b" },
    ],
    materials: "Acrylic + Wood",
    rating: 4.8,
    reviewCount: 73,
    featured: true,
    bestseller: false,
    newArrival: true,
    inStock: true,
    stock: 18,
    tags: ["art", "paint", "gift"],
    dimensions: "38 x 26 x 6 cm",
    weight: "1.4kg",
    specifications: [
      { label: "Shades", value: "48 x 12ml" },
      { label: "Brushes", value: "3 Professional" },
      { label: "Non-toxic", value: "Yes, ASTM certified" },
    ],
    reviews: [
      { id: "r13", author: "Aarav P.", avatar: "AP", rating: 5, title: "Pro quality", comment: "Colors are super pigmented, daughter loves it for school art competition.", date: "2024-12-06", verified: true },
    ],
  },
];

export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug);
export const getProductById = (id: string) => products.find(p => p.id === id);
