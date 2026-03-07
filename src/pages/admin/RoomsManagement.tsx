import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { getRooms, createRoom, updateRoom, deleteRoom } from '@/db/api';
import type { Room, RoomType } from '@/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';

export default function RoomsManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [formData, setFormData] = useState({
    room_number: '',
    room_type: 'double' as RoomType,
    floor: 1,
    capacity: 2,
    monthly_fee: 0,
    amenities: [] as string[],
  });

  const amenitiesList = ['WiFi', 'AC', 'Attached Bathroom', 'Study Table', 'Wardrobe', 'TV'];

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, formData);
        toast.success('Room updated successfully');
      } else {
        await createRoom(formData);
        toast.success('Room created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      loadRooms();
    } catch (error) {
      console.error('Failed to save room:', error);
      toast.error('Failed to save room');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      await deleteRoom(id);
      toast.success('Room deleted successfully');
      loadRooms();
    } catch (error) {
      console.error('Failed to delete room:', error);
      toast.error('Failed to delete room');
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      room_number: room.room_number,
      room_type: room.room_type,
      floor: room.floor,
      capacity: room.capacity,
      monthly_fee: room.monthly_fee,
      amenities: room.amenities || [],
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      room_number: '',
      room_type: 'double',
      floor: 1,
      capacity: 2,
      monthly_fee: 0,
      amenities: [],
    });
    setEditingRoom(null);
  };

  const filteredRooms = rooms.filter((room) =>
    room.room_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rooms Management</h1>
            <p className="text-muted-foreground">Manage hostel rooms and availability</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Rooms</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
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
                    <TableHead>Room Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Occupied</TableHead>
                    <TableHead>Monthly Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No rooms found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.room_number}</TableCell>
                        <TableCell className="capitalize">{room.room_type}</TableCell>
                        <TableCell>{room.floor}</TableCell>
                        <TableCell>{room.capacity}</TableCell>
                        <TableCell>{room.occupied}</TableCell>
                        <TableCell>${room.monthly_fee}</TableCell>
                        <TableCell>
                          {room.is_available ? (
                            <Badge variant="secondary">Available</Badge>
                          ) : (
                            <Badge variant="destructive">Full</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(room)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(room.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
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
              <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
              <DialogDescription>
                {editingRoom ? 'Update room information' : 'Create a new room'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room_number">Room Number</Label>
                  <Input
                    id="room_number"
                    value={formData.room_number}
                    onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room_type">Room Type</Label>
                  <Select
                    value={formData.room_type}
                    onValueChange={(value: RoomType) =>
                      setFormData({ ...formData, room_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="triple">Triple</SelectItem>
                      <SelectItem value="quad">Quad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    type="number"
                    min="1"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="monthly_fee">Monthly Fee ($)</Label>
                  <Input
                    id="monthly_fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthly_fee}
                    onChange={(e) =>
                      setFormData({ ...formData, monthly_fee: Number(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                amenities: [...formData.amenities, amenity],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                amenities: formData.amenities.filter((a) => a !== amenity),
                              });
                            }
                          }}
                        />
                        <Label htmlFor={amenity} className="text-sm font-normal">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
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
                <Button type="submit">{editingRoom ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
