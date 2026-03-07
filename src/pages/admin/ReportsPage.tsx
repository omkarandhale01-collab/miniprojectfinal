import React from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and view system reports</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="transition-smooth hover:shadow-md cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Student Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View comprehensive student information and statistics
              </p>
            </CardContent>
          </Card>

          <Card className="transition-smooth hover:shadow-md cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Room Occupancy Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analyze room occupancy rates and availability
              </p>
            </CardContent>
          </Card>

          <Card className="transition-smooth hover:shadow-md cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Fee Collection Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track fee payments and outstanding amounts
              </p>
            </CardContent>
          </Card>

          <Card className="transition-smooth hover:shadow-md cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Maintenance Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Review maintenance requests and resolution times
              </p>
            </CardContent>
          </Card>

          <Card className="transition-smooth hover:shadow-md cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Attendance Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View student attendance patterns and statistics
              </p>
            </CardContent>
          </Card>

          <Card className="transition-smooth hover:shadow-md cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Revenue Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analyze revenue trends and financial performance
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
