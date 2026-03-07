import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, DollarSign } from 'lucide-react';
import { getFees, createFee, updateFee, getStudents } from '@/db/api';
import type { Fee, Student } from '@/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeesManagement() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    amount: 0,
    due_date: '',
    remarks: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [feesData, studentsData] = await Promise.all([getFees(), getStudents()]);
      setFees(feesData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load fees');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFee(formData);
      toast.success('Fee created successfully');
      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Failed to create fee:', error);
      toast.error('Failed to create fee');
    }
  };

  const handleMarkAsPaid = async (fee: Fee) => {
    try {
      await updateFee(fee.id, {
        status: 'paid',
        paid_date: new Date().toISOString().split('T')[0],
      });
      toast.success('Fee marked as paid');
      loadData();
    } catch (error) {
      console.error('Failed to update fee:', error);
      toast.error('Failed to update fee');
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      amount: 0,
      due_date: '',
      remarks: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="secondary">Paid</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
            <p className="text-muted-foreground">Track and manage student fee payments</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Fee
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Fees</CardTitle>
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
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No fees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    fees.map((fee) => (
                      <TableRow key={fee.id}>
                        <TableCell>{fee.student?.profile?.full_name || 'N/A'}</TableCell>
                        <TableCell className="font-medium">${fee.amount}</TableCell>
                        <TableCell>{new Date(fee.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {fee.paid_date ? new Date(fee.paid_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(fee.status)}</TableCell>
                        <TableCell>
                          {fee.status === 'pending' && (
                            <Button variant="outline" size="sm" onClick={() => handleMarkAsPaid(fee)}>
                              <DollarSign className="mr-2 h-4 w-4" />
                              Mark as Paid
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Fee</DialogTitle>
              <DialogDescription>Create a new fee record for a student</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student_id">Student</Label>
                <Select
                  value={formData.student_id}
                  onValueChange={(value) => setFormData({ ...formData, student_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.student_id} - {student.profile?.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
