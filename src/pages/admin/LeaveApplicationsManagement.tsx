import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import {
  getLeaveApplications,
  getPendingLeaveApplications,
  updateLeaveApplicationStatus,
} from '@/db/api';
import type { LeaveApplication } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function LeaveApplicationsManagement() {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [pendingApplications, setPendingApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<LeaveApplication | null>(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const { profile } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allApps, pendingApps] = await Promise.all([
        getLeaveApplications(),
        getPendingLeaveApplications(),
      ]);
      setApplications(allApps);
      setPendingApplications(pendingApps);
    } catch (error) {
      console.error('Failed to load applications:', error);
      toast.error('Failed to load leave applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedApplication || !profile) return;
    try {
      await updateLeaveApplicationStatus(
        selectedApplication.id,
        'approved',
        adminRemarks,
        profile.id
      );
      toast.success('Leave application approved');
      setIsDialogOpen(false);
      setAdminRemarks('');
      loadData();
    } catch (error) {
      console.error('Failed to approve:', error);
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async () => {
    if (!selectedApplication || !profile) return;
    try {
      await updateLeaveApplicationStatus(
        selectedApplication.id,
        'rejected',
        adminRemarks,
        profile.id
      );
      toast.success('Leave application rejected');
      setIsDialogOpen(false);
      setAdminRemarks('');
      loadData();
    } catch (error) {
      console.error('Failed to reject:', error);
      toast.error('Failed to reject application');
    }
  };

  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Applications</h1>
          <p className="text-muted-foreground">Manage student leave requests</p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">{pendingApplications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{approvedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{rejectedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
                <TabsTrigger value="all">All Applications</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4">
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full bg-muted" />
                    ))}
                  </div>
                ) : pendingApplications.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No pending applications
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Leave Type</TableHead>
                        <TableHead>From Date</TableHead>
                        <TableHead>To Date</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">
                            {app.student?.profile?.full_name || 'N/A'}
                          </TableCell>
                          <TableCell className="capitalize">{app.leave_type}</TableCell>
                          <TableCell>{new Date(app.from_date).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(app.to_date).toLocaleDateString()}</TableCell>
                          <TableCell className="max-w-xs truncate">{app.reason}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedApplication(app);
                                setIsDialogOpen(true);
                              }}
                            >
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              <TabsContent value="all" className="mt-4">
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full bg-muted" />
                    ))}
                  </div>
                ) : applications.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No applications found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Leave Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">
                            {app.student?.profile?.full_name || 'N/A'}
                          </TableCell>
                          <TableCell className="capitalize">{app.leave_type}</TableCell>
                          <TableCell>
                            {new Date(app.from_date).toLocaleDateString()} -{' '}
                            {new Date(app.to_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {app.status === 'approved' && (
                              <Badge variant="secondary">Approved</Badge>
                            )}
                            {app.status === 'rejected' && (
                              <Badge variant="destructive">Rejected</Badge>
                            )}
                            {app.status === 'pending' && <Badge variant="outline">Pending</Badge>}
                          </TableCell>
                          <TableCell>
                            {new Date(app.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Review Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Leave Application</DialogTitle>
              <DialogDescription>Approve or reject the leave request</DialogDescription>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Student</Label>
                    <p className="font-medium">
                      {selectedApplication.student?.profile?.full_name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Leave Type</Label>
                    <p className="font-medium capitalize">{selectedApplication.leave_type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">From Date</Label>
                    <p className="font-medium">
                      {new Date(selectedApplication.from_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">To Date</Label>
                    <p className="font-medium">
                      {new Date(selectedApplication.to_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Reason</Label>
                  <p className="mt-1">{selectedApplication.reason}</p>
                </div>
                {selectedApplication.contact_during_leave && (
                  <div>
                    <Label className="text-muted-foreground">Contact During Leave</Label>
                    <p className="mt-1">{selectedApplication.contact_during_leave}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="admin_remarks">Admin Remarks</Label>
                  <Textarea
                    id="admin_remarks"
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    placeholder="Add your remarks (optional)"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setAdminRemarks('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="button" variant="destructive" onClick={handleReject}>
                    Reject
                  </Button>
                  <Button type="button" onClick={handleApprove}>
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
