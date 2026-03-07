import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { getMaintenanceRequests, updateMaintenanceRequest } from '@/db/api';
import type { MaintenanceRequest } from '@/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function MaintenanceManagement() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await getMaintenanceRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load requests:', error);
      toast.error('Failed to load maintenance requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return;
    try {
      await updateMaintenanceRequest(selectedRequest.id, {
        status: newStatus as any,
        admin_notes: adminNotes,
        resolved_at: newStatus === 'completed' ? new Date().toISOString() : null,
      });
      toast.success('Request updated successfully');
      setIsDialogOpen(false);
      loadRequests();
    } catch (error) {
      console.error('Failed to update request:', error);
      toast.error('Failed to update request');
    }
  };

  const openDialog = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setNewStatus(request.status);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="secondary">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Management</h1>
          <p className="text-muted-foreground">Manage student maintenance requests</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Maintenance Requests</CardTitle>
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
                    <TableHead>Room</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No maintenance requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.student?.profile?.full_name || 'N/A'}</TableCell>
                        <TableCell>{request.room?.room_number || 'N/A'}</TableCell>
                        <TableCell className="font-medium">{request.title}</TableCell>
                        <TableCell className="capitalize">{request.priority}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => openDialog(request)}>
                            View & Update
                          </Button>
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
              <DialogTitle>Update Maintenance Request</DialogTitle>
              <DialogDescription>Update the status and add admin notes</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Request Details</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Title:</span> {selectedRequest.title}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Description:</span>{' '}
                      {selectedRequest.description}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Priority:</span>{' '}
                      {selectedRequest.priority}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin_notes">Admin Notes</Label>
                  <Textarea
                    id="admin_notes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateStatus}>Update</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
