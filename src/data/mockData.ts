
import { Room, Reservation, User } from "../models/types";

export const rooms: Room[] = [
  {
    id: 1,
    name: "Executive Suite",
    capacity: 12,
    location: "Building A, Floor 3",
    features: ["Projector", "Video conferencing", "Whiteboard", "Coffee machine"],
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Brainstorm Room",
    capacity: 6,
    location: "Building B, Floor 2",
    features: ["Whiteboard", "TV Screen", "Standing desks"],
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Conference Hall",
    capacity: 30,
    location: "Building A, Floor 1",
    features: ["Projector", "Sound system", "Video conferencing", "Podium"],
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Focus Room",
    capacity: 4,
    location: "Building C, Floor 2",
    features: ["Whiteboard", "TV Screen"],
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=500&auto=format&fit=crop"
  },
];

export const users: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john.doe@company.com",
    department: "Marketing"
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    department: "Engineering"
  }
];

// Current date and next week
const today = new Date();
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

// Format function for dates
const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const reservations: Reservation[] = [
  {
    id: 1,
    roomId: 1,
    userId: "user1",
    title: "Executive Meeting",
    description: "Quarterly review with department heads",
    startTime: formatDate(new Date(today.setHours(10, 0, 0, 0))),
    endTime: formatDate(new Date(today.setHours(12, 0, 0, 0))),
    attendees: 8,
    status: "confirmed",
    createdAt: formatDate(new Date(today.setDate(today.getDate() - 5)))
  },
  {
    id: 2,
    roomId: 2,
    userId: "user2",
    title: "Project Kickoff",
    description: "Initial planning for new product feature",
    startTime: formatDate(new Date(today.setHours(14, 0, 0, 0))),
    endTime: formatDate(new Date(today.setHours(15, 30, 0, 0))),
    attendees: 5,
    status: "confirmed",
    createdAt: formatDate(new Date(today.setDate(today.getDate() - 2)))
  },
  {
    id: 3,
    roomId: 3,
    userId: "user1",
    title: "Company Presentation",
    description: "Annual company overview and roadmap",
    startTime: formatDate(new Date(nextWeek.setHours(13, 0, 0, 0))),
    endTime: formatDate(new Date(nextWeek.setHours(16, 0, 0, 0))),
    attendees: 25,
    status: "confirmed",
    createdAt: formatDate(new Date(today.setDate(today.getDate() - 10)))
  }
];

// Generate time slots for a date
export const generateTimeSlots = (date: Date, reservations: Reservation[], roomId: number) => {
  const slots = [];
  const dateStr = date.toISOString().split('T')[0]; // Get just the date part
  
  // Business hours from 8AM to 8PM
  for (let hour = 8; hour <= 20; hour++) {
    const time = `${dateStr}T${hour.toString().padStart(2, '0')}:00:00`;
    
    // Check if this time slot overlaps with any reservation
    const isBooked = reservations.some(res => {
      if (res.roomId !== roomId) return false;
      
      const resStart = new Date(res.startTime).getTime();
      const resEnd = new Date(res.endTime).getTime();
      const slotTime = new Date(time).getTime();
      
      return slotTime >= resStart && slotTime < resEnd;
    });
    
    slots.push({
      time,
      available: !isBooked
    });
  }
  
  return slots;
};

// Function to generate a week's schedule for a room
export const generateWeekSchedule = (startDate: Date, roomId: number) => {
  const weekSchedule = [];
  const currentDate = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    
    weekSchedule.push({
      date: date.toISOString().split('T')[0],
      timeSlots: generateTimeSlots(date, reservations, roomId)
    });
  }
  
  return weekSchedule;
};

// Helper to get a specific room by ID
export const getRoomById = (id: number): Room | undefined => {
  return rooms.find(room => room.id === id);
};

// Helper to get all reservations for a room
export const getReservationsForRoom = (roomId: number): Reservation[] => {
  return reservations.filter(res => res.roomId === roomId);
};
