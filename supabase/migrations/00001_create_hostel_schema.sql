-- Create user_role enum
CREATE TYPE public.user_role AS ENUM ('student', 'admin');

-- Create room_type enum
CREATE TYPE public.room_type AS ENUM ('single', 'double', 'triple', 'quad');

-- Create fee_status enum
CREATE TYPE public.fee_status AS ENUM ('pending', 'paid', 'overdue');

-- Create maintenance_status enum
CREATE TYPE public.maintenance_status AS ENUM ('pending', 'in_progress', 'completed', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create students table (extended profile info for students)
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  admission_date DATE DEFAULT CURRENT_DATE,
  room_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT UNIQUE NOT NULL,
  room_type public.room_type NOT NULL,
  floor INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  occupied INTEGER DEFAULT 0,
  monthly_fee DECIMAL(10, 2) NOT NULL,
  amenities TEXT[],
  is_available BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key to students table
ALTER TABLE public.students ADD CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE SET NULL;

-- Create fees table
CREATE TABLE public.fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status public.fee_status DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create maintenance_requests table
CREATE TABLE public.maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status public.maintenance_status DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  image_url TEXT,
  admin_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  is_present BOOLEAN DEFAULT FALSE,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  image_url TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('a3ic6c5x55hd_hostel_images', 'a3ic6c5x55hd_hostel_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for images
CREATE POLICY "Public read access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'a3ic6c5x55hd_hostel_images');

CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'a3ic6c5x55hd_hostel_images');

CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'a3ic6c5x55hd_hostel_images');

CREATE POLICY "Admins can delete" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'a3ic6c5x55hd_hostel_images' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(uid UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  INSERT INTO public.profiles (id, email, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'student'::public.user_role END
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Create public_profiles view
CREATE VIEW public.public_profiles AS
  SELECT id, username, full_name, role, avatar_url FROM public.profiles;

-- RLS Policies for students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to students" ON public.students
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Students can view their own data" ON public.students
  FOR SELECT TO authenticated USING (profile_id = auth.uid());

CREATE POLICY "Students can update their own data" ON public.students
  FOR UPDATE TO authenticated USING (profile_id = auth.uid());

-- RLS Policies for rooms
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to rooms" ON public.rooms
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Students can view rooms" ON public.rooms
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for fees
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to fees" ON public.fees
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Students can view their own fees" ON public.fees
  FOR SELECT TO authenticated USING (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid())
);

-- RLS Policies for maintenance_requests
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to maintenance" ON public.maintenance_requests
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Students can view their own requests" ON public.maintenance_requests
  FOR SELECT TO authenticated USING (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid())
);

CREATE POLICY "Students can create requests" ON public.maintenance_requests
  FOR INSERT TO authenticated WITH CHECK (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid())
);

-- RLS Policies for attendance
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to attendance" ON public.attendance
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Students can view their own attendance" ON public.attendance
  FOR SELECT TO authenticated USING (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid())
);

-- RLS Policies for announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to announcements" ON public.announcements
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Everyone can view active announcements" ON public.announcements
  FOR SELECT TO authenticated USING (is_active = true);