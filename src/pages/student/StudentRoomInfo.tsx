import React, { useEffect, useState } from 'react';
import { StudentLayout } from '@/components/layouts/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStudentByProfileId } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Student } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { DoorOpen, Users, DollarSign } from 'lucide-react';

export default function StudentRoomInfo() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      loadStudent();
    }
  }, [profile]);

  const loadStudent = async () => {
    if (!profile) return;
    try {
      const data = await getStudentByProfileId(profile.id);
      setStudent(data);
    } catch (error) {
      console.error('Failed to load student:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48 bg-muted" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-muted" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full bg-muted" />
            </CardContent>
          </Card>
        </div>
      </StudentLayout>
    );
  }

  if (!student?.room) {
    return (
      <StudentLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Room Information</h1>
            <p className="text-muted-foreground">View your assigned room details</p>
          </div>
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <DoorOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No room assigned yet. Please contact the administrator.</p>
            </CardContent>
          </Card>
        </div>
      </StudentLayout>
    );
  }

  const room = student.room;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Information</h1>
          <p className="text-muted-foreground">View your assigned room details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DoorOpen className="h-5 w-5" />
              Room {room.room_number}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <img
              src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_d892adf4-ee44-4995-8991-b6cbd674258b.jpg"
              alt="Room Amenities"
              className="w-full h-64 object-cover rounded-lg"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Room Type</p>
                <p className="font-medium capitalize">{room.room_type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Floor</p>
                <p className="font-medium">{room.floor}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-medium">{room.capacity} persons</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Occupied</p>
                <p className="font-medium">{room.occupied} persons</p>
              </div>
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity: string) => (
                    <Badge key={amenity} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Monthly Fee</span>
                </div>
                <span className="text-2xl font-bold text-primary">${room.monthly_fee}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="overflow-hidden">
            <img
              src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_b7f83c91-63fb-44ac-a82e-a2f3bc2c9321.jpg"
              alt="Bathroom"
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle className="text-base">Clean Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Well-maintained bathroom facilities with regular cleaning services
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Room Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Keep the room clean and tidy at all times</p>
              <p>• Report any maintenance issues immediately</p>
              <p>• Respect quiet hours (10 PM - 7 AM)</p>
              <p>• No smoking or alcohol in the rooms</p>
              <p>• Visitors must be registered at the reception</p>
              <p>• Pay monthly fees on time to avoid penalties</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
