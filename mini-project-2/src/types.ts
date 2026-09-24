export type Equipment = 'Projector' | 'Whiteboard' | 'High-spec PC' | 'AC';
export type Room = { id: string; name: string; building: 'A' | 'B' | 'C' | 'V'; floor: number; capacity: number; equipment: Equipment[]; photo: string };
export type TimeSlot = { id: string; label: string; start: string; end: string };
export type Reservation = { id: string; roomId: string; roomName: string; date: string; slot: TimeSlot; pass: string; createdAt: string };
