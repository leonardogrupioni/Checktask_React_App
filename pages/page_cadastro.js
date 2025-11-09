import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUser } from '../src/services/auth';

export default function Cadastro() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const useDelayedSecure = false;
  const [securePwd, setSecurePwd] = useState(!useDelayedSecure);
  const [secureConfirm, setSecureConfirm] = useState(!useDelayedSecure);
  const pwdInputRef = useRef(null);
  const confirmInputRef = useRef(null);

  const onSubmit = async () => {
    const nomeT = nome.trim();
    const emailT = email.trim().toLowerCase();
    const telefoneT = telefone.trim();
    const senhaT = senha.trim();
    const confirmT = confirm.trim();

    if (!nomeT || !emailT || !senhaT) {
      Alert.alert('Atenção', 'Preencha nome, e-mail e senha.');
      return;
    }
    if (senhaT !== confirmT) {
      Alert.alert('Atenção', 'As senhas não conferem.');
      return;
    }
    try {
      setLoading(true);
      await createUser(nomeT, emailT, telefoneT, senhaT);
      Alert.alert('Sucesso', 'Conta criada, faça o login.');
      navigation.navigate('Login');
    } catch (e) {
      Alert.alert('Erro ao cadastrar', e?.message ?? 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePwdFocus = () => {
    if (useDelayedSecure) {
      setSecurePwd(false);
      requestAnimationFrame(() => setTimeout(() => setSecurePwd(true), 50));
    }
  };
  const handleConfirmFocus = () => {
    if (useDelayedSecure) {
      setSecureConfirm(false);
      requestAnimationFrame(() => setTimeout(() => setSecureConfirm(true), 50));
    }
  };

  const iosNoAutofill = Platform.OS === 'ios' ? 'oneTimeCode' : 'none';

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 24 }}>Crie sua conta</Text>

        <Text style={{ marginBottom: 8 }}>Nome completo</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome"
          returnKeyType="next"
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}
        />

        <Text style={{ marginBottom: 8 }}>Telefone</Text>
        <TextInput
          value={telefone}
          onChangeText={setTelefone}
          placeholder="(11) 99999-9999"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          returnKeyType="next"
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}
        />

        <Text style={{ marginBottom: 8 }}>E-mail</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          returnKeyType="next"
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}
        />

        <Text style={{ marginBottom: 8 }}>Senha</Text>
        <TextInput
          ref={pwdInputRef}
          value={senha}
          onChangeText={setSenha}
          placeholder="••••••••"
          secureTextEntry={securePwd}
          onFocus={handlePwdFocus}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType={iosNoAutofill}
          autoComplete="off"
          // Android: evita autofill também
          importantForAutofill="no"
          returnKeyType="next"
          editable={!loading}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}
        />

        <Text style={{ marginBottom: 8 }}>Confirmar senha</Text>
        <TextInput
          ref={confirmInputRef}
          value={confirm}
          onChangeText={setConfirm}
          placeholder="••••••••"
          secureTextEntry={secureConfirm}
          onFocus={handleConfirmFocus}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType={iosNoAutofill}
          autoComplete="off"
          importantForAutofill="no"
          returnKeyType="done"
          onSubmitEditing={onSubmit}
          editable={!loading}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 20 }}
        />

        <TouchableOpacity
          disabled={loading}
          onPress={onSubmit}
          style={{ backgroundColor: '#4ECDC4', padding: 14, borderRadius: 10, alignItems: 'center' }}>
          <Text style={{ color: 'white', fontWeight: '700' }}>{loading ? 'Enviando...' : 'Criar conta'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}