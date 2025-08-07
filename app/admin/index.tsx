import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text style={styles.denied}>Acceso denegado. No eres admin.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/settings')}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Panel de Admin</Text>
      <Text style={styles.subtitle}>Bienvenido, {user.email}</Text>
      <Button
        title="ABM de Preguntas"
        onPress={() => router.push('/admin/questions')}
        variant="primary"
        size="medium"
        style={{ marginBottom: 16 }}
      />
      <Button
        title="Ver Feedback de Usuarios"
        onPress={() => router.push('/admin/feedback')}
        variant="secondary"
        size="medium"
      />
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
  backButton: {
    position: 'absolute',
    top: 32,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 24,
  },
  denied: {
    color: '#ff5252',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;
