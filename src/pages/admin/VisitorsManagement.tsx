import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserCheck, UserX, LogOut } from 'lucide-react';
import { getVisitors, getActiveVisitors, checkOutVisitor } from '@/db/api';
import type { Visitor } from '@/types';
import { toast } from 'sonner';

export default function VisitorsManagement() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [activeVisitors, setActiveVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allVisitors, active] = await Promise.all([getVisitors(), getActiveVisitors()]);
      setVisitors(allVisitors);
      setActiveVisitors(active);
    } catch (error) {
      console.error('Failed to load visitors:', error);
      toast.error('Failed to load visitor records');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (id: string) => {
    try {
      await checkOutVisitor(id);
      toast.success('Visitor checked out successfully');
      loadData();
    } catch (error) {
      console.error('Failed to check out visitor:', error);
      toast.error('Failed to check out visitor');
    }
  };

  const checkedOutCount = visitors.filter((v) => v.status === 'checked_out').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visitors Management</h1>
          <p className="text-muted-foreground">Track and manage hostel visitors</p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
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
              <CardTitle className="text-sm font-medium">Currently In</CardTitle>
              <UserCheck className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{activeVisitors.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Checked Out</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{checkedOutCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
              <Users className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">
                {
                  visitors.filter(
                    (v) =>
                      new Date(v.check_in_time).toDateString() === new Date().toDateString()
                  ).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visitors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Visitor Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">Active ({activeVisitors.length})</TabsTrigger>
                <TabsTrigger value="all">All Visitors</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-4">
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full bg-muted" />
                    ))}
                  </div>
                ) : activeVisitors.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No active visitors
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Visitor Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Visiting Student</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Check In Time</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeVisitors.map((visitor) => (
                        <TableRow key={visitor.id}>
                          <TableCell className="font-medium">{visitor.visitor_name}</TableCell>
                          <TableCell>{visitor.visitor_phone}</TableCell>
                          <TableCell>
                            {visitor.student?.profile?.full_name || 'N/A'}
                          </TableCell>
                          <TableCell>{visitor.purpose}</TableCell>
                          <TableCell>
                            {new Date(visitor.check_in_time).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCheckOut(visitor.id)}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Check Out
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
                ) : visitors.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No visitor records found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Visitor Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>ID Type</TableHead>
                        <TableHead>ID Number</TableHead>
                        <TableHead>Visiting Student</TableHead>
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
                          <TableCell className="capitalize">
                            {visitor.visitor_id_type.replace('_', ' ')}
                          </TableCell>
                          <TableCell>{visitor.visitor_id_number}</TableCell>
                          <TableCell>
                            {visitor.student?.profile?.full_name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {new Date(visitor.check_in_time).toLocaleString()}
                          </TableCell>
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
