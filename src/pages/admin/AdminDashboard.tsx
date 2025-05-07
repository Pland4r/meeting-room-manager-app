
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminStats, Reservation } from '@/models/types';
import { api } from '@/services/api';
import { CalendarIcon, Check, LayoutDashboardIcon, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Fetch room and reservation data
  const { data: rooms = [] } = useQuery({
    queryKey: ['admin-rooms'],
    queryFn: api.getRooms
  });

  const { data: reservations = [] } = useQuery({
    queryKey: ['admin-reservations'],
    queryFn: api.getReservations
  });

  // Calculate admin stats
  const stats: AdminStats = {
    totalRooms: rooms.length,
    availableRooms: rooms.filter(room => room.isAvailable !== false).length,
    pendingReservations: reservations.filter(res => res.status === 'pending').length,
    confirmedReservations: reservations.filter(res => res.status === 'confirmed').length,
    cancelledReservations: reservations.filter(res => res.status === 'cancelled' || res.status === 'rejected').length,
  };

  // Get latest pending reservations for the dashboard
  const pendingReservations = reservations
    .filter(res => res.status === 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your meeting room management system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <LayoutDashboardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableRooms} currently available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reservations</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReservations}</div>
            <p className="text-xs text-muted-foreground">
              Waiting for approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Reservations</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmedReservations}</div>
            <p className="text-xs text-muted-foreground">
              Currently approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled/Rejected</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelledReservations}</div>
            <p className="text-xs text-muted-foreground">
              No longer active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Pending Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingReservations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingReservations.map((reservation) => {
                  const room = rooms.find(r => r.id === reservation.roomId);
                  const startDate = new Date(reservation.startTime);
                  const formattedDate = startDate.toLocaleDateString();
                  const formattedTime = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                  
                  return (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.title}</TableCell>
                      <TableCell>{room?.name || 'Unknown Room'}</TableCell>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell>{formattedTime}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/admin/reservations`)}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No pending reservations</p>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => navigate('/admin/reservations')}>
              View All Reservations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
