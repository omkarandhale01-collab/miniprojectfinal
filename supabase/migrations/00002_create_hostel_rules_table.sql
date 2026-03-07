-- Create hostel_rules table
CREATE TABLE IF NOT EXISTS hostel_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('required', 'prohibited', 'info')),
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_hostel_rules_category ON hostel_rules(category);
CREATE INDEX idx_hostel_rules_active ON hostel_rules(is_active);

-- Enable RLS
ALTER TABLE hostel_rules ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read active rules
CREATE POLICY "Anyone can view active rules" ON hostel_rules
  FOR SELECT USING (is_active = true);

-- Policy: Admins can manage all rules
CREATE POLICY "Admins can manage rules" ON hostel_rules
  FOR ALL TO authenticated
  USING (is_admin(auth.uid()));

-- Insert default rules
INSERT INTO hostel_rules (category, title, description, rule_type, priority) VALUES
-- General Rules
('General Rules', 'ID Card Requirement', 'All residents must carry their ID cards at all times within the hostel premises', 'required', 1),
('General Rules', 'Cleanliness', 'Residents must maintain cleanliness in their rooms and common areas', 'required', 2),
('General Rules', 'Respect', 'Respect fellow residents and maintain a peaceful environment', 'required', 3),
('General Rules', 'Report Issues', 'Report any maintenance issues or damages immediately to the administration', 'required', 4),
('General Rules', 'Follow Instructions', 'Follow all instructions given by hostel staff and security personnel', 'required', 5),

-- Timing & Access
('Timing & Access', 'Gate Hours', 'Hostel gates open at 6:00 AM and close at 10:00 PM daily', 'required', 1),
('Timing & Access', 'Late Entry', 'Late entry after 10:00 PM requires prior permission from the warden', 'required', 2),
('Timing & Access', 'Quiet Hours', 'Quiet hours: 10:00 PM to 7:00 AM - maintain silence during these hours', 'required', 3),
('Timing & Access', 'Mess Timings', 'Mess timings: Breakfast (7-9 AM), Lunch (12-2 PM), Dinner (7-9 PM)', 'info', 4),
('Timing & Access', 'Study Room', 'Study room available 24/7 for students', 'info', 5),

-- Visitors & Guests
('Visitors & Guests', 'Visitor Registration', 'All visitors must register at the reception desk with valid ID', 'required', 1),
('Visitors & Guests', 'Common Areas Only', 'Visitors are allowed only in common areas, not in residential rooms', 'required', 2),
('Visitors & Guests', 'Visiting Hours', 'Visiting hours: 9:00 AM to 6:00 PM on weekdays, 9:00 AM to 8:00 PM on weekends', 'required', 3),
('Visitors & Guests', 'No Overnight Guests', 'Overnight guests are strictly prohibited', 'prohibited', 4),
('Visitors & Guests', 'Visitor Responsibility', 'Residents are responsible for their visitors behavior', 'required', 5),

-- Safety & Security
('Safety & Security', 'No Smoking', 'Smoking is strictly prohibited inside the hostel building', 'prohibited', 1),
('Safety & Security', 'No Open Flames', 'Use of candles, incense sticks, or open flames is not allowed', 'prohibited', 2),
('Safety & Security', 'Safety Equipment', 'Do not tamper with fire safety equipment or security cameras', 'prohibited', 3),
('Safety & Security', 'Emergency Exits', 'Keep emergency exits clear at all times', 'required', 4),
('Safety & Security', 'Report Suspicious Activity', 'Report any suspicious activity to security immediately', 'required', 5),
('Safety & Security', 'Electrical Appliances', 'Electrical appliances must be approved by hostel administration', 'required', 6),

-- Prohibited Items
('Prohibited Items', 'No Alcohol/Drugs', 'Alcohol and illegal substances are strictly prohibited', 'prohibited', 1),
('Prohibited Items', 'No Weapons', 'Weapons of any kind are not allowed', 'prohibited', 2),
('Prohibited Items', 'No Pets', 'Pets are not permitted in the hostel', 'prohibited', 3),
('Prohibited Items', 'No Cooking Equipment', 'Cooking equipment (hot plates, electric stoves) in rooms is prohibited', 'prohibited', 4),
('Prohibited Items', 'No Gambling', 'Gambling or any illegal activities are strictly forbidden', 'prohibited', 5),

-- Room & Property
('Room & Property', 'No Damage', 'Do not modify or damage hostel property', 'prohibited', 1),
('Room & Property', 'Lost Keys', 'Lost keys must be reported immediately - replacement fee applies', 'required', 2),
('Room & Property', 'Room Changes', 'Room changes require approval from hostel administration', 'required', 3),
('Room & Property', 'Lock Rooms', 'Keep rooms locked when not present', 'required', 4),
('Room & Property', 'Damage Liability', 'Residents are liable for damages caused to hostel property', 'required', 5),

-- Noise & Disturbance
('Noise & Disturbance', 'No Loud Music', 'Playing loud music or creating noise disturbance is prohibited', 'prohibited', 1),
('Noise & Disturbance', 'Use Headphones', 'Use headphones for personal entertainment devices', 'required', 2),
('Noise & Disturbance', 'No Parties', 'No parties or gatherings in rooms without prior permission', 'prohibited', 3),
('Noise & Disturbance', 'Common Area Hours', 'Common areas must be vacated by 10:00 PM', 'required', 4),

-- Food & Dining
('Food & Dining', 'Dining Cleanliness', 'Maintain cleanliness in the dining hall', 'required', 1),
('Food & Dining', 'No Food Waste', 'Do not waste food - take only what you can consume', 'required', 2),
('Food & Dining', 'Return Utensils', 'Return trays and utensils to designated areas', 'required', 3),
('Food & Dining', 'Outside Food', 'Outside food delivery is allowed but must be consumed in designated areas', 'info', 4);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hostel_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_hostel_rules_timestamp
  BEFORE UPDATE ON hostel_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_hostel_rules_updated_at();