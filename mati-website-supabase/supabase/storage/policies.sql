-- Policies for Supabase Storage

-- Allow authenticated users to read their own files
create policy "Users can read their own files"
on storage.objects
for select
using (auth.uid() = owner);

-- Allow authenticated users to insert files
create policy "Users can insert files"
on storage.objects
for insert
with check (auth.uid() = owner);

-- Allow authenticated users to delete their own files
create policy "Users can delete their own files"
on storage.objects
for delete
using (auth.uid() = owner);