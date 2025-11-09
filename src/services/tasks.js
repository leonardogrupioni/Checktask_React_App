import { exec, getAll } from '../db/database';

const now = () => Date.now();

const pickColor = (activity) => {
  const map = {
    'Acordar': '#FF6B6B', 'Almoçar': '#4ECDC4', 'Treinar': '#45B7D1',
    'Corrida': '#96CEB4', 'Reunião': '#FFA726', 'Estudar': '#AB47BC',
    'Trabalhar': '#5C6BC0', 'Dormir': '#78909C'
  };
  return map[activity] ?? '#4ECDC4';
};

export async function getTasksByDate(date, userId = null) {
  const params = [date];
  let whereUser = '';
  if (userId) { whereUser = ' AND (user_id IS NULL OR user_id = ?)'; params.push(userId); }

  return await getAll(
    `SELECT * FROM tasks
     WHERE date = ?${whereUser}
     ORDER BY
       completed ASC,
       CASE WHEN time IS NULL OR TRIM(time) = '' THEN 1 ELSE 0 END,
       time ASC,
       id DESC`,
    params
  );
}

export async function getTaskById(id) {
  const rows = await getAll(`SELECT * FROM tasks WHERE id = ? LIMIT 1`, [id]);
  return rows?.[0] ?? null;
}

// Conta tarefas por data num intervalo [startISO, endISO]
export async function getTaskStatsInRange(startISO, endISO, userId = null) {
  const params = [startISO, endISO];
  let whereUser = '';
  if (userId) { whereUser = ' AND (user_id IS NULL OR user_id = ?)'; params.push(userId); }

  // SQLite: soma condicionais com CASE
  const rows = await getAll(
    `SELECT date,
            SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) AS openCount,
            SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) AS doneCount
     FROM tasks
     WHERE date BETWEEN ? AND ?${whereUser}
     GROUP BY date
     ORDER BY date ASC`,
    params
  );
  return rows; // [{date:'2025-11-09', openCount:2, doneCount:1}, ...]
}

export async function addTask(date, activity, time = null, color = null, userId = null) {
  await exec(
    `INSERT INTO tasks (date, activity, time, color, completed, user_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, 0, ?, ?, ?)`,
    [date, activity, time, color ?? pickColor(activity), userId, now(), now()]
  );
}

export async function updateTask(id, patch) {
  const sets = [];
  const vals = [];
  for (const key of Object.keys(patch)) {
    sets.push(`${key} = ?`);
    vals.push(patch[key]);
  }
  sets.push('updated_at = ?'); vals.push(now());
  vals.push(id);

  await exec(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`, vals);
}

export async function deleteTask(id) {
  await exec(`DELETE FROM tasks WHERE id = ?`, [id]);
}