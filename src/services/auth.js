import * as Crypto from 'expo-crypto';
import { exec, getOne } from '../db/database';

const now = () => Date.now();
const hash = async (plain) =>
  await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, plain);

export async function createUser(name, email, phone, password) {
  const password_hash = await hash(password);
  await exec(
    `INSERT INTO users (name, email, phone, password_hash, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email.toLowerCase(), phone, password_hash, now()]
  );
}

export async function loginWithEmail(email, password) {
  const password_hash = await hash(password);
  const row = await getOne(
    `SELECT id, name, email FROM users WHERE email = ? AND password_hash = ?`,
    [email.toLowerCase(), password_hash]
  );
  if (!row) throw new Error('Credenciais inválidas');
  return row;
}