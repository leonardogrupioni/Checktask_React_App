// Modelos de referência em JavaScript (sem TypeScript)

export const UserModel = {
  id: null,
  name: '',
  email: '',
  phone: '',
  password_hash: '',
  created_at: 0,
};

export const TaskModel = {
  id: null,
  date: '',          // YYYY-MM-DD
  time: '',          // Ex: "09h30" (opcional)
  activity: '',      // Nome da tarefa
  color: '',         // Cor associada (opcional)
  completed: 0,      // 0 = não concluída, 1 = concluída
  user_id: null,     // FK para user (ou null)
  created_at: 0,
  updated_at: 0,
};