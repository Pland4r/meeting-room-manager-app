
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reservation } from '@/models/types';
import { api } from '@/services/api';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

const AdminReservations = () => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Fetch reservations and rooms data
  const { 
    data: reservations = [], 
    isLoading: reservationsLoading,
    refetch: refetchReservations
  } = useQuery({
    queryKey: ['admin-reservations'],
    queryFn: api.getReservations
  });
  
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['admin-rooms'],
    queryFn: api.getRooms
  });
  
  // Filter reservations by status
  const pendingReservations = reservations.filter(res => res.status === 'pending');
  const confirmedReservations = reservations.filter(res => res.status === 'confirmed');
  const cancelledReservations = reservations.filter(
    res => res.status === 'cancelled' || res.status === 'rejected'
  );
  
  const handleOpenDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setAdminNotes(reservation.adminNotes || '');
    setIsDetailsOpen(true);
  };
  
  const handleApprove = async () => {
    if (!selectedReservation) return;
    
    try {
      await api.updateReservation(selectedReservation.id, {
        status: 'confirmed',
        adminNotes
      });
      toast.success("Reservation approved successfully");
      refetchReservations();
      setIsDetailsOpen(false);
    } catch (error) {
      toast.error("Failed to approve reservation");
      console.error(error);
    }
  };
  
  const handleReject = async () => {
    if (!selectedReservation) return;
    
    try {
      await api.updateReservation(selectedReservation.id, {
        status: 'rejected',
        adminNotes
      });
      toast.success("Reservation rejected");
      refetchReservations();
      setIsDetailsOpen(false);
    } catch (error) {
      toast.error("Failed to reject reservation");
      console.error(error);
    }
  };
  
  if (reservationsLoading || roomsLoading) {
    return <div className="flex items-center justify-center h-64">Loading reservations...</div>;
  }

  const renderReservationTable = (reservationList: Reservation[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Room</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Requester</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservationList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6">
              No reservations found
            </TableCell>
          </TableRow>
        ) : (
          reservationList.map((reservation) => {
            const room = rooms.find(r => r.id === reservation.roomId);
            const startDate = new Date(reservation.startTime);
            const endDate = new Date(reservation.endTime);
            
            const formattedDate = startDate.toLocaleDateString();
            const formattedTime = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                  ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            
            return (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.title}</TableCell>
                <TableCell>{room?.name || 'Unknown Room'}</TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>{formattedTime}</TableCell>
                <TableCell>{reservation.userId}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      reservation.status === 'confirmed' ? 'success' : 
                      reservation.status === 'pending' ? 'outline' : 'destructive'
                    }
                  >
                    {reservation.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDetails(reservation)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reservations Management</h1>
        <p className="text-muted-foreground">
          Review and manage meeting room reservations
        </p>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingReservations.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed ({confirmedReservations.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled/Rejected ({cancelledReservations.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              {renderReservationTable(pendingReservations)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="confirmed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Confirmed Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              {renderReservationTable(confirmedReservations)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cancelled" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cancelled & Rejected Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              {renderReservationTable(cancelledReservations)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Reservation Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogDescription>
              View and manage this reservation request
            </DialogDescription>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Title</p>
                  <p>{selectedReservation.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Room</p>
                  <p>{rooms.find(r => r.id === selectedReservation.roomId)?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Start Time</p>
                  <p>{new Date(selectedReservation.startTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">End Time</p>
                  <p>{new Date(selectedReservation.endTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Requester</p>
                  <p>{selectedReservation.userId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Attendees</p>
                  <p>{selectedReservation.attendees || 'Not specified'}</p>
                </div>
              </div>
              
              {selectedReservation.description && (
                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <p className="text-sm">{selectedReservation.description}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium mb-1">Admin Notes</p>
                <Textarea
                  placeholder="Add notes (visible to admin only)"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="h-24"
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between sm:justify-between">
            {selectedReservation?.status === 'pending' && (
              <>
                <Button variant="destructive" onClick={handleReject}>
                  Reject
                </Button>
                <Button onClick={handleApprove}>
                  Approve
                </Button>
              </>
            )}
            {selectedReservation?.status !== 'pending' && (
              <Button onClick={() => setIsDetailsOpen(false)} className="ml-auto">
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReservations;
