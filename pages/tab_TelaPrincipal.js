import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { useTasksByDate } from '../src/hooks/useTasksByDate';
import { getTaskStatsInRange } from '../src/services/tasks';

function toISO(d) {
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function monthEdges(yyyy, mm /*1-12*/) {
  const first = new Date(yyyy, mm - 1, 1);
  const last = new Date(yyyy, mm, 0);
  return { start: toISO(first), end: toISO(last) };
}

export default function TelaPrincipal() {
  const navigation = useNavigation();

  const today = useMemo(() => toISO(new Date()), []);
  const [selected, setSelected] = useState(today);

  // tarefas do dia selecionado
  const { tasks, loading, edit, refresh } = useTasksByDate(selected);

  // marcações do calendário
  const [marked, setMarked] = useState({ [today]: { selected: true } });
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });

  // quando voltar ao foco, recarrega lista do dia
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  // busca estatística do mês para marcar dias
  const loadMonthMarks = useCallback(async (year, month) => {
    const { start, end } = monthEdges(year, month);
    const stats = await getTaskStatsInRange(start, end, null);

    const next = {};
    // marca o dia selecionado
    next[selected] = { ...(next[selected] || {}), selected: true };

    // marca dias com tarefas (pontinhos)
    for (const r of stats) {
      const dots = [];
      if (r.openCount > 0) dots.push({ key: 'open', color: '#FF6B6B' });
      if (r.doneCount > 0) dots.push({ key: 'done', color: '#4ECDC4' });
      next[r.date] = {
        ...(next[r.date] || {}),
        marked: dots.length > 0,
        dots,
      };
    }
    setMarked(next);
  }, [selected]);

  // carrega marks ao montar e ao trocar de mês
  useEffect(() => {
    loadMonthMarks(currentMonth.year, currentMonth.month);
  }, [currentMonth, loadMonthMarks]);

  // quando muda o dia selecionado, garante que fica “selected” no calendário
  useEffect(() => {
    setMarked((prev) => ({
      ...prev,
      [selected]: { ...(prev[selected] || {}), selected: true },
    }));
  }, [selected]);

  const onDayPress = (day) => {
    setSelected(day.dateString); // o hook vai recarregar sozinho
  };

  const onMonthChange = (m) => {
    setCurrentMonth({ year: m.year, month: m.month });
  };

  const toggle = async (t) => {
    await edit(t.id, { completed: t.completed ? 0 : 1 });
  };

  const openDia = () => navigation.navigate('TasksDoDia', { date: selected });

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        current={selected}
        markedDates={marked}
        markingType="multi-dot"             // pontinhos coloridos
        onDayPress={onDayPress}
        onMonthChange={onMonthChange}
        theme={{
          todayTextColor: '#4ECDC4',
          selectedDayBackgroundColor: '#4ECDC4',
          selectedDayTextColor: '#ffffff',
          dotColor: '#4ECDC4',
        }}
      />

      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>
          Tarefas de {selected}
        </Text>

        {loading ? (
          <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            extraData={selected}
            data={tasks}
            keyExtractor={(t) => String(t.id)}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggle(item)}
                style={{
                  padding: 14,
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 12,
                  backgroundColor: item.completed ? '#E8F5E9' : '#fff',
                }}>
                <Text style={{
                  fontWeight: '600',
                  textDecorationLine: item.completed ? 'line-through' : 'none'
                }}>
                  {item.activity}{item.time ? ` — ${item.time}` : ''}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={{ color:'#666', marginTop:8 }}>Sem tarefas neste dia.</Text>}
          />
        )}

        <TouchableOpacity
          onPress={openDia}
          style={{ marginTop: 12, backgroundColor: '#4ECDC4', padding: 14, borderRadius: 10, alignItems: 'center' }}>
          <Text style={{ color: 'white', fontWeight: '700' }}>
            Gerenciar tarefas de {selected}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}