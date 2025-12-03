
export const SERVICES_DATA = [
  // 1. HAIR SERVICES
  { 
    id: 101, name: 'Haircut (Women)', category: 'Hair Services', subCategory: 'Hair Cut', price: 650, duration: 45, 
    description: 'A personalized haircut by our expert stylists to match your style and face shape.',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
    slots: 10, discount: 0, rating: 4.8, reviews: 120
  },
  { 
    id: 102, name: 'Haircut (Men)', category: 'Hair Services', subCategory: 'Hair Cut', price: 250, duration: 30, 
    description: 'A sharp, clean cut for the modern gentleman.',
    image: 'https://images.unsplash.com/photo-1599351431202-ac56d0422114?auto=format&fit=crop&q=80&w=800',
    slots: 15, discount: 0, rating: 4.9, reviews: 85
  },
  { 
    id: 103, name: 'Kids Haircut', category: 'Hair Services', subCategory: 'Hair Cut', price: 200, duration: 30, 
    description: 'A fun and friendly haircut experience for children under 12.',
    image: 'https://images.unsplash.com/photo-1503944383269-4d2d9ff645fe?auto=format&fit=crop&q=80&w=800',
    slots: 8, discount: 0, rating: 4.7, reviews: 40
  },
  { 
    id: 104, name: 'Beard Trim / Shave', category: 'Hair Services', subCategory: 'Beard Grooming', price: 150, duration: 20, 
    description: 'Expert shaping, trimming, or a classic clean shave.',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800',
    slots: 20, discount: 0, rating: 4.8, reviews: 60
  },
  { 
    id: 105, name: 'Hair Wash + Blow Dry', category: 'Hair Services', subCategory: 'Hair Styling', price: 500, duration: 30, 
    description: 'A refreshing wash followed by a professional blow dry for a polished look.',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800',
    slots: 10, discount: 0, rating: 4.6, reviews: 30
  },
  { 
    id: 106, name: 'Signature Hair Spa', category: 'Hair Services', subCategory: 'Hair Treatment', price: 1500, duration: 60, 
    description: 'An intensive conditioning treatment that nourishes and revitalizes your hair, leaving it soft and shiny.',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800',
    slots: 12, discount: 20, offerValidUntil: '2024-12-31', rating: 4.9, reviews: 200
  },
  { 
    id: 107, name: 'Head Massage', category: 'Hair Services', subCategory: 'Hair Treatment', price: 400, duration: 20, 
    description: 'A relaxing head massage to relieve stress and improve circulation.',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=800',
    slots: 15, discount: 0, rating: 4.8, reviews: 50
  },
  { 
    id: 108, name: 'Ironing / Curling', category: 'Hair Services', subCategory: 'Hair Styling', price: 750, duration: 45, 
    description: 'Temporary styling for special occasions, from sleek straight to bouncy curls.',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=800',
    slots: 8, discount: 0, rating: 4.5, reviews: 25
  },
  { 
    id: 109, name: 'Global Hair Color', category: 'Hair Services', subCategory: 'Hair Colouring', price: 3500, duration: 120, 
    description: 'Full head single-shade coloring for a vibrant, uniform look.',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800',
    slots: 5, discount: 10, rating: 4.7, reviews: 90
  },
  { 
    id: 110, name: 'Root Touch-up', category: 'Hair Services', subCategory: 'Hair Colouring', price: 1200, duration: 75, 
    description: 'Cover your roots and refresh your color seamlessly.',
    image: 'https://images.unsplash.com/photo-1620243127383-7b5387b32267?auto=format&fit=crop&q=80&w=800',
    slots: 10, discount: 0, rating: 4.6, reviews: 45
  },
  { 
    id: 111, name: 'Balayage', category: 'Hair Services', subCategory: 'Hair Colouring', price: 5000, duration: 180, 
    description: 'A free-hand painting technique for a natural, sun-kissed look.',
    image: 'https://images.unsplash.com/photo-1616099395912-4d2c88f9f688?auto=format&fit=crop&q=80&w=800',
    slots: 3, discount: 0, isMembersOnly: true, rating: 5.0, reviews: 15
  },
  { 
    id: 112, name: 'Keratin Treatment', category: 'Hair Services', subCategory: 'Hair Treatment', price: 4500, duration: 180, 
    description: 'Tame frizz and achieve silky smooth hair for months. A revolutionary smoothing treatment.',
    image: 'https://images.unsplash.com/photo-1599387737838-66155694248a?auto=format&fit=crop&q=80&w=800',
    slots: 4, discount: 5, rating: 4.8, reviews: 70
  },
  { 
    id: 113, name: 'Botox Hair Treatment', category: 'Hair Services', subCategory: 'Hair Treatment', price: 5500, duration: 150, 
    description: 'An intensive repairing treatment that fills in gaps in the hair fiber, leaving it strong and lustrous.',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800',
    slots: 2, discount: 10, rating: 4.9, reviews: 35
  },

  // 2. SKIN CARE
  { 
    id: 201, name: 'Brightening Facial', category: 'Skin Care', subCategory: 'Facial', price: 1800, duration: 60, 
    description: 'A facial designed to reduce pigmentation and bring out your natural radiance.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
    slots: 8, discount: 15, offerValidUntil: '2024-12-31', rating: 4.7, reviews: 88
  },
  { 
    id: 202, name: 'Gold Facial', category: 'Skin Care', subCategory: 'Facial', price: 2500, duration: 75, 
    description: 'Infused with 24k gold, this luxury facial provides an opulent glow and anti-ageing benefits.',
    image: 'https://images.unsplash.com/photo-1598421863542-a59a7a15a6b1?auto=format&fit=crop&q=80&w=800',
    slots: 5, discount: 0, isMembersOnly: true, rating: 4.9, reviews: 40
  },
  { 
    id: 203, name: 'Charcoal Detox Facial', category: 'Skin Care', subCategory: 'Facial', price: 2000, duration: 60, 
    description: 'Deeply cleanses and detoxifies the skin, removing impurities and excess oil for a clear complexion.',
    image: 'https://plus.unsplash.com/premium_photo-1679513342378-2103951ada1c?auto=format&fit=crop&q=80&w=800',
    slots: 10, discount: 0, rating: 4.6, reviews: 55
  },
  { 
    id: 204, name: 'De-Tan Pack (Face & Neck)', category: 'Skin Care', subCategory: 'De-Tan', price: 600, duration: 30, 
    description: 'Effectively removes tan and restores your natural skin tone.',
    image: 'https://images.unsplash.com/photo-1556228852-6d45a7d8a632?auto=format&fit=crop&q=80&w=800',
    slots: 15, discount: 0, rating: 4.5, reviews: 30
  },
  { 
    id: 205, name: 'Face Cleanup', category: 'Skin Care', subCategory: 'Cleanup', price: 800, duration: 45, 
    description: 'A quick yet effective cleanup to exfoliate and refresh your skin.',
    image: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&q=80&w=800',
    slots: 0, discount: 10, rating: 4.4, reviews: 20
  },

  // 3. HANDS & FEET CARE
  { 
    id: 301, name: 'Classic Manicure', category: 'Hands & Feet Care', subCategory: 'Manicure', price: 500, duration: 45, 
    description: 'Complete nail and cuticle care, finishing with a polish of your choice.',
    image: 'https://images.unsplash.com/photo-1632345031635-7b800099cdeb?auto=format&fit=crop&q=80&w=800',
    slots: 10, discount: 0, rating: 4.6, reviews: 40
  },
  { 
    id: 302, name: 'Spa Pedicure', category: 'Hands & Feet Care', subCategory: 'Pedicure', price: 900, duration: 60, 
    description: 'A luxurious pedicure with exfoliation, massage, and a nourishing mask.',
    image: 'https://images.unsplash.com/photo-1519415495209-76295304a37f?auto=format&fit=crop&q=80&w=800',
    slots: 8, discount: 10, rating: 4.8, reviews: 60
  },
  { 
    id: 303, name: 'Gel Polish Application', category: 'Hands & Feet Care', subCategory: 'Nail Polish', price: 700, duration: 45, 
    description: 'Long-lasting, chip-free gel polish in a variety of trendy shades.',
    image: 'https://images.unsplash.com/photo-1522337360797-4c0847f8a75e?auto=format&fit=crop&q=80&w=800',
    slots: 12, discount: 0, rating: 4.7, reviews: 50
  },

  // 4. BRIDAL & GROOMING
  { 
    id: 401, name: 'Bridal Makeup HD', category: 'Bridal & Grooming', subCategory: 'Makeup', price: 15000, duration: 180, 
    description: 'Flawless, high-definition makeup for the bride to look picture-perfect on her special day.',
    image: 'https://images.unsplash.com/photo-1615211912953-73138128919a?auto=format&fit=crop&q=80&w=800',
    slots: 2, discount: 0, isMembersOnly: true, rating: 5.0, reviews: 20
  },
  { 
    id: 402, name: 'Party Makeup', category: 'Bridal & Grooming', subCategory: 'Makeup', price: 3000, duration: 90, 
    description: 'A glamorous look for any party or event, tailored to your outfit and style.',
    image: 'https://images.unsplash.com/photo-1601758124467-24419b4def77?auto=format&fit=crop&q=80&w=800',
    slots: 10, discount: 0, rating: 4.8, reviews: 35
  },
  { 
    id: 403, name: 'Saree Draping', category: 'Bridal & Grooming', subCategory: 'Styling', price: 500, duration: 20, 
    description: 'Professional draping for a perfect and comfortable saree look.',
    image: 'https://images.unsplash.com/photo-1617196020537-add3c04297a7?auto=format&fit=crop&q=80&w=800',
    slots: 20, discount: 0, rating: 4.7, reviews: 15
  },

  // 5. WAXING
  { 
    id: 501, name: 'Full Legs Waxing (Rica)', category: 'Waxing', subCategory: 'Legs Waxing', price: 800, duration: 45, 
    description: 'Gentle and effective Rica waxing for smooth, hair-free legs.',
    image: 'https://images.unsplash.com/photo-1616941441916-94db75fce65c?auto=format&fit=crop&q=80&w=800',
    slots: 10, discount: 0, rating: 4.6, reviews: 65
  },
  { 
    id: 502, name: 'Full Arms & Underarms', category: 'Waxing', subCategory: 'Arms Waxing', price: 600, duration: 30, 
    description: 'Complete waxing for both arms and underarms for a clean look.',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=800',
    slots: 15, discount: 10, rating: 4.5, reviews: 50
  },

  // 6. THREADING
  { 
    id: 601, name: 'Eyebrows Threading', category: 'Threading', subCategory: 'Eyebrows', price: 50, duration: 10, 
    description: 'Precise eyebrow shaping to perfectly frame your face.',
    image: 'https://images.unsplash.com/photo-1596701062351-8c2c14d9aDD5?auto=format&fit=crop&q=80&w=800',
    slots: 30, discount: 0, rating: 4.8, reviews: 200
  },
  { 
    id: 602, name: 'Full Face Threading', category: 'Threading', subCategory: 'Full Face', price: 250, duration: 20, 
    description: 'Remove unwanted facial hair for a smooth, flawless finish.',
    image: 'https://images.unsplash.com/photo-1531750164672-b7a42337d6e8?auto=format&fit=crop&q=80&w=800',
    slots: 10, discount: 0, rating: 4.7, reviews: 80
  },
  
  // 7. NAIL STUDIO
  { 
    id: 701, name: 'Nail Extensions (Gel)', category: 'Nail Studio', subCategory: 'Extensions', price: 2500, duration: 120, 
    description: 'Add length and strength to your nails with durable and beautiful gel extensions.',
    image: 'https://images.unsplash.com/photo-1604338838656-2e1189d4c153?auto=format&fit=crop&q=80&w=800',
    slots: 4, discount: 10, rating: 4.8, reviews: 40
  },
  { 
    id: 702, name: 'Premium Nail Art', category: 'Nail Studio', subCategory: 'Nail Art', price: 800, duration: 60, 
    description: 'Intricate and creative designs by our nail artists to make a statement.',
    image: 'https://images.unsplash.com/photo-1615886311545-a74c4e70e34c?auto=format&fit=crop&q=80&w=800',
    slots: 6, discount: 0, rating: 4.9, reviews: 30
  },
  { 
    id: 703, name: 'Chrome Nails', category: 'Nail Studio', subCategory: 'Nail Art', price: 1200, duration: 75, 
    description: 'Get a futuristic, mirror-like finish with our stunning chrome nail application.',
    image: 'https://images.unsplash.com/photo-1519415495209-76295304a37f?auto=format&fit=crop&q=80&w=800',
    slots: 3, discount: 0, isMembersOnly: true, rating: 5.0, reviews: 10
  },
  
  // 8. PACKAGES
  {
    id: 801,
    name: 'Essential Grooming',
    category: 'Packages',
    subCategory: 'Combo',
    price: 1200,
    duration: 90,
    description: 'A complete grooming package to keep you looking sharp and refreshed.',
    includes: ['Haircut (Men)', 'Beard Trim / Shave', 'De-Tan Pack (Face & Neck)'],
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800',
    slots: 5,
    discount: 25,
    offerValidUntil: '2025-01-15',
    rating: 4.7,
    reviews: 60
  },
  {
    id: 802,
    name: 'Radiant Glow Combo',
    category: 'Packages',
    subCategory: 'Combo',
    price: 2500,
    duration: 120,
    description: 'Indulge in a session of pampering that leaves your skin glowing and your feet relaxed.',
    includes: ['Brightening Facial', 'Spa Pedicure', 'Eyebrows Threading'],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    slots: 3,
    discount: 20,
    rating: 4.8,
    reviews: 75
  },
  {
    id: 803,
    name: 'Ultimate Bridal Prep',
    category: 'Packages',
    subCategory: 'Bridal',
    price: 8000,
    duration: 240,
    description: 'A comprehensive package to prepare you for your big day, ensuring you look and feel your absolute best.',
    includes: ['Gold Facial', 'Full Body Waxing (Rica)', 'Spa Manicure', 'Spa Pedicure'],
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=800',
    slots: 2,
    discount: 15,
    isMembersOnly: true,
    rating: 5.0,
    reviews: 25
  }
];

export const USER_PROFILE_DATA = {
  name: "Alice Freeman",
  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  email: "alice.freeman@example.com",
  phone: "+91 9876 543 210",
  location: "Kanjirappally, KL",
  membership: {
    tier: 'Platinum',
    points: 2450,
    nextTier: 'Diamond',
    progress: 75,
    id: 'NAT-8734-2931',
    memberSince: '2022'
  },
  spends: {
    month: 4500,
    total: 28000
  }
};

export const SAVED_ADDRESSES_DATA = [
  { id: 1, type: 'Home', address: 'Loyola Arcade, Puthenangadi Jn, Kanjirappally, 686507', isDefault: true },
  { id: 2, type: 'Work', address: 'Cyber Park, Kozhikode, Kerala, 673016', isDefault: false },
];


// Single Shop Data
export const BRANCHES_DATA = [
  { 
    id: 1, 
    name: 'Naturals Kanjirappally', 
    city: 'Kanjirappally', 
    address: 'Loyola Arcade, Puthenangadi Jn, Tambalakkadu Road, Kanjirappally 686507', 
    phone: '+91 97444 88822', 
    email: 'kanjirappally@naturals.com',
    status: 'Open',
    image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=800'
  }
];

export const STAFF_DATA = [
  { id: 1, name: 'Jane Doe', role: 'Senior Stylist', image: 'https://i.pravatar.cc/150?u=1', rating: 4.9 },
  { id: 2, name: 'Stacy Lee', role: 'Dermatologist', image: 'https://i.pravatar.cc/150?u=2', rating: 4.8 },
  { id: 3, name: 'Robert Fox', role: 'Massage Therapist', image: 'https://i.pravatar.cc/150?u=3', rating: 4.7 },
  { id: 4, name: 'Priya Sharma', role: 'Hair Specialist', image: 'https://i.pravatar.cc/150?u=4', rating: 4.8 },
];

export const INVENTORY_DATA = [
  { id: 1, name: "L'Oreal Professional Shampoo", category: 'Hair Care', stock: 12, unit: 'Bottles', status: 'In Stock', threshold: 5 },
  { id: 2, name: "Wella Hair Color (Dark Brown)", category: 'Color', stock: 4, unit: 'Tubes', status: 'Low Stock', threshold: 5 },
  { id: 3, name: "O3+ Facial Kit", category: 'Skin Care', stock: 8, unit: 'Kits', status: 'In Stock', threshold: 3 },
  { id: 4, name: "Disposable Towels", category: 'Supplies', stock: 150, unit: 'Pieces', status: 'In Stock', threshold: 50 },
  { id: 5, name: "Keratin Treatment Serum", category: 'Hair Care', stock: 2, unit: 'Bottles', status: 'Critical', threshold: 3 },
  { id: 6, name: "Rica Wax (Chocolate)", category: 'Waxing', stock: 6, unit: 'Jars', status: 'In Stock', threshold: 2 },
];

export const INITIAL_APPOINTMENTS = [
  { 
    id: 1, 
    date: new Date().toISOString().split('T')[0], // Today
    time: '10:00 AM', 
    customer: 'Sarah Jenkins', 
    customerEmail: 'sarah@example.com',
    service: 'Signature Hair Spa', 
    status: 'Completed', 
    price: 1200, 
    staffId: 1,
    branchId: 1,
    notes: 'Allergic to lavender',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    rating: 5,
    review: "Amazing service as always!"
  },
  { 
    id: 2, 
    date: new Date().toISOString().split('T')[0], // Today
    time: '11:30 AM', 
    customer: 'Alice Freeman', 
    customerEmail: 'alice@example.com', // Matches demo user
    service: 'Haircut (Women)', 
    status: 'In Progress', 
    price: 650, 
    staffId: 3,
    branchId: 1,
    notes: 'Regular customer, wants layers.',
    paymentStatus: 'Pending',
    paymentMethod: 'Pay at Venue'
  },
  { 
    id: 3, 
    date: new Date().toISOString().split('T')[0], // Today
    time: '02:00 PM', 
    customer: 'Alice Freeman', 
    customerEmail: 'alice@example.com', // Matches demo user
    service: 'Gold Facial', 
    status: 'Scheduled', 
    price: 2500, 
    staffId: 2,
    branchId: 1,
    notes: 'First time for this facial.',
    paymentStatus: 'Paid',
    paymentMethod: 'Card' 
  },
  { 
    id: 4, 
    date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0], // Upcoming
    time: '04:00 PM', 
    customer: 'Alice Freeman', 
    customerEmail: 'alice@example.com',
    service: 'Classic Manicure', 
    status: 'Scheduled', 
    price: 500, 
    staffId: 4,
    branchId: 1,
    notes: '',
    paymentStatus: 'Pending',
    paymentMethod: 'Pay at Venue'
  },
  { 
    id: 5, 
    date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0], // Past
    time: '01:00 PM', 
    customer: 'Alice Freeman', 
    customerEmail: 'alice@example.com',
    service: 'Hair Wash + Blow Dry', 
    status: 'Completed', 
    price: 500, 
    staffId: 1,
    branchId: 1,
    notes: 'Completed',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    rating: 4,
    review: "Good service but slight delay."
  },
  { 
    id: 6, 
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], // Past
    time: '03:30 PM', 
    customer: 'Alice Freeman', 
    customerEmail: 'alice@example.com',
    service: 'Full Legs Waxing (Rica)', 
    status: 'Cancelled', 
    price: 800, 
    staffId: 2,
    branchId: 1,
    notes: 'User cancelled via phone.',
    paymentStatus: 'Refunded',
    paymentMethod: 'Card'
  }
];
