import { Room, TimeSlot } from '../types';
export const rooms: Room[] = [
  { id: 'a201', name: 'Study Room A201', building: 'A', floor: 2, capacity: 6, equipment: ['Projector', 'Whiteboard', 'AC'], photo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900' },
  { id: 'b304', name: 'Computer Lab B304', building: 'B', floor: 3, capacity: 20, equipment: ['High-spec PC', 'AC'], photo: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900' },
  { id: 'c105', name: 'Focus Room C105', building: 'C', floor: 1, capacity: 4, equipment: ['Whiteboard', 'AC'], photo: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900' },
  { id: 'v202', name: 'Project Room V202', building: 'V', floor: 2, capacity: 12, equipment: ['Projector', 'Whiteboard', 'AC'], photo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900' }
];
export const slots: TimeSlot[] = [
  { id: '0730', label: '07:30–09:30', start: '07:30', end: '09:30' }, { id: '0930', label: '09:30–11:30', start: '09:30', end: '11:30' }, { id: '1300', label: '13:00–15:00', start: '13:00', end: '15:00' }, { id: '1500', label: '15:00–17:00', start: '15:00', end: '17:00' }
];
