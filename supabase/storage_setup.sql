-- Run AFTER creating a Storage bucket named "media" (see README step 4).
-- These policies let anyone VIEW files (needed for the public site to show
-- images) but only admins can upload/replace/delete.

create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

create policy "admin upload media" on storage.objects
  for insert with check (bucket_id = 'media' and is_admin());

create policy "admin update media" on storage.objects
  for update using (bucket_id = 'media' and is_admin());

create policy "admin delete media" on storage.objects
  for delete using (bucket_id = 'media' and is_admin());
