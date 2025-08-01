import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';

interface SimpleFeedbackProps {
  visible: boolean;
  onComplete: () => void;
}

export const SimpleFeedback: React.FC<SimpleFeedbackProps> = ({
  visible,
  onComplete,
}) => {
  console.log('🔍 SimpleFeedback render:', { visible });

  if (!visible) {
    console.log('❌ SimpleFeedback no visible');
    return null;
  }

  console.log('✅ SimpleFeedback renderizando modal');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>🧪 Test Modal</Text>
          <Text style={styles.text}>Si ves esto, el modal funciona</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={onComplete}
          >
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    maxWidth: 300,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
