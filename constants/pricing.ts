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
 * Format: com.yourapp.wouldyourather.[pack_id]
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
