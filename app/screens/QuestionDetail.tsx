import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Question, User, Vote, QuestionAnswer } from '../../types';
import { PREDICTION_SCORING } from '../../constants/config';

interface QuestionDetailProps {
  route: {
    params: {
      question: Question;
    };
  };
  navigation: any;
  currentUser: User;
}

export default function QuestionDetail({
  route,
  navigation,
  currentUser,
}: QuestionDetailProps) {
  const { question } = route.params;

  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [predictedPercentageA, setPredictedPercentageA] = useState(50);
  const [submitting, setSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [myVote, setMyVote] = useState<Vote | null>(null);
  const [creatorAnswer, setCreatorAnswer] = useState<QuestionAnswer | null>(null);

  useEffect(() => {
    checkIfVoted();
    loadCreatorAnswer();
  }, []);

  const checkIfVoted = async () => {
    try {
      // TODO: Replace with actual API call
      // const vote = await fetch(`/api/votes/${question.id}/user/${currentUser.id}`)
      //   .then(r => r.json());

      // Mock for now
      const vote = null;

      if (vote) {
        setHasVoted(true);
        setMyVote(vote);
        setSelectedOption(vote.choseA ? 'A' : 'B');
        setPredictedPercentageA(vote.predictedA);
      }
    } catch (error) {
      console.error('Failed to check vote:', error);
    }
  };

  const loadCreatorAnswer = async () => {
    try {
      // Only load if user is the creator OR has voted
      if (question.creatorId === currentUser.id || hasVoted) {
        // TODO: Replace with actual API call
        // const answer = await fetch(`/api/questions/${question.id}/answer`)
        //   .then(r => r.json());

        // Mock for now
        const mockAnswer: QuestionAnswer = {
          id: '1',
          questionId: question.id,
          creatorId: question.creatorId,
          anonymousText: 'I personally chose option B because...',
          createdAt: new Date(),
        };

        setCreatorAnswer(mockAnswer);
      }
    } catch (error) {
      console.error('Failed to load creator answer:', error);
    }
  };

  const handleSubmitVote = async () => {
    if (!selectedOption) {
      Alert.alert('Error', 'Please select an option (A or B)');
      return;
    }

    try {
      setSubmitting(true);

      const vote: Vote = {
        id: `vote_${Date.now()}`,
        questionId: question.id,
        userId: currentUser.id,
        choseA: selectedOption === 'A',
        predictedA: predictedPercentageA,
        createdAt: new Date(),
      };

      // TODO: Replace with actual API call
      // await fetch('/api/votes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(vote),
      // });

      console.log('Vote submitted:', vote);

      setHasVoted(true);
      setMyVote(vote);

      Alert.alert(
        'Vote Submitted!',
        `You chose option ${selectedOption} and predicted ${predictedPercentageA}% would choose A.`
      );

      // Reload creator answer now that user has voted
      loadCreatorAnswer();
    } catch (error) {
      console.error('Failed to submit vote:', error);
      Alert.alert('Error', 'Failed to submit vote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateAccuracy = () => {
    if (!myVote || question.totalVotes === 0) return null;

    const actualPercentageA = Math.round(
      (question.votesA / question.totalVotes) * 100
    );
    const difference = Math.abs(actualPercentageA - myVote.predictedA);
    const accuracy = Math.max(0, 100 - difference);

    return {
      accuracy,
      actualPercentageA,
      difference,
    };
  };

  const accuracyStats = calculateAccuracy();

  const actualPercentageA =
    question.totalVotes > 0
      ? Math.round((question.votesA / question.totalVotes) * 100)
      : 50;

  const handleReport = () => {
    Alert.alert(
      'Report Question',
      'Why are you reporting this question?',
      [
        { text: 'Spam', onPress: () => submitReport('spam') },
        { text: 'Inappropriate', onPress: () => submitReport('inappropriate') },
        { text: 'Offensive', onPress: () => submitReport('offensive') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const submitReport = async (reason: string) => {
    try {
      // TODO: API call to report question
      console.log('Reporting question:', question.id, reason);
      Alert.alert('Thank you', 'Question has been reported for review.');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Question Header */}
      <View style={styles.header}>
        <Text style={styles.questionId}>Question #{question.id}</Text>
        <View style={styles.voteCount}>
          <Text style={styles.voteCountText}>{question.totalVotes} votes</Text>
        </View>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionCard,
            selectedOption === 'A' && styles.optionSelected,
            hasVoted && styles.optionDisabled,
          ]}
          onPress={() => !hasVoted && setSelectedOption('A')}
          disabled={hasVoted}
        >
          <View style={styles.optionHeader}>
            <Text style={styles.optionLabel}>Option A</Text>
            {hasVoted && (
              <Text style={styles.optionPercentage}>{actualPercentageA}%</Text>
            )}
          </View>
          <Text style={styles.optionText}>{question.textA}</Text>
          {hasVoted && myVote?.choseA && (
            <View style={styles.myChoiceBadge}>
              <Text style={styles.myChoiceText}>✓ Your Choice</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.vs}>VS</Text>

        <TouchableOpacity
          style={[
            styles.optionCard,
            selectedOption === 'B' && styles.optionSelected,
            hasVoted && styles.optionDisabled,
          ]}
          onPress={() => !hasVoted && setSelectedOption('B')}
          disabled={hasVoted}
        >
          <View style={styles.optionHeader}>
            <Text style={styles.optionLabel}>Option B</Text>
            {hasVoted && (
              <Text style={styles.optionPercentage}>
                {100 - actualPercentageA}%
              </Text>
            )}
          </View>
          <Text style={styles.optionText}>{question.textB}</Text>
          {hasVoted && !myVote?.choseA && (
            <View style={styles.myChoiceBadge}>
              <Text style={styles.myChoiceText}>✓ Your Choice</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Prediction Slider */}
      {!hasVoted && (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionTitle}>
            Predict the Crowd: What % will choose A?
          </Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>0%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={predictedPercentageA}
              onValueChange={setPredictedPercentageA}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#E5E5E7"
              thumbTintColor="#007AFF"
              step={1}
            />
            <Text style={styles.sliderLabel}>100%</Text>
          </View>
          <Text style={styles.predictionValue}>{predictedPercentageA}%</Text>
          <Text style={styles.predictionHint}>
            Earn points for accurate predictions!
          </Text>
        </View>
      )}

      {/* Accuracy Stats (after voting) */}
      {hasVoted && accuracyStats && (
        <View style={styles.accuracyContainer}>
          <Text style={styles.accuracyTitle}>Your Prediction Accuracy</Text>
          <View style={styles.accuracyStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>You Predicted</Text>
              <Text style={styles.statValue}>{myVote?.predictedA}%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Actual Result</Text>
              <Text style={styles.statValue}>
                {accuracyStats.actualPercentageA}%
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Accuracy</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: accuracyStats.accuracy > 80 ? '#34C759' : '#FF9500' },
                ]}
              >
                {accuracyStats.accuracy}%
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Creator Answer (visible after voting) */}
      {hasVoted && creatorAnswer && (
        <View style={styles.creatorAnswerContainer}>
          <Text style={styles.creatorAnswerTitle}>
            💭 Creator's Anonymous Answer
          </Text>
          <Text style={styles.creatorAnswerText}>
            {creatorAnswer.anonymousText}
          </Text>
        </View>
      )}

      {/* Submit Button */}
      {!hasVoted && (
        <TouchableOpacity
          style={[styles.submitButton, !selectedOption && styles.submitButtonDisabled]}
          onPress={handleSubmitVote}
          disabled={!selectedOption || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Vote & Prediction</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Report Button */}
      <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
        <Text style={styles.reportButtonText}>🚩 Report Question</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
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
  questionId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  voteCount: {
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  voteCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  optionsContainer: {
    padding: 20,
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E5E7',
  },
  optionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  optionDisabled: {
    opacity: 0.8,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  optionPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  optionText: {
    fontSize: 18,
    color: '#000000',
    lineHeight: 26,
  },
  myChoiceBadge: {
    marginTop: 12,
    backgroundColor: '#34C759',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  myChoiceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  vs: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8E8E93',
  },
  predictionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  predictionValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginVertical: 10,
  },
  predictionHint: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  accuracyContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
  accuracyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
  },
  accuracyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  creatorAnswerContainer: {
    backgroundColor: '#F0F0F5',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#5856D6',
  },
  creatorAnswerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5856D6',
    marginBottom: 10,
  },
  creatorAnswerText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginBottom: 15,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reportButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 12,
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
});
