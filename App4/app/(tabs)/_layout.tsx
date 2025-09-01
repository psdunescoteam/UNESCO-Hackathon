import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#007BFF',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#A9A9A9' : 'gray',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF',
        },
      }}>
      <Tabs.Screen
        name="easy"
        options={{
          title: 'Easy',
          tabBarIcon: ({ color }) => <Ionicons name="build-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="professional"
        options={{
          title: 'Professional',
          tabBarIcon: ({ color }) => <Ionicons name="business-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
