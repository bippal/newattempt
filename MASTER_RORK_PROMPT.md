# 🚀 MASTER RORK JUNIOR PROMPT - Complete "Would You Rather" App

Copy this ENTIRE prompt and paste it into Rork Junior to generate the complete app with all utilities.

---

```
Create a React Native Expo app called "Would You Rather" - a prediction game where users vote on questions and predict crowd behavior.

## PROJECT SETUP
- TypeScript
- Expo SDK 51+
- Expo Router (file-based routing)
- Dependencies: expo-router, @react-native-community/slider

## SCREENS TO CREATE
Bottom tabs:
- app/(tabs)/index.tsx - Home feed
- app/(tabs)/dashboard.tsx - Creator dashboard
- app/(tabs)/profile.tsx - User profile

Stack screens:
- app/question/[id].tsx - Question detail (dynamic route)
- app/purchase.tsx - IAP bundles
- app/admin.tsx - Admin panel
- app/predictions.tsx - Prediction history

## UTILITY FILES - CREATE THESE WITH EXACT CONTENT:

---
FILE: types/index.ts
---
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

---
FILE: constants/pricing.ts
---
import { IAPPack } from '../types';

/**
 * In-App Purchase Packages Configuration
 * Connect these IDs to App Store Connect & Google Play Console
 */

export const IAP_PACKS: IAPPack[] = [
  {
    id: 'single',
    price: 0.99,
    questions: 1,
    label: '1 Question',
  },
  {
    id: 'five',
    price: 3.99,
    questions: 5,
    label: '5-Pack',
    discount: 'Save 20%',
  },
  {
    id: 'pro',
    price: 9.99,
    questions: 15,
    label: 'Pro Pack',
    discount: 'Save 33%',
  },
  {
    id: 'lifetime',
    price: 24.99,
    questions: Infinity,
    label: 'Lifetime Creator',
    discount: 'Best Value',
  },
];

/**
 * Product IDs for App Store (iOS)
 */
export const IOS_PRODUCT_IDS = {
  single: 'com.wouldyourather.single',
  five: 'com.wouldyourather.five',
  pro: 'com.wouldyourather.pro',
  lifetime: 'com.wouldyourather.lifetime',
};

/**
 * Product IDs for Google Play (Android)
 */
export const ANDROID_PRODUCT_IDS = {
  single: 'com.wouldyourather.single',
  five: 'com.wouldyourather.five',
  pro: 'com.wouldyourather.pro',
  lifetime: 'com.wouldyourather.lifetime',
};

/**
 * Revenue share configuration
 */
export const REVENUE_CONFIG = {
  platformFee: 0.3, // 30% to platform (App Store/Google Play)
  creatorShare: 0.7, // 70% to creator
  minimumPayout: 10.0, // Minimum $10 for creator payout
};

/**
 * Free tier configuration
 */
export const FREE_TIER = {
  maxVotesPerDay: 10,
  maxPredictionsPerDay: 10,
  canCreateQuestions: false,
};

/**
 * Paid tier benefits
 */
export const PAID_BENEFITS = {
  unlimitedVotes: true,
  unlimitedPredictions: true,
  canCreateQuestions: true,
  seeOwnQuestionStats: true,
  seeOwnAnswers: true,
  prioritySupport: true,
};

---
FILE: constants/config.ts
---
/**
 * App Configuration & Moderation Settings
 */

/**
 * Admin user emails (hardcoded for MVP)
 */
export const ADMIN_EMAILS = [
  'admin@wouldyourather.com',
  'moderator@wouldyourather.com',
];

/**
 * Banned words for automatic moderation
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
  autoFlagUserReports: 3,
  highPriority: 5,
  autoDelete: 10,
  minQuestionLength: 10,
  maxQuestionLength: 200,
  cooldownMinutes: 5,
};

/**
 * Question visibility rules
 */
export const VISIBILITY_RULES = {
  paidCreatorCanSeeOwnQuestions: true,
  paidCreatorCanSeeOwnAnswers: true,
  freeUsersCanSeeStats: false,
  minVotesBeforeShowingStats: 10,
};

/**
 * Prediction scoring algorithm
 */
export const PREDICTION_SCORING = {
  perfectPredictionBonus: 100,
  accuracyMultiplier: 1.0,
  minAccuracyForPoints: 50,
};

/**
 * Question lifecycle
 */
export const QUESTION_LIFECYCLE = {
  minVotesToClose: 100,
  maxDaysActive: 7,
  minVotesToShowResults: 5,
};

/**
 * Rate limiting
 */
export const RATE_LIMITS = {
  votesPerHourFree: 10,
  votesPerHourPaid: Infinity,
  questionsPerDayFree: 0,
  questionsPerDayPaid: 5,
  reportsPerHour: 3,
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

---
FILE: utils/moderation.ts
---
import { BANNED_WORDS, REVIEW_WORDS, MODERATION_THRESHOLDS } from '../constants/config';
import { ModerationFlag, Question } from '../types';

/**
 * Profanity and spam detection utilities
 */

export interface ModerationResult {
  isClean: boolean;
  shouldFlag: boolean;
  shouldAutoDelete: boolean;
  severity: 'low' | 'medium' | 'high';
  reasons: string[];
  matchedWords: string[];
}

/**
 * Check if text contains banned words
 */
export function checkProfanity(text: string): ModerationResult {
  const lowerText = text.toLowerCase();
  const matchedBannedWords: string[] = [];
  const matchedReviewWords: string[] = [];
  const reasons: string[] = [];

  // Check banned words
  for (const word of BANNED_WORDS) {
    if (lowerText.includes(word)) {
      matchedBannedWords.push(word);
    }
  }

  // Check review words
  for (const word of REVIEW_WORDS) {
    if (lowerText.includes(word)) {
      matchedReviewWords.push(word);
    }
  }

  // Check for excessive caps (SPAM DETECTION)
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  const isExcessiveCaps = capsRatio > 0.5 && text.length > 10;

  // Check for excessive punctuation
  const hasExcessivePunctuation = /[!?]{3,}/.test(text);

  // Check for suspicious patterns
  const hasURL = /https?:\/\/|www\./i.test(text);
  const hasEmail = /\S+@\S+\.\S+/.test(text);

  // Determine severity and action
  let severity: 'low' | 'medium' | 'high' = 'low';
  let shouldAutoDelete = false;

  if (matchedBannedWords.length > 0) {
    severity = 'high';
    shouldAutoDelete = true;
    reasons.push(`Contains banned words: ${matchedBannedWords.join(', ')}`);
  }

  if (matchedReviewWords.length > 0) {
    severity = severity === 'high' ? 'high' : 'medium';
    reasons.push(`Contains review words: ${matchedReviewWords.join(', ')}`);
  }

  if (isExcessiveCaps) {
    severity = severity === 'high' ? 'high' : 'medium';
    reasons.push('Excessive capitalization (spam indicator)');
  }

  if (hasExcessivePunctuation) {
    severity = 'medium';
    reasons.push('Excessive punctuation');
  }

  if (hasURL || hasEmail) {
    severity = 'high';
    shouldAutoDelete = true;
    reasons.push('Contains URL or email (spam)');
  }

  const isClean = matchedBannedWords.length === 0 && !shouldAutoDelete;
  const shouldFlag = !isClean || matchedReviewWords.length > 0 || isExcessiveCaps;

  return {
    isClean,
    shouldFlag,
    shouldAutoDelete,
    severity,
    reasons,
    matchedWords: [...matchedBannedWords, ...matchedReviewWords],
  };
}

/**
 * Validate question text
 */
export function validateQuestion(textA: string, textB: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (textA.length < MODERATION_THRESHOLDS.minQuestionLength) {
    errors.push(`Option A too short (min ${MODERATION_THRESHOLDS.minQuestionLength} chars)`);
  }
  if (textB.length < MODERATION_THRESHOLDS.minQuestionLength) {
    errors.push(`Option B too short (min ${MODERATION_THRESHOLDS.minQuestionLength} chars)`);
  }
  if (textA.length > MODERATION_THRESHOLDS.maxQuestionLength) {
    errors.push(`Option A too long (max ${MODERATION_THRESHOLDS.maxQuestionLength} chars)`);
  }
  if (textB.length > MODERATION_THRESHOLDS.maxQuestionLength) {
    errors.push(`Option B too long (max ${MODERATION_THRESHOLDS.maxQuestionLength} chars)`);
  }

  if (textA.toLowerCase() === textB.toLowerCase()) {
    errors.push('Options A and B must be different');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Moderate a question and return action
 */
export function moderateQuestion(
  textA: string,
  textB: string,
  flaggedCount: number = 0
): {
  shouldAllow: boolean;
  shouldFlag: boolean;
  shouldAutoDelete: boolean;
  severity: 'low' | 'medium' | 'high';
  reasons: string[];
} {
  const validation = validateQuestion(textA, textB);
  if (!validation.isValid) {
    return {
      shouldAllow: false,
      shouldFlag: true,
      shouldAutoDelete: false,
      severity: 'medium',
      reasons: validation.errors,
    };
  }

  const moderationA = checkProfanity(textA);
  const moderationB = checkProfanity(textB);

  const combinedReasons = [...moderationA.reasons, ...moderationB.reasons];
  const shouldAutoDelete = moderationA.shouldAutoDelete || moderationB.shouldAutoDelete;
  const shouldFlag = moderationA.shouldFlag || moderationB.shouldFlag;
  const severity = moderationA.severity === 'high' || moderationB.severity === 'high' ? 'high' :
                   moderationA.severity === 'medium' || moderationB.severity === 'medium' ? 'medium' : 'low';

  if (flaggedCount >= MODERATION_THRESHOLDS.autoDelete) {
    return {
      shouldAllow: false,
      shouldFlag: true,
      shouldAutoDelete: true,
      severity: 'high',
      reasons: [...combinedReasons, `Exceeded flag threshold (${flaggedCount} flags)`],
    };
  }

  return {
    shouldAllow: !shouldAutoDelete,
    shouldFlag,
    shouldAutoDelete,
    severity,
    reasons: combinedReasons,
  };
}

/**
 * Get priority level for admin queue
 */
export function getPriorityLevel(flaggedCount: number): 'low' | 'medium' | 'high' {
  if (flaggedCount >= MODERATION_THRESHOLDS.highPriority) return 'high';
  if (flaggedCount >= MODERATION_THRESHOLDS.autoFlagUserReports) return 'medium';
  return 'low';
}

/**
 * Format moderation reasons for display
 */
export function formatModerationReasons(reasons: string[]): string {
  if (reasons.length === 0) return 'No issues detected';
  return reasons.join(' • ');
}

---
FILE: utils/purchase.ts
---
import { Platform } from 'react-native';
import { IAP_PACKS, IOS_PRODUCT_IDS, ANDROID_PRODUCT_IDS } from '../constants/pricing';
import { IAPPack } from '../types';

/**
 * In-App Purchase utilities for iOS (StoreKit) and Android (Google Play Billing)
 *
 * SETUP REQUIRED:
 * 1. Install: npm install react-native-iap
 * 2. iOS: Configure products in App Store Connect
 * 3. Android: Configure products in Google Play Console
 */

export interface PurchaseResult {
  success: boolean;
  productId?: string;
  transactionId?: string;
  credits?: number;
  error?: string;
}

/**
 * Get platform-specific product IDs
 */
export function getProductIds(): string[] {
  if (Platform.OS === 'ios') {
    return Object.values(IOS_PRODUCT_IDS);
  } else {
    return Object.values(ANDROID_PRODUCT_IDS);
  }
}

/**
 * Initialize IAP connection
 */
export async function initializeIAP(): Promise<boolean> {
  try {
    console.log('IAP initialization (mock)');
    return true;
  } catch (error) {
    console.error('Failed to initialize IAP:', error);
    return false;
  }
}

/**
 * Get available products from App Store / Google Play
 */
export async function getAvailableProducts(): Promise<IAPPack[]> {
  try {
    return IAP_PACKS;
  } catch (error) {
    console.error('Failed to get products:', error);
    return IAP_PACKS;
  }
}

/**
 * Purchase a product
 */
export async function purchaseProduct(productId: string): Promise<PurchaseResult> {
  try {
    console.log('Attempting purchase:', productId);

    const pack = IAP_PACKS.find(p => productId.includes(p.id));

    return {
      success: true,
      productId,
      transactionId: `mock_${Date.now()}`,
      credits: pack?.questions || 0,
    };
  } catch (error: any) {
    console.error('Purchase failed:', error);
    return {
      success: false,
      error: error.message || 'Purchase failed',
    };
  }
}

/**
 * Restore previous purchases (required by App Store)
 */
export async function restorePurchases(): Promise<PurchaseResult[]> {
  try {
    console.log('Restoring purchases...');
    return [];
  } catch (error) {
    console.error('Restore failed:', error);
    return [];
  }
}

/**
 * Get pack details by product ID
 */
export function getPackByProductId(productId: string): IAPPack | undefined {
  return IAP_PACKS.find(pack => productId.includes(pack.id));
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

---
END OF UTILITY FILES
---

## STYLING REQUIREMENTS
- iOS design style
- Colors: #007AFF (blue), #34C759 (green), #FF3B30 (red)
- White cards with shadows, 12px border radius
- Bottom tab navigation (Home, Dashboard, Profile)

## GENERATE:
1. All utility files above with EXACT content
2. Basic scaffold for all 7 screens
3. Mock data for testing
4. Expo Router file-based routing
5. TypeScript properly configured

Create this as a working Expo app I can preview immediately.
```

---

## ✅ AFTER PASTING TO RORK

Once Rork creates the scaffold, tell it:

```
Now fetch and replace the screen files with production code from:
https://github.com/bippal/newattempt/tree/claude/would-you-rather-game-01BJHm1dAi1bb5hkxwHw7vWn/app

Replace all files in app/ folder with the versions from GitHub.
```

---

**This prompt includes ALL utility files inline, so Rork can create everything in one go!** 🚀
