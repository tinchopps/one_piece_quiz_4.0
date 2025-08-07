import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';


import { Ionicons } from '@expo/vector-icons';

const LoginScreen: React.FC = () => {
  const { user, login, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError(null);
    const res = await login(email, password);
    if (res.error) {
      setError(res.error);
    } else {
      setEmail('');
      setPassword('');
      // La navegación se maneja en el useEffect de abajo
    }
  };


  // Navegar según el rol cuando user cambia y está autenticado
  useEffect(() => {
    if (user && !loading) {
      if (user.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/(tabs)/settings');
      }
    }
  }, [user, loading]);

  // Render principal (con input de contraseña con icono de ojo)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword((prev) => !prev)}
          accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <Button onPress={handleLogin} disabled={loading} title={loading ? 'Cargando...' : 'Entrar'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181A20',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#23252C',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordContainer: {
    width: '100%',
    maxWidth: 340,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#23252C',
    borderRadius: 8,
  },
  eyeIcon: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  error: {
    color: '#ff5252',
    marginBottom: 12,
  },
});

export default LoginScreen;
