
export interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  features: string[];
  image?: string;
}

export interface Reservation {
  id: number;
  roomId: number;
  userId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendees?: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  reservation?: Reservation;
}

export interface DaySchedule {
  date: string;
  timeSlots: TimeSlot[];
}
