import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsManagement from './pages/admin/StudentsManagement';
import RoomsManagement from './pages/admin/RoomsManagement';
import FeesManagement from './pages/admin/FeesManagement';
import AttendanceTracking from './pages/admin/AttendanceTracking';
import MaintenanceManagement from './pages/admin/MaintenanceManagement';
import AnnouncementsManagement from './pages/admin/AnnouncementsManagement';
import ReportsPage from './pages/admin/ReportsPage';
import HostelRulesManagement from './pages/admin/HostelRulesManagement';
import CheckInOutManagement from './pages/admin/CheckInOutManagement';
import LeaveApplicationsManagement from './pages/admin/LeaveApplicationsManagement';
import VisitorsManagement from './pages/admin/VisitorsManagement';
import AdminPanel from './pages/admin/AdminPanel';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentRoomInfo from './pages/student/StudentRoomInfo';
import StudentFees from './pages/student/StudentFees';
import StudentMaintenance from './pages/student/StudentMaintenance';
import StudentAnnouncements from './pages/student/StudentAnnouncements';
import StudentRulesPage from './pages/student/StudentRulesPage';
import StudentLeaveApplications from './pages/student/StudentLeaveApplications';
import StudentVisitors from './pages/student/StudentVisitors';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <LandingPage />,
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
  },
  // Admin Routes
  {
    name: 'Admin Dashboard',
    path: '/admin/dashboard',
    element: <AdminDashboard />,
  },
  {
    name: 'Students Management',
    path: '/admin/students',
    element: <StudentsManagement />,
  },
  {
    name: 'Rooms Management',
    path: '/admin/rooms',
    element: <RoomsManagement />,
  },
  {
    name: 'Check In/Out',
    path: '/admin/checkinout',
    element: <CheckInOutManagement />,
  },
  {
    name: 'Leave Applications',
    path: '/admin/leave',
    element: <LeaveApplicationsManagement />,
  },
  {
    name: 'Visitors',
    path: '/admin/visitors',
    element: <VisitorsManagement />,
  },
  {
    name: 'Fees Management',
    path: '/admin/fees',
    element: <FeesManagement />,
  },
  {
    name: 'Attendance Tracking',
    path: '/admin/attendance',
    element: <AttendanceTracking />,
  },
  {
    name: 'Maintenance Management',
    path: '/admin/maintenance',
    element: <MaintenanceManagement />,
  },
  {
    name: 'Announcements Management',
    path: '/admin/announcements',
    element: <AnnouncementsManagement />,
  },
  {
    name: 'Reports',
    path: '/admin/reports',
    element: <ReportsPage />,
  },
  {
    name: 'Hostel Rules Management',
    path: '/admin/rules',
    element: <HostelRulesManagement />,
  },
  {
    name: 'Admin Panel',
    path: '/admin/panel',
    element: <AdminPanel />,
  },
  // Student Routes
  {
    name: 'Student Dashboard',
    path: '/student/dashboard',
    element: <StudentDashboard />,
  },
  {
    name: 'Student Profile',
    path: '/student/profile',
    element: <StudentProfile />,
  },
  {
    name: 'Room Information',
    path: '/student/room',
    element: <StudentRoomInfo />,
  },
  {
    name: 'Fee Status',
    path: '/student/fees',
    element: <StudentFees />,
  },
  {
    name: 'Leave Applications',
    path: '/student/leave',
    element: <StudentLeaveApplications />,
  },
  {
    name: 'My Visitors',
    path: '/student/visitors',
    element: <StudentVisitors />,
  },
  {
    name: 'Maintenance Requests',
    path: '/student/maintenance',
    element: <StudentMaintenance />,
  },
  {
    name: 'Announcements',
    path: '/student/announcements',
    element: <StudentAnnouncements />,
  },
  {
    name: 'Hostel Rules',
    path: '/student/rules',
    element: <StudentRulesPage />,
  },
];

export default routes;
