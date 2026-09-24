# VKU Study Room Booking

Mini-Project 2: a React Native + Expo study-room reservation app.

## Features

- Room discovery with search, building and capacity filters.
- FlatList room feed with photos, capacity and equipment badges.
- Seven-day selector with fixed two-hour slots.
- Zustand booking state with AsyncStorage persistence.
- Conflict prevention for an already reserved room/date/slot.
- QR booking pass after a successful reservation.
- Expo notification reminder 15 minutes before a booking.
- Booking list with cancellation.

## Run

```bash
cd mini-project-2
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `a` for Android. Notifications require a physical device; the web preview can demonstrate discovery and booking flows but cannot fully test native reminders.
