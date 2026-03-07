import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, User, DoorOpen, DollarSign, Wrench, Megaphone, BookOpen } from 'lucide-react';

interface StudentLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { name: 'Profile', href: '/student/profile', icon: User },
  { name: 'Room Info', href: '/student/room', icon: DoorOpen },
  { name: 'Fees', href: '/student/fees', icon: DollarSign },
  { name: 'Maintenance', href: '/student/maintenance', icon: Wrench },
  { name: 'Announcements', href: '/student/announcements', icon: Megaphone },
  { name: 'Hostel Rules', href: '/student/rules', icon: BookOpen },
];

export function StudentLayout({ children }: StudentLayoutProps) {
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
