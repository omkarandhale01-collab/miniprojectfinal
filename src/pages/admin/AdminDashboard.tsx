import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DoorOpen, Wrench, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { getDashboardStats } from '@/db/api';
import type { DashboardStats } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Rooms',
      value: stats?.totalRooms || 0,
      icon: DoorOpen,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Occupied Rooms',
      value: stats?.occupiedRooms || 0,
      icon: TrendingUp,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      title: 'Pending Maintenance',
      value: stats?.pendingMaintenance || 0,
      icon: Wrench,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Pending Fees',
      value: stats?.pendingFees || 0,
      icon: AlertCircle,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the hostel management system</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24 bg-muted" />
                    <Skeleton className="h-8 w-8 rounded-full bg-muted" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 bg-muted" />
                  </CardContent>
                </Card>
              ))
            : statCards.map((stat, index) => (
                <Card key={index} className="transition-smooth hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="/admin/students"
                className="block p-3 rounded-lg border hover:bg-accent transition-smooth"
              >
                <div className="font-medium">Manage Students</div>
                <div className="text-sm text-muted-foreground">Add, edit, or remove students</div>
              </a>
              <a
                href="/admin/rooms"
                className="block p-3 rounded-lg border hover:bg-accent transition-smooth"
              >
                <div className="font-medium">Manage Rooms</div>
                <div className="text-sm text-muted-foreground">View and allocate rooms</div>
              </a>
              <a
                href="/admin/fees"
                className="block p-3 rounded-lg border hover:bg-accent transition-smooth"
              >
                <div className="font-medium">Fee Management</div>
                <div className="text-sm text-muted-foreground">Track and manage payments</div>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Room Occupancy</span>
                <span className="font-medium">
                  {stats ? `${((stats.occupiedRooms / stats.totalRooms) * 100).toFixed(1)}%` : '0%'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Issues</span>
                <span className="font-medium">{stats?.pendingMaintenance || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Outstanding Fees</span>
                <span className="font-medium">{stats?.pendingFees || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
