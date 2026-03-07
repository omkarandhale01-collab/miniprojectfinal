import React, { useEffect, useState } from 'react';
import { StudentLayout } from '@/components/layouts/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Users } from 'lucide-react';
import { getVisitorsByStudentId, createVisitor, getStudentByProfileId } from '@/db/api';
import type { Visitor } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [studentId, setStudentId] = useState<string>('');
  const { profile } = useAuth();

  const [formData, setFormData] = useState({
    visitor_name: '',
    visitor_phone: '',
    visitor_id_type: 'national_id' as 'national_id' | 'passport' | 'driving_license' | 'other',
    visitor_id_number: '',
    purpose: '',
  });

  useEffect(() => {
    loadData();
  }, [profile]);

  const loadData = async () => {
    if (!profile) return;
    try {
      const student = await getStudentByProfileId(profile.id);
      if (student) {
        setStudentId(student.id);
        const visitorData = await getVisitorsByStudentId(student.id);
        setVisitors(visitorData);
      }
    } catch (error) {
      console.error('Failed to load visitors:', error);
      toast.error('Failed to load visitor records');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      toast.error('Student information not found');
      return;
    }
    try {
      await createVisitor(formData, studentId);
      toast.success('Visitor registered successfully');
      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Failed to register visitor:', error);
      toast.error('Failed to register visitor');
    }
  };

  const resetForm = () => {
    setFormData({
      visitor_name: '',
      visitor_phone: '',
      visitor_id_type: 'national_id',
      visitor_id_number: '',
      purpose: '',
    });
  };

  const activeVisitors = visitors.filter((v) => v.status === 'checked_in').length;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Visitors</h1>
            <p className="text-muted-foreground">Register and track your visitors</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Register Visitor
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitors.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currently In Hostel</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{activeVisitors}</div>
            </CardContent>
          </Card>
        </div>

        {/* Visitor Guidelines */}
        <Card className="bg-primary/5 border-primary">
          <CardHeader>
            <CardTitle className="text-base">Visitor Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• All visitors must register at the reception with valid ID</p>
            <p>• Visitors are allowed only in common areas</p>
            <p>• Visiting hours: 9:00 AM - 6:00 PM (weekdays), 9:00 AM - 8:00 PM (weekends)</p>
            <p>• Overnight guests are strictly prohibited</p>
            <p>• You are responsible for your visitor's behavior</p>
          </CardContent>
        </Card>

        {/* Visitors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Visitor History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-muted" />
                ))}
              </div>
            ) : visitors.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No visitor records yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="font-medium">{visitor.visitor_name}</TableCell>
                      <TableCell>{visitor.visitor_phone}</TableCell>
                      <TableCell>{visitor.purpose}</TableCell>
                      <TableCell>{new Date(visitor.check_in_time).toLocaleString()}</TableCell>
                      <TableCell>
                        {visitor.check_out_time
                          ? new Date(visitor.check_out_time).toLocaleString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {visitor.status === 'checked_in' ? (
                          <Badge variant="secondary">Checked In</Badge>
                        ) : (
                          <Badge variant="outline">Checked Out</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Register Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register Visitor</DialogTitle>
              <DialogDescription>Register a new visitor to the hostel</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="visitor_name">Visitor Name</Label>
                <Input
                  id="visitor_name"
                  value={formData.visitor_name}
                  onChange={(e) => setFormData({ ...formData, visitor_name: e.target.value })}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitor_phone">Phone Number</Label>
                <Input
                  id="visitor_phone"
                  value={formData.visitor_phone}
                  onChange={(e) => setFormData({ ...formData, visitor_phone: e.target.value })}
                  placeholder="Contact number"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visitor_id_type">ID Type</Label>
                  <Select
                    value={formData.visitor_id_type}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, visitor_id_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national_id">National ID</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="driving_license">Driving License</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitor_id_number">ID Number</Label>
                  <Input
                    id="visitor_id_number"
                    value={formData.visitor_id_number}
                    onChange={(e) =>
                      setFormData({ ...formData, visitor_id_number: e.target.value })
                    }
                    placeholder="ID number"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Visit</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Reason for visiting"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Register Visitor</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </StudentLayout>
  );
}
