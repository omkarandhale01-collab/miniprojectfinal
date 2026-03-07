import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { getAttendance, createAttendance, getStudents } from '@/db/api';
import type { Attendance, Student } from '@/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function AttendanceTracking() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    try {
      const [attendanceData, studentsData] = await Promise.all([
        getAttendance(selectedDate),
        getStudents(),
      ]);
      setAttendance(attendanceData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      const promises = students.map((student) => {
        const existing = attendance.find((a) => a.student_id === student.id);
        if (!existing) {
          return createAttendance({
            student_id: student.id,
            date: selectedDate,
            is_present: false,
          });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      toast.success('Attendance initialized');
      loadData();
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      toast.error('Failed to mark attendance');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance Tracking</h1>
            <p className="text-muted-foreground">Track student attendance records</p>
          </div>
          <Button onClick={handleMarkAttendance}>
            <Plus className="mr-2 h-4 w-4" />
            Initialize Attendance
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attendance Records</CardTitle>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-muted" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Present</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No attendance records for this date
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.student?.student_id}</TableCell>
                        <TableCell>{record.student?.profile?.full_name || 'N/A'}</TableCell>
                        <TableCell>{record.student?.room?.room_number || 'N/A'}</TableCell>
                        <TableCell>
                          {record.check_in_time
                            ? new Date(record.check_in_time).toLocaleTimeString()
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {record.check_out_time
                            ? new Date(record.check_out_time).toLocaleTimeString()
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={record.is_present} disabled />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
