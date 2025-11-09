// pages/page_tasks.js
import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Platform
} from 'react-native';

import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasksByDate } from '../src/hooks/useTasksByDate';

function formatHM(dateObj) {
  const h = String(dateObj.getHours()).padStart(2, '0');
  const m = String(dateObj.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export default function TasksDoDia() {
  const route = useRoute();
  const navigation = useNavigation();

  const date = useMemo(() => route.params?.date ?? '', [route.params?.date]);

  const { tasks, loading, create, edit, remove, refresh } = useTasksByDate(date);

  const [isModal, setIsModal] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  // Atualiza quando voltar da tela de edição
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const openModal = () => {
    const now = new Date();
    setPickerDate(now);
    setNewTime(formatHM(now)); // hora atual por padrão
    setNewActivity('');
    setShowPicker(false);
    setIsModal(true);
  };

  const onChangeTime = (_event, selectedDate) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) {
      setPickerDate(selectedDate);
      setNewTime(formatHM(selectedDate)); // HH:mm
    }
  };

  const addTask = async () => {
    if (!newActivity.trim()) {
      Alert.alert('Atenção', 'Informe a atividade.');
      return;
    }

    await create(newActivity.trim(), newTime || null);
    setIsModal(false);
    setNewTime('');
    setNewActivity('');
    refresh();
  };

  const toggleCompleted = async (t) => {
    await edit(t.id, { completed: t.completed ? 0 : 1 });
  };

  const goEditar = (task) => {
    navigation.navigate('EditarTaskDoDia', { taskId: task.id, date });
  };

  const excluir = async (task) => {
    await remove(task.id);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>
        Tarefas de {date}
      </Text>

      <FlatList
        data={tasks}
        keyExtractor={(t) => String(t.id)}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 14,
              borderWidth: 1,
              borderColor: '#eee',
              borderRadius: 12,
              backgroundColor: '#fff',
            }}
          >
            <TouchableOpacity onPress={() => toggleCompleted(item)}>
              <Text
                style={{
                  fontWeight: '600',
                  textDecorationLine: item.completed ? 'line-through' : 'none',
                }}
              >
                {item.activity} {item.time ? `• ${item.time}` : ''}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                gap: 12,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => goEditar(item)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: '#E3F2FD',
                }}
              >
                <Text style={{ color: '#1976D2', fontWeight: '600' }}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => excluir(item)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: '#FFEBEE',
                }}
              >
                <Text style={{ color: '#C62828', fontWeight: '600' }}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#666', marginTop: 8 }}>
            Sem tarefas para este dia.
          </Text>
        }
      />

      <TouchableOpacity
        onPress={openModal}
        style={{
          marginTop: 16,
          backgroundColor: '#4ECDC4',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700' }}>
          Adicionar tarefa
        </Text>
      </TouchableOpacity>

      {/* ✅ MODAL NOVA TAREFA */}
      <Modal visible={isModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
              Nova tarefa
            </Text>

            {/* HORÁRIO */}
            <Text style={{ marginBottom: 6 }}>Horário (opcional)</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#ddd',
                  backgroundColor: '#fafafa',
                }}
              >
                <Text>{newTime || 'Selecionar hora'}</Text>
              </TouchableOpacity>

              {!!newTime && (
                <TouchableOpacity
                  onPress={() => setNewTime('')}
                  style={{ paddingVertical: 10, paddingHorizontal: 12 }}
                >
                  <Text style={{ color: '#C62828' }}>Limpar</Text>
                </TouchableOpacity>
              )}
            </View>

            {showPicker && (
              <DateTimePicker
                value={pickerDate}
                mode="time"
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeTime}
              />
            )}

            {/* ATIVIDADE */}
            <Text style={{ marginTop: 16, marginBottom: 6 }}>Atividade</Text>

            <TextInput
              value={newActivity}
              onChangeText={setNewActivity}
              placeholder="Ex.: Estudar"
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 10,
                marginBottom: 16,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setIsModal(false);
                  setNewTime('');
                  setNewActivity('');
                }}
                style={{ paddingVertical: 10, paddingHorizontal: 14 }}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={addTask}
                style={{
                  backgroundColor: '#4ECDC4',
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '700' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}