import React, { useEffect, useState } from 'react';
import { StudentLayout } from '@/components/layouts/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getStudentByProfileId, getFeesByStudentId } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Fee } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function StudentFees() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      loadFees();
    }
  }, [profile]);

  const loadFees = async () => {
    if (!profile) return;
    try {
      const student = await getStudentByProfileId(profile.id);
      if (student) {
        const feesData = await getFeesByStudentId(student.id);
        setFees(feesData);
      }
    } catch (error) {
      console.error('Failed to load fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="secondary">
            <CheckCircle className="mr-1 h-3 w-3" />
            Paid
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const totalAmount = fees.reduce((sum, fee) => sum + Number(fee.amount), 0);
  const paidAmount = fees
    .filter((f) => f.status === 'paid')
    .reduce((sum, fee) => sum + Number(fee.amount), 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Status</h1>
          <p className="text-muted-foreground">View your fee payment history and status</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">${paidAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">${pendingAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-muted" />
                ))}
              </div>
            ) : fees.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No fee records found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">${fee.amount}</TableCell>
                      <TableCell>{new Date(fee.due_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {fee.paid_date ? new Date(fee.paid_date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(fee.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {fee.remarks || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Fees must be paid by the due date to avoid late penalties</p>
            <p>• Payment can be made at the hostel office during working hours</p>
            <p>• Keep your payment receipt for future reference</p>
            <p>• Contact the administrator for any payment-related queries</p>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
