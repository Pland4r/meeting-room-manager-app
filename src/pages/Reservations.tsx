
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import ReservationDetails from '@/components/ReservationDetails';
import { api } from '@/services/api';
import { Reservation } from '@/models/types';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from "sonner";

const Reservations = () => {
  const navigate = useNavigate();
  const [cancellationId, setCancellationId] = useState<number | null>(null);
  
  // Fetch reservations and rooms
  const { 
    data: reservations = [], 
    isLoading: reservationsLoading,
    refetch: refetchReservations
  } = useQuery({
    queryKey: ['reservations'],
    queryFn: api.getReservations
  });
  
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: api.getRooms
  });
  
  // Filter reservations by status
  const upcomingReservations = reservations.filter(
    res => res.status === 'confirmed' && new Date(res.startTime) > new Date()
  );
  
  const pastReservations = reservations.filter(
    res => res.status === 'confirmed' && new Date(res.startTime) <= new Date()
  );
  
  const cancelledReservations = reservations.filter(
    res => res.status === 'cancelled'
  );
  
  // Handle reservation cancellation
  const handleCancelRequest = (id: number) => {
    setCancellationId(id);
  };
  
  const confirmCancellation = async () => {
    if (cancellationId === null) return;
    
    try {
      await api.cancelReservation(cancellationId);
      toast.success("Reservation cancelled successfully");
      refetchReservations();
    } catch (error) {
      toast.error("Failed to cancel reservation");
      console.error(error);
    } finally {
      setCancellationId(null);
    }
  };
  
  if (reservationsLoading || roomsLoading) {
    return <div className="flex items-center justify-center h-64">Loading your reservations...</div>;
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Reservations</h1>
        <p className="text-muted-foreground">
          Manage all your meeting room bookings
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingReservations.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastReservations.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledReservations.length})
            </TabsTrigger>
          </TabsList>
          
          {/* Upcoming reservations */}
          <TabsContent value="upcoming" className="mt-6">
            {upcomingReservations.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8">
                <h3 className="text-lg font-medium">You have no upcoming reservations</h3>
                <p className="text-muted-foreground mt-2 mb-4">Book a meeting room to get started</p>
                <Button onClick={() => navigate('/rooms')}>Book a Room</Button>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingReservations.map((reservation) => {
                  const room = rooms.find(r => r.id === reservation.roomId);
                  if (!room) return null;
                  
                  return (
                    <ReservationDetails 
                      key={reservation.id} 
                      reservation={reservation}
                      room={room}
                      onCancel={() => handleCancelRequest(reservation.id)}
                      isOwner={true}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          {/* Past reservations */}
          <TabsContent value="past" className="mt-6">
            {pastReservations.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8">
                <h3 className="text-lg font-medium">No past reservations</h3>
                <p className="text-muted-foreground mt-2">Your reservation history will appear here</p>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastReservations.map((reservation) => {
                  const room = rooms.find(r => r.id === reservation.roomId);
                  if (!room) return null;
                  
                  return (
                    <ReservationDetails 
                      key={reservation.id} 
                      reservation={reservation}
                      room={room}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          {/* Cancelled reservations */}
          <TabsContent value="cancelled" className="mt-6">
            {cancelledReservations.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8">
                <h3 className="text-lg font-medium">No cancelled reservations</h3>
                <p className="text-muted-foreground mt-2">Cancelled reservation history will appear here</p>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cancelledReservations.map((reservation) => {
                  const room = rooms.find(r => r.id === reservation.roomId);
                  if (!room) return null;
                  
                  return (
                    <ReservationDetails 
                      key={reservation.id} 
                      reservation={reservation}
                      room={room}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Cancellation Confirmation Dialog */}
      <AlertDialog open={cancellationId !== null} onOpenChange={(open) => !open && setCancellationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your reservation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancellation} className="bg-destructive text-destructive-foreground">
              Yes, cancel reservation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Reservations;
