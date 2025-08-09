import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Modal, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/services/supabaseClient';
import { SAGAS } from '@/constants/sagas';

// Toast/Snackbar simple
const useToast = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  const ToastComponent = toast ? (
    <View style={[toastStyles.toast, toast.type === 'success' ? toastStyles.success : toastStyles.error]}>
      <Text style={toastStyles.toastText}>{toast.message}</Text>
    </View>
  ) : null;
  return { showToast, ToastComponent };
};

const toastStyles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  success: {
    backgroundColor: '#00C896',
  },
  error: {
    backgroundColor: '#ff5252',
  },
});

interface Question {
  id: number;
  saga: string;
  difficulty: string;
  question: string;
  options: string[];
  correct_answer: string;
}

// Paginación
const ITEMS_PER_PAGE = 8;

const AdminQuestions: React.FC = () => {
  const { showToast, ToastComponent } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSaga, setFilterSaga] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');

  // Sagas para filtros (con estructura correcta)
  const SAGAS_FILTER = [
    { label: 'Todas', value: '' },
    { label: 'East Blue', value: 'east-blue' },
    { label: 'Alabasta', value: 'alabasta' },
    { label: 'Skypea', value: 'skypea' },
    { label: 'Water 7', value: 'water-7' },
    { label: 'Thriller Bark', value: 'thriller-bark' },
    { label: 'Marineford', value: 'marineford' },
    { label: 'Dressrosa', value: 'dressrosa' },
    { label: 'Whole Cake Island', value: 'whole-cake-island' },
    { label: 'Wano', value: 'wano' },
    { label: 'Punk Hazard', value: 'punk-hazard' },
  ];

  // Dificultades predefinidas
  const DIFFICULTIES = [
    { label: 'Todas', value: '' },
    { label: 'Fácil', value: 'easy' },
    { label: 'Media', value: 'medium' },
    { label: 'Difícil', value: 'hard' },
  ];

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: undefined as number | undefined,
    saga: '',
    difficulty: '',
    question: '',
    options: ['', '', '', ''],
    correct_answer: '',
  });
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);

  const handleOpenModal = () => {
    setForm({ id: undefined, saga: '', difficulty: '', question: '', options: ['', '', '', ''], correct_answer: '' });
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (q: Question) => {
    setForm({
      id: q.id,
      saga: q.saga,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    Alert.alert('¿Eliminar pregunta?', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          setSaving(true);
          const { error } = await supabase.from('questions').delete().eq('id', id);
          setSaving(false);
          if (error) {
            showToast('Error al eliminar la pregunta', 'error');
          } else {
            setQuestions(qs => qs.filter(q => q.id !== id));
            showToast('Pregunta eliminada correctamente', 'success');
          }
        }
      }
    ]);
  };

  const handleSave = async () => {
    if (!form.question || !form.correct_answer || form.options.some(opt => !opt)) {
      showToast('Por favor completá todos los campos', 'error');
      return;
    }

    setSaving(true);
    const questionData = {
      saga: form.saga,
      difficulty: form.difficulty,
      question: form.question,
      options: form.options,
      correct_answer: form.correct_answer,
    };

    let error;
    if (editMode && form.id) {
      const result = await supabase.from('questions').update(questionData).eq('id', form.id).select();
      error = result.error;
      if (!error && result.data) {
        setQuestions(qs => qs.map(q => q.id === form.id ? { ...q, ...questionData } : q));
      }
    } else {
      const result = await supabase.from('questions').insert([questionData]).select();
      error = result.error;
      if (!error && result.data) {
        setQuestions(qs => [...qs, result.data[0] as Question]);
      }
    }

    setSaving(false);
    if (error) {
      showToast('Error al guardar la pregunta', 'error');
    } else {
      showToast(editMode ? 'Pregunta actualizada correctamente' : 'Pregunta creada correctamente', 'success');
      setShowModal(false);
    }
  };

  const handleChangeOption = (index: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm(f => ({ ...f, options: newOptions }));
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchQuestions();
  }, [user]);

  const fetchQuestions = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('questions').select('*').order('id', { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setQuestions(data || []);
    }
    setLoading(false);
  };

  // Filtrado de preguntas
  const filteredQuestions = questions.filter(q => {
    const sagaMatch = !filterSaga || q.saga === filterSaga;
    const difficultyMatch = !filterDifficulty || q.difficulty === filterDifficulty;
    return sagaMatch && difficultyMatch;
  });

  // Paginación
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    // Calcular el rango de páginas a mostrar
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + 2);
    if (end - start < 2) start = Math.max(1, end - 2);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[styles.pageNumber, currentPage === i && styles.pageNumberActive]}
          onPress={() => goToPage(i)}
        >
          <Text style={[styles.pageNumberText, currentPage === i && styles.pageNumberTextActive]}>{i}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && { opacity: 0.5 }]}
          onPress={() => goToPage(1)}
          disabled={currentPage === 1}
        >
          <Text style={styles.pageButtonText}>{'<<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && { opacity: 0.5 }]}
          onPress={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Text style={styles.pageButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.pageNumbers}>{pages}</View>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === totalPages && { opacity: 0.5 }]}
          onPress={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.pageButtonText}>{'>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === totalPages && { opacity: 0.5 }]}
          onPress={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.pageButtonText}>{'>>'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuestion = ({ item }: { item: Question }) => (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <View>
          <Text style={styles.questionSaga}>{SAGAS_FILTER.find(s => s.value === item.saga)?.label || item.saga}</Text>
          <Text style={styles.questionDifficulty}>{item.difficulty}</Text>
        </View>
        <View style={styles.questionActions}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
            <Ionicons name="pencil" size={18} color="#00C896" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleDelete(item.id)} 
            style={[styles.actionButton, { opacity: 0.5 }]}
            disabled={true}
          >
            <Ionicons name="trash" size={18} color="#ff5252" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.questionText}>{item.question}</Text>
      <Text style={styles.questionAnswer}>Respuesta: {item.correct_answer}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00C896" />
        <Text style={styles.loadingText}>Cargando preguntas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Reintentar" onPress={fetchQuestions} variant="primary" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {ToastComponent}
      
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Preguntas</Text>
        <Button title="Nueva Pregunta" onPress={handleOpenModal} variant="success" />
      </View>

      {/* Filtros */}
      <View style={styles.filtersRow}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Saga</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={filterSaga}
              onValueChange={setFilterSaga}
              style={Platform.OS === 'web' ? [styles.pickerWeb, styles.pickerDark] : styles.pickerDark}
              dropdownIconColor="#00C896"
              itemStyle={styles.pickerItem}
            >
              {SAGAS_FILTER.map(s => (
                <Picker.Item key={s.value} label={s.label} value={s.value} color="#e0e0e0" />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Dificultad</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={filterDifficulty}
              onValueChange={setFilterDifficulty}
              style={Platform.OS === 'web' ? [styles.pickerWeb, styles.pickerDark] : styles.pickerDark}
              dropdownIconColor="#00C896"
              itemStyle={styles.pickerItem}
            >
              {DIFFICULTIES.map(d => (
                <Picker.Item key={d.value} label={d.label} value={d.value} color="#e0e0e0" />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <Text style={styles.resultsCount}>
        {filteredQuestions.length} pregunta{filteredQuestions.length !== 1 ? 's' : ''} encontrada{filteredQuestions.length !== 1 ? 's' : ''}
      </Text>

      <FlatList
        data={paginatedQuestions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {renderPagination()}

      {/* Modal responsive mejorado */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.modalTitle}>{editMode ? 'Editar Pregunta' : 'Nueva Pregunta'}</Text>
              
              {/* Bloque Saga/Dificultad */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Categoría</Text>
                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pickerLabel}>Saga</Text>
                    <View style={[styles.pickerWrapper, styles.pickerHighlight]}>
                      <Picker
                        selectedValue={form.saga}
                        onValueChange={v => setForm(f => ({ ...f, saga: v }))}
                        style={Platform.OS === 'web' ? [styles.pickerWeb, styles.pickerDark] : styles.pickerDark}
                        dropdownIconColor="#00C896"
                        itemStyle={styles.pickerItem}
                      >
                        {SAGAS_FILTER.filter(s => s.value).map(s => (
                          <Picker.Item key={s.value} label={s.label} value={s.value} color="#e0e0e0" />
                        ))}
                      </Picker>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pickerLabel}>Dificultad</Text>
                    <View style={[styles.pickerWrapper, styles.pickerHighlight]}>
                      <Picker
                        selectedValue={form.difficulty}
                        onValueChange={v => setForm(f => ({ ...f, difficulty: v }))}
                        style={Platform.OS === 'web' ? [styles.pickerWeb, styles.pickerDark] : styles.pickerDark}
                        dropdownIconColor="#00C896"
                        itemStyle={styles.pickerItem}
                      >
                        <Picker.Item label="Fácil" value="easy" color="#e0e0e0" />
                        <Picker.Item label="Media" value="medium" color="#e0e0e0" />
                        <Picker.Item label="Difícil" value="hard" color="#e0e0e0" />
                      </Picker>
                    </View>
                  </View>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Pregunta */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Enunciado</Text>
                <TextInput
                  style={[styles.input, { marginBottom: 20, paddingVertical: 14 }]}
                  placeholder="Pregunta"
                  placeholderTextColor="#888"
                  value={form.question}
                  onChangeText={v => setForm(f => ({ ...f, question: v }))}
                />
              </View>

              {/* Opciones */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Opciones de respuesta</Text>
                {form.options.map((opt, i) => (
                  <TextInput
                    key={i}
                    style={[styles.input, { marginBottom: 14, paddingVertical: 12 }]}
                    placeholder={`Opción ${i + 1}`}
                    placeholderTextColor="#888"
                    value={opt}
                    onChangeText={v => handleChangeOption(i, v)}
                  />
                ))}
              </View>

              {/* Respuesta correcta - Radio buttons */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Respuesta correcta</Text>
                <View style={styles.radioGroup}>
                  {form.options.map((opt, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.radioOption,
                        form.correct_answer === opt && styles.radioOptionSelected,
                        !opt && { opacity: 0.5 }
                      ]}
                      onPress={() => opt && setForm(f => ({ ...f, correct_answer: opt }))}
                      disabled={!opt}
                    >
                      <View style={[
                        styles.radioCircle,
                        form.correct_answer === opt && styles.radioCircleSelected
                      ]}>
                        {form.correct_answer === opt && <View style={styles.radioDot} />}
                      </View>
                      <Text style={styles.radioLabel}>{opt || `Opción ${i + 1}`}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {!form.correct_answer && (
                  <Text style={styles.radioError}>Seleccioná la respuesta correcta</Text>
                )}
              </View>
            </ScrollView>
            
            {/* Botones fijos en la parte inferior */}
            <View style={styles.modalFooter}>
              <View style={styles.buttonRow}>
                <Button
                  title={saving ? 'Guardando...' : (editMode ? 'Actualizar' : 'Guardar')}
                  onPress={handleSave}
                  disabled={saving || !form.correct_answer}
                  variant="success"
                  size="large"
                  style={{ flex: 1, marginRight: 12 }}
                />
                <Button
                  title="Cancelar"
                  onPress={() => setShowModal(false)}
                  variant="danger"
                  size="large"
                  style={{ flex: 1, marginLeft: 12 }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1c21',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingText: {
    color: '#ccc',
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff5252',
    marginBottom: 20,
    textAlign: 'center',
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 20,
    marginBottom: 20,
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  filterGroup: {
    flex: 1,
    minWidth: 140,
  },
  filterLabel: {
    color: '#00C896',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 14,
  },
  pickerWrapper: {
    backgroundColor: '#181a1f',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#222',
    overflow: 'hidden',
  },
  pickerWeb: {
    height: 44,
    backgroundColor: '#181a1f',
    color: '#e0e0e0',
    borderRadius: 8,
  },
  pickerDark: {
    color: '#e0e0e0',
    backgroundColor: '#181a1f',
  },
  pickerItem: {
    color: '#e0e0e0',
    backgroundColor: '#181a1f',
  },
  resultsCount: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  questionCard: {
    backgroundColor: '#23252C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questionSaga: {
    color: '#00C896',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionDifficulty: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  questionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#1a1c21',
  },
  questionText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  questionAnswer: {
    color: '#ccc',
    fontSize: 14,
    fontStyle: 'italic',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    gap: 10,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#23252C',
    borderRadius: 6,
  },
  pageButtonText: {
    color: '#00C896',
    fontWeight: '600',
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: 4,
  },
  pageNumber: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#23252C',
  },
  pageNumberActive: {
    backgroundColor: '#00C896',
  },
  pageNumberText: {
    color: '#fff',
    fontWeight: '600',
  },
  pageNumberTextActive: {
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 20 : 12,
  },
  modalContentCard: {
    backgroundColor: '#23252C',
    borderRadius: 18,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 440 : '100%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Platform.OS === 'web' ? 32 : 20,
    paddingBottom: 20,
  },
  modalFooter: {
    backgroundColor: '#1a1c21',
    borderTopWidth: 1,
    borderTopColor: '#333',
    padding: Platform.OS === 'web' ? 20 : 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#00C896',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
    marginLeft: 2,
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 18,
    borderRadius: 2,
  },
  pickerHighlight: {
    borderColor: '#00C896',
    borderWidth: 1.5,
    backgroundColor: '#181a1f',
  },
  pickerLabel: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#1a1c21',
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  radioGroup: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'web' ? 8 : 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 2,
    backgroundColor: 'transparent',
    minHeight: Platform.OS === 'web' ? 40 : 48,
  },
  radioOptionSelected: {
    backgroundColor: '#1b2a22',
  },
  radioCircle: {
    width: Platform.OS === 'web' ? 22 : 26,
    height: Platform.OS === 'web' ? 22 : 26,
    borderRadius: Platform.OS === 'web' ? 11 : 13,
    borderWidth: 2,
    borderColor: '#00C896',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#181a1f',
  },
  radioCircleSelected: {
    borderColor: '#00C896',
    backgroundColor: '#23252C',
  },
  radioDot: {
    width: Platform.OS === 'web' ? 10 : 12,
    height: Platform.OS === 'web' ? 10 : 12,
    borderRadius: Platform.OS === 'web' ? 5 : 6,
    backgroundColor: '#00C896',
  },
  radioLabel: {
    color: '#fff',
    fontSize: Platform.OS === 'web' ? 15 : 16,
    flex: 1,
  },
  radioError: {
    color: '#ff5a5a',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 2,
  },
});

export default AdminQuestions;
