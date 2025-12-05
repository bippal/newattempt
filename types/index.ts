/**
 * Core Data Models for "Would You Rather" Prediction Game
 */

export interface User {
  id: string;
  username: string;
  credits: number;
  predictionAccuracy: number; // 0-100
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  textA: string;
  textB: string;
  creatorId: string;
  price: number;
  status: 'active' | 'closed' | 'paused';
  isPaid: boolean;
  flaggedCount: number;
  votesA: number;
  votesB: number;
  totalVotes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vote {
  id: string;
  questionId: string;
  userId: string;
  choseA: boolean;
  predictedA: number; // 0-100 predicted percentage for option A
  accuracyScore?: number; // Calculated after question closes
  createdAt: Date;
}

export interface QuestionAnswer {
  id: string;
  questionId: string;
  creatorId: string;
  anonymousText: string; // Creator's answer to their own question
  createdAt: Date;
}

export interface AdminLog {
  id: string;
  adminId: string;
  action: 'deleted' | 'flagged' | 'paused' | 'banned';
  questionId: string;
  reason: string;
  createdAt: Date;
}

export interface IAPPack {
  id: string;
  price: number;
  questions: number;
  label: string;
  discount?: string;
}

export interface UserReport {
  id: string;
  questionId: string;
  reporterId: string;
  reason: string;
  createdAt: Date;
}

export interface PredictionStats {
  userId: string;
  totalPredictions: number;
  averageAccuracy: number;
  bestAccuracy: number;
  worstAccuracy: number;
  rank?: number;
}

export interface CreatorStats {
  userId: string;
  questionsCreated: number;
  totalVotes: number;
  revenue: number;
  mostPopularQuestion?: Question;
}

export type ModerationType = 'auto' | 'user_report' | 'admin_review';

export interface ModerationFlag {
  questionId: string;
  type: ModerationType;
  severity: 'low' | 'medium' | 'high';
  reason: string;
  createdAt: Date;
}
