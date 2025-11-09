import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTasksByDate } from '../src/hooks/useTasksByDate';

export default function EditarTaskDoDia() {
  const route = useRoute();
  const navigation = useNavigation();
  const taskId = useMemo(() => route.params?.taskId, [route.params?.taskId]);
  const date = useMemo(() => route.params?.date, [route.params?.date]);

  const { tasks, loading, edit, remove } = useTasksByDate(date);
  const [task, setTask] = useState(null);
  const [time, setTime] = useState('');
  const [activity, setActivity] = useState('');

  useEffect(() => {
    const found = tasks.find(t => t.id === taskId);
    setTask(found || null);
    if (found) {
      setTime(found.time || '');
      setActivity(found.activity || '');
    }
  }, [tasks, taskId]);

  const salvar = async () => {
    if (!activity.trim()) { Alert.alert('Atenção', 'Informe a atividade.'); return; }
    await edit(taskId, { activity: activity.trim(), time: time.trim() || null });
    navigation.goBack();
  };

  const excluir = async () => {
    await remove(taskId);
    navigation.goBack();
  };

  if (loading || !task) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16 }}>Editar tarefa</Text>

      <Text style={{ marginBottom: 6 }}>Horário (opcional)</Text>
      <TextInput
        value={time}
        onChangeText={setTime}
        placeholder="09h30"
        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 12 }}
      />

      <Text style={{ marginBottom: 6 }}>Atividade</Text>
      <TextInput
        value={activity}
        onChangeText={setActivity}
        placeholder="Estudar"
        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 20 }}
      />

      <TouchableOpacity
        onPress={salvar}
        style={{ backgroundColor: '#4ECDC4', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Salvar alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={excluir}
        style={{ backgroundColor: '#FF6B6B', padding: 14, borderRadius: 10, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Excluir tarefa</Text>
      </TouchableOpacity>
    </View>
  );
}