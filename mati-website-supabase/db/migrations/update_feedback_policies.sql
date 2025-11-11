-- Update feedback policies to allow anonymous submissions and admin delete

-- Drop old policy
DROP POLICY IF EXISTS "feedback_insert_authenticated" ON public.feedback;

-- Create new policy allowing all to insert
CREATE POLICY "feedback_insert_all" ON public.feedback FOR INSERT WITH CHECK (true);

-- Add delete policy for admins
CREATE POLICY "feedback_delete_admin" ON public.feedback FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
