-- Migration: Fix RLS policies and auto-create user_roles & profiles on signup
-- Issue: New users cannot insert products/transactions because they lack user_roles entry
-- Solution: Add trigger to auto-create user_roles with 'staff' role on auth.users insert

-- 1. Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default user_roles entry (staff role without branch)
  INSERT INTO public.user_roles (user_id, role, branch_id)
  VALUES (NEW.id, 'staff'::app_role, NULL)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Create default profiles entry
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- 2. Create trigger on auth.users for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Fix products RLS policy - allow users without branch to insert
DROP POLICY IF EXISTS "Users can insert products" ON public.products;
CREATE POLICY "Users can insert products (any branch)"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 4. Fix transaksi RLS policy - allow users without branch to insert
DROP POLICY IF EXISTS "Users can insert transactions (branch optional)" ON public.transaksi;
CREATE POLICY "Users can insert transactions (any branch)"
ON public.transaksi
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 5. Fix invoice RLS policy - allow users without branch to insert
DROP POLICY IF EXISTS "Users can insert invoices (branch optional)" ON public.invoice;
CREATE POLICY "Users can insert invoices (any branch)"
ON public.invoice
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 6. Fix pos_transaksi RLS policy - allow insert regardless of branch
DROP POLICY IF EXISTS "Users can insert POS transactions" ON public.pos_transaksi;
CREATE POLICY "Users can insert POS transactions (any branch)"
ON public.pos_transaksi
FOR INSERT
TO authenticated
WITH CHECK (TRUE);
