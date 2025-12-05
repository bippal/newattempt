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
  TextInput,
} from 'react-native';
import { Question, User, AdminLog } from '../../types';
import { getPriorityLevel, formatModerationReasons } from '../../utils/moderation';
import { MODERATION_THRESHOLDS } from '../../constants/config';

interface AdminPanelProps {
  navigation: any;
  currentUser: User;
}

export default function AdminPanel({
  navigation,
  currentUser,
}: AdminPanelProps) {
  const [flaggedQuestions, setFlaggedQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [deleteReason, setDeleteReason] = useState('');
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser.isAdmin) {
      Alert.alert('Access Denied', 'You do not have admin privileges');
      navigation.goBack();
      return;
    }
    loadFlaggedQuestions();
  }, []);

  const loadFlaggedQuestions = async () => {
    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // const flagged = await fetch('/api/admin/flagged-questions')
      //   .then(r => r.json());

      // Mock data with various priority levels
      const mockFlagged: Question[] = [
        {
          id: '1',
          textA: 'Would you rather eat shit',
          textB: 'Would you rather die',
          creatorId: 'spam_user_1',
          price: 0.99,
          status: 'active',
          isPaid: false,
          flaggedCount: 8,
          votesA: 10,
          votesB: 5,
          totalVotes: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          textA: 'Free iPhone giveaway click here!!!',
          textB: 'Win $1000 limited time!!!',
          creatorId: 'spam_user_2',
          price: 0.99,
          status: 'active',
          isPaid: false,
          flaggedCount: 6,
          votesA: 3,
          votesB: 2,
          totalVotes: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          textA: 'Live without internet',
          textB: 'Live without porn',
          creatorId: 'user123',
          price: 0.99,
          status: 'active',
          isPaid: true,
          flaggedCount: 2,
          votesA: 100,
          votesB: 150,
          totalVotes: 250,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      setFlaggedQuestions(mockFlagged);
    } catch (error) {
      console.error('Failed to load flagged questions:', error);
      Alert.alert('Error', 'Failed to load flagged questions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFlaggedQuestions();
  };

  const handleDelete = async (question: Question) => {
    Alert.alert(
      'Delete Question',
      `Are you sure you want to delete this question?\n\n"${question.textA}" vs "${question.textB}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => showDeleteReasonDialog(question),
        },
      ]
    );
  };

  const showDeleteReasonDialog = (question: Question) => {
    Alert.prompt(
      'Delete Reason',
      'Enter reason for deletion (will be logged):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: (reason) => confirmDelete(question, reason || 'No reason provided'),
        },
      ],
      'plain-text',
      '',
      'default'
    );
  };

  const confirmDelete = async (question: Question, reason: string) => {
    try {
      setActioningId(question.id);

      // TODO: Replace with actual API call
      // await fetch(`/api/admin/questions/${question.id}`, {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     adminId: currentUser.id,
      //     reason,
      //   }),
      // });

      const adminLog: AdminLog = {
        id: `log_${Date.now()}`,
        adminId: currentUser.id,
        action: 'deleted',
        questionId: question.id,
        reason,
        createdAt: new Date(),
      };

      console.log('Question deleted:', question.id, adminLog);

      // Remove from list
      setFlaggedQuestions((prev) => prev.filter((q) => q.id !== question.id));

      Alert.alert('Success', 'Question deleted and logged');
    } catch (error) {
      console.error('Failed to delete question:', error);
      Alert.alert('Error', 'Failed to delete question');
    } finally {
      setActioningId(null);
    }
  };

  const handlePause = async (question: Question) => {
    try {
      setActioningId(question.id);

      // TODO: Replace with actual API call
      console.log('Pausing question:', question.id);

      setFlaggedQuestions((prev) =>
        prev.map((q) =>
          q.id === question.id ? { ...q, status: 'paused' as const } : q
        )
      );

      Alert.alert('Success', 'Question paused');
    } catch (error) {
      Alert.alert('Error', 'Failed to pause question');
    } finally {
      setActioningId(null);
    }
  };

  const handleBanUser = async (userId: string) => {
    Alert.alert(
      'Ban User',
      `Ban user ${userId}? This will delete all their questions.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Ban',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: API call to ban user
              console.log('Banning user:', userId);
              Alert.alert('Success', 'User banned');
              loadFlaggedQuestions();
            } catch (error) {
              Alert.alert('Error', 'Failed to ban user');
            }
          },
        },
      ]
    );
  };

  const getFilteredQuestions = () => {
    if (filter === 'all') return flaggedQuestions;

    return flaggedQuestions.filter((q) => {
      const priority = getPriorityLevel(q.flaggedCount);
      return priority === filter;
    });
  };

  const renderPriorityBadge = (flaggedCount: number) => {
    const priority = getPriorityLevel(flaggedCount);

    return (
      <View
        style={[
          styles.priorityBadge,
          priority === 'high' && styles.priorityHigh,
          priority === 'medium' && styles.priorityMedium,
          priority === 'low' && styles.priorityLow,
        ]}
      >
        <Text style={styles.priorityText}>
          {priority === 'high' && '🔴 HIGH PRIORITY'}
          {priority === 'medium' && '🟡 MODERATION QUEUE'}
          {priority === 'low' && '🟢 LOW PRIORITY'}
        </Text>
      </View>
    );
  };

  const renderQuestionCard = ({ item }: { item: Question }) => {
    const isActioning = actioningId === item.id;

    return (
      <View style={styles.questionCard}>
        {renderPriorityBadge(item.flaggedCount)}

        <View style={styles.questionHeader}>
          <Text style={styles.questionId}>#{item.id}</Text>
          <View style={styles.flagCount}>
            <Text style={styles.flagCountText}>
              🚩 {item.flaggedCount} reports
            </Text>
          </View>
        </View>

        <View style={styles.questionContent}>
          <Text style={styles.questionText}>
            "{item.textA}" VS "{item.textB}"
          </Text>
        </View>

        <View style={styles.questionMeta}>
          <Text style={styles.metaText}>Creator: {item.creatorId}</Text>
          <Text style={styles.metaText}>Votes: {item.totalVotes}</Text>
          <Text style={styles.metaText}>
            Status: {item.status.toUpperCase()}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
            disabled={isActioning}
          >
            {isActioning ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.actionButtonText}>DELETE</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.pauseButton]}
            onPress={() => handlePause(item)}
            disabled={isActioning || item.status === 'paused'}
          >
            <Text style={styles.actionButtonText}>
              {item.status === 'paused' ? 'PAUSED' : 'PAUSE'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.banButton]}
            onPress={() => handleBanUser(item.creatorId)}
            disabled={isActioning}
          >
            <Text style={styles.actionButtonText}>BAN USER</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStats = () => {
    const highPriorityCount = flaggedQuestions.filter(
      (q) => getPriorityLevel(q.flaggedCount) === 'high'
    ).length;
    const mediumPriorityCount = flaggedQuestions.filter(
      (q) => getPriorityLevel(q.flaggedCount) === 'medium'
    ).length;
    const lowPriorityCount = flaggedQuestions.filter(
      (q) => getPriorityLevel(q.flaggedCount) === 'low'
    ).length;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{highPriorityCount}</Text>
          <Text style={styles.statLabel}>High Priority</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{mediumPriorityCount}</Text>
          <Text style={styles.statLabel}>Medium</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{lowPriorityCount}</Text>
          <Text style={styles.statLabel}>Low</Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        No flagged questions matching filter
      </Text>
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
        <Text style={styles.title}>Admin Panel</Text>
        <Text style={styles.subtitle}>Moderation Queue</Text>
      </View>

      {renderStats()}

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {(['all', 'high', 'medium', 'low'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === f && styles.filterTabTextActive,
              ]}
            >
              {f.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={getFilteredQuestions()}
        renderItem={renderQuestionCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
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
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#F5F5F7',
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  list: {
    padding: 15,
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
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  priorityHigh: {
    backgroundColor: '#FFE5E5',
  },
  priorityMedium: {
    backgroundColor: '#FFF4CC',
  },
  priorityLow: {
    backgroundColor: '#E5F5E5',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  questionId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  flagCount: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  flagCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30',
  },
  questionContent: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
  },
  questionMeta: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
  metaText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  pauseButton: {
    backgroundColor: '#FF9500',
  },
  banButton: {
    backgroundColor: '#8E8E93',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
