
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeftIcon, MapPinIcon, UsersIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, parse, isBefore, startOfToday } from 'date-fns';
import { api } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReservationForm from '@/components/ReservationForm';
import ReservationDetails from '@/components/ReservationDetails';

const RoomDetail = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = parseInt(id || '0');
  const navigate = useNavigate();
  
  // State for booking
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // Fetch room details
  const { data: room, isLoading: roomLoading } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => api.getRoom(roomId)
  });
  
  // Fetch reservations for room
  const { data: roomReservations = [], isLoading: reservationsLoading } = useQuery({
    queryKey: ['roomReservations', roomId],
    queryFn: () => api.getReservationsForRoom(roomId)
  });
  
  // Fetch schedule for selected week
  const { data: roomSchedule = [], isLoading: scheduleLoading } = useQuery({
    queryKey: ['roomSchedule', roomId, selectedDate.toISOString()],
    queryFn: () => api.getRoomSchedule(roomId, selectedDate)
  });
  
  // Calculate available time slots for the selected date
  const availableTimeSlots = useMemo(() => {
    if (!roomSchedule.length) return [];
    
    const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
    const daySchedule = roomSchedule.find(day => day.date === selectedDateString);
    
    if (!daySchedule) return [];
    
    return daySchedule.timeSlots
      .filter(slot => slot.available)
      .map(slot => format(new Date(slot.time), 'HH:mm'));
  }, [roomSchedule, selectedDate]);
  
  // Generate days with bookings for calendar highlighting
  const bookedDates = useMemo(() => {
    return roomReservations
      .filter(res => res.status === 'confirmed')
      .map(res => new Date(res.startTime));
  }, [roomReservations]);
  
  // Handle date selection in calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  // Handle booking success
  const handleBookingSuccess = () => {
    setIsBookingOpen(false);
    // Could add a refetch here
  };
  
  if (roomLoading) {
    return <div className="flex items-center justify-center h-64">Loading room details...</div>;
  }
  
  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold">Room not found</h2>
        <Button 
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/rooms')}
        >
          Back to Rooms
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className="flex items-center mb-2 p-0 hover:bg-transparent"
            onClick={() => navigate('/rooms')}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to rooms
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{room.name}</h1>
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <div className="flex items-center">
              <MapPinIcon className="mr-1 h-4 w-4" />
              {room.location}
            </div>
            <div className="flex items-center">
              <UsersIcon className="mr-1 h-4 w-4" />
              Capacity: {room.capacity}
            </div>
          </div>
        </div>
        <Button 
          className="mt-4 md:mt-0"
          onClick={() => setIsBookingOpen(true)}
        >
          Book this room
        </Button>
      </div>
      
      {/* Room content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Room image */}
        <Card className="md:col-span-1">
          <div className="h-[300px] w-full overflow-hidden rounded-t-lg">
            {room.image ? (
              <img 
                src={room.image} 
                alt={room.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-muted">
                No image available
              </div>
            )}
          </div>
          <CardHeader>
            <CardTitle className="text-lg">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {room.features.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Calendar and availability */}
        <Card className="md:col-span-2">
          <Tabs defaultValue="calendar">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Availability</CardTitle>
                <TabsList>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="calendar" className="space-y-4">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      // Disable dates in the past
                      return isBefore(date, startOfToday());
                    }}
                    className="rounded-md border"
                    classNames={{
                      day_selected: 'calendar-day-selected',
                      day_today: 'border border-primary',
                    }}
                  />
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">
                      Available Times for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {scheduleLoading ? (
                      <div className="text-center py-4">Loading availability...</div>
                    ) : availableTimeSlots.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No available time slots for this date
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {availableTimeSlots.map((timeSlot) => (
                          <Button 
                            key={timeSlot} 
                            variant="outline" 
                            className="text-sm"
                            onClick={() => setIsBookingOpen(true)}
                          >
                            {timeSlot}
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="upcoming">
                {reservationsLoading ? (
                  <div className="text-center py-4">Loading reservations...</div>
                ) : roomReservations.filter(r => r.status === 'confirmed').length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No upcoming reservations for this room
                  </div>
                ) : (
                  <div className="space-y-4">
                    {roomReservations
                      .filter(r => r.status === 'confirmed')
                      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                      .slice(0, 5) // Only show next 5 reservations
                      .map(reservation => (
                        <div 
                          key={reservation.id} 
                          className="p-3 rounded-md border"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{reservation.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(reservation.startTime), 'EEEE, MMMM d')} • {' '}
                                {format(new Date(reservation.startTime), 'h:mm a')} - {format(new Date(reservation.endTime), 'h:mm a')}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {reservation.attendees} {reservation.attendees === 1 ? 'person' : 'people'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Booking dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book {room.name}</DialogTitle>
          </DialogHeader>
          <ReservationForm 
            room={room}
            date={selectedDate}
            availableTimeSlots={availableTimeSlots}
            onSuccess={handleBookingSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomDetail;
