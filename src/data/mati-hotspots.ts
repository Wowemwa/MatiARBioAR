export type HotspotType = 'marine' | 'terrestrial'

export type SpeciesStatus = 'CR' | 'EN' | 'VU' | 'NT' | 'LC' | 'DD'

export interface SpeciesDetail {
  id: string
  category: 'flora' | 'fauna'
  commonName: string
  scientificName: string
  status: SpeciesStatus
  habitat: string
  blurb: string
  siteIds: string[]
  highlights: string[]
  images?: string[]
  // Additional fields from Supabase
  kingdom?: string
  phylum?: string
  class?: string
  taxonomic_order?: string
  family?: string
  genus?: string
  species?: string
  authorship?: string
  synonyms?: string[]
  endemic?: boolean
  invasive?: boolean
  key_facts?: string[]
  diet?: string
  behavior?: string
  reproduction?: string
  ecosystem_services?: string[]
  phenology?: string
  interactions?: string[]
  growth_form?: string
  leaf_type?: string
  flowering_period?: string
  ethnobotanical_uses?: string[]
  mobility?: string
  activity_pattern?: string
  size?: string
  weight?: string
  lifespan?: string
  population_trend?: string
  threats?: string[]
  conservation_actions?: string[]
  legal_protection?: string[]
  reference_sources?: string[]
}

export interface Hotspot {
  id: string
  name: string
  type: HotspotType
  barangay?: string
  city: string
  province: string
  designation: string
  areaHectares?: number
  lat: number
  lng: number
  elevationRangeMeters?: [number, number]
  summary: string
  description: string
  features: string[]
  stewardship: string
  image?: string
  tags: string[]
  highlightSpeciesIds: string[]
  floraIds: string[]
  faunaIds: string[]
  visitorNotes?: string
}

// ACCURATE MATI CITY BIODIVERSITY HOTSPOTS
export const MATI_HOTSPOTS: Hotspot[] = [
  {
    id: 'mount-hamiguitan-sanctuary',
    name: 'Mount Hamiguitan Range Wildlife Sanctuary',
    type: 'terrestrial',
    barangay: 'Multiple (Eastern Mati City)',
    city: 'Mati City',
    province: 'Davao Oriental',
    designation: 'UNESCO World Heritage Site • National Wildlife Sanctuary (RA 9303)',
    areaHectares: 6834,
    lat: 6.740667,
    lng: 126.182222,
    elevationRangeMeters: [75, 1620],
    summary: 'UNESCO World Heritage Site with unique pygmy forests and exceptional endemic biodiversity.',
    description: 'Mount Hamiguitan is Mindanao\'s first UNESCO World Heritage Site, renowned for its unique pygmy forest ecosystem on ultramafic soils. The sanctuary harbors 462 plant species in montane forests, 338 in dipterocarp forests, and 246 in mossy forests. It hosts 45 orchid species (23 endemic to Philippines), several endemic Nepenthes pitcher plants, and critically endangered fauna including the Philippine Eagle.',
    features: [
      'First UNESCO World Heritage Site in Mindanao (2014)',
      'Unique pygmy forest with century-old dwarf trees',
      'Five endemic Nepenthes species including N. hamiguitanensis',
      'Habitat for 11 IUCN Red List endangered vertebrates',
      'Eastern Mindanao Biodiversity Corridor component',
      '45 orchid species with high endemism'
    ],
    stewardship: 'Protected Area Management Board (PAMB) comprising DENR, Davao Oriental LGUs, indigenous Mandaya and Kalagan communities, and scientific institutions.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mount_Hamiguitan_Range_Wildlife_Sanctuary_%2814%29.jpg/1200px-Mount_Hamiguitan_Range_Wildlife_Sanctuary_%2814%29.jpg',
    tags: ['UNESCO World Heritage', 'Pygmy Forest', 'Endemic Species', 'Philippine Eagle', 'Pitcher Plants', 'Ultramafic Soil'],
    highlightSpeciesIds: ['philippine-eagle', 'nepenthes-hamiguitanensis', 'batomys-hamiguitan'],
    floraIds: ['nepenthes-hamiguitanensis', 'nepenthes-peltata', 'nepenthes-micramphora', 'leptospermum-flavescens', 'dacrydium-elatum', 'almaciga-tree'],
    faunaIds: ['philippine-eagle', 'giant-golden-crowned-flying-fox', 'philippine-tarsier', 'philippine-warty-pig', 'batomys-hamiguitan', 'tarictic-hornbill', 'giant-scops-owl'],
    visitorNotes: 'Strictly regulated access. Research permits required from PAMB. Indigenous guides available through local communities.'
  },
  {
    id: 'pujada-bay-protected-seascape',
    name: 'Pujada Bay Protected Landscape and Seascape',
    type: 'marine',
    barangay: 'Multiple coastal barangays',
    city: 'Mati City',
    province: 'Davao Oriental',
    designation: 'Protected Landscape and Seascape (Proclamation No. 431, 1994)',
    areaHectares: 21200,
    lat: 6.8913,
    lng: 126.2272,
    summary: 'One of world\'s most beautiful bays with extensive coral reefs, mangroves, and seagrass beds.',
    description: 'Pujada Bay is recognized by Les Plus Belles Baies du Monde as one of the world\'s most beautiful bays. The bay features 25 genera of hard and soft corals dominated by Montipora, Acropora, and Porites. It contains 850 hectares of mangroves and harbors 9 of the 16 seagrass species found in the Philippines. Four islands dot the bay: Pujada Island (with lighthouse), Uanivan Island, Oak Island, and Ivy Island.',
    features: [
      'World\'s Most Beautiful Bays club member (2022)',
      '25 genera of hard and soft corals',
      '850 hectares of mangrove forests',
      '9 out of 16 Philippine seagrass species',
      'Four scenic islands within the bay',
      'Traditional fishing grounds and tourism sites'
    ],
    stewardship: 'Protected Area Management Board with DENR, Mati City LGU, coastal barangays, fisherfolk organizations, and tourism operators.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Pujada_Bay_Mati_Davao_Oriental.jpg/1200px-Pujada_Bay_Mati_Davao_Oriental.jpg',
    tags: ['World Beautiful Bay', 'Coral Reefs', 'Mangroves', 'Seagrass', 'Islands', 'Marine Protected Area'],
    highlightSpeciesIds: ['green-sea-turtle', 'giant-clam', 'napoleon-wrasse'],
    floraIds: ['thalassia-hemprichii', 'enhalus-acoroides', 'rhizophora-mucronata', 'avicennia-marina', 'montipora-coral', 'acropora-coral'],
    faunaIds: ['green-sea-turtle', 'hawksbill-turtle', 'napoleon-wrasse', 'giant-clam', 'parrotfish-species', 'spinner-dolphin'],
    visitorNotes: 'Island hopping and snorkeling tours available from Mati port. Follow marine sanctuary guidelines and local fishing schedules.'
  },
  {
    id: 'dahican-beach-mayo-bay',
    name: 'Dahican Beach and Mayo Bay',
    type: 'marine',
    barangay: 'Dahican',
    city: 'Mati City',
    province: 'Davao Oriental',
    designation: 'Community-managed marine turtle nesting beach',
    lat: 6.922,
    lng: 126.273,
    summary: 'Seven-kilometer crescent beach famous for sea turtle nesting and skimboarding.',
    description: 'Dahican Beach stretches 7 kilometers along Mayo Bay, serving as one of the Philippines\' most important sea turtle nesting sites. The Amihan sa Dahican volunteer group monitors and protects nesting hawksbill and olive ridley turtles year-round. The beach is also famous for sunrise skimboarding and dolphin watching.',
    features: [
      'Major sea turtle nesting site in Mindanao',
      'Community-based turtle conservation program',
      'International skimboarding destination', 
      'Dolphin and whale watching opportunities',
      'Sunrise photography hotspot'
    ],
    stewardship: 'Amihan sa Dahican volunteer group with support from Mati City LGU and DENR-BMB.',
    image: 'https://images.unsplash.com/photo-1437623889155-075d40e2e59f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Sea Turtles', 'Skimboarding', 'Dolphin Watching', 'Beach Conservation', 'Community Tourism'],
    highlightSpeciesIds: ['hawksbill-turtle', 'olive-ridley-turtle', 'spinner-dolphin'],
    floraIds: ['casuarina-equisetifolia', 'pandanus-tectorius', 'ipomoea-pes-caprae'],
    faunaIds: ['hawksbill-turtle', 'olive-ridley-turtle', 'green-sea-turtle', 'spinner-dolphin', 'bottlenose-dolphin'],
    visitorNotes: 'Turtle nesting season is year-round with peaks March-June. Red lights only during nighttime turtle watching.'
  },
  {
    id: 'mati-protected-landscape',
    name: 'Mati Protected Landscape',
    type: 'terrestrial', 
    barangay: 'Multiple inland barangays',
    city: 'Mati City',
    province: 'Davao Oriental',
    designation: 'Protected Landscape',
    areaHectares: 2500,
    lat: 6.85,
    lng: 126.15,
    elevationRangeMeters: [50, 800],
    summary: 'Watershed protection area with secondary forests and agricultural landscapes.',
    description: 'The Mati Protected Landscape encompasses the watershed areas that supply fresh water to Mati City. It contains remaining secondary dipterocarp forests, agroforestry systems, and grasslands. The area serves as a buffer zone for Mount Hamiguitan and provides important ecosystem services to the city.',
    features: [
      'Municipal watershed protection',
      'Secondary dipterocarp forest remnants',
      'Agroforestry demonstration sites',
      'Buffer zone for Mount Hamiguitan',
      'Erosion control and flood mitigation'
    ],
    stewardship: 'Mati City Environment and Natural Resources Office with barangay-level forest protection committees.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Watershed', 'Forest Protection', 'Agroforestry', 'Buffer Zone', 'Ecosystem Services'],
    highlightSpeciesIds: ['philippine-brown-deer', 'long-tailed-macaque'],
    floraIds: ['shorea-species', 'dipterocarpus-species', 'coconut-palm'],
    faunaIds: ['philippine-brown-deer', 'long-tailed-macaque', 'philippine-serpent-eagle', 'common-palm-civet'],
    visitorNotes: 'Accessible via barangay roads. Community-based ecotourism programs available.'
  },
  {
    id: 'sleeping-dinosaur-island',
    name: 'Sleeping Dinosaur Island (Pujada Island)',
    type: 'marine',
    barangay: 'Coastal areas',
    city: 'Mati City', 
    province: 'Davao Oriental',
    designation: 'Part of Pujada Bay Protected Seascape',
    lat: 6.883,
    lng: 126.25,
    summary: 'Iconic island formation resembling a sleeping dinosaur with lighthouse and marine life.',
    description: 'Pujada Island, locally known as Sleeping Dinosaur Island due to its distinctive silhouette, guards the entrance to Pujada Bay. The island features a historic lighthouse and is surrounded by coral reefs and seagrass beds. It serves as an important seabird nesting site and marine sanctuary.',
    features: [
      'Historic lighthouse facility',
      'Distinctive dinosaur-shaped silhouette', 
      'Seabird nesting and roosting site',
      'Coral reef and seagrass habitats',
      'Popular island hopping destination'
    ],
    stewardship: 'Philippine Coast Guard (lighthouse) and Mati City LGU (marine sanctuary components).',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    tags: ['Lighthouse', 'Seabirds', 'Island Hopping', 'Marine Sanctuary', 'Iconic Landmark'],
    highlightSpeciesIds: ['brown-booby', 'white-bellied-sea-eagle'],
    floraIds: ['coastal-vegetation', 'mangrove-associates'],
    faunaIds: ['brown-booby', 'white-bellied-sea-eagle', 'reef-egret', 'marine-fish-species'],
    visitorNotes: 'Accessible by boat from Mati. Lighthouse visits may require coordination with Philippine Coast Guard.'
  },
  {
    id: 'guang-guang-mangrove-reserve',
    name: 'Guang-guang Mangrove Nature Reserve',
    type: 'marine',
    barangay: 'Dahican',
    city: 'Mati City',
    province: 'Davao Oriental', 
    designation: 'Community-managed mangrove reserve',
    areaHectares: 50,
    lat: 6.918,
    lng: 126.265,
    summary: 'Coastal mangrove ecosystem with boardwalk and environmental education facilities.',
    description: 'The Guang-guang Mangrove Nature Reserve protects a remnant mangrove forest along the coast near Dahican Beach. The site features a wooden boardwalk for eco-tourism and serves as an environmental education center. It demonstrates successful community-based mangrove restoration and conservation.',
    features: [
      'Wooden boardwalk for visitors',
      'Environmental education center',
      'Mangrove restoration demonstration site',
      'Bird watching opportunities',
      'Community-based management model'
    ],
    stewardship: 'Dahican Barangay Council with support from environmental NGOs and Mati City LGU.',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Mangroves', 'Eco-tourism', 'Environmental Education', 'Community Conservation', 'Bird Watching'],
    highlightSpeciesIds: ['collared-kingfisher', 'white-bellied-mangrove-snake'],
    floraIds: ['rhizophora-stylosa', 'avicennia-officinalis', 'sonneratia-alba'],
    faunaIds: ['collared-kingfisher', 'little-egret', 'mangrove-crab', 'mudskipper', 'white-bellied-mangrove-snake'],
    visitorNotes: 'Open daily with small entrance fee. Guided tours available through barangay tourism office.'
  }
]

// MATI CITY SPECIES DATA
export const MATI_SPECIES: SpeciesDetail[] = [
  // Mount Hamiguitan Species
  {
    id: 'philippine-eagle',
    category: 'fauna',
    commonName: 'Philippine Eagle',
    scientificName: 'Pithecophaga jeffreyi',
    status: 'CR',
    habitat: 'Primary and secondary forests, 500-1800m elevation',
    blurb: 'The Philippines\' national bird and one of the world\'s most endangered raptors. Mount Hamiguitan provides critical habitat for this apex predator.',
    siteIds: ['mount-hamiguitan-sanctuary'],
    highlights: ['National bird of the Philippines', 'Critically endangered with <1000 individuals', 'Apex forest predator'],
    images: ['https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop&crop=center']
  },
  {
    id: 'nepenthes-hamiguitanensis',
    category: 'flora', 
    commonName: 'Hamiguitan Pitcher Plant',
    scientificName: 'Nepenthes hamiguitanensis',
    status: 'EN',
    habitat: 'Ultramafic soils in pygmy forest, 1200-1600m elevation',
    blurb: 'Endemic pitcher plant discovered in 2009, found only on Mount Hamiguitan\'s unique ultramafic soils.',
    siteIds: ['mount-hamiguitan-sanctuary'],
    highlights: ['Endemic to Mount Hamiguitan', 'Discovered in 2009', 'Adapted to ultramafic soils'],
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&crop=center']
  },
  {
    id: 'batomys-hamiguitan',
    category: 'fauna',
    commonName: 'Hamiguitan Hairy-tailed Rat',
    scientificName: 'Batomys hamiguitan', 
    status: 'EN',
    habitat: 'Mossy forests above 1000m elevation',
    blurb: 'Yellow-brown furry-tailed rat species endemic to Mount Hamiguitan, discovered in scientific surveys of the pygmy forest.',
    siteIds: ['mount-hamiguitan-sanctuary'],
    highlights: ['Endemic to Mount Hamiguitan', 'Unique furry tail', 'Recently described species'],
    images: ['https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&h=600&fit=crop&crop=center']
  },
  {
    id: 'nepenthes-copelandii',
    category: 'flora',
    commonName: 'Copeland\'s Pitcher Plant',
    scientificName: 'Nepenthes copelandii',
    status: 'VU',
    habitat: 'Ultramafic substrates, 1200-1635m elevation',
    blurb: 'Another endemic pitcher plant species found in Mount Hamiguitan\'s unique pygmy forest ecosystem.',
    siteIds: ['mount-hamiguitan-sanctuary'],
    highlights: ['Endemic to Mindanao', 'Pygmy forest specialist', 'Ultramafic soil adapted'],
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center']
  },
  {
    id: 'philippine-warty-pig',
    category: 'fauna',
    commonName: 'Philippine Warty Pig',
    scientificName: 'Sus philippensis',
    status: 'VU',
    habitat: 'Primary and secondary forests',
    blurb: 'Endemic wild pig species found in Mount Hamiguitan\'s forest ecosystems, important seed disperser.',
    siteIds: ['mount-hamiguitan-sanctuary', 'mati-protected-landscape'],
    highlights: ['Endemic to Philippines', 'Important seed disperser', 'Forest ecosystem engineer'],
    images: ['https://images.unsplash.com/photo-1605379399843-5870eea9b74e?w=800&h=600&fit=crop&crop=center']
  },

  // Pujada Bay Species  
  {
    id: 'hawksbill-turtle',
    category: 'fauna',
    commonName: 'Hawksbill Sea Turtle', 
    scientificName: 'Eretmochelys imbricata',
    status: 'CR',
    habitat: 'Coral reefs and nesting beaches',
    blurb: 'Critically endangered sea turtle that nests on Dahican Beach. Protected by community conservation programs.',
    siteIds: ['dahican-beach-mayo-bay', 'pujada-bay-protected-seascape'],
    highlights: ['Regular nester at Dahican Beach', 'Protected by Amihan sa Dahican', 'Feeds on sponges and coral'],
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center']
  },
  {
    id: 'giant-clam',
    category: 'fauna',
    commonName: 'Giant Clam',
    scientificName: 'Tridacna gigas',
    status: 'VU', 
    habitat: 'Shallow coral reefs and seagrass beds',
    blurb: 'World\'s largest bivalve mollusc found in Pujada Bay\'s shallow waters. Important for reef ecosystem health.',
    siteIds: ['pujada-bay-protected-seascape'],
    highlights: ['Largest bivalve in the world', 'Filter feeds to clean water', 'Provides habitat for small fish'],
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center']
  },
  {
    id: 'green-sea-turtle',
    category: 'fauna',
    commonName: 'Green Sea Turtle',
    scientificName: 'Chelonia mydas',
    status: 'EN',
    habitat: 'Seagrass beds and coral reefs',
    blurb: 'Herbivorous sea turtle that feeds on seagrasses in Pujada Bay and nests on nearby beaches.',
    siteIds: ['pujada-bay-protected-seascape', 'dahican-beach-mayo-bay'],
    highlights: ['Grazes on seagrass beds', 'Nests on sandy beaches', 'Temperature-dependent sex determination'],
    images: ['https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&crop=center']
  },
  {
    id: 'thalassia-hemprichii',
    category: 'flora',
    commonName: 'Paddle Grass',
    scientificName: 'Thalassia hemprichii',
    status: 'LC',
    habitat: 'Shallow sandy bottoms in marine environments',
    blurb: 'Dominant seagrass species in Pujada Bay, provides critical habitat for marine life and carbon sequestration.',
    siteIds: ['pujada-bay-protected-seascape'],
    highlights: ['Forms extensive seagrass meadows', 'Critical nursery habitat', 'Blue carbon storage'],
    images: ['https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&crop=center&sat=-50&con=20']
  },
  {
    id: 'napoleon-wrasse',
    category: 'fauna',
    commonName: 'Napoleon Wrasse',
    scientificName: 'Cheilinus undulatus',
    status: 'EN',
    habitat: 'Coral reefs and lagoons',
    blurb: 'Large reef fish found in Pujada Bay\'s coral ecosystems, important predator maintaining reef balance.',
    siteIds: ['pujada-bay-protected-seascape'],
    highlights: ['Largest reef fish', 'Sequential hermaphrodite', 'Controls crown-of-thorns starfish'],
    images: ['https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&crop=center&hue=180']
  },

  // Dahican Beach Species
  {
    id: 'olive-ridley-turtle',
    category: 'fauna',
    commonName: 'Olive Ridley Sea Turtle',
    scientificName: 'Lepidochelys olivacea',
    status: 'VU',
    habitat: 'Open ocean and nesting beaches',
    blurb: 'Most abundant sea turtle species nesting at Dahican Beach, protected by community-based conservation.',
    siteIds: ['dahican-beach-mayo-bay'],
    highlights: ['Most abundant sea turtle at Dahican', 'Synchronized mass nesting (arribada)', 'Omnivorous feeding'],
    images: ['https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800&h=600&fit=crop&crop=center']
  },
  {
    id: 'coconut-palm',
    category: 'flora',
    commonName: 'Coconut Palm',
    scientificName: 'Cocos nucifera',
    status: 'LC',
    habitat: 'Coastal areas and sandy beaches',
    blurb: 'Iconic coastal tree lining Dahican Beach, provides erosion control and livelihood for local communities.',
    siteIds: ['dahican-beach-mayo-bay', 'mati-protected-landscape'],
    highlights: ['Coastal protection', 'Economic importance', 'Salt tolerance'],
    images: ['https://images.unsplash.com/photo-1502780402662-acc01917737e?w=800&h=600&fit=crop&crop=center']
  },

  // Sleeping Dinosaur Island Species
  {
    id: 'red-footed-booby',
    category: 'fauna',
    commonName: 'Red-footed Booby',
    scientificName: 'Sula sula',
    status: 'LC',
    habitat: 'Tropical coastal and pelagic waters',
    blurb: 'Seabird species that roosts on Sleeping Dinosaur Island, excellent diver feeding on fish.',
    siteIds: ['sleeping-dinosaur-island'],
    highlights: ['Colonial nesting', 'Plunge diving behavior', 'Long-distance foraging'],
    images: ['https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop&crop=center']
  },
  {
    id: 'pandanus-tectorius',
    category: 'flora',
    commonName: 'Screw Pine',
    scientificName: 'Pandanus tectorius',
    status: 'LC',
    habitat: 'Coastal areas and rocky shores',
    blurb: 'Hardy coastal plant found on Sleeping Dinosaur Island, adapted to salt spray and strong winds.',
    siteIds: ['sleeping-dinosaur-island', 'dahican-beach-mayo-bay'],
    highlights: ['Salt tolerant', 'Erosion control', 'Traditional uses for weaving'],
    images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=center']
  },

  // Guang-guang Mangrove Reserve Species
  {
    id: 'rhizophora-mucronata',
    category: 'flora',
    commonName: 'Red Mangrove',
    scientificName: 'Rhizophora mucronata',
    status: 'LC',
    habitat: 'Intertidal mangrove forests',
    blurb: 'Dominant mangrove species in Guang-guang Reserve, critical for coastal protection and fisheries.',
    siteIds: ['guang-guang-mangrove-reserve'],
    highlights: ['Prop root system', 'Viviparous reproduction', 'Coastal protection'],
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center']
  },
  {
    id: 'mud-crab',
    category: 'fauna',
    commonName: 'Mud Crab',
    scientificName: 'Scylla serrata',
    status: 'LC',
    habitat: 'Mangrove creeks and estuaries',
    blurb: 'Important commercial crab species in Guang-guang mangroves, supports local livelihoods.',
    siteIds: ['guang-guang-mangrove-reserve'],
    highlights: ['Commercial importance', 'Mangrove obligate', 'Sustainable aquaculture'],
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center&hue=30']
  },
  {
    id: 'collared-kingfisher',
    category: 'fauna',
    commonName: 'Collared Kingfisher',
    scientificName: 'Todiramphus chloris',
    status: 'LC',
    habitat: 'Mangrove forests and coastal areas',
    blurb: 'Common kingfisher species in Guang-guang mangroves, feeds on crabs and small fish.',
    siteIds: ['guang-guang-mangrove-reserve'],
    highlights: ['Mangrove specialist', 'Territorial behavior', 'Cavity nester'],
    images: ['https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop&crop=center&hue=180']
  },

  // Mati Protected Landscape Species
  {
    id: 'philippine-tarsier',
    category: 'fauna',
    commonName: 'Philippine Tarsier',
    scientificName: 'Carlito syrichta',
    status: 'NT',
    habitat: 'Secondary forests and bamboo thickets',
    blurb: 'Small nocturnal primate found in Mati Protected Landscape\'s forest fragments.',
    siteIds: ['mati-protected-landscape'],
    highlights: ['World\'s smallest primate', 'Exclusively carnivorous', 'Ultrasonic communication'],
    images: ['https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&h=600&fit=crop&crop=center&sat=20']
  },
  {
    id: 'bamboo-orchid',
    category: 'flora',
    commonName: 'Bamboo Orchid',
    scientificName: 'Arundina graminifolia',
    status: 'LC',
    habitat: 'Grasslands and forest edges',
    blurb: 'Common terrestrial orchid in Mati Protected Landscape, blooms year-round with purple flowers.',
    siteIds: ['mati-protected-landscape'],
    highlights: ['Year-round blooming', 'Terrestrial orchid', 'Pioneer species'],
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center&hue=270']
  },
  {
    id: 'brahminy-kite',
    category: 'fauna',
    commonName: 'Brahminy Kite',
    scientificName: 'Haliastur indus',
    status: 'LC',
    habitat: 'Coastal areas and wetlands',
    blurb: 'Medium-sized raptor common in Mati\'s coastal and agricultural areas, sacred bird in Hindu culture.',
    siteIds: ['mati-protected-landscape', 'pujada-bay-protected-seascape'],
    highlights: ['Sacred in Hindu culture', 'Opportunistic feeder', 'Coastal scavenger'],
    images: ['https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop&crop=center&hue=30']
  }
]