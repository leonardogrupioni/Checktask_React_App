import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginWithEmail } from '../src/services/auth';
import { useAuth } from '../src/context/AuthContext';

export default function Login() {
  const navigation = useNavigation();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    try {
      setLoading(true);
      const u = await loginWithEmail(email, senha);
      setUser(u);
      navigation.navigate('Tabs', { screen: 'Principal' });
    } catch (e) {
      Alert.alert('Erro ao entrar', e?.message ?? 'Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const goCadastro = () => navigation.navigate('Cadastro');

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 24 }}>CheckTask</Text>

        <Text style={{ marginBottom: 8 }}>E-mail</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="seu@email.com"
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16 }}
        />

        <Text style={{ marginBottom: 8 }}>Senha</Text>
        <TextInput
          value={senha}
          onChangeText={setSenha}
          placeholder="••••••••"
          secureTextEntry
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 24 }}
        />

        <TouchableOpacity
          disabled={loading}
          onPress={onLogin}
          style={{ backgroundColor: '#4ECDC4', padding: 14, borderRadius: 10, alignItems: 'center' }}>
          <Text style={{ color: 'white', fontWeight: '700' }}>{loading ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goCadastro} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ color: '#4ECDC4', fontWeight: '600' }}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}