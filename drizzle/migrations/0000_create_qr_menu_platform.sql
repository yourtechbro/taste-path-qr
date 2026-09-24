-- Restaurants
CREATE TABLE public.restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  logo_url text,
  address text,
  phone text,
  whatsapp text,
  google_maps_url text,
  google_review_url text,
  instagram_url text,
  google_rating numeric(2,1),
  google_review_count integer,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.restaurants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.restaurants TO authenticated;
GRANT ALL ON public.restaurants TO service_role;

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published restaurants are viewable by everyone"
  ON public.restaurants FOR SELECT TO anon, authenticated
  USING (is_published OR owner_id = auth.uid());

CREATE POLICY "Owners can insert their restaurant"
  ON public.restaurants FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their restaurant"
  ON public.restaurants FOR UPDATE TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete their restaurant"
  ON public.restaurants FOR DELETE TO authenticated
  USING (owner_id = auth.uid());

-- Helper: can the current request read this restaurant's menu?
CREATE OR REPLACE FUNCTION public.can_view_restaurant(_restaurant_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.id = _restaurant_id AND (r.is_published OR r.owner_id = auth.uid())
  )
$$;

CREATE OR REPLACE FUNCTION public.owns_restaurant(_restaurant_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.id = _restaurant_id AND r.owner_id = auth.uid()
  )
$$;

-- Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX categories_restaurant_idx ON public.categories(restaurant_id, position);

GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories of visible restaurants are readable"
  ON public.categories FOR SELECT TO anon, authenticated
  USING (public.can_view_restaurant(restaurant_id));

CREATE POLICY "Owners manage categories insert"
  ON public.categories FOR INSERT TO authenticated
  WITH CHECK (public.owns_restaurant(restaurant_id));

CREATE POLICY "Owners manage categories update"
  ON public.categories FOR UPDATE TO authenticated
  USING (public.owns_restaurant(restaurant_id)) WITH CHECK (public.owns_restaurant(restaurant_id));

CREATE POLICY "Owners manage categories delete"
  ON public.categories FOR DELETE TO authenticated
  USING (public.owns_restaurant(restaurant_id));

-- Menu items
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text,
  is_veg boolean NOT NULL DEFAULT true,
  is_available boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX menu_items_restaurant_idx ON public.menu_items(restaurant_id, position);

GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Menu items of visible restaurants are readable"
  ON public.menu_items FOR SELECT TO anon, authenticated
  USING (public.can_view_restaurant(restaurant_id));

CREATE POLICY "Owners manage items insert"
  ON public.menu_items FOR INSERT TO authenticated
  WITH CHECK (public.owns_restaurant(restaurant_id));

CREATE POLICY "Owners manage items update"
  ON public.menu_items FOR UPDATE TO authenticated
  USING (public.owns_restaurant(restaurant_id)) WITH CHECK (public.owns_restaurant(restaurant_id));

CREATE POLICY "Owners manage items delete"
  ON public.menu_items FOR DELETE TO authenticated
  USING (public.owns_restaurant(restaurant_id));

-- Demo restaurant
INSERT INTO public.restaurants (id, slug, name, description, address, phone, whatsapp, google_maps_url, google_review_url, instagram_url, google_rating, google_review_count, is_published)
VALUES (
  '11111111-1111-4111-8111-111111111111',
  'spice-garden',
  'The Spice Garden',
  'Slow-cooked regional Indian cooking, served from a small kitchen in the old quarter.',
  '14 Lane 3, Hauz Khas, New Delhi 110016',
  '+911140001234',
  '911140001234',
  'https://maps.google.com/?q=Hauz+Khas+New+Delhi',
  'https://search.google.com/local/writereview?placeid=ChIJLfyY2E4uDW0R',
  'https://instagram.com/thespicegarden',
  4.8,
  1240,
  true
);

INSERT INTO public.categories (id, restaurant_id, name, position) VALUES
  ('22222222-0001-4111-8111-111111111111','11111111-1111-4111-8111-111111111111','Starters',1),
  ('22222222-0002-4111-8111-111111111111','11111111-1111-4111-8111-111111111111','Main Course',2),
  ('22222222-0003-4111-8111-111111111111','11111111-1111-4111-8111-111111111111','Biryani',3),
  ('22222222-0004-4111-8111-111111111111','11111111-1111-4111-8111-111111111111','Beverages',4),
  ('22222222-0005-4111-8111-111111111111','11111111-1111-4111-8111-111111111111','Desserts',5);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, image_url, is_veg, is_available, position) VALUES
  ('11111111-1111-4111-8111-111111111111','22222222-0001-4111-8111-111111111111','Paneer Tikka','Cottage cheese marinated in yoghurt and spice, grilled over charcoal.',220,'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=70&auto=format&fit=crop',true,true,1),
  ('11111111-1111-4111-8111-111111111111','22222222-0001-4111-8111-111111111111','Punjabi Samosa','Flaky pastry filled with spiced potato and peas, served with tamarind chutney.',90,'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=70&auto=format&fit=crop',true,true,2),
  ('11111111-1111-4111-8111-111111111111','22222222-0001-4111-8111-111111111111','Tandoori Chicken','Half bird marinated overnight, finished in the clay oven.',340,'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&q=70&auto=format&fit=crop',false,true,3),
  ('11111111-1111-4111-8111-111111111111','22222222-0002-4111-8111-111111111111','Butter Chicken','Tandoori chicken in a silky tomato and cream gravy, finished with butter.',320,'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=70&auto=format&fit=crop',false,true,1),
  ('11111111-1111-4111-8111-111111111111','22222222-0002-4111-8111-111111111111','Dal Makhani','Black lentils simmered overnight with butter and cream.',240,'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=70&auto=format&fit=crop',true,true,2),
  ('11111111-1111-4111-8111-111111111111','22222222-0002-4111-8111-111111111111','Palak Paneer','Cottage cheese in a smooth spinach gravy with garlic and cumin.',260,'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=800&q=70&auto=format&fit=crop',true,true,3),
  ('11111111-1111-4111-8111-111111111111','22222222-0003-4111-8111-111111111111','Chicken Biryani','Aromatic basmati rice layered with tender chicken, saffron and fried onion.',280,'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=70&auto=format&fit=crop',false,true,1),
  ('11111111-1111-4111-8111-111111111111','22222222-0003-4111-8111-111111111111','Mutton Dum Biryani','Slow-sealed handi biryani with tender mutton and whole spices.',380,'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=70&auto=format&fit=crop',false,true,2),
  ('11111111-1111-4111-8111-111111111111','22222222-0003-4111-8111-111111111111','Veg Dum Biryani','Seasonal vegetables and basmati sealed and cooked on slow coal.',240,'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=800&q=70&auto=format&fit=crop',true,true,3),
  ('11111111-1111-4111-8111-111111111111','22222222-0004-4111-8111-111111111111','Masala Chai','Slow-brewed tea with ginger, cardamom and milk.',60,'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=70&auto=format&fit=crop',true,true,1),
  ('11111111-1111-4111-8111-111111111111','22222222-0004-4111-8111-111111111111','Mango Lassi','Churned yoghurt blended with Alphonso mango and a hint of cardamom.',150,'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=70&auto=format&fit=crop',true,false,2),
  ('11111111-1111-4111-8111-111111111111','22222222-0004-4111-8111-111111111111','Fresh Lime Soda','Sweet or salted, pressed to order.',80,'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=70&auto=format&fit=crop',true,true,3),
  ('11111111-1111-4111-8111-111111111111','22222222-0005-4111-8111-111111111111','Gulab Jamun','Warm milk dumplings soaked in cardamom syrup.',120,'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?w=800&q=70&auto=format&fit=crop',true,true,1),
  ('11111111-1111-4111-8111-111111111111','22222222-0005-4111-8111-111111111111','Kulfi Falooda','Saffron kulfi with vermicelli, rose syrup and basil seeds.',160,'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&q=70&auto=format&fit=crop',true,true,2);
