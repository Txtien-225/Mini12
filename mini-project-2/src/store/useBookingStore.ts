import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { create } from 'zustand';
import { Reservation } from '../types';
const KEY = 'vku-study-room-booking-state';
type State = { user: { name: string; email: string }; reservations: Reservation[]; hydrated: boolean; hydrate: () => Promise<void>; book: (reservation: Reservation) => Promise<void>; cancel: (id: string) => Promise<void>; isBooked: (roomId: string, date: string, slotId: string) => boolean };
const persist = async (state: Pick<State, 'user' | 'reservations'>) => AsyncStorage.setItem(KEY, JSON.stringify(state));
export const useBookingStore = create<State>((set, get) => ({
  user: { name: 'VKU Student', email: 'student@vku.udn.vn' }, reservations: [], hydrated: false,
  hydrate: async () => { const raw = await AsyncStorage.getItem(KEY); if (raw) set({ ...JSON.parse(raw), hydrated: true }); else set({ hydrated: true }); },
  book: async (reservation) => { const reservations = [...get().reservations, reservation]; set({ reservations }); await persist({ user: get().user, reservations }); const start = new Date(`${reservation.date}T${reservation.slot.start}:00`); const trigger = new Date(start.getTime() - 15 * 60 * 1000); if (trigger.getTime() > Date.now()) await Notifications.scheduleNotificationAsync({ content: { title: 'Study room reminder', body: `${reservation.roomName} starts in 15 minutes.` }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger } }); },
  cancel: async (id) => { const reservations = get().reservations.filter((item) => item.id !== id); set({ reservations }); await persist({ user: get().user, reservations }); },
  isBooked: (roomId, date, slotId) => get().reservations.some((item) => item.roomId === roomId && item.date === date && item.slot.id === slotId)
}));
