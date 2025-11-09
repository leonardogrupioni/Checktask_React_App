// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './navigation/routes'; 
import { AuthProvider } from './src/context/AuthContext';
import { resetSchema } from './src/db/database';

export default function App() {
  useEffect(() => {
    (async () => {
      await resetSchema(); // apaga tudo e recria a cada inicialização
    })();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </AuthProvider>
  );
}