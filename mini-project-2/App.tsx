import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
import { HomeScreen } from './src/screens/HomeScreen';
import { BookingsScreen } from './src/screens/BookingsScreen';
import { useBookingStore } from './src/store/useBookingStore';

Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) });
const Tabs = createBottomTabNavigator();
export default function App() { const hydrate = useBookingStore((s) => s.hydrate); useEffect(() => { hydrate(); Notifications.requestPermissionsAsync(); }, [hydrate]); return <NavigationContainer><Tabs.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#087fbd' }}><Tabs.Screen name="Rooms" component={HomeScreen} options={{ tabBarLabel: 'Phòng học' }} /><Tabs.Screen name="Bookings" component={BookingsScreen} options={{ tabBarLabel: 'Lịch đặt' }} /></Tabs.Navigator></NavigationContainer>; }
