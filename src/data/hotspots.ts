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
  arModelUrl?: string
  arPatternUrl?: string
  arModelScale?: number
  arModelRotation?: { x: number; y: number; z: number }
  arViewerHtml?: string
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

export const HOTSPOTS: Hotspot[] = [
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
    description:
      'Mount Hamiguitan is Mindanao\'s first UNESCO World Heritage Site, renowned for its unique pygmy forest ecosystem on ultramafic soils. The sanctuary harbors 462 plant species in montane forests, 338 in dipterocarp forests, and 246 in mossy forests. It hosts 45 orchid species (23 endemic to Philippines), several endemic Nepenthes pitcher plants, and critically endangered fauna including the Philippine Eagle.',
    features: [
      'First UNESCO World Heritage Site in Mindanao (2014)',
      'Unique pygmy forest with century-old dwarf trees',
      'Five endemic Nepenthes species including N. hamiguitanensis',
      'Habitat for 11 IUCN Red List endangered vertebrates',
      'Eastern Mindanao Biodiversity Corridor component',
      '45 orchid species with high endemism'
    ],
    stewardship:
      'Protected Area Management Board (PAMB) comprising DENR, Davao Oriental LGUs, indigenous Mandaya and Kalagan communities, and scientific institutions.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    tags: ['UNESCO World Heritage', 'Pygmy Forest', 'Endemic Species', 'Philippine Eagle', 'Pitcher Plants', 'Ultramafic Soil'],
    highlightSpeciesIds: [
      'philippine-eagle',
      'nepenthes-hamiguitanensis',
      'batomys-hamiguitan',
    ],
    floraIds: [
      'nepenthes-hamiguitanensis',
      'nepenthes-peltata',
      'nepenthes-micramphora',
      'nepenthes-justinae',
      'leptospermum-flavescens',
      'dacrydium-elatum',
    ],
    faunaIds: [
      'philippine-eagle',
      'giant-golden-crowned-flying-fox',
      'philippine-tarsier',
      'philippine-warty-pig',
      'batomys-hamiguitan',
      'tarictic-hornbill',
      'giant-scops-owl',
    ],
    visitorNotes:
      'Strictly regulated access. Research permits required from PAMB. Indigenous guides available through local communities.',
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
    summary: 'One of world\'s most beautiful bays with rich coral reefs, mangroves, and marine biodiversity.',
    description:
      'Pujada Bay’s clear waters transition from seagrass meadows to fringing reefs and mangrove belts. The mosaic provides forage for dugongs, turtle nesting beaches, and reef fish nurseries vital to coastal fisheries.',
    features: [
      'Recognized Important Marine Mammal Area (IMMA)',
      'Seagrass meadows spanning 500+ hectares',
      'Fringing reefs with 40+ coral genera',
      'Community-led marine protected area network',
    ],
    stewardship:
      'Joint management by Mati City LGU, DENR, BFAR, people’s organizations (POs) and fisherfolk cooperatives supporting community-based patrols.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Seagrass', 'Coral reefs', 'Marine mammals', 'Turtle habitat'],
    highlightSpeciesIds: [
      'dugong',
      'green-sea-turtle',
      'giant-clam',
    ],
    floraIds: [
      'thalassia-hemprichii',
      'enhalus-acoroides',
      'rhizophora-mucronata',
      'avicennia-marina',
      'sargassum-polycystum',
    ],
    faunaIds: [
      'dugong',
      'green-sea-turtle',
      'olive-ridley',
      'hawksbill-turtle',
      'spinner-dolphin',
      'giant-clam',
    ],
    visitorNotes:
      'Snorkeling and boating are best coordinated with local guides to avoid disturbing seagrass beds and turtle haul-out zones.',
  },
  {
    id: 'dahican-beach',
    name: 'Dahican Beach and Mayo Bay',
    type: 'marine',
    barangay: 'Barangay Dahican',
    city: 'Mati City',
    province: 'Davao Oriental',
    designation: 'Community-managed turtle nesting beach and skimming haven',
    lat: 6.922,
    lng: 126.273,
    summary: 'Seven-kilometre crescent beach famed for sea turtles, sunrise skimboarding, and nearshore dolphin pods.',
    description:
      'Dahican’s sandy arc serves as a nesting ground for marine turtles and a launch point for watching spinner and bottlenose dolphins frequenting Mayo Bay. Community volunteers known as Amihan Boys patrol the shores to protect eggs and hatchlings.',
    features: [
      'Year-round marine turtle monitoring by Amihan sa Dahican',
      'Sunrise dolphin watching expeditions',
      'Fine sand beach forest fringed by dune vegetation',
    ],
    stewardship:
      'Grassroots sea turtle conservation by Amihan sa Dahican with Mati City LGU support and DENR guidance.',
    image: 'https://images.unsplash.com/photo-1437623889155-075d40e2e59f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Sea turtles', 'Dolphin watching', 'Beach forest'],
    highlightSpeciesIds: [
      'olive-ridley',
      'spinner-dolphin',
      'bottlenose-dolphin',
    ],
    floraIds: [
      'casuarina-equisetifolia',
      'pandanus-tectorius',
      'ipomoea-pes-caprae',
    ],
    faunaIds: [
      'olive-ridley',
      'hawksbill-turtle',
      'green-sea-turtle',
      'spinner-dolphin',
      'bottlenose-dolphin',
    ],
    visitorNotes:
      'Maintain distance from nesting sites and nighttime patrols; red-filtered lights only around hatchlings.',
  },
  {
    id: 'waniban-island',
    name: 'Waniban (Vanishing) Island',
    type: 'marine',
    barangay: 'Barangay Bobon',
    city: 'Mati City',
    province: 'Davao Oriental',
    designation: 'Community tourism site within Pujada Bay Protected Seascape',
    lat: 6.988,
    lng: 126.28,
    summary: 'Small white-sand cay fringed by seagrasses and shallow coral reefs popular for low-impact day trips.',
    description:
      'Waniban—or Vanishing Island—emerges at low tide and is ringed by turquoise shallows full of juvenile reef fish, giant clams, and soft corals. Local boat operators coordinate visits to manage carrying capacity and reef etiquette.',
    features: [
      'Seagrass halo with juvenile reef fish assemblages',
      'Resident giant clams (Tridacna species)',
      'Community guidelines limiting anchoring and litter',
    ],
    stewardship:
      'Barangay tourism council and people’s organizations enforce visitor caps and reef protection measures.',
    image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80',
    tags: ['Sandbar', 'Snorkeling', 'Seagrass'],
    highlightSpeciesIds: [
      'giant-clam',
      'clownfish',
      'blacktip-reef-shark',
    ],
    floraIds: [
      'thalassia-hemprichii',
      'halodule-uninervis',
      'sargassum-polycystum',
    ],
    faunaIds: [
      'giant-clam',
      'clownfish',
      'blacktip-reef-shark',
      'hawksbill-turtle',
    ],
    visitorNotes:
      'Avoid stepping on seagrass and corals; follow designated snorkeling zones and no-anchor areas.',
  },
  {
    id: 'calapagan-mangrove',
    name: 'Calapagan Mangrove Forest and Boardwalk',
    type: 'terrestrial',
    barangay: 'Barangay Calapagan (Mati City coastal boundary)',
    city: 'Mati City',
    province: 'Davao Oriental',
    designation: 'Community-managed mangrove eco-park under local conservation ordinance',
    lat: 6.931,
    lng: 126.064,
    summary: 'Expansive mangrove belt acting as blue carbon sink and nursery for mud crabs, shorebirds, and juvenile fish.',
    description:
      'Calapagan’s boardwalk winds through mixed mangrove stands dominated by Rhizophora and Sonneratia species. At low tide, mudflats host waders and mudskippers, while channels shelter juvenile fish destined for offshore reefs.',
    features: [
      'Interpretive boardwalk built by community cooperatives',
      'Observation decks for migratory shorebirds',
      'Nursery areas for cultured mangrove-friendly aquasilviculture',
    ],
    stewardship:
      'Barangay Calapagan people’s organization in partnership with PENRO Davao Oriental and coastal resource management NGOs.',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',
    tags: ['Mangroves', 'Blue carbon', 'Birdwatching'],
    highlightSpeciesIds: [
      'rhizophora-mucronata',
      'collared-kingfisher',
      'mud-crab',
    ],
    floraIds: [
      'rhizophora-mucronata',
      'sonneratia-alba',
      'bruguiera-gymnorrhiza',
      'avicennia-marina',
    ],
    faunaIds: [
      'collared-kingfisher',
      'purple-heron',
      'mud-crab',
      'giant-mudskipper',
    ],
    visitorNotes:
      'Boardwalk visits are tide-dependent; best paired with guided interpretation to understand mangrove zoning.',
  },
]

export const SPECIES: SpeciesDetail[] = [
  {
    id: 'philippine-eagle',
    category: 'fauna',
    commonName: 'Philippine Eagle',
    scientificName: 'Pithecophaga jefferyi',
    status: 'CR',
    habitat: 'Old-growth dipterocarp and montane forests',
    blurb:
      'Apex forest raptor and national bird of the Philippines. Pairs require vast territories, making Mount Hamiguitan’s intact forests vital refuges.',
    siteIds: ['mount-hamiguitan'],
    highlights: [
      'Estimated wingspan of up to 2.2 meters',
      'Breeds every two years with a single chick',
      'Indicator of healthy, contiguous forest habitat',
    ],
    images: ['https://images.unsplash.com/photo-1508674861873-03b8998319d0?auto=format&fit=crop&w=1100&q=80'],
  },
  {
    id: 'hamiguitan-pitcher-plant',
    category: 'flora',
    commonName: 'Hamiguitan Pitcher Plant',
    scientificName: 'Nepenthes hamiguitanensis',
    status: 'EN',
    habitat: 'Ultramafic pygmy forests (1000–1200 m ASL)',
    blurb:
      'Endemic Nepenthes species with orange-speckled pitchers adapted to nutrient-poor soils by trapping insects.',
    siteIds: ['mount-hamiguitan'],
    highlights: [
      'Discovered in 2008 and described in 2010',
      'Pitchers reach 18 cm with translucent windows for luring prey',
      'Locally known as "banga-banga" by Mandaya communities',
    ],
    images: ['https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1100&q=80'],
  },
  {
    id: 'nepenthes-peltata',
    category: 'flora',
    commonName: 'Shielded Pitcher Plant',
    scientificName: 'Nepenthes peltata',
    status: 'EN',
    habitat: 'Montane ridges of Mount Hamiguitan',
    blurb:
      'Distinct pitchers with a shield-like petiole attachment, endemic to southeastern Mindanao’s ultramafic slopes.',
    siteIds: ['mount-hamiguitan'],
    highlights: [
      'Leaves possess peltate (shielded) tendrils',
      'Coexists with other Nepenthes creating pitcher-plant mosaics',
      'Sensitive to habitat disturbance and trampling',
    ],
  },
  {
    id: 'rafflesia-schadenbergiana',
    category: 'flora',
    commonName: 'Giant Rafflesia',
    scientificName: 'Rafflesia schadenbergiana',
    status: 'CR',
    habitat: 'Forest floor parasitic on Tetrastigma vines',
    blurb:
      'One of the largest flowers in the world (up to 80 cm diameter). Emits carrion scent to attract pollinating flies.',
    siteIds: ['mount-hamiguitan'],
    highlights: [
      'Bloom lasts 5–7 days and is extremely rare',
      'Rediscovered in Mount Hamiguitan after being presumed extinct in Mindanao',
      'Protection relies on safeguarding host vines and forest floor integrity',
    ],
  },
  {
    id: 'white-lauan',
    category: 'flora',
    commonName: 'White Lauan',
    scientificName: 'Shorea contorta',
    status: 'VU',
    habitat: 'Lowland dipterocarp forest',
    blurb:
      'Commercially valuable dipterocarp tree providing canopy structure and wildlife nesting cavities.',
    siteIds: ['mount-hamiguitan'],
    highlights: [
      'Key carbon sink in primary forests',
      'Wood prized for construction but protected within the sanctuary',
      'Seeds dispersed by wind; regeneration tied to mast fruiting events',
    ],
  },
  {
    id: 'mindanao-hornbill',
    category: 'fauna',
    commonName: 'Mindanao Hornbill',
    scientificName: 'Penelopides affinis',
    status: 'EN',
    habitat: 'Dipterocarp and secondary forests',
    blurb:
      'Also known as the Mindanao tarictic hornbill. Dependent on large tree cavities for nesting, making old-growth conservation critical.',
    siteIds: ['mount-hamiguitan'],
    highlights: [
      'Female seals herself inside nest cavity using mud and trampled wood pulp',
      'Frugivorous diet aids forest regeneration via seed dispersal',
    ],
  },
  {
    id: 'philippine-tarsier',
    category: 'fauna',
    commonName: 'Philippine Tarsier',
    scientificName: 'Carlito syrichta',
    status: 'NT',
    habitat: 'Low to mid-elevation secondary forest thickets',
    blurb:
      'Nocturnal primate with enormous eyes and silent leaps. Populations persist in dense understory pockets of Mount Hamiguitan.',
    siteIds: ['mount-hamiguitan'],
    highlights: [
      '360-degree head rotation aids insect hunting',
      'Sensitive to habitat fragmentation and human disturbance',
    ],
  },
  {
    id: 'philippine-warty-pig',
    category: 'fauna',
    commonName: 'Philippine Warty Pig',
    scientificName: 'Sus philippensis',
    status: 'VU',
    habitat: 'Forest edges and clearings',
    blurb:
      'Forest-dwelling pig recognized by facial warts and bristly mane. A key seed disperser and soil tiller within the sanctuary.',
    siteIds: ['mount-hamiguitan'],
    highlights: [
      'Browses on roots, tubers, and fruits',
      'Threatened by hunting and habitat loss outside protected zones',
    ],
  },
  {
    id: 'hamiguitan-tree-frog',
    category: 'fauna',
    commonName: 'Hamiguitan Tree Frog',
    scientificName: 'Lepidobatrachus hamiguitanensis',
    status: 'DD',
    habitat: 'High-elevation mossy forest leaf litter',
    blurb:
      'Recently described amphibian adapted to moist ultramafic substrates; data deficient due to limited surveys.',
    siteIds: ['mount-hamiguitan'],
    highlights: [
      'Camouflaged skin pattern blends with mosses and lichens',
      'Indicator of microhabitat moisture and forest integrity',
    ],
  },
  {
    id: 'dugong',
    category: 'fauna',
    commonName: 'Dugong',
    scientificName: 'Dugong dugon',
    status: 'VU',
    habitat: 'Seagrass meadows of Pujada Bay',
    blurb:
      'Herbivorous marine mammal reliant on dense seagrass beds. Sightings underscore the bay’s productivity.',
    siteIds: ['pujada-bay'],
    highlights: [
      'Feeds on Thalassia, Halodule, and Cymodocea species',
      'Slow reproduction makes populations vulnerable to disturbance',
      'Flagship species for community marine protected areas',
    ],
  },
  {
    id: 'green-sea-turtle',
    category: 'fauna',
    commonName: 'Green Sea Turtle',
    scientificName: 'Chelonia mydas',
    status: 'EN',
    habitat: 'Nearshore seagrass beds and nesting beaches',
    blurb:
      'Medium-sized turtle grazing on seagrass and algae. Females nest on Dahican Beach and adjacent sandy coves.',
    siteIds: ['pujada-bay', 'dahican-beach'],
    highlights: [
      'Juveniles recruit to seagrass meadows for foraging',
      'Conservation hinges on protecting nesting beaches and reducing bycatch',
    ],
  },
  {
    id: 'olive-ridley',
    category: 'fauna',
    commonName: 'Olive Ridley Turtle',
    scientificName: 'Lepidochelys olivacea',
    status: 'VU',
    habitat: 'Open-water foraging grounds and sandy nesting beaches',
    blurb:
      'Smallest of the globally roaming sea turtles. Dahican Beach patrols guard nests and guide hatchlings to the Davao Gulf.',
  siteIds: ['dahican-beach', 'pujada-bay'],
    highlights: [
      'Arribada-style mass nesters capable of laying over 100 eggs per clutch',
      'Nightly monitoring by Amihan sa Dahican volunteers reduces poaching and predation',
      'Juveniles forage on jellyfish, crustaceans, and algae within Mayo and Pujada Bays',
    ],
  },
  {
    id: 'hawksbill-turtle',
    category: 'fauna',
    commonName: 'Hawksbill Turtle',
    scientificName: 'Eretmochelys imbricata',
    status: 'CR',
    habitat: 'Coral reef slopes and nesting beaches',
    blurb:
      'Critically endangered turtle with distinctive overlapping scutes. Feeds on sponges and soft corals within the bay.',
    siteIds: ['pujada-bay', 'dahican-beach', 'waniban-island'],
    highlights: [
      'Key indicator for reef health and complexity',
      'Shell historically targeted for tortoiseshell trade—now strictly protected',
    ],
  },
  {
    id: 'spinner-dolphin',
    category: 'fauna',
    commonName: 'Spinner Dolphin',
    scientificName: 'Stenella longirostris',
    status: 'DD',
    habitat: 'Offshore waters of Mayo and Pujada Bays',
    blurb:
      'Small, agile dolphin famous for aerial spins. Pods rest near Dahican in the mornings before foraging offshore.',
    siteIds: ['pujada-bay', 'dahican-beach'],
    highlights: [
      'Up to seven spins in a single leap',
      'Sensitive to boat traffic; responsible wildlife viewing enforced by local guides',
    ],
  },
  {
    id: 'bottlenose-dolphin',
    category: 'fauna',
    commonName: 'Indo-Pacific Bottlenose Dolphin',
    scientificName: 'Tursiops aduncus',
    status: 'NT',
    habitat: 'Continental shelf and nearshore waters',
    blurb:
      'Frequently seen alongside spinner dolphins off Dahican, forming mixed-species groups during feeding bouts.',
    siteIds: ['dahican-beach'],
    highlights: [
      'Cooperative hunting behavior with bubbles and tail slaps',
      'Boats are encouraged to follow the Marine Wildlife Interaction Guidelines',
    ],
  },
  {
    id: 'giant-clam',
    category: 'fauna',
    commonName: 'Giant Clam',
    scientificName: 'Tridacna gigas',
    status: 'VU',
    habitat: 'Shallow coral reefs and lagoon floors',
    blurb:
      'Massive bivalve with symbiotic algae that provide energy via photosynthesis. Reintroduced to Pujada Bay through reseeding programs.',
    siteIds: ['pujada-bay', 'waniban-island'],
    highlights: [
      'Shells can reach 1.3 meters in length',
      'Filter-feeding improves water clarity',
      'Seeds distributed by Marine Protected Area Network volunteers',
    ],
  },
  {
    id: 'clownfish',
    category: 'fauna',
    commonName: 'Clark’s Anemonefish',
    scientificName: 'Amphiprion clarkii',
    status: 'LC',
    habitat: 'Shallow coral reefs with host anemones',
    blurb:
      'Bright reef fish forming symbiotic relationships with sea anemones around Waniban Island’s patch reefs.',
    siteIds: ['waniban-island'],
    highlights: [
      'Mucus coating protects them from anemone stings',
      'Sequential hermaphrodites—dominant individual becomes female',
    ],
  },
  {
    id: 'blacktip-reef-shark',
    category: 'fauna',
    commonName: 'Blacktip Reef Shark',
    scientificName: 'Carcharhinus melanopterus',
    status: 'NT',
    habitat: 'Shallow sandy flats and reef edges',
    blurb:
      'Juveniles patrol Waniban’s shallows; adults cruise reef drop-offs. Indicator of healthy trophic web.',
    siteIds: ['waniban-island'],
    highlights: [
      'Recognizable black tips on fins even from the surface',
      'Requires undisturbed nursery zones for pups',
    ],
  },
  {
    id: 'thalassia-hemprichii',
    category: 'flora',
    commonName: 'Sickle Seagrass',
    scientificName: 'Thalassia hemprichii',
    status: 'LC',
    habitat: 'Shallow sandy lagoons up to 10 m depth',
    blurb:
      'Dominant seagrass species in Pujada Bay forming dense meadows that stabilize sediments and feed dugongs.',
    siteIds: ['pujada-bay', 'waniban-island'],
    highlights: [
      'Rhizomes knit sand and reduce erosion',
      'Supports rich epiphytic communities of invertebrates',
    ],
  },
  {
    id: 'enhalus-acoroides',
    category: 'flora',
    commonName: 'Tape Seagrass',
    scientificName: 'Enhalus acoroides',
    status: 'LC',
    habitat: 'Soft-bottom shallow subtidal zones',
    blurb:
      'Broad-leaved seagrass producing buoyant seeds eaten by fish, sea turtles, and dugongs in the bay.',
    siteIds: ['pujada-bay'],
    highlights: [
      'Long strap-like leaves up to 1.5 m',
      'Flowers pollinated underwater and at the surface',
    ],
  },
  {
    id: 'rhizophora-mucronata',
    category: 'flora',
    commonName: 'Loop-root Mangrove',
    scientificName: 'Rhizophora mucronata',
    status: 'LC',
    habitat: 'Mangrove estuaries and tidal creeks',
    blurb:
      'Key structural mangrove species dominating Calapagan’s boardwalk zone and acting as nursery habitat for crabs and fish.',
    siteIds: ['pujada-bay', 'calapagan-mangrove'],
    highlights: [
      'Prop roots buffer storm surge and trap sediments',
      'Viviparous propagules drift and colonize new shorelines',
    ],
  },
  {
    id: 'sonneratia-alba',
    category: 'flora',
  commonName: 'Pagatpat (Mangrove Apple)',
    scientificName: 'Sonneratia alba',
    status: 'LC',
    habitat: 'River mouths and seaward mangrove fringes',
    blurb:
      'Broad-canopied mangrove with snorkel-like pneumatophores lining Calapagan’s tidal creeks, providing perches for roosting shorebirds.',
    siteIds: ['calapagan-mangrove'],
    highlights: [
      'White, brush-like nocturnal flowers attract bats for pollination',
      'Conical pneumatophores aerate roots during low tide exposures',
      'Edible fruit locally processed into juice and jams',
    ],
  },
  {
    id: 'bruguiera-gymnorrhiza',
    category: 'flora',
    commonName: 'Large-Leaved Orange Mangrove',
    scientificName: 'Bruguiera gymnorrhiza',
    status: 'LC',
    habitat: 'Mid-intertidal mangrove forests',
    blurb:
      'Stilt-rooted mangrove species forming the mid-story of Calapagan’s boardwalk, stabilizing creek banks and filtering sediments.',
    siteIds: ['calapagan-mangrove'],
    highlights: [
      'Viviparous cigar-shaped propagules spear into mud to establish new stands',
      'Bark rich in tannins traditionally used for dyeing and medicine',
      'Supports resident mudcrabs and juvenile fish seeking shade and structure',
    ],
  },
  {
    id: 'avicennia-marina',
    category: 'flora',
    commonName: 'Grey Mangrove',
    scientificName: 'Avicennia marina',
    status: 'LC',
    habitat: 'Seaward mangrove fringe',
    blurb:
      'Salt-tolerant mangrove with pneumatophores that aerate roots in Calapagan and Pujada Bay.',
    siteIds: ['pujada-bay', 'calapagan-mangrove'],
    highlights: [
      'Leaves excrete excess salt through specialized glands',
      'Pneumatophores provide perches for shorebirds at low tide',
    ],
  },
  {
    id: 'sargassum-polycystum',
    category: 'flora',
    commonName: 'Bubble Brown Algae',
    scientificName: 'Sargassum polycystum',
    status: 'LC',
    habitat: 'Subtidal rocky and sandy substrates',
    blurb:
      'Brown macroalgae forming seasonal drifts that shelter juvenile fish around Pujada and Waniban reefs.',
    siteIds: ['pujada-bay', 'waniban-island'],
    highlights: [
      'Contains air bladders (pneumatocysts) keeping fronds buoyant',
      'Harvested sustainably for fertilizers by coastal communities',
    ],
  },
  {
    id: 'casuarina-equisetifolia',
    category: 'flora',
    commonName: 'Agoho (Beach She-oak)',
    scientificName: 'Casuarina equisetifolia',
    status: 'LC',
    habitat: 'Coastal strand forests and dunes',
    blurb:
      'Wind-resistant tree stabilizing beach ridges along Dahican and providing roosts for shorebirds.',
    siteIds: ['dahican-beach'],
    highlights: [
      'Needle-like branchlets reduce water loss',
      'Roots fix nitrogen through actinomycete symbiosis',
    ],
  },
  {
    id: 'pandanus-tectorius',
    category: 'flora',
    commonName: 'Screwpine',
    scientificName: 'Pandanus tectorius',
    status: 'LC',
    habitat: 'Coastal thickets and sandy beaches',
    blurb:
      'Aerial-stilted screwpine producing fibrous leaves used in weaving; fruit drupes feed fruit bats along Dahican.',
    siteIds: ['dahican-beach'],
    highlights: [
      'Roots anchor dunes and prevent erosion',
      'Leaves woven into traditional mats and handicrafts',
    ],
  },
  {
    id: 'ipomoea-pes-caprae',
    category: 'flora',
    commonName: 'Beach Morning Glory',
    scientificName: 'Ipomoea pes-caprae',
    status: 'LC',
    habitat: 'Foredune vegetation',
    blurb:
      'Creeping vine with purple flowers forming the first line of defense against dune erosion along Dahican.',
    siteIds: ['dahican-beach'],
    highlights: [
      'Rapid growth stabilizes sand and traps windblown sediments',
      'Flowers attract pollinators like bees and butterflies',
    ],
  },
  {
    id: 'collared-kingfisher',
    category: 'fauna',
    commonName: 'Collared Kingfisher',
    scientificName: 'Todiramphus chloris',
    status: 'LC',
    habitat: 'Mangroves and coastal woodlands',
    blurb:
      'Vivid blue-and-white kingfisher patrolling the Calapagan boardwalk for crabs, insects, and small fish.',
    siteIds: ['calapagan-mangrove'],
    highlights: [
      'Distinctive loud “kilit” calls echo through mangrove canopy',
      'Nest hollows excavated in soft wood and termite mounds',
    ],
  },
  {
    id: 'purple-heron',
    category: 'fauna',
    commonName: 'Purple Heron',
    scientificName: 'Ardea purpurea',
    status: 'LC',
    habitat: 'Mangrove creeks, wetlands, and rice paddies',
    blurb:
      'Wading bird seen stalking in Calapagan mudflats at low tide, indicating productive estuarine food webs.',
    siteIds: ['calapagan-mangrove'],
    highlights: [
      'Flexible neck allows lightning-fast strikes at fish and crustaceans',
      'Breeds in colonies within dense mangrove stands',
    ],
  },
  {
    id: 'mud-crab',
    category: 'fauna',
    commonName: 'Giant Mud Crab',
    scientificName: 'Scylla serrata',
    status: 'LC',
    habitat: 'Mangrove creeks and estuaries',
    blurb:
      'High-value crab cultured in mangrove-friendly aquasilviculture pens; indicator of healthy brackish nurseries.',
    siteIds: ['calapagan-mangrove'],
    highlights: [
      'Feeding on detritus and small organisms recycles nutrients',
      'Supports sustainable livelihoods when harvest quotas are enforced',
    ],
  },
  {
    id: 'giant-mudskipper',
    category: 'fauna',
    commonName: 'Giant Mudskipper',
    scientificName: 'Periophthalmodon schlosseri',
    status: 'LC',
    habitat: 'Intertidal mudflats and mangrove channels',
    blurb:
      'Amphibious fish that hops across mudbanks using its pectoral fins. Commonly seen along the Calapagan boardwalk.',
    siteIds: ['calapagan-mangrove'],
    highlights: [
      'Breathes air through a moist lining in its mouth and throat',
      'Territorial males excavate burrows and perform courtship displays',
    ],
  },
]

export type { SpeciesDetail as BiodiversitySpecies, Hotspot as BiodiversityHotspot }
