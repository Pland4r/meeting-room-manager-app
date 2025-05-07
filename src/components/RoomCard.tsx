
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Room } from '@/models/types';
import { useNavigate } from 'react-router-dom';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {room.image && (
        <div className="h-48 w-full overflow-hidden">
          <img 
            src={room.image} 
            alt={room.name} 
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription>
          {room.location} • Capacity: {room.capacity} people
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {room.features.map((feature, index) => (
            <Badge key={index} variant="secondary">{feature}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => navigate(`/rooms/${room.id}`)}
        >
          Book Room
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
