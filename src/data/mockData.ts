import { Car, ServicePackage, ServiceBooking, CustomerInquiry, CustomerReview, BlogPost } from '../types';

export const INITIAL_CARS: Car[] = [
  {
    id: 'car-1',
    title: 'Mercedes-Benz S580 4MATIC Sedan',
    make: 'Mercedes-Benz',
    model: 'S580 4MATIC',
    year: 2024,
    priceNGN: 145000000,
    priceUSD: 95000,
    mileage: 1800,
    condition: 'Brand New',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    bodyType: 'Sedan',
    engine: '4.0L V8 Biturbo with EQ Boost',
    horsepower: 496,
    acceleration: '4.4s (0-100 km/h)',
    exteriorColor: 'Obsidian Black Metallic',
    interiorColor: 'Nappa Exclusive Sienna Brown',
    vin: 'W1KZF8HB3PA982110',
    features: [
      'Burmester 4D High-End Surround Sound',
      'Rear-Axle Steering (4.5 degrees)',
      'MBUX Augmented Reality Head-Up Display',
      'Active Multicontour Front & Rear Seats with Hot-Stone Massage',
      'Executive Rear Seating Package with Footrest',
      'Panoramic Sliding Sunroof'
    ],
    imageUrl: '/src/assets/images/laye_luxury_sedan_1790849513464.jpg',
    status: 'Available',
    featured: true
  },
  {
    id: 'car-2',
    title: 'Range Rover Autobiography LWB',
    make: 'Land Rover',
    model: 'Range Rover Autobiography',
    year: 2023,
    priceNGN: 178000000,
    priceUSD: 118000,
    mileage: 6200,
    condition: 'Certified Pre-Owned',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'SUV',
    engine: '4.4L Twin-Turbocharged V8',
    horsepower: 523,
    acceleration: '4.6s (0-100 km/h)',
    exteriorColor: 'Ostuini Pearl White',
    interiorColor: 'Perforated Semi-Aniline Deep Garnet',
    vin: 'SALWR2V44PA734912',
    features: [
      'Electronic Air Suspension with Dynamic Response Pro',
      'Meridian Signature 35-Speaker 1600W Sound System',
      'Executive Class Comfort-Plus Rear Seats',
      'ClearSight Digital Rear-View Mirror',
      '23-inch Style 1075 Gloss Black Alloy Wheels',
      'Soft Door Close & Hands-Free Power Gesture Tailgate'
    ],
    imageUrl: '/src/assets/images/laye_premium_suv_1790849524175.jpg',
    status: 'Available',
    featured: true
  },
  {
    id: 'car-3',
    title: 'Porsche 911 Carrera GTS Coupe',
    make: 'Porsche',
    model: '911 Carrera GTS',
    year: 2024,
    priceNGN: 162000000,
    priceUSD: 108000,
    mileage: 950,
    condition: 'Brand New',
    transmission: 'Dual-Clutch',
    fuelType: 'Petrol',
    bodyType: 'Coupe',
    engine: '3.0L Twin-Turbo Boxer 6-Cylinder',
    horsepower: 473,
    acceleration: '3.3s (0-100 km/h)',
    exteriorColor: 'Shark Blue Metallic',
    interiorColor: 'Race-Tex with Carmine Red Stitching',
    vin: 'WP0AB2A97RS192834',
    features: [
      'Porsche Ceramic Composite Brakes (PCCB)',
      'Sport Chrono Package with Mode Switch',
      'PASM Sport Suspension (-10mm lower ride height)',
      'Sport Exhaust System with Tailpipes in High-Gloss Black',
      'LED Matrix Headlights in Black with PDLS Plus',
      'Front Axle Hydraulic Lift System'
    ],
    imageUrl: '/src/assets/images/laye_sport_coupe_1790849536287.jpg',
    status: 'Available',
    featured: true
  },
  {
    id: 'car-4',
    title: 'Toyota Land Cruiser 300 VXR VIP',
    make: 'Toyota',
    model: 'Land Cruiser 300 VXR',
    year: 2024,
    priceNGN: 135000000,
    priceUSD: 90000,
    mileage: 3400,
    condition: 'Certified Pre-Owned',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'SUV',
    engine: '3.5L Twin-Turbo V6 (V35A-FTS)',
    horsepower: 409,
    acceleration: '6.7s (0-100 km/h)',
    exteriorColor: 'Precious White Pearl',
    interiorColor: 'Beige & Black Luxury Leather',
    vin: 'JTMAB03J7N4029481',
    features: [
      'Adaptive Variable Suspension (AVS)',
      'Multi-Terrain Monitor with Underfloor View',
      'Cooler Box in Center Console',
      'JBL Synthesis 14-Speaker Premium Audio',
      'Dual Rear Seat Entertainment Screens (11.6-inch)',
      'Pre-Collision System & Dynamic Radar Cruise'
    ],
    imageUrl: '/src/assets/images/laye_premium_suv_1790849524175.jpg',
    status: 'Available',
    featured: false
  },
  {
    id: 'car-5',
    title: 'Audi Q7 55 TFSI Quattro S-Line',
    make: 'Audi',
    model: 'Q7 55 TFSI',
    year: 2023,
    priceNGN: 89000000,
    priceUSD: 59000,
    mileage: 14200,
    condition: 'Certified Pre-Owned',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    bodyType: 'SUV',
    engine: '3.0L Turbocharged V6 with 48V MHEV',
    horsepower: 335,
    acceleration: '5.6s (0-100 km/h)',
    exteriorColor: 'Floret Silver Metallic',
    interiorColor: 'Valcona Black Diamond Stitching',
    vin: 'WA1VAAF70PD028471',
    features: [
      'Quattro Permanent All-Wheel Drive with Self-Locking Center Diff',
      'Adaptive Air Suspension',
      'Audi Virtual Cockpit Plus (12.3-inch)',
      'Bang & Olufsen 3D Premium Sound System',
      'Panoramic Glass Sunroof',
      'S-Line Aerodynamic Package with 21-inch Alloys'
    ],
    imageUrl: '/src/assets/images/laye_repair_bay_1790849502054.jpg',
    status: 'Available',
    featured: false
  },
  {
    id: 'car-6',
    title: 'BMW 530i M Sport Executive Sedan',
    make: 'BMW',
    model: '530i M Sport',
    year: 2024,
    priceNGN: 76000000,
    priceUSD: 51000,
    mileage: 4100,
    condition: 'Brand New',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Sedan',
    engine: '2.0L BMW TwinPower Turbo 4-Cylinder',
    horsepower: 255,
    acceleration: '5.9s (0-100 km/h)',
    exteriorColor: 'Carbon Black Metallic',
    interiorColor: 'Cognac Perforated Veganza',
    vin: 'WBA53EK08RC884210',
    features: [
      'BMW Curved Display with Operating System 8.5',
      'Harman Kardon Surround Sound System',
      'M Sport Suspension & M Aerodynamics Package',
      'BMW Interaction Bar with Backlit Ambient Presets',
      'Parking Assistant Plus with Surround View Cameras',
      'Wireless Apple CarPlay & Android Auto'
    ],
    imageUrl: '/src/assets/images/laye_luxury_sedan_1790849513464.jpg',
    status: 'Reserved',
    featured: false
  }
];

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'srv-oil-maintenance',
    name: 'Master Synthetic Oil & Multi-Point Inspection',
    category: 'Routine Maintenance',
    description: 'Complete engine flush with European OEM-grade fully synthetic oil, OEM oil filter replacement, fluid top-up, and 50-point safety health check.',
    priceNGN: 65000,
    priceUSD: 45,
    estimatedDuration: '1.5 Hours',
    recommendedInterval: 'Every 5,000 - 8,000 km',
    inclusions: [
      'Full synthetic 5W-30 / 0W-40 oil fill (up to 6.5L)',
      'OEM certified oil filter replacement',
      'Brake, coolant, transmission & washer fluid top-up',
      'Tire pressure, tread depth check & rotation inspect',
      'Battery state-of-health computerized load test',
      'Comprehensive digital inspection report with photo logs'
    ],
    popular: true
  },
  {
    id: 'srv-diagnostics-ecu',
    name: 'Advanced Computer Diagnostics & ECU Calibration',
    category: 'Diagnostics & Mechanical',
    description: 'High-end dealership-grade scanner interrogation for check engine lights, transmission faults, sensor misreads, and live data sensor telemetry.',
    priceNGN: 45000,
    priceUSD: 30,
    estimatedDuration: '1 - 2 Hours',
    recommendedInterval: 'At any warning light or quarterly',
    inclusions: [
      'Full vehicle OBD-II & CAN-Bus electronic scan',
      'Live fuel trim, O2 sensor & ignition timing analysis',
      'Transmission adaptation & shift solenoid testing',
      'Error code clearing & module health calibration',
      'Actionable mechanical repair roadmap with quote'
    ]
  },
  {
    id: 'srv-brake-overhaul',
    name: 'Precision Braking System & Rotor Overhaul',
    category: 'Brakes & Suspension',
    description: 'Complete brake servicing with ceramic low-dust pads, high-temperature brake fluid flush, caliper servicing, and computerized rotor resurfacing.',
    priceNGN: 95000,
    priceUSD: 65,
    estimatedDuration: '2.5 Hours',
    recommendedInterval: 'Every 20,000 - 30,000 km',
    inclusions: [
      'Premium ceramic front or rear brake pad install',
      'Brake rotor micro-resurfacing or runout inspection',
      'Brake caliper slider pin cleaning and synthetic lubrication',
      'Full DOT 4 / DOT 5.1 hydraulic pressure bleed',
      'Emergency brake cable & electronic parking brake calibration',
      'Road safety deceleration and ABS activation road test'
    ],
    popular: true
  },
  {
    id: 'srv-ac-climate',
    name: 'Tropical Climate Automotive AC & Compressor Overhaul',
    category: 'Electrical & AC',
    description: 'Heavy-duty air conditioning restoration designed for hot climates. Vacuum leak test, compressor lubrication, R134a/R1234yf recharge, and antibacterial evaporator sanitization.',
    priceNGN: 85000,
    priceUSD: 58,
    estimatedDuration: '2 Hours',
    recommendedInterval: 'Annually or before hot season',
    inclusions: [
      'Nitrogen pressure leak detection for evaporator & condenser',
      'High-vacuum moisture evacuation cycle',
      'Precision OEM refrigerant recharge by gram weight',
      'PAG compressor oil replenish with UV dye tracer',
      'Cabin pollen & PM2.5 microfilter replacement',
      'Vent temperature verification (sub-6°C cooling output)'
    ]
  },
  {
    id: 'srv-suspension-align',
    name: 'Suspension Overhaul & 3D Laser Wheel Alignment',
    category: 'Brakes & Suspension',
    description: 'Combat pothole and rough terrain wear. Bushing replacement, shock absorber testing, steering rack inspection, and 3D computer alignment.',
    priceNGN: 75000,
    priceUSD: 50,
    estimatedDuration: '2 Hours',
    recommendedInterval: 'Every 10,000 km',
    inclusions: [
      '4-Wheel computerized 3D laser alignment',
      'Control arm bushings, ball joints & tie rods inspection',
      'Shock absorber damping resistance test',
      'High-speed dynamic wheel balancing (4 wheels)',
      'Subframe bolt torque check and road stabilization'
    ]
  },
  {
    id: 'srv-ceramic-detailing',
    name: 'Bespoke Executive Detailing & 9H Ceramic Shield',
    category: 'Detailing',
    description: 'Showroom finish renewal. Multi-stage paint correction, interior leather nourishment, steam extraction, and hydrophobic 9H ceramic coating protection.',
    priceNGN: 180000,
    priceUSD: 120,
    estimatedDuration: '1 Full Day',
    recommendedInterval: 'Every 12 - 24 Months',
    inclusions: [
      'Multi-stage dual-action machine paint correction (swirl removal)',
      '9H Nano-Ceramic Protective Coating application (2 coats)',
      'Deep steam decontamination of leather, alcantara & carpets',
      'UV leather barrier conditioning & trim restoration',
      'Engine bay dry-steam detailing & dressing',
      'Hydrophobic rain repellent treatment on all glass windows'
    ]
  }
];

export const INITIAL_BOOKINGS: ServiceBooking[] = [
  {
    id: 'book-101',
    bookingRef: 'LA-SRV-8821',
    customerName: 'Babajide Adekunle',
    customerEmail: 'baba.adekunle@yahoo.com',
    customerPhone: '+2348035512901',
    vehicleMake: 'Toyota',
    vehicleModel: 'Land Cruiser Prado',
    vehicleYear: 2022,
    plateNumber: 'EKY-904-AA',
    serviceId: 'srv-oil-maintenance',
    serviceName: 'Master Synthetic Oil & Multi-Point Inspection',
    servicePriceNGN: 65000,
    bookingDate: '2026-10-03',
    timeSlot: '09:00 AM - 11:00 AM',
    pickupDropoff: false,
    notes: 'Please check slight squeak from front right wheel on cold morning start.',
    paymentMethod: 'card',
    paymentStatus: 'paid_full',
    amountPaidNGN: 65000,
    status: 'confirmed',
    remindersEnabled: true,
    createdAt: '2026-09-30T10:14:00Z',
    notificationsSent: [
      {
        type: 'booking_confirmation',
        timestamp: '2026-09-30T10:15:00Z',
        channel: 'SMS',
        content: 'Laye Autos: Booking LA-SRV-8821 confirmed for Oct 3, 09:00 AM. Bay reserved.'
      }
    ]
  },
  {
    id: 'book-102',
    bookingRef: 'LA-SRV-9014',
    customerName: 'Chiamaka Eze',
    customerEmail: 'chiamaka.eze@corp.ng',
    customerPhone: '+2348149923847',
    vehicleMake: 'Mercedes-Benz',
    vehicleModel: 'GLE 450',
    vehicleYear: 2021,
    plateNumber: 'JJJ-411-FK',
    serviceId: 'srv-ac-climate',
    serviceName: 'Tropical Climate Automotive AC & Compressor Overhaul',
    servicePriceNGN: 85000,
    bookingDate: '2026-10-04',
    timeSlot: '01:00 PM - 03:00 PM',
    pickupDropoff: true,
    notes: 'AC blows lukewarm when idling in Victoria Island traffic.',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid_full',
    amountPaidNGN: 85000,
    status: 'confirmed',
    remindersEnabled: true,
    createdAt: '2026-09-29T14:20:00Z',
    notificationsSent: [
      {
        type: 'booking_confirmation',
        timestamp: '2026-09-29T14:22:00Z',
        channel: 'EMAIL',
        content: 'Your appointment LA-SRV-9014 is confirmed. Valet driver will call at 12:00 PM for pickup.'
      }
    ]
  }
];

export const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-1',
    customerName: 'Tunde Oladipo',
    customerEmail: 'tunde.oladipo@gmail.com',
    customerPhone: '+2348091122334',
    inquiryType: 'test_drive',
    vehicleId: 'car-1',
    vehicleTitle: 'Mercedes-Benz S580 4MATIC Sedan',
    message: 'I am interested in scheduling a weekend test drive on Saturday at your Lekki/VI showroom. Please let me know required documentation.',
    status: 'new',
    createdAt: '2026-10-01T01:30:00Z'
  },
  {
    id: 'inq-2',
    customerName: 'Folake Martins',
    customerEmail: 'folake.m@zenithholdings.ng',
    customerPhone: '+2348029988776',
    inquiryType: 'sales_inquiry',
    vehicleId: 'car-2',
    vehicleTitle: 'Range Rover Autobiography LWB',
    message: 'Can you provide the customs clearance documentation and inspection report for the 2023 Range Rover? Also inquiring about trade-in value for my 2020 Velar.',
    status: 'in_contact',
    createdAt: '2026-09-28T16:15:00Z'
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Chief Emeka Okoli',
    location: 'Ikoyi, Lagos',
    serviceOrCar: 'Purchased Mercedes-Benz S580',
    rating: 5,
    date: 'September 2026',
    comment: 'Laye Autos sets a gold standard for luxury vehicle acquisitions in Nigeria. The car came in immaculate condition with genuine mileage and pristine customs papers. The staff treated me with utmost dignity.',
    verified: true
  },
  {
    id: 'rev-2',
    customerName: 'Engr. Sarah Nwachukwu',
    location: 'Victoria Island, Lagos',
    serviceOrCar: 'AC Overhaul & Suspension Alignment',
    rating: 5,
    date: 'September 2026',
    comment: 'My Audi Q7 was suffering from severe steering vibration and poor AC chilling in traffic. Within 3 hours at Laye Autos workshop, their diagnostic team identified the bad lower control arm bushings and recharged the refrigerant. Chills down to 4°C now!',
    verified: true
  },
  {
    id: 'rev-3',
    customerName: 'Alhaji Musa Danjuma',
    location: 'Abuja FCT',
    serviceOrCar: 'Purchased Land Cruiser 300 VXR',
    rating: 5,
    date: 'August 2026',
    comment: 'Transacted completely online and by phone. Laye Autos arranged safe covered carrier transport from Lagos straight to my residence in Maitama. Excellent communication, honest team.',
    verified: true
  },
  {
    id: 'rev-4',
    customerName: 'David Adeleke Jr.',
    location: 'Lekki Phase 1',
    serviceOrCar: 'Full Detailing & 9H Ceramic Coating',
    rating: 5,
    date: 'August 2026',
    comment: 'The workshop looks like a Formula 1 laboratory. They removed every swirl mark on my Porsche and applied the 9H coating. Water beads off like magic. Automated SMS reminder for my next checkup was a nice touch.',
    verified: true
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'engine-oil-guide-tropical-climate',
    title: 'Engine Oil Viscosity in Tropical Climates: 5W-30 vs 0W-40 Explained',
    category: 'Engine Care',
    excerpt: 'Operating modern turbocharged engines in high-temperature environments demands strict adherence to synthetic oil shear stability and thermal breakdown thresholds.',
    content: [
      'In high ambient temperature zones like Nigeria, where afternoon tarmac temperatures frequently exceed 38°C, engine oil experiences severe thermal stress during prolonged stop-and-go traffic.',
      'Many car owners mistakenly believe "heavier" mineral oil (like 20W-50) is better for warm weather. In modern variable-valve timing engines (VVT-i, VTEC, Double-VANOS), heavy oil starves delicate camshaft oil passages during startup, leading to premature camshaft lobe scoring.',
      'For luxury and performance European vehicles, always stick to the OEM specification (e.g., Mercedes MB 229.5, BMW Longlife-01, Porsche A40). A high-grade full synthetic 0W-40 or 5W-30 provides rapid cold lubrication while retaining robust film strength under extreme engine bay heat.'
    ],
    tipsChecklist: [
      'Check dipstick level bi-weekly on a level surface after engine has rested for 10 minutes.',
      'Always replace the oil filter with an OEM pleat filter—counterfeit filters collapse under oil pressure.',
      'Never mix synthetic and mineral oils during top-ups.',
      'If you commute in heavy traffic daily, shorten your service interval from 10,000 km to 7,500 km.'
    ],
    readTime: '4 min read',
    publishedDate: 'September 24, 2026',
    author: 'Engr. Laye Adeyemi (Lead Master Tech)',
    coverImage: '/src/assets/images/laye_repair_bay_1790849502054.jpg'
  },
  {
    id: 'blog-2',
    slug: 'brake-pad-rotor-warning-signs',
    title: 'Recognizing Brake Pad Glazing, Rotor Warping & ABS Warning Signs',
    category: 'Brake System',
    excerpt: 'How to diagnose brake pedal pulsation, high-pitched metallic squeal, and spongy pedal travel before dangerous brake failure occurs.',
    content: [
      'Your braking system is the single most critical safety subsystem on your car. Brake pads wear gradually, making it easy for drivers to become accustomed to deteriorating stopping distance.',
      'When you apply brakes and feel a pulsating vibration through the steering wheel or brake pedal, this is rarely "ABS acting up"—it is brake disc thickness variation (commonly called rotor warping), caused by thermal overheating or uneven pad material deposition.',
      'Squealing noises can be caused by the mechanical acoustic wear indicator tab touching the rotor face, or by glazed pad surfaces caused by hard braking without proper bedding-in.'
    ],
    tipsChecklist: [
      'Inspect brake pad lining thickness: replace immediately if pad friction material is under 3mm.',
      'Brake fluid absorbs ambient humidity over time—flush DOT 4 fluid every 24 months to prevent boiling and pedal fade.',
      'Never spray cold water directly onto hot brake discs immediately after highway driving or downhill descents.'
    ],
    readTime: '5 min read',
    publishedDate: 'September 18, 2026',
    author: 'Michael Obasi (Senior Brake Specialist)',
    coverImage: '/src/assets/images/laye_sport_coupe_1790849536287.jpg'
  },
  {
    id: 'blog-3',
    slug: 'car-ac-maintenance-tropical-heat',
    title: 'Car Air Conditioning Mastery: Protecting Your Compressor from Failure',
    category: 'Air Conditioning',
    excerpt: 'Why AC systems blow hot air at traffic lights, how refrigerant leaks ruin compressors, and the critical role of the cabin microfilter.',
    content: [
      'An automotive air conditioning system does not just create cold air—it removes heat and moisture from the cabin interior through heat exchange in the evaporator coil.',
      'If your AC blows icy cold while cruising on the highway but begins blowing lukewarm air when stopped in gridlock traffic, common culprits include a failing auxiliary electric cooling fan, a clogged AC condenser fin matrix, or an over-pressurized system.',
      'Refrigerant also carries lubricating PAG oil for the AC compressor. When a tiny O-ring leak develops, refrigerant gas escapes and the compressor starves of oil, causing internal piston seizure that contaminates the entire system with black metal shavings.'
    ],
    tipsChecklist: [
      'Clean dust and road debris from the front radiator and condenser grill every 6 months.',
      'Replace the cabin air filter every 10,000 km—a clogged filter reduces cabin airflow by up to 60%.',
      'Run the AC at least once a week even during rainy season to circulate compressor lubricant and prevent seal drying.'
    ],
    readTime: '6 min read',
    publishedDate: 'September 10, 2026',
    author: 'Engr. Laye Adeyemi',
    coverImage: '/src/assets/images/laye_autos_hero_1790849491050.jpg'
  },
  {
    id: 'blog-4',
    slug: 'suspension-longevity-and-wheel-alignment',
    title: 'Protecting Your Suspension & Steering Components on Rough Roads',
    category: 'Tires & Suspension',
    excerpt: 'Mastering tire pressures, avoiding pothole impacts, and understanding how 3D laser alignment saves tires from premature cord exposure.',
    content: [
      'Frequent impacts with rough terrain and potholes deliver shock forces directly through tire sidewalls into ball joints, control arm rubber bushings, and strut mounts.',
      'When wheel alignment toe or camber drifts by even 0.5 degrees, the tire is essentially dragged sideways across the asphalt at 100 km/h, shredding tire tread in as little as 5,000 km.',
      'At Laye Autos, our 3D optical alignment rigs measure 14 geometric axes including castor, camber, steering axis inclination (SAI), and thrust angle to ensure arrow-straight high-speed tracking.'
    ],
    tipsChecklist: [
      'Maintain factory cold tire PSI (check sticker on driver door B-pillar).',
      'Perform wheel rotation and dynamic balance every 8,000 km.',
      'Listen for dull thuds or clunking sounds when driving over road bumps—a clear signal of worn sway bar links or shock mounts.'
    ],
    readTime: '4 min read',
    publishedDate: 'August 29, 2026',
    author: 'Kazeem Balogun (Chassis & Alignment Tech)',
    coverImage: '/src/assets/images/laye_luxury_sedan_1790849513464.jpg'
  }
];

// Helper to access and persist state in browser localStorage
const STORAGE_KEYS = {
  CARS: 'laye_autos_cars_v1',
  BOOKINGS: 'laye_autos_bookings_v1',
  INQUIRIES: 'laye_autos_inquiries_v1',
  REVIEWS: 'laye_autos_reviews_v1'
};

export const getStoredCars = (): Car[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CARS);
    return data ? JSON.parse(data) : INITIAL_CARS;
  } catch {
    return INITIAL_CARS;
  }
};

export const saveStoredCars = (cars: Car[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
  } catch (e) {
    console.error('Failed to save cars', e);
  }
};

export const getStoredBookings = (): ServiceBooking[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return data ? JSON.parse(data) : INITIAL_BOOKINGS;
  } catch {
    return INITIAL_BOOKINGS;
  }
};

export const saveStoredBookings = (bookings: ServiceBooking[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to save bookings', e);
  }
};

export const getStoredInquiries = (): CustomerInquiry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    return data ? JSON.parse(data) : INITIAL_INQUIRIES;
  } catch {
    return INITIAL_INQUIRIES;
  }
};

export const saveStoredInquiries = (inquiries: CustomerInquiry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  } catch (e) {
    console.error('Failed to save inquiries', e);
  }
};

export const getStoredReviews = (): CustomerReview[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return data ? JSON.parse(data) : INITIAL_REVIEWS;
  } catch {
    return INITIAL_REVIEWS;
  }
};

export const saveStoredReviews = (reviews: CustomerReview[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save reviews', e);
  }
};

export const CONTACT_DETAILS = {
  phone: '+2348022341342',
  phoneDisplay: '+234 802 234 1342',
  email: 'layetsneh@gmail.com',
  address: 'Plot 14, Auto Commercial Boulevard, Victoria Island & Ikeja Tech Hub, Lagos, Nigeria',
  hours: 'Monday – Saturday: 8:00 AM – 6:30 PM (24/7 Emergency Towing)',
  whatsappLink: 'https://wa.me/2348022341342?text=Hello%20Laye%20Autos,%20I%20would%20like%20to%20inquire%20about%20your%20vehicles%20and%20auto%20services.'
};
