import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  DoorOpen,
  DollarSign,
  ClipboardCheck,
  Wrench,
  Megaphone,
  FileText,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/admin/students', icon: Users },
  { name: 'Rooms', href: '/admin/rooms', icon: DoorOpen },
  { name: 'Fees', href: '/admin/fees', icon: DollarSign },
  { name: 'Attendance', href: '/admin/attendance', icon: ClipboardCheck },
  { name: 'Maintenance', href: '/admin/maintenance', icon: Wrench },
  { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { name: 'Reports', href: '/admin/reports', icon: FileText },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 border-r bg-sidebar shrink-0">
        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-smooth',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container py-6">{children}</div>
      </div>
    </div>
  );
}
