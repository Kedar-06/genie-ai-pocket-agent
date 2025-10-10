import { Tabs } from "expo-router";
import React from "react";
import { Globe, History, HomeIcon, UserCircle } from "lucide-react-native";
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Explore"
        options={{
          tabBarIcon: ({ color, size }) => <Globe size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <UserCircle size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
