
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parse, addHours } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Room, User } from '@/models/types';
import { toast } from "sonner";
import { api } from '@/services/api';

interface ReservationFormProps {
  room: Room;
  date: Date;
  onSuccess: () => void;
  availableTimeSlots: string[];
}

const timeSlotSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  startTime: z.string({
    required_error: "Please select a start time",
  }),
  duration: z.string({
    required_error: "Please select duration",
  }),
  attendees: z.number().min(1).max(100),
});

const ReservationForm: React.FC<ReservationFormProps> = ({ 
  room, 
  date, 
  onSuccess,
  availableTimeSlots 
}) => {
  const form = useForm<z.infer<typeof timeSlotSchema>>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      title: '',
      description: '',
      attendees: 1,
    },
  });
  
  const currentUser = {
    id: "user1", // Assuming we have a current user - this would normally come from auth
    name: "John Doe",
  };
  
  const handleSubmit = async (data: z.infer<typeof timeSlotSchema>) => {
    try {
      const startDateTime = parse(
        `${format(date, 'yyyy-MM-dd')} ${data.startTime}`, 
        'yyyy-MM-dd HH:mm', 
        new Date()
      );
      
      const durationInHours = parseInt(data.duration);
      const endDateTime = addHours(startDateTime, durationInHours);
      
      await api.createReservation({
        roomId: room.id,
        userId: currentUser.id,
        title: data.title,
        description: data.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        attendees: data.attendees,
        status: "confirmed"
      });
      
      toast.success("Reservation created successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to create reservation");
      console.error(error);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Title</FormLabel>
              <FormControl>
                <Input placeholder="Team Weekly Sync" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief description of the meeting purpose" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableTimeSlots.map((timeSlot) => (
                      <SelectItem key={timeSlot} value={timeSlot}>
                        {timeSlot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="attendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Attendees</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1}
                  max={room.capacity}
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>
                Maximum capacity: {room.capacity} people
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">Book Room</Button>
      </form>
    </Form>
  );
};

export default ReservationForm;
