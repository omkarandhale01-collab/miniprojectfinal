import React, { useEffect, useState } from 'react';
import { StudentLayout } from '@/components/layouts/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DoorOpen, DollarSign, Wrench, Megaphone, AlertCircle } from 'lucide-react';
import { getStudentByProfileId, getStudentDashboardStats } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Student, StudentDashboardStats } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

  const loadData = async () => {
    if (!profile) return;
    try {
      const studentData = await getStudentByProfileId(profile.id);
      if (studentData) {
        setStudent(studentData);
        const statsData = await getStudentDashboardStats(studentData.id);
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Room Number',
      value: stats?.roomInfo?.room_number || 'Not Assigned',
      icon: DoorOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Pending Fees',
      value: stats?.pendingFees || 0,
      icon: DollarSign,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Maintenance Requests',
      value: stats?.maintenanceRequests || 0,
      icon: Wrench,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'New Announcements',
      value: stats?.recentAnnouncements || 0,
      icon: Megaphone,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
  ];

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {profile?.full_name || profile?.username}!
          </h1>
          <p className="text-muted-foreground">Here's your hostel information overview</p>
        </div>

        {!student && !loading && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>
                  Your student profile is not complete. Please contact the administrator to complete
                  your registration.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
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

        {student && stats?.roomInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Room Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Room Number</p>
                  <p className="font-medium">{stats.roomInfo.room_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Room Type</p>
                  <p className="font-medium capitalize">{stats.roomInfo.room_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Floor</p>
                  <p className="font-medium">{stats.roomInfo.floor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Fee</p>
                  <p className="font-medium">${stats.roomInfo.monthly_fee}</p>
                </div>
              </div>
              {stats.roomInfo.amenities && stats.roomInfo.amenities.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {stats.roomInfo.amenities.map((amenity: string) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="/student/fees"
                className="block p-3 rounded-lg border hover:bg-accent transition-smooth"
              >
                <div className="font-medium">View Fees</div>
                <div className="text-sm text-muted-foreground">Check your payment status</div>
              </a>
              <a
                href="/student/maintenance"
                className="block p-3 rounded-lg border hover:bg-accent transition-smooth"
              >
                <div className="font-medium">Submit Maintenance Request</div>
                <div className="text-sm text-muted-foreground">Report room issues</div>
              </a>
              <a
                href="/student/announcements"
                className="block p-3 rounded-lg border hover:bg-accent transition-smooth"
              >
                <div className="font-medium">View Announcements</div>
                <div className="text-sm text-muted-foreground">Stay updated with hostel news</div>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Student ID</p>
                <p className="font-medium">{student?.student_id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{profile?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{profile?.phone || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
