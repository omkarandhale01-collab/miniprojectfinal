import { supabase } from './supabase';
import type {
  Profile,
  Student,
  Room,
  Fee,
  MaintenanceRequest,
  Attendance,
  Announcement,
  HostelRule,
  DashboardStats,
  StudentDashboardStats,
  StudentFormData,
  RoomFormData,
  FeeFormData,
  MaintenanceFormData,
  AnnouncementFormData,
  HostelRuleFormData,
  AttendanceFormData,
} from '@/types';

// Profile API
export async function getCurrentProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', (await supabase.auth.getUser()).data.user?.id || '')
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Student API
export async function getStudents(limit = 50, offset = 0): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      profile:profiles!students_profile_id_fkey(*),
      room:rooms!students_room_id_fkey(*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getStudentById(id: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      profile:profiles!students_profile_id_fkey(*),
      room:rooms!students_room_id_fkey(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getStudentByProfileId(profileId: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      profile:profiles!students_profile_id_fkey(*),
      room:rooms!students_room_id_fkey(*)
    `)
    .eq('profile_id', profileId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createStudent(studentData: StudentFormData, profileId: string): Promise<Student> {
  // First create profile
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: studentData.full_name,
      email: studentData.email,
      phone: studentData.phone,
    })
    .eq('id', profileId)
    .select()
    .single();

  if (profileError) throw profileError;

  // Then create student record
  const { data, error } = await supabase
    .from('students')
    .insert({
      profile_id: profileId,
      student_id: studentData.student_id,
      date_of_birth: studentData.date_of_birth || null,
      gender: studentData.gender || null,
      address: studentData.address || null,
      emergency_contact_name: studentData.emergency_contact_name || null,
      emergency_contact_phone: studentData.emergency_contact_phone || null,
      room_id: studentData.room_id || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStudent(id: string): Promise<void> {
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) throw error;
}

// Room API
export async function getRooms(limit = 50, offset = 0): Promise<Room[]> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('room_number', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getAvailableRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('is_available', true)
    .order('room_number', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getRoomById(id: string): Promise<Room | null> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createRoom(roomData: RoomFormData): Promise<Room> {
  const { data, error } = await supabase
    .from('rooms')
    .insert({
      ...roomData,
      occupied: 0,
      is_available: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRoom(id: string, updates: Partial<Room>): Promise<Room> {
  const { data, error } = await supabase
    .from('rooms')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRoom(id: string): Promise<void> {
  const { error } = await supabase.from('rooms').delete().eq('id', id);
  if (error) throw error;
}

// Fee API
export async function getFees(limit = 50, offset = 0): Promise<Fee[]> {
  const { data, error } = await supabase
    .from('fees')
    .select(`
      *,
      student:students!fees_student_id_fkey(
        *,
        profile:profiles!students_profile_id_fkey(*)
      )
    `)
    .order('due_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getFeesByStudentId(studentId: string): Promise<Fee[]> {
  const { data, error } = await supabase
    .from('fees')
    .select('*')
    .eq('student_id', studentId)
    .order('due_date', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createFee(feeData: FeeFormData): Promise<Fee> {
  const { data, error } = await supabase
    .from('fees')
    .insert(feeData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFee(id: string, updates: Partial<Fee>): Promise<Fee> {
  const { data, error } = await supabase
    .from('fees')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFee(id: string): Promise<void> {
  const { error } = await supabase.from('fees').delete().eq('id', id);
  if (error) throw error;
}

// Maintenance Request API
export async function getMaintenanceRequests(limit = 50, offset = 0): Promise<MaintenanceRequest[]> {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select(`
      *,
      student:students!maintenance_requests_student_id_fkey(
        *,
        profile:profiles!students_profile_id_fkey(*)
      ),
      room:rooms!maintenance_requests_room_id_fkey(*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getMaintenanceRequestsByStudentId(studentId: string): Promise<MaintenanceRequest[]> {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select(`
      *,
      room:rooms!maintenance_requests_room_id_fkey(*)
    `)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createMaintenanceRequest(
  requestData: MaintenanceFormData,
  studentId: string,
  roomId: string
): Promise<MaintenanceRequest> {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .insert({
      ...requestData,
      student_id: studentId,
      room_id: roomId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMaintenanceRequest(
  id: string,
  updates: Partial<MaintenanceRequest>
): Promise<MaintenanceRequest> {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMaintenanceRequest(id: string): Promise<void> {
  const { error } = await supabase.from('maintenance_requests').delete().eq('id', id);
  if (error) throw error;
}

// Attendance API
export async function getAttendance(date?: string, limit = 50, offset = 0): Promise<Attendance[]> {
  let query = supabase
    .from('attendance')
    .select(`
      *,
      student:students!attendance_student_id_fkey(
        *,
        profile:profiles!students_profile_id_fkey(*)
      )
    `)
    .order('date', { ascending: false });

  if (date) {
    query = query.eq('date', date);
  }

  const { data, error } = await query.range(offset, offset + limit - 1);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getAttendanceByStudentId(studentId: string): Promise<Attendance[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createAttendance(attendanceData: AttendanceFormData): Promise<Attendance> {
  const { data, error } = await supabase
    .from('attendance')
    .insert(attendanceData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAttendance(id: string, updates: Partial<Attendance>): Promise<Attendance> {
  const { data, error } = await supabase
    .from('attendance')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Announcement API
export async function getAnnouncements(limit = 50, offset = 0): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select(`
      *,
      creator:profiles!announcements_created_by_fkey(*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createAnnouncement(
  announcementData: AnnouncementFormData,
  createdBy: string
): Promise<Announcement> {
  const { data, error } = await supabase
    .from('announcements')
    .insert({
      ...announcementData,
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement> {
  const { data, error } = await supabase
    .from('announcements')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) throw error;
}

// Dashboard Stats API
export async function getDashboardStats(): Promise<DashboardStats> {
  const [studentsRes, roomsRes, maintenanceRes, feesRes] = await Promise.all([
    supabase.from('students').select('id', { count: 'exact', head: true }),
    supabase.from('rooms').select('id, occupied', { count: 'exact' }),
    supabase
      .from('maintenance_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase.from('fees').select('status, amount'),
  ]);

  const totalStudents = studentsRes.count || 0;
  const totalRooms = roomsRes.count || 0;
  const occupiedRooms = roomsRes.data?.filter((r) => r.occupied > 0).length || 0;
  const pendingMaintenance = maintenanceRes.count || 0;

  const fees = Array.isArray(feesRes.data) ? feesRes.data : [];
  const pendingFees = fees.filter((f) => f.status === 'pending').length;
  const totalRevenue = fees.filter((f) => f.status === 'paid').reduce((sum, f) => sum + Number(f.amount), 0);

  return {
    totalStudents,
    totalRooms,
    occupiedRooms,
    pendingMaintenance,
    pendingFees,
    totalRevenue,
  };
}

export async function getStudentDashboardStats(studentId: string): Promise<StudentDashboardStats> {
  const student = await getStudentById(studentId);
  const fees = await getFeesByStudentId(studentId);
  const maintenanceRequests = await getMaintenanceRequestsByStudentId(studentId);
  const announcements = await getActiveAnnouncements();

  const pendingFees = fees.filter((f) => f.status === 'pending').length;
  const totalFees = fees.reduce((sum, f) => sum + Number(f.amount), 0);

  return {
    roomInfo: student?.room || null,
    pendingFees,
    totalFees,
    maintenanceRequests: maintenanceRequests.length,
    recentAnnouncements: announcements.slice(0, 5).length,
  };
}

// Hostel Rules API
export async function getHostelRules(): Promise<HostelRule[]> {
  const { data, error } = await supabase
    .from('hostel_rules')
    .select('*')
    .order('category', { ascending: true })
    .order('priority', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getActiveHostelRules(): Promise<HostelRule[]> {
  const { data, error } = await supabase
    .from('hostel_rules')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('priority', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getHostelRulesByCategory(category: string): Promise<HostelRule[]> {
  const { data, error } = await supabase
    .from('hostel_rules')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('priority', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createHostelRule(formData: HostelRuleFormData): Promise<void> {
  const { error } = await supabase.from('hostel_rules').insert([formData]);

  if (error) throw error;
}

export async function updateHostelRule(
  id: string,
  formData: Partial<HostelRuleFormData>
): Promise<void> {
  const { error } = await supabase.from('hostel_rules').update(formData).eq('id', id);

  if (error) throw error;
}

export async function deleteHostelRule(id: string): Promise<void> {
  const { error } = await supabase.from('hostel_rules').delete().eq('id', id);

  if (error) throw error;
}

export async function toggleHostelRuleStatus(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from('hostel_rules')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) throw error;
}
