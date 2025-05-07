
export interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  features: string[];
  image?: string;
  isAvailable?: boolean; // New field for availability management
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
  status: "confirmed" | "pending" | "cancelled" | "rejected"; // Added "rejected" status
  createdAt: string;
  adminNotes?: string; // New field for admin notes
}

export interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  isAdmin?: boolean; // New field to identify admin users
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

// Admin role types
export interface AdminStats {
  totalRooms: number;
  availableRooms: number;
  pendingReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
}
