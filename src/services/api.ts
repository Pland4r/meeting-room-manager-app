
import { rooms, users, reservations, generateWeekSchedule, getRoomById } from "../data/mockData";
import { Room, Reservation, User, DaySchedule } from "../models/types";

// Mock API delay for realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Room operations
  getRooms: async (): Promise<Room[]> => {
    await delay(500);
    return [...rooms];
  },
  
  getRoom: async (id: number): Promise<Room | undefined> => {
    await delay(300);
    return getRoomById(id);
  },
  
  createRoom: async (roomData: Omit<Room, 'id'>): Promise<Room> => {
    await delay(700);
    const newRoom = {
      ...roomData,
      id: rooms.length + 1
    };
    rooms.push(newRoom);
    return newRoom;
  },
  
  updateRoom: async (id: number, updates: Partial<Room>): Promise<Room> => {
    await delay(500);
    
    const index = rooms.findIndex(room => room.id === id);
    if (index === -1) throw new Error("Room not found");
    
    rooms[index] = { ...rooms[index], ...updates };
    return rooms[index];
  },
  
  deleteRoom: async (id: number): Promise<boolean> => {
    await delay(500);
    
    const index = rooms.findIndex(room => room.id === id);
    if (index === -1) throw new Error("Room not found");
    
    // Check if there are any active reservations for this room
    const activeReservations = reservations.filter(
      res => res.roomId === id && res.status === 'confirmed'
    );
    
    if (activeReservations.length > 0) {
      throw new Error("Cannot delete room with active reservations");
    }
    
    // Remove the room
    rooms.splice(index, 1);
    return true;
  },
  
  // Reservation operations
  getReservations: async (): Promise<Reservation[]> => {
    await delay(500);
    return [...reservations];
  },
  
  getReservationsForRoom: async (roomId: number): Promise<Reservation[]> => {
    await delay(300);
    return reservations.filter(res => res.roomId === roomId);
  },
  
  createReservation: async (reservation: Omit<Reservation, 'id' | 'createdAt'>): Promise<Reservation> => {
    await delay(700);
    
    const newReservation = {
      ...reservation,
      id: reservations.length + 1,
      createdAt: new Date().toISOString()
    };
    
    reservations.push(newReservation);
    return newReservation;
  },
  
  updateReservation: async (id: number, updates: Partial<Reservation>): Promise<Reservation> => {
    await delay(500);
    
    const index = reservations.findIndex(res => res.id === id);
    if (index === -1) throw new Error("Reservation not found");
    
    reservations[index] = { ...reservations[index], ...updates };
    return reservations[index];
  },
  
  cancelReservation: async (id: number): Promise<boolean> => {
    await delay(500);
    
    const index = reservations.findIndex(res => res.id === id);
    if (index === -1) throw new Error("Reservation not found");
    
    reservations[index].status = "cancelled";
    return true;
  },
  
  // Schedule operations
  getRoomSchedule: async (roomId: number, startDate: Date): Promise<DaySchedule[]> => {
    await delay(600);
    return generateWeekSchedule(startDate, roomId);
  },
  
  // User operations
  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return [...users];
  },
  
  getCurrentUser: async (): Promise<User> => {
    await delay(200);
    // For demo purposes, always return the first user
    return users[0];
  },
  
  // Admin operations
  getAdminStats: async () => {
    await delay(400);
    
    return {
      totalRooms: rooms.length,
      availableRooms: rooms.filter(room => room.isAvailable !== false).length,
      pendingReservations: reservations.filter(res => res.status === 'pending').length,
      confirmedReservations: reservations.filter(res => res.status === 'confirmed').length,
      cancelledReservations: reservations.filter(res => res.status === 'cancelled' || res.status === 'rejected').length,
    };
  }
};
