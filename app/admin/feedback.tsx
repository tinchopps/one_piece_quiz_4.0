import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AdminFeedback: React.FC = () => {
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
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Feedback de Usuarios</Text>
      <Text style={styles.subtitle}>Aquí podrás ver y analizar el feedback recibido.</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 24,
  },
  denied: {
    color: '#ff5252',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AdminFeedback;
