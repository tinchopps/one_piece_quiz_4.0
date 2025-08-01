import { Tabs } from 'expo-router';
import { Chrome as Home, BarChart3, Settings } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: -2 },
          shadowColor: Colors.shadow,
          height: 80,
          paddingBottom: 12,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="story"
        options={{
          href: null, // Oculta del tab bar pero mantiene disponible
        }}
      />
      <Tabs.Screen
        name="free-mode"
        options={{
          href: null, // Oculta del tab bar pero mantiene disponible
        }}
      />
    </Tabs>
  );
}