
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
  }
};
