-- Create products table for POS catalog
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES public.branches(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  harga numeric NOT NULL CHECK (harga >= 0),
  stok integer NOT NULL DEFAULT 0 CHECK (stok >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow admin pusat to view all products
CREATE POLICY "Admin pusat can view all products"
ON public.products FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin_pusat'));

-- Users can view products for their branch or products they created
CREATE POLICY "Users can view their branch or own products"
ON public.products FOR SELECT
TO authenticated
USING (branch_id = public.get_user_branch(auth.uid()) OR user_id = auth.uid());

-- Users can insert products for their branch or without branch
CREATE POLICY "Users can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND (branch_id IS NULL OR branch_id = public.get_user_branch(auth.uid()))
);

-- Users can update their own products
CREATE POLICY "Users can update their products"
ON public.products FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Users can delete their own products
CREATE POLICY "Users can delete their products"
ON public.products FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Trigger to update updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
