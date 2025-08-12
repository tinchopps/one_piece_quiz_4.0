import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, RefreshCw } from 'lucide-react-native';
import { Colors, gradients } from '@/constants/colors';
import { RankingService } from '@/services/supabaseClient';
import { useGame } from '@/context/GameContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Row { username: string; score: number; }

type ModeTab = 'free' | 'story';

export default function RankingScreen() {
  const { username } = useGame();
  const [mode, setMode] = useState<ModeTab>('free');
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const top = await RankingService.getTopScores(mode, 50);
      setRows(top);
      if (username) {
        const rank = await RankingService.getUserRank(username, mode);
        setUserRank(rank);
      } else {
        setUserRank(null);
      }
    } catch (e) {
      console.warn('[Ranking] fetch error', (e as any)?.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [mode, username]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }: { item: Row; index: number }) => {
    const highlight = username && item.username === username;
    return (
      <View style={[styles.row, highlight && styles.highlightRow]}>
        <Text style={[styles.rank, highlight && styles.highlightText]}>{index + 1}</Text>
        <Text style={[styles.username, highlight && styles.highlightText]} numberOfLines={1}>{item.username}</Text>
        <Text style={[styles.score, highlight && styles.highlightText]}>{item.score}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={gradients.pirate as any} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}> 
          <Trophy size={32} color={Colors.secondary} />
          <Text style={styles.title}>Ranking Global</Text>
        </View>
        <View style={styles.modeTabs}>
          <TouchableOpacity onPress={() => setMode('free')} style={[styles.modeTab, mode==='free' && styles.modeTabActive]}>
            <Text style={[styles.modeTabText, mode==='free' && styles.modeTabTextActive]}>Libre</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('story')} style={[styles.modeTab, mode==='story' && styles.modeTabActive]}>
            <Text style={[styles.modeTabText, mode==='story' && styles.modeTabTextActive]}>Historia</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={fetchData} style={styles.refreshBtn}>
            <RefreshCw size={20} color={Colors.secondary} />
          </TouchableOpacity>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoText}>
            {mode === 'free'
              ? 'Solo partidas (Mixto / Mixto / 10) cuentan para este ranking.'
              : 'Mejor puntuación por saga (temporal).'}
          </Text>
          {!username && (
            <Text style={styles.noteText}>Configura un nombre en Ajustes o Modo Personalizado para aparecer aquí.</Text>
          )}
        </Card>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.secondary} />
          </View>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item) => item.username}
            renderItem={renderItem}
            style={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.secondary} />}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay datos todavía.</Text>}
          />
        )}

        {username && userRank && userRank > rows.length && (
          <View style={styles.rankFooter}>
            <Text style={styles.footerText}>Tu puesto: {userRank}</Text>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8 },
  title: { fontSize: 24, fontFamily: 'PirataOne-Regular', color: Colors.secondary },
  modeTabs: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 12, gap: 8 },
  modeTab: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)' },
  modeTabActive: { backgroundColor: 'rgba(251,191,36,0.3)' },
  modeTabText: { textAlign: 'center', fontFamily: 'Inter-SemiBold', color: Colors.text.inverse },
  modeTabTextActive: { color: Colors.secondary },
  refreshBtn: { padding: 8 },
  infoCard: { margin: 20 },
  infoText: { fontSize: 12, fontFamily: 'Inter-Regular', color: Colors.text.primary },
  noteText: { marginTop: 8, fontSize: 12, fontFamily: 'Inter-SemiBold', color: Colors.accent },
  loadingBox: { margin: 20, alignItems: 'center' },
  list: { flex: 1, marginHorizontal: 20 },
  emptyText: { textAlign: 'center', marginTop: 40, fontFamily: 'Inter-SemiBold', color: Colors.text.inverse },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  highlightRow: { backgroundColor: 'rgba(251,191,36,0.15)', borderRadius: 6 },
  rank: { width: 40, textAlign: 'center', fontFamily: 'Inter-Bold', color: Colors.text.inverse },
  username: { flex: 1, fontFamily: 'Inter-Regular', color: Colors.text.inverse },
  score: { width: 60, textAlign: 'right', fontFamily: 'Inter-Bold', color: Colors.secondary, paddingRight: 8 },
  highlightText: { color: Colors.secondary },
  rankFooter: { padding: 16, alignItems: 'center' },
  footerText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: Colors.secondary },
});
