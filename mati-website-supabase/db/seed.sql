-- Seed data for Mati City Biodiversity Platform
-- This populates the database with initial biodiversity data

-- Insert admin user (you'll need to create this user in Supabase Auth first)
-- Note: Replace with actual UUID from auth.users after creating admin user
-- INSERT INTO public.admins (id, email, role) VALUES
-- ('admin-uuid-here', 'admin@mati.city', 'super_admin');

-- Insert sites (hotspots)
INSERT INTO public.sites (id, name, type, barangay, city, province, designation, area_hectares, lat, lng, elevation_range_meters, summary, description, features, stewardship, image_url, tags, visitor_notes) VALUES
('mount-hamiguitan-sanctuary', 'Mount Hamiguitan Range Wildlife Sanctuary', 'terrestrial', 'Multiple (Eastern Mati City)', 'Mati City', 'Davao Oriental', 'UNESCO World Heritage Site • National Wildlife Sanctuary (RA 9303)', 6834, 6.740667, 126.182222, '[75,1620]', 'UNESCO World Heritage Site with unique pygmy forests and exceptional endemic biodiversity.', 'Mount Hamiguitan is Mindanao''s first UNESCO World Heritage Site, renowned for its unique pygmy forest ecosystem on ultramafic soils. The sanctuary harbors 462 plant species in montane forests, 338 in dipterocarp forests, and 246 in mossy forests. It hosts 45 orchid species (23 endemic to Philippines), several endemic Nepenthes pitcher plants, and critically endangered fauna including the Philippine Eagle.', ARRAY['First UNESCO World Heritage Site in Mindanao (2014)', 'Unique pygmy forest with century-old dwarf trees', 'Five endemic Nepenthes species including N. hamiguitanensis', 'Habitat for 11 IUCN Red List endangered vertebrates', 'Eastern Mindanao Biodiversity Corridor component', '45 orchid species with high endemism'], 'Protected Area Management Board (PAMB) comprising DENR, Davao Oriental LGUs, indigenous Mandaya and Kalagan communities, and scientific institutions.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mount_Hamiguitan_Range_Wildlife_Sanctuary_%2814%29.jpg/1200px-Mount_Hamiguitan_Range_Wildlife_Sanctuary_%2814%29.jpg', ARRAY['UNESCO World Heritage', 'Pygmy Forest', 'Endemic Species', 'Philippine Eagle', 'Pitcher Plants', 'Ultramafic Soil'], 'Strictly regulated access. Research permits required from PAMB. Indigenous guides available through local communities.'),
('pujada-bay-protected-seascape', 'Pujada Bay Protected Landscape and Seascape', 'marine', 'Multiple coastal barangays', 'Mati City', 'Davao Oriental', 'Protected Landscape and Seascape (Proclamation No. 431, 1994)', 21200, 6.8913, 126.2272, NULL, 'One of world''s most beautiful bays with extensive coral reefs, mangroves, and seagrass beds.', 'Pujada Bay is recognized by Les Plus Belles Baies du Monde as one of the world''s most beautiful bays. The bay features 25 genera of hard and soft corals dominated by Montipora, Acropora, and Porites. It contains 850 hectares of mangroves and harbors 9 of the 16 seagrass species found in the Philippines. Four islands dot the bay: Pujada Island (with lighthouse), Uanivan Island, Oak Island, and Ivy Island.', ARRAY['World''s Most Beautiful Bays club member (2022)', '25 genera of hard and soft corals', '850 hectares of mangrove forests', '9 out of 16 Philippine seagrass species', 'Four scenic islands within the bay', 'Traditional fishing grounds and tourism sites'], 'Protected Area Management Board with DENR, Mati City LGU, coastal barangays, fisherfolk organizations, and tourism operators.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Pujada_Bay_Mati_Davao_Oriental.jpg/1200px-Pujada_Bay_Mati_Davao_Oriental.jpg', ARRAY['World Beautiful Bay', 'Coral Reefs', 'Mangroves', 'Seagrass', 'Islands', 'Marine Protected Area'], NULL);

-- Insert species
INSERT INTO public.species (id, category, common_name, scientific_name, kingdom, phylum, class, taxonomic_order, family, genus, species, conservation_status, endemic, description, habitat, key_facts, threats, conservation_actions) VALUES
('philippine-eagle', 'fauna', 'Philippine Eagle', 'Pithecophaga jefferyi', 'Animalia', 'Chordata', 'Aves', 'Accipitriformes', 'Accipitridae', 'Pithecophaga', 'jefferyi', 'CR', true, 'The Philippine Eagle is one of the largest and most powerful eagles in the world, with a wingspan of up to 2 meters. It is critically endangered and endemic to the Philippines.', 'Tropical rainforests, particularly in Mindanao', ARRAY['Largest eagle in the Philippines', 'Wingspan up to 2 meters', 'Endemic to Philippines', 'Critically endangered'], ARRAY['Habitat loss', 'Hunting', 'Pesticide poisoning'], ARRAY['Habitat protection', 'Captive breeding programs', 'Anti-poaching patrols']),
('nepenthes-hamiguitanensis', 'flora', 'Hamiguitan Pitcher Plant', 'Nepenthes hamiguitanensis', 'Plantae', 'Tracheophyta', 'Magnoliopsida', 'Caryophyllales', 'Nepenthaceae', 'Nepenthes', 'hamiguitanensis', 'CR', true, 'A critically endangered pitcher plant endemic to Mount Hamiguitan, known for its distinctive pitcher shape and carnivorous nature.', 'Ultramafic soils in pygmy forests', ARRAY['Endemic to Mount Hamiguitan', 'Carnivorous plant', 'Critically endangered', 'Unique pitcher morphology'], ARRAY['Habitat destruction', 'Illegal collection', 'Mining activities'], ARRAY['Protected area management', 'Ex-situ conservation', 'Public education']),
('giant-clam', 'fauna', 'Giant Clam', 'Tridacna gigas', 'Animalia', 'Mollusca', 'Bivalvia', 'Cardiida', 'Cardiidae', 'Tridacna', 'gigas', 'VU', false, 'One of the largest bivalve mollusks, known for its symbiotic relationship with algae and important role in coral reef ecosystems.', 'Coral reefs in shallow tropical waters', ARRAY['Can weigh up to 200kg', 'Lives symbiotically with algae', 'Important for reef health'], ARRAY['Overfishing', 'Habitat destruction', 'Climate change'], ARRAY['Marine protected areas', 'Sustainable harvesting', 'Restoration projects']),
('green-sea-turtle', 'fauna', 'Green Sea Turtle', 'Chelonia mydas', 'Animalia', 'Chordata', 'Reptilia', 'Testudines', 'Cheloniidae', 'Chelonia', 'mydas', 'EN', false, 'Large sea turtle known for its herbivorous diet and important role in maintaining seagrass ecosystems.', 'Tropical and subtropical oceans, seagrass beds', ARRAY['Herbivorous diet', 'Migrates long distances', 'Important for seagrass health'], ARRAY['Bycatch', 'Habitat loss', 'Plastic pollution'], ARRAY['Turtle sanctuaries', 'Fishing gear modifications', 'Beach protection']);

-- Insert species-site relationships
INSERT INTO public.species_sites (species_id, site_id, is_highlight) VALUES
('philippine-eagle', 'mount-hamiguitan-sanctuary', true),
('nepenthes-hamiguitanensis', 'mount-hamiguitan-sanctuary', true),
('giant-clam', 'pujada-bay-protected-seascape', true),
('green-sea-turtle', 'pujada-bay-protected-seascape', true);

-- Insert media assets
INSERT INTO public.media_assets (species_id, site_id, type, url, credit, license, caption) VALUES
('philippine-eagle', 'mount-hamiguitan-sanctuary', 'image', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Philippine_Eagle.jpg/800px-Philippine_Eagle.jpg', 'Wikimedia Commons', 'CC BY-SA', 'Philippine Eagle in flight'),
('nepenthes-hamiguitanensis', 'mount-hamiguitan-sanctuary', 'image', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Nepenthes_hamiguitanensis.jpg/800px-Nepenthes_hamiguitanensis.jpg', 'Wikimedia Commons', 'CC BY-SA', 'Nepenthes hamiguitanensis pitcher plant'),
('giant-clam', 'pujada-bay-protected-seascape', 'image', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Tridacna_gigas.jpg/800px-Tridacna_gigas.jpg', 'Wikimedia Commons', 'CC BY-SA', 'Giant clam on coral reef');

-- Insert team members
INSERT INTO public.team_members (name, role, bio, email, avatar_url, social_links, sort_order) VALUES
('Dr. Maria Santos', 'Chief Biodiversity Officer', 'PhD in Ecology with 15 years experience in Philippine biodiversity conservation.', 'maria.santos@mati.city', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80', '{"linkedin": "https://linkedin.com/in/maria-santos", "researchgate": "https://researchgate.net/profile/maria-santos"}', 1),
('Dr. Antonio Reyes', 'Marine Ecologist', 'Specialist in coral reef ecosystems and marine protected areas.', 'antonio.reyes@mati.city', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', '{"linkedin": "https://linkedin.com/in/antonio-reyes"}', 2),
('Prof. Elena Cruz', 'Botanist', 'Expert in Philippine flora with focus on endemic species.', 'elena.cruz@mati.city', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', '{"linkedin": "https://linkedin.com/in/elena-cruz"}', 3);

-- Insert sample feedback
INSERT INTO public.feedback (email, message, user_agent, url, is_read) VALUES
('visitor@example.com', 'Amazing website! The biodiversity information is incredibly detailed and well-presented.', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '/biodiversity', true),
('researcher@university.edu', 'Could you add more detailed distribution maps for the species?', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '/species/philippine-eagle', false);

-- Insert sample analytics events
INSERT INTO public.analytics_events (event_type, event_data, url, user_agent) VALUES
('page_view', '{"page": "home", "referrer": "direct"}', '/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('species_view', '{"species_id": "philippine-eagle", "category": "fauna"}', '/species/philippine-eagle', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
('site_view', '{"site_id": "mount-hamiguitan-sanctuary", "type": "terrestrial"}', '/sites/mount-hamiguitan-sanctuary', 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36');

-- Insert sample performance metrics
INSERT INTO public.performance_metrics (metric_type, value, metadata, url) VALUES
('page_load_time', 2.3, '{"device": "desktop", "connection": "4g"}', '/'),
('page_load_time', 1.8, '{"device": "mobile", "connection": "4g"}', '/species/philippine-eagle'),
('render_time', 0.5, '{"component": "BiodiversityExplorer"}', '/biodiversity');