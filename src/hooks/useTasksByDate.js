import { useEffect, useRef, useState, useCallback } from 'react';
import { ensureSchema } from '../db/database';
import { addTask, deleteTask, getTasksByDate, updateTask } from '../services/tasks';

export function useTasksByDate(date, userId = null) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  // incrementa a cada refresh; usado p/ invalidar respostas antigas
  const reqIdRef = useRef(0);

  const refresh = useCallback(async () => {
    const myReq = ++reqIdRef.current;      // gera id desta chamada
    try {
      setLoading(true);
      await ensureSchema();
      const data = await getTasksByDate(date, userId);
      // se outra chamada já foi feita depois, ignore esta resposta
      if (reqIdRef.current !== myReq) return;
      setTasks(data);
      setError(null);
    } catch (e) {
      if (reqIdRef.current !== myReq) return;
      setError(e?.message ?? 'Erro ao carregar');
    } finally {
      if (reqIdRef.current === myReq) setLoading(false);
    }
  }, [date, userId]);

  // recarrega sempre que a data mudar
  useEffect(() => { refresh(); }, [refresh]);

  const create = async (activity, time = null) => {
    await addTask(date, activity, time, null, userId);
    refresh();
  };

  const edit = async (id, patch) => {
    await updateTask(id, patch);
    refresh();
  };

  const remove = async (id) => {
    await deleteTask(id);
    refresh();
  };

  return { tasks, loading, error, refresh, create, edit, remove };
}