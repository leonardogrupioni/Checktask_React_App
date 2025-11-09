// navigation/Tabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import TelaPrincipal from '../pages/tab_TelaPrincipal';
import Perfil from '../pages/tab_Perfil';
// import TabIndex from '../pages/tab_index'; // opcional

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#4ECDC4',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => {
          let icon = 'ellipse-outline';
          if (route.name === 'Principal') icon = focused ? 'home' : 'home-outline';
          if (route.name === 'Perfil') icon = focused ? 'person' : 'person-outline';
          // if (route.name === 'Início') icon = focused ? 'grid' : 'grid-outline';
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Principal"
        component={TelaPrincipal}
        options={{ title: 'Hoje' }}
      />
      {/* <Tab.Screen
        name="Início"
        component={TabIndex}
        options={{ title: 'Início' }}
      /> */}
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}