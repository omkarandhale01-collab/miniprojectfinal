// User and Profile Types
export type UserRole = 'student' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  username: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicProfile {
  id: string;
  username: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
}

// Student Types
export type RoomType = 'single' | 'double' | 'triple' | 'quad';

export interface Student {
  id: string;
  profile_id: string;
  student_id: string;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  admission_date: string;
  room_id: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  room?: Room;
}

// Room Types
export interface Room {
  id: string;
  room_number: string;
  room_type: RoomType;
  floor: number;
  capacity: number;
  occupied: number;
  monthly_fee: number;
  amenities: string[];
  is_available: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Fee Types
export type FeeStatus = 'pending' | 'paid' | 'overdue';

export interface Fee {
  id: string;
  student_id: string;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: FeeStatus;
  payment_method: string | null;
  transaction_id: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
}

// Maintenance Request Types
export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export interface MaintenanceRequest {
  id: string;
  student_id: string;
  room_id: string;
  title: string;
  description: string;
  status: MaintenanceStatus;
  priority: string;
  image_url: string | null;
  admin_notes: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
  room?: Room;
}

// Attendance Types
export interface Attendance {
  id: string;
  student_id: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  is_present: boolean;
  remarks: string | null;
  created_at: string;
  student?: Student;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  image_url: string | null;
  created_by: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  creator?: Profile;
}

// Hostel Rules Types
export type RuleType = 'required' | 'prohibited' | 'info';

export interface HostelRule {
  id: string;
  category: string;
  title: string;
  description: string;
  rule_type: RuleType;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Check In/Out Types
export type CheckInOutStatus = 'in' | 'out';

export interface CheckInOut {
  id: string;
  student_id: string;
  check_in_time: string | null;
  check_out_time: string | null;
  date: string;
  status: CheckInOutStatus;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
}

// Leave Application Types
export type LeaveType = 'sick' | 'casual' | 'emergency' | 'other';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveApplication {
  id: string;
  student_id: string;
  leave_type: LeaveType;
  from_date: string;
  to_date: string;
  reason: string;
  contact_during_leave: string | null;
  status: LeaveStatus;
  admin_remarks: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
  approver?: Profile;
}

// Visitor Types
export type VisitorIdType = 'national_id' | 'passport' | 'driving_license' | 'other';
export type VisitorStatus = 'checked_in' | 'checked_out';

export interface Visitor {
  id: string;
  student_id: string;
  visitor_name: string;
  visitor_phone: string;
  visitor_id_type: VisitorIdType;
  visitor_id_number: string;
  purpose: string;
  check_in_time: string;
  check_out_time: string | null;
  status: VisitorStatus;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalStudents: number;
  totalRooms: number;
  occupiedRooms: number;
  pendingMaintenance: number;
  pendingFees: number;
  totalRevenue: number;
}

export interface StudentDashboardStats {
  roomInfo: Room | null;
  pendingFees: number;
  totalFees: number;
  maintenanceRequests: number;
  recentAnnouncements: number;
}

// Form Types
export interface LoginFormData {
  username: string;
  password: string;
}

export interface StudentFormData {
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  room_id?: string;
}

export interface RoomFormData {
  room_number: string;
  room_type: RoomType;
  floor: number;
  capacity: number;
  monthly_fee: number;
  amenities: string[];
  image_url?: string;
}

export interface FeeFormData {
  student_id: string;
  amount: number;
  due_date: string;
  remarks?: string;
}

export interface MaintenanceFormData {
  title: string;
  description: string;
  priority: string;
  image_url?: string;
}

export interface AnnouncementFormData {
  title: string;
  content: string;
  priority: string;
  image_url?: string;
}

export interface HostelRuleFormData {
  category: string;
  title: string;
  description: string;
  rule_type: RuleType;
  priority: number;
}

export interface CheckInOutFormData {
  student_id: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  status: CheckInOutStatus;
  remarks?: string;
}

export interface LeaveApplicationFormData {
  leave_type: LeaveType;
  from_date: string;
  to_date: string;
  reason: string;
  contact_during_leave?: string;
}

export interface VisitorFormData {
  visitor_name: string;
  visitor_phone: string;
  visitor_id_type: VisitorIdType;
  visitor_id_number: string;
  purpose: string;
}

export interface AttendanceFormData {
  student_id: string;
  date: string;
  is_present: boolean;
  check_in_time?: string;
  check_out_time?: string;
  remarks?: string;
}
