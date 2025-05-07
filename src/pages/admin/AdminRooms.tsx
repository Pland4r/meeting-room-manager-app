
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Room } from '@/models/types';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const AdminRooms = () => {
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [isEditingRoom, setIsEditingRoom] = useState<number | null>(null);

  // Form state for new room
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: '',
    capacity: 0,
    location: '',
    features: [],
    isAvailable: true
  });

  // Form state for feature input
  const [featureInput, setFeatureInput] = useState('');

  // Fetch room data
  const { data: rooms = [], refetch } = useQuery({
    queryKey: ['admin-rooms'],
    queryFn: api.getRooms
  });

  // Handle adding a new feature
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    
    setNewRoom(prev => ({
      ...prev,
      features: [...(prev.features || []), featureInput.trim()]
    }));
    
    setFeatureInput('');
  };

  // Handle removing a feature
  const handleRemoveFeature = (indexToRemove: number) => {
    setNewRoom(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, index) => index !== indexToRemove)
    }));
  };

  // Handle form submission for new room
  const handleCreateRoom = async () => {
    // In a real app, this would call an API
    // For now, let's simulate adding a room to the mock data
    try {
      await api.createRoom(newRoom as Room);
      toast.success("Room created successfully");
      refetch();
      setIsAddingRoom(false);
      // Reset form
      setNewRoom({
        name: '',
        capacity: 0,
        location: '',
        features: [],
        isAvailable: true
      });
    } catch (error) {
      toast.error("Failed to create room");
      console.error(error);
    }
  };

  // Handle editing a room
  const handleEditRoom = (room: Room) => {
    setIsEditingRoom(room.id);
    setNewRoom({ ...room });
  };

  // Handle saving edited room
  const handleSaveRoom = async () => {
    try {
      if (isEditingRoom !== null) {
        await api.updateRoom(isEditingRoom, newRoom);
        toast.success("Room updated successfully");
        refetch();
        setIsEditingRoom(null);
        // Reset form
        setNewRoom({
          name: '',
          capacity: 0,
          location: '',
          features: [],
          isAvailable: true
        });
      }
    } catch (error) {
      toast.error("Failed to update room");
      console.error(error);
    }
  };

  // Handle toggling room availability
  const handleToggleAvailability = async (roomId: number, isAvailable: boolean) => {
    try {
      await api.updateRoom(roomId, { isAvailable: !isAvailable });
      toast.success(`Room ${isAvailable ? 'disabled' : 'enabled'} successfully`);
      refetch();
    } catch (error) {
      toast.error("Failed to update room availability");
      console.error(error);
    }
  };

  // Handle deleting a room
  const handleDeleteRoom = async (roomId: number) => {
    if (window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      try {
        await api.deleteRoom(roomId);
        toast.success("Room deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete room");
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
          <p className="text-muted-foreground">
            Add, edit, or delete meeting rooms
          </p>
        </div>
        <Sheet open={isAddingRoom} onOpenChange={setIsAddingRoom}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Add New Room
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Add New Room</SheetTitle>
              <SheetDescription>
                Fill in the details to add a new meeting room
              </SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name</Label>
                <Input 
                  id="name" 
                  value={newRoom.name} 
                  onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                  placeholder="Enter room name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={newRoom.location} 
                  onChange={(e) => setNewRoom({...newRoom, location: e.target.value})}
                  placeholder="Enter room location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input 
                  id="capacity" 
                  type="number" 
                  value={newRoom.capacity || ''} 
                  onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value) || 0})}
                  placeholder="Enter room capacity"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex gap-2">
                  <Input 
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add feature"
                  />
                  <Button type="button" onClick={handleAddFeature}>Add</Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {newRoom.features?.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex gap-1 items-center">
                      {feature}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 p-0 ml-1" 
                        onClick={() => handleRemoveFeature(index)}
                      >
                        <Trash size={12} />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  checked={newRoom.isAvailable || false}
                  onCheckedChange={(checked) => setNewRoom({...newRoom, isAvailable: checked})}
                />
                <Label>Available for booking</Label>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button onClick={handleCreateRoom}>
                  Create Room
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Edit Room Sheet */}
        {isEditingRoom !== null && (
          <Sheet open={isEditingRoom !== null} onOpenChange={() => setIsEditingRoom(null)}>
            <SheetContent className="sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Edit Room</SheetTitle>
                <SheetDescription>
                  Update room details
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                {/* Same form fields as Add New Room */}
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Room Name</Label>
                  <Input 
                    id="edit-name" 
                    value={newRoom.name} 
                    onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                    placeholder="Enter room name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input 
                    id="edit-location" 
                    value={newRoom.location} 
                    onChange={(e) => setNewRoom({...newRoom, location: e.target.value})}
                    placeholder="Enter room location"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">Capacity</Label>
                  <Input 
                    id="edit-capacity" 
                    type="number" 
                    value={newRoom.capacity || ''} 
                    onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value) || 0})}
                    placeholder="Enter room capacity"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Add feature"
                    />
                    <Button type="button" onClick={handleAddFeature}>Add</Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newRoom.features?.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex gap-1 items-center">
                        {feature}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 p-0 ml-1" 
                          onClick={() => handleRemoveFeature(index)}
                        >
                          <Trash size={12} />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch 
                    checked={newRoom.isAvailable || false}
                    onCheckedChange={(checked) => setNewRoom({...newRoom, isAvailable: checked})}
                  />
                  <Label>Available for booking</Label>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSaveRoom}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Room List */}
      <Card>
        <CardHeader>
          <CardTitle>All Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.location}</TableCell>
                  <TableCell>{room.capacity} people</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {room.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline">{feature}</Badge>
                      ))}
                      {room.features.length > 2 && (
                        <Badge variant="outline">+{room.features.length - 2} more</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={room.isAvailable !== false ? "success" : "destructive"}>
                      {room.isAvailable !== false ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleAvailability(room.id, room.isAvailable !== false)}
                      >
                        {room.isAvailable !== false ? <X size={16} /> : <Check size={16} />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRoom(room)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRooms;
