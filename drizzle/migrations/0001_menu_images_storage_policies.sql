CREATE POLICY "Menu images are publicly readable"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'menu-images');

CREATE POLICY "Authenticated users can upload menu images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'menu-images' AND owner = auth.uid());

CREATE POLICY "Owners can update their menu images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'menu-images' AND owner = auth.uid());

CREATE POLICY "Owners can delete their menu images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'menu-images' AND owner = auth.uid());
