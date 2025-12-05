import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Vote, Question, User, PredictionStats } from '../types';

export default function Predictions() {
  const router = useRouter();

  // TODO: Get current user from context
  const [currentUser] = useState<User>({
    id: 'user123',
    username: 'JohnDoe',
    credits: 5,
    predictionAccuracy: 78,
    isAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [predictions, setPredictions] = useState<(Vote & { question: Question })[]>([]);
  const [stats, setStats] = useState<PredictionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // const predictions = await fetch(`/api/users/${currentUser.id}/predictions`)
      //   .then(r => r.json());
      // const stats = await fetch(`/api/users/${currentUser.id}/prediction-stats`)
      //   .then(r => r.json());

      // Mock data
      const mockPredictions: (Vote & { question: Question })[] = [
        {
          id: 'vote1',
          questionId: '1',
          userId: currentUser.id,
          choseA: true,
          predictedA: 65,
          accuracyScore: 85,
          createdAt: new Date('2025-12-04'),
          question: {
            id: '1',
            textA: 'Live in a world without music',
            textB: 'Live in a world without movies',
            creatorId: 'user456',
            price: 0.99,
            status: 'closed',
            isPaid: true,
            flaggedCount: 0,
            votesA: 342,
            votesB: 658,
            totalVotes: 1000,
            createdAt: new Date('2025-12-04'),
            updatedAt: new Date('2025-12-04'),
          },
        },
        {
          id: 'vote2',
          questionId: '2',
          userId: currentUser.id,
          choseA: false,
          predictedA: 45,
          accuracyScore: 95,
          createdAt: new Date('2025-12-03'),
          question: {
            id: '2',
            textA: 'Have the ability to fly',
            textB: 'Have the ability to turn invisible',
            creatorId: 'user789',
            price: 0.99,
            status: 'closed',
            isPaid: true,
            flaggedCount: 0,
            votesA: 520,
            votesB: 480,
            totalVotes: 1000,
            createdAt: new Date('2025-12-03'),
            updatedAt: new Date('2025-12-03'),
          },
        },
      ];

      const mockStats: PredictionStats = {
        userId: currentUser.id,
        totalPredictions: 24,
        averageAccuracy: 78,
        bestAccuracy: 98,
        worstAccuracy: 42,
        rank: 156,
      };

      setPredictions(mockPredictions);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load predictions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPredictions();
  };

  const calculateActualPercentageA = (question: Question) => {
    if (question.totalVotes === 0) return 50;
    return Math.round((question.votesA / question.totalVotes) * 100);
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return '#34C759'; // Green
    if (accuracy >= 70) return '#007AFF'; // Blue
    if (accuracy >= 50) return '#FF9500'; // Orange
    return '#FF3B30'; // Red
  };

  const renderStatsCard = () => {
    if (!stats) return null;

    return (
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Prediction Stats</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalPredictions}</Text>
            <Text style={styles.statLabel}>Total Predictions</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: getAccuracyColor(stats.averageAccuracy) }]}>
              {stats.averageAccuracy}%
            </Text>
            <Text style={styles.statLabel}>Avg Accuracy</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#34C759' }]}>
              {stats.bestAccuracy}%
            </Text>
            <Text style={styles.statLabel}>Best</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#FF3B30' }]}>
              {stats.worstAccuracy}%
            </Text>
            <Text style={styles.statLabel}>Worst</Text>
          </View>
        </View>

        {stats.rank && (
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>🏆 Rank #{stats.rank} Globally</Text>
          </View>
        )}
      </View>
    );
  };

  const renderPredictionCard = ({ item }: { item: Vote & { question: Question } }) => {
    const actualPercentageA = calculateActualPercentageA(item.question);
    const accuracy = item.accuracyScore || 0;
    const difference = Math.abs(actualPercentageA - item.predictedA);

    return (
      <TouchableOpacity
        style={styles.predictionCard}
        onPress={() => router.push(`/question/${item.questionId}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.questionId}>#{item.questionId}</Text>
          <View style={[styles.accuracyBadge, { backgroundColor: getAccuracyColor(accuracy) }]}>
            <Text style={styles.accuracyText}>{accuracy}% Accurate</Text>
          </View>
        </View>

        <Text style={styles.questionText} numberOfLines={2}>
          "{item.question.textA}" vs "{item.question.textB}"
        </Text>

        <View style={styles.predictionDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>You chose:</Text>
            <Text style={styles.detailValue}>{item.choseA ? 'A' : 'B'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>You predicted:</Text>
            <Text style={styles.detailValue}>{item.predictedA}% would choose A</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Actual result:</Text>
            <Text style={styles.detailValue}>{actualPercentageA}% chose A</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Difference:</Text>
            <Text style={[styles.detailValue, { color: getAccuracyColor(accuracy) }]}>
              {difference}%
            </Text>
          </View>
        </View>

        <Text style={styles.dateText}>
          {item.createdAt.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        You haven't made any predictions yet
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={styles.exploreButtonText}>Explore Questions</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Predictions</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={predictions}
        renderItem={renderPredictionCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderStatsCard}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  list: {
    padding: 15,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F5F5F7',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  rankBadge: {
    marginTop: 15,
    backgroundColor: '#F0F8FF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  predictionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  accuracyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accuracyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  questionText: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 15,
    lineHeight: 22,
  },
  predictionDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  dateText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 20,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
