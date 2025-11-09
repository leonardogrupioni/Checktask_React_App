// navigation/routes.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../pages/page_login';
import Cadastro from '../pages/page_cadastro';

import Tabs from './Tabs';

import TasksDoDia from '../pages/page_tasks';
import EditarTaskDoDia from '../pages/page_editar_task';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerTitleAlign: 'center' }}
    >
      <Stack.Screen name="Login" component={Login} options={{ title: 'Entrar' }} />
      <Stack.Screen name="Cadastro" component={Cadastro} options={{ title: 'Criar conta' }} />
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="TasksDoDia"
        component={TasksDoDia}
        options={({ route }) => ({
          title: route?.params?.date ? `Tarefas — ${route.params.date}` : 'Tarefas do dia',
        })}
      />
      <Stack.Screen
        name="EditarTaskDoDia"
        component={EditarTaskDoDia}
        options={{ title: 'Editar tarefa' }}
      />
    </Stack.Navigator>
  );
}