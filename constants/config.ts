/**
 * App Configuration & Moderation Settings
 */

/**
 * Admin user emails (hardcoded for MVP)
 * TODO: Move to database for production
 */
export const ADMIN_EMAILS = [
  'admin@wouldyourather.com',
  'moderator@wouldyourather.com',
  // Add your email here for testing
];

/**
 * Banned words for automatic moderation
 * Questions containing these trigger auto-flagging
 */
export const BANNED_WORDS = [
  // Profanity
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'cunt',
  'dick',
  'pussy',

  // Hate speech
  'nigger',
  'faggot',
  'retard',
  'tranny',

  // Violence
  'kill yourself',
  'kys',
  'suicide',
  'die',

  // Spam indicators
  'free iphone',
  'click here',
  'buy now',
  'limited time',
  'act fast',
  'winner',
  'congratulations',

  // Scams
  'nigerian prince',
  'wire transfer',
  'bitcoin wallet',
  'send money',
];

/**
 * Borderline words that trigger review (not auto-delete)
 */
export const REVIEW_WORDS = [
  'sex',
  'porn',
  'nude',
  'naked',
  'drugs',
  'weed',
  'cocaine',
  'alcohol',
  'drunk',
  'money',
  'cash',
  'prize',
];

/**
 * Auto-flag thresholds
 */
export const MODERATION_THRESHOLDS = {
  autoFlagUserReports: 3, // Auto-flag after 3 user reports
  highPriority: 5, // Mark HIGH PRIORITY after 5 flags
  autoDelete: 10, // Auto-delete after 10 flags (spam)
  minQuestionLength: 10, // Minimum characters
  maxQuestionLength: 200, // Maximum characters
  cooldownMinutes: 5, // Min time between questions from same user
};

/**
 * Question visibility rules
 */
export const VISIBILITY_RULES = {
  paidCreatorCanSeeOwnQuestions: true,
  paidCreatorCanSeeOwnAnswers: true,
  freeUsersCanSeeStats: false,
  minVotesBeforeShowingStats: 10, // Need 10+ votes before showing percentages
};

/**
 * Prediction scoring algorithm
 */
export const PREDICTION_SCORING = {
  perfectPredictionBonus: 100, // Points for exact prediction
  accuracyMultiplier: 1.0, // Base multiplier
  minAccuracyForPoints: 50, // Must be within 50% to earn points
};

/**
 * Question lifecycle
 */
export const QUESTION_LIFECYCLE = {
  minVotesToClose: 100, // Auto-close after 100 votes
  maxDaysActive: 7, // Auto-close after 7 days
  minVotesToShowResults: 5, // Need 5+ votes to show results
};

/**
 * Rate limiting
 */
export const RATE_LIMITS = {
  votesPerHourFree: 10,
  votesPerHourPaid: Infinity,
  questionsPerDayFree: 0,
  questionsPerDayPaid: 5,
  reportsPerHour: 3, // Max 3 reports per hour per user
};

/**
 * Feature flags
 */
export const FEATURES = {
  enableUserReports: true,
  enableAutoModeration: true,
  enablePredictions: true,
  enableCreatorStats: true,
  enableAdminPanel: true,
  enableIAP: true,
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  retryAttempts: 3,
};

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  user: '@wouldyourather:user',
  token: '@wouldyourather:token',
  credits: '@wouldyourather:credits',
  onboarding: '@wouldyourather:onboarding',
};
