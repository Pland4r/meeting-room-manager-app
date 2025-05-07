
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ClockIcon, UsersIcon } from 'lucide-react';
import { Reservation, Room } from '@/models/types';

interface ReservationDetailsProps {
  reservation: Reservation;
  room: Room;
  onCancel?: () => void;
  isOwner?: boolean;
}

const ReservationDetails: React.FC<ReservationDetailsProps> = ({ 
  reservation, 
  room, 
  onCancel,
  isOwner = false 
}) => {
  const startTime = new Date(reservation.startTime);
  const endTime = new Date(reservation.endTime);
  
  const formatDateTime = (date: Date) => {
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  const getStatusColor = () => {
    switch (reservation.status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{reservation.title}</CardTitle>
          <Badge className={`${getStatusColor()} text-white capitalize`}>
            {reservation.status}
          </Badge>
        </div>
        <CardDescription className="text-base">
          {room.name} - {room.location}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {reservation.description && (
          <p className="text-muted-foreground">{reservation.description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} className="text-muted-foreground" />
            <p>
              <span className="font-medium">Date: </span>
              {format(startTime, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <ClockIcon size={16} className="text-muted-foreground" />
            <p>
              <span className="font-medium">Time: </span>
              {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
            </p>
          </div>
          
          {reservation.attendees && (
            <div className="flex items-center gap-2">
              <UsersIcon size={16} className="text-muted-foreground" />
              <p>
                <span className="font-medium">Attendees: </span>
                {reservation.attendees} people
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      {isOwner && reservation.status !== 'cancelled' && (
        <CardFooter>
          <Button 
            variant="destructive" 
            onClick={onCancel} 
            className="w-full"
          >
            Cancel Reservation
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ReservationDetails;
