
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import RoomCard from '@/components/RoomCard';
import Calendar from '@/components/Calendar';
import ReservationDetails from '@/components/ReservationDetails';
import { api } from '@/services/api';
import { Room, Reservation } from '@/models/types';
import { CalendarIcon, UsersIcon, LayoutDashboardIcon, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch rooms and user reservations
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: api.getRooms
  });

  const { data: userReservations, isLoading: reservationsLoading } = useQuery({
    queryKey: ['userReservations'],
    queryFn: api.getReservations
  });

  // Handlers
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Filter upcoming reservations (today or later)
  const upcomingReservations = userReservations?.filter(res => {
    const startTime = new Date(res.startTime);
    const now = new Date();
    return startTime >= now && res.status === 'confirmed';
  }).slice(0, 3) || [];

  // Get rooms with available slots today
  const availableRooms = rooms?.slice(0, 3) || [];
  
  // Prepare dates with reservations for calendar highlighting
  const reservationDates = userReservations?.map(res => new Date(res.startTime)) || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your meeting rooms and reservations.
          </p>
        </div>
        <Button onClick={() => navigate('/rooms')}>Book a Room</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              Total Rooms
            </CardTitle>
            <LayoutDashboardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rooms?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Available meeting spaces
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              Today's Bookings
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userReservations?.filter(res => {
                const startTime = new Date(res.startTime);
                const today = new Date();
                return startTime.toDateString() === today.toDateString();
              }).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Meetings scheduled for today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              Total Attendees
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userReservations?.reduce((sum, res) => sum + (res.attendees || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              People attending your meetings
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Reservations</TabsTrigger>
          <TabsTrigger value="available">Available Rooms</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Calendar 
              onDateSelect={handleDateSelect} 
              highlightDates={reservationDates} 
            />
            <Card>
              <CardHeader>
                <CardTitle>
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {userReservations?.filter(res => {
                  const resDate = new Date(res.startTime);
                  return resDate.toDateString() === selectedDate.toDateString();
                }).map(res => (
                  <div key={res.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">{res.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(res.startTime), 'h:mm a')} - {format(new Date(res.endTime), 'h:mm a')}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/reservations/${res.id}`)}>
                      View
                    </Button>
                  </div>
                ))}
                {(!userReservations || userReservations.filter(res => {
                  const resDate = new Date(res.startTime);
                  return resDate.toDateString() === selectedDate.toDateString();
                }).length === 0) && (
                  <p className="text-muted-foreground text-center py-8">
                    No reservations for this date
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-6">
          {reservationsLoading ? (
            <div className="text-center py-8">Loading reservations...</div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                {upcomingReservations.map(reservation => {
                  const room = rooms?.find(r => r.id === reservation.roomId);
                  return room ? (
                    <ReservationDetails 
                      key={reservation.id} 
                      reservation={reservation}
                      room={room}
                      isOwner={true}
                    />
                  ) : null;
                })}
              </div>
              
              {upcomingReservations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming reservations</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/rooms')}
                  >
                    Book a Room
                  </Button>
                </div>
              )}
              
              {upcomingReservations.length > 0 && (
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => navigate('/reservations')}
                  >
                    View all reservations
                    <ArrowRight size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="available" className="mt-6">
          {roomsLoading ? (
            <div className="text-center py-8">Loading rooms...</div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-3">
                {availableRooms.map(room => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
              
              {availableRooms.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No rooms available</p>
                </div>
              )}
              
              {availableRooms.length > 0 && (
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => navigate('/rooms')}
                  >
                    View all rooms
                    <ArrowRight size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
