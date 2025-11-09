import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function Perfil() {
  const { user, setUser } = useAuth();
  const navigation = useNavigation();

  const sair = () => {
    setUser(null);
    Alert.alert('Até logo!', 'Você saiu da sua conta.');
    navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 16 }}>Perfil</Text>
      {user ? (
        <>
          <Text style={{ fontSize: 16, marginBottom: 4 }}><Text style={{ fontWeight: '700' }}>Nome:</Text> {user.name}</Text>
          <Text style={{ fontSize: 16, marginBottom: 24 }}><Text style={{ fontWeight: '700' }}>E-mail:</Text> {user.email}</Text>
        </>
      ) : (
        <Text style={{ color: '#666', marginBottom: 24 }}>Você não está logado.</Text>
      )}

      <TouchableOpacity onPress={sair} style={{ backgroundColor: '#FF6B6B', padding: 14, borderRadius: 10, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}