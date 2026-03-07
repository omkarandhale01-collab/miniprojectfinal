import React, { useEffect, useState } from 'react';
import { StudentLayout } from '@/components/layouts/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getActiveAnnouncements } from '@/db/api';
import type { Announcement } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Megaphone } from 'lucide-react';

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await getActiveAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">Stay updated with hostel news and notices</p>
        </div>

        <div className="grid gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48 bg-muted" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full bg-muted" />
                </CardContent>
              </Card>
            ))
          ) : announcements.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No announcements at the moment</p>
              </CardContent>
            </Card>
          ) : (
            announcements.map((announcement) => (
              <Card key={announcement.id} className="transition-smooth hover:shadow-md">
                <CardHeader>
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {announcement.title}
                      {announcement.priority === 'high' && (
                        <Badge variant="destructive">High Priority</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(announcement.created_at).toLocaleDateString()} at{' '}
                      {new Date(announcement.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{announcement.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
