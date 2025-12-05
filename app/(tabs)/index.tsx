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
import { Question, User } from '../../types';
import { VISIBILITY_RULES } from '../../constants/config';

interface HomeProps {
  navigation: any;
  currentUser: User;
}

export default function Home({ navigation, currentUser }: HomeProps) {
  const [trendingQuestions, setTrendingQuestions] = useState<Question[]>([]);
  const [myQuestions, setMyQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'trending' | 'mine'>('trending');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);

      // TODO: Replace with actual API calls
      // const trending = await fetch('/api/questions/trending').then(r => r.json());
      // const mine = await fetch(`/api/questions/creator/${currentUser.id}`).then(r => r.json());

      // Mock data for now
      const mockTrending: Question[] = [
        {
          id: '1',
          textA: 'Live in a world without music',
          textB: 'Live in a world without movies',
          creatorId: 'user123',
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
          textA: 'Have the ability to fly',
          textB: 'Have the ability to turn invisible',
          creatorId: 'user456',
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

      setTrendingQuestions(mockTrending);

      // Only load "My Questions" if user is paid creator
      if (currentUser.credits > 0) {
        // const myQs = mockTrending.filter(q => q.creatorId === currentUser.id);
        setMyQuestions([]);
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadQuestions();
  };

  const renderQuestionCard = ({ item }: { item: Question }) => {
    const percentageA = item.totalVotes > 0
      ? Math.round((item.votesA / item.totalVotes) * 100)
      : 50;

    const canSeeStats =
      item.totalVotes >= VISIBILITY_RULES.minVotesBeforeShowingStats;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('QuestionDetail', { question: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.questionNumber}>#{item.id}</Text>
          <View style={styles.voteCount}>
            <Text style={styles.voteCountText}>{item.totalVotes} votes</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <View style={styles.option}>
            <Text style={styles.optionLabel}>A</Text>
            <Text style={styles.optionText}>{item.textA}</Text>
            {canSeeStats && (
              <Text style={styles.percentage}>{percentageA}%</Text>
            )}
          </View>

          <Text style={styles.vs}>VS</Text>

          <View style={styles.option}>
            <Text style={styles.optionLabel}>B</Text>
            <Text style={styles.optionText}>{item.textB}</Text>
            {canSeeStats && (
              <Text style={styles.percentage}>{100 - percentageA}%</Text>
            )}
          </View>
        </View>

        {item.isPaid && (
          <View style={styles.paidBadge}>
            <Text style={styles.paidBadgeText}>💎 CREATOR QUESTION</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        {activeTab === 'trending'
          ? 'No questions yet. Be the first to create one!'
          : 'You haven\'t created any questions yet.'}
      </Text>
      {activeTab === 'mine' && currentUser.credits === 0 && (
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => navigation.navigate('Purchase')}
        >
          <Text style={styles.upgradeButtonText}>
            🚀 Upgrade to Creator
          </Text>
        </TouchableOpacity>
      )}
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Would You Rather?</Text>
        <View style={styles.headerRight}>
          <Text style={styles.credits}>
            {currentUser.credits === Infinity ? '∞' : currentUser.credits} credits
          </Text>
          {currentUser.isAdmin && (
            <TouchableOpacity
              style={styles.adminButton}
              onPress={() => navigation.navigate('AdminPanel')}
            >
              <Text style={styles.adminButtonText}>⚙️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
          onPress={() => setActiveTab('trending')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'trending' && styles.activeTabText,
            ]}
          >
            🔥 Trending
          </Text>
        </TouchableOpacity>

        {currentUser.credits > 0 && (
          <TouchableOpacity
            style={[styles.tab, activeTab === 'mine' && styles.activeTab]}
            onPress={() => setActiveTab('mine')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'mine' && styles.activeTabText,
              ]}
            >
              📝 My Questions
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Questions List */}
      <FlatList
        data={activeTab === 'trending' ? trendingQuestions : myQuestions}
        renderItem={renderQuestionCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {currentUser.credits > 0 ? (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateQuestion')}
          >
            <Text style={styles.createButtonText}>+ Create Question</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.upgradeButtonBottom}
            onPress={() => navigation.navigate('Purchase')}
          >
            <Text style={styles.upgradeButtonBottomText}>
              💎 Become a Creator ($0.99)
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => navigation.navigate('MyPredictions')}
        >
          <Text style={styles.statsButtonText}>
            📊 My Stats ({currentUser.predictionAccuracy}% accurate)
          </Text>
        </TouchableOpacity>
      </View>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  credits: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  adminButton: {
    padding: 8,
  },
  adminButtonText: {
    fontSize: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  list: {
    padding: 15,
  },
  card: {
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
    marginBottom: 15,
  },
  questionNumber: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  voteCount: {
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  voteCountText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  optionsContainer: {
    gap: 15,
  },
  option: {
    gap: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
  },
  vs: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8E8E93',
  },
  percentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  paidBadge: {
    marginTop: 15,
    backgroundColor: '#F0F0F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  paidBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5856D6',
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
  upgradeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    gap: 10,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  upgradeButtonBottom: {
    backgroundColor: '#5856D6',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonBottomText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsButton: {
    backgroundColor: '#F5F5F7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statsButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
