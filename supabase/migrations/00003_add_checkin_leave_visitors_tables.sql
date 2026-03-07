-- Create check_in_out table
CREATE TABLE IF NOT EXISTS check_in_out (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('in', 'out')) DEFAULT 'out',
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create leave_applications table
CREATE TABLE IF NOT EXISTS leave_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('sick', 'casual', 'emergency', 'other')),
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  reason TEXT NOT NULL,
  contact_during_leave TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  admin_remarks TEXT,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  visitor_phone TEXT NOT NULL,
  visitor_id_type TEXT NOT NULL CHECK (visitor_id_type IN ('national_id', 'passport', 'driving_license', 'other')),
  visitor_id_number TEXT NOT NULL,
  purpose TEXT NOT NULL,
  check_in_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  check_out_time TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('checked_in', 'checked_out')) DEFAULT 'checked_in',
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_check_in_out_student ON check_in_out(student_id);
CREATE INDEX idx_check_in_out_date ON check_in_out(date);
CREATE INDEX idx_leave_applications_student ON leave_applications(student_id);
CREATE INDEX idx_leave_applications_status ON leave_applications(status);
CREATE INDEX idx_visitors_student ON visitors(student_id);
CREATE INDEX idx_visitors_status ON visitors(status);

-- Enable RLS
ALTER TABLE check_in_out ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Check In/Out Policies
CREATE POLICY "Admins can manage all check-ins" ON check_in_out
  FOR ALL TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Students can view their own check-ins" ON check_in_out
  FOR SELECT TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE profile_id = auth.uid()
    )
  );

-- Leave Applications Policies
CREATE POLICY "Admins can manage all leave applications" ON leave_applications
  FOR ALL TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Students can view their own leave applications" ON leave_applications
  FOR SELECT TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Students can create leave applications" ON leave_applications
  FOR INSERT TO authenticated
  WITH CHECK (
    student_id IN (
      SELECT id FROM students WHERE profile_id = auth.uid()
    )
  );

-- Visitors Policies
CREATE POLICY "Admins can manage all visitors" ON visitors
  FOR ALL TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Students can view their own visitors" ON visitors
  FOR SELECT TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Students can register visitors" ON visitors
  FOR INSERT TO authenticated
  WITH CHECK (
    student_id IN (
      SELECT id FROM students WHERE profile_id = auth.uid()
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_check_in_out_timestamp
  BEFORE UPDATE ON check_in_out
  FOR EACH ROW
  EXECUTE FUNCTION update_hostel_rules_updated_at();

CREATE TRIGGER update_leave_applications_timestamp
  BEFORE UPDATE ON leave_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_hostel_rules_updated_at();

CREATE TRIGGER update_visitors_timestamp
  BEFORE UPDATE ON visitors
  FOR EACH ROW
  EXECUTE FUNCTION update_hostel_rules_updated_at();