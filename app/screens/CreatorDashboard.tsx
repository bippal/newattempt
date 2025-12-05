import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Question, User, CreatorStats, QuestionAnswer } from '../../types';
import { REVENUE_CONFIG } from '../../constants/pricing';

interface CreatorDashboardProps {
  navigation: any;
  currentUser: User;
}

export default function CreatorDashboard({
  navigation,
  currentUser,
}: CreatorDashboardProps) {
  const [myQuestions, setMyQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // TODO: Replace with actual API calls
      // const questions = await fetch(`/api/creators/${currentUser.id}/questions`)
      //   .then(r => r.json());
      // const stats = await fetch(`/api/creators/${currentUser.id}/stats`)
      //   .then(r => r.json());

      // Mock data
      const mockQuestions: Question[] = [
        {
          id: '1',
          textA: 'Live in a world without music',
          textB: 'Live in a world without movies',
          creatorId: currentUser.id,
          price: 0.99,
          status: 'active',
          isPaid: true,
          flaggedCount: 0,
          votesA: 342,
          votesB: 658,
          totalVotes: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          textA: 'Always be 10 minutes late',
          textB: 'Always be 20 minutes early',
          creatorId: currentUser.id,
          price: 0.99,
          status: 'active',
          isPaid: true,
          flaggedCount: 0,
          votesA: 520,
          votesB: 480,
          totalVotes: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockStats: CreatorStats = {
        userId: currentUser.id,
        questionsCreated: 12,
        totalVotes: 8543,
        revenue: 84.32,
        mostPopularQuestion: mockQuestions[0],
      };

      setMyQuestions(mockQuestions);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const handlePauseQuestion = async (questionId: string) => {
    Alert.alert(
      'Pause Question',
      'This will temporarily hide your question from users. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pause',
          onPress: async () => {
            try {
              // TODO: API call to pause question
              console.log('Pausing question:', questionId);
              Alert.alert('Success', 'Question paused');
              loadDashboard();
            } catch (error) {
              Alert.alert('Error', 'Failed to pause question');
            }
          },
        },
      ]
    );
  };

  const handleViewAnswers = (question: Question) => {
    navigation.navigate('QuestionAnswers', { question });
  };

  const renderStatsCard = () => {
    if (!stats) return null;

    const estimatedEarnings = stats.revenue * REVENUE_CONFIG.creatorShare;
    const canPayout = estimatedEarnings >= REVENUE_CONFIG.minimumPayout;

    return (
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Creator Stats</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.questionsCreated}</Text>
            <Text style={styles.statLabel}>Questions Created</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalVotes.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Votes</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.revenueValue]}>
              ${estimatedEarnings.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Estimated Earnings</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {currentUser.credits === Infinity ? '∞' : currentUser.credits}
            </Text>
            <Text style={styles.statLabel}>Credits Remaining</Text>
          </View>
        </View>

        {canPayout && (
          <TouchableOpacity
            style={styles.payoutButton}
            onPress={() => Alert.alert('Payout', 'Payout feature coming soon!')}
          >
            <Text style={styles.payoutButtonText}>
              💰 Request Payout (${estimatedEarnings.toFixed(2)})
            </Text>
          </TouchableOpacity>
        )}

        {!canPayout && (
          <Text style={styles.payoutHint}>
            Minimum payout: ${REVENUE_CONFIG.minimumPayout.toFixed(2)}
          </Text>
        )}
      </View>
    );
  };

  const renderQuestionCard = ({ item }: { item: Question }) => {
    const percentageA = item.totalVotes > 0
      ? Math.round((item.votesA / item.totalVotes) * 100)
      : 50;

    const isPaused = item.status === 'paused';
    const isClosed = item.status === 'closed';

    return (
      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionId}>#{item.id}</Text>
          <View
            style={[
              styles.statusBadge,
              isPaused && styles.statusPaused,
              isClosed && styles.statusClosed,
            ]}
          >
            <Text style={styles.statusText}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.questionOptions}>
          <View style={styles.option}>
            <Text style={styles.optionLabel}>A ({percentageA}%)</Text>
            <Text style={styles.optionText} numberOfLines={2}>
              {item.textA}
            </Text>
          </View>

          <View style={styles.option}>
            <Text style={styles.optionLabel}>B ({100 - percentageA}%)</Text>
            <Text style={styles.optionText} numberOfLines={2}>
              {item.textB}
            </Text>
          </View>
        </View>

        <View style={styles.questionStats}>
          <Text style={styles.questionStat}>
            👥 {item.totalVotes} votes
          </Text>
          <Text style={styles.questionStat}>
            💰 ${(item.price * item.totalVotes * REVENUE_CONFIG.creatorShare).toFixed(2)} earned
          </Text>
        </View>

        <View style={styles.questionActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewAnswers(item)}
          >
            <Text style={styles.actionButtonText}>View Answers</Text>
          </TouchableOpacity>

          {!isClosed && (
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() => handlePauseQuestion(item.id)}
            >
              <Text style={styles.actionButtonTextSecondary}>
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {item.flaggedCount > 0 && (
          <View style={styles.flagWarning}>
            <Text style={styles.flagWarningText}>
              🚩 {item.flaggedCount} reports - Under review
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        You haven't created any questions yet
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateQuestion')}
      >
        <Text style={styles.createButtonText}>+ Create Your First Question</Text>
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
        <Text style={styles.title}>Creator Dashboard</Text>
        <TouchableOpacity
          style={styles.buyMoreButton}
          onPress={() => navigation.navigate('Purchase')}
        >
          <Text style={styles.buyMoreButtonText}>+ Buy Credits</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={myQuestions}
        renderItem={renderQuestionCard}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  buyMoreButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buyMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
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
  revenueValue: {
    color: '#34C759',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  payoutButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  payoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  payoutHint: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 10,
  },
  questionCard: {
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
  questionHeader: {
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
  statusBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPaused: {
    backgroundColor: '#FF9500',
  },
  statusClosed: {
    backgroundColor: '#8E8E93',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  questionOptions: {
    gap: 10,
    marginBottom: 12,
  },
  option: {
    gap: 4,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#000000',
  },
  questionStats: {
    flexDirection: 'row',
    gap: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    marginBottom: 12,
  },
  questionStat: {
    fontSize: 12,
    color: '#8E8E93',
  },
  questionActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonSecondary: {
    backgroundColor: '#F5F5F7',
  },
  actionButtonTextSecondary: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  flagWarning: {
    marginTop: 12,
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 6,
  },
  flagWarningText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '600',
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
  createButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
