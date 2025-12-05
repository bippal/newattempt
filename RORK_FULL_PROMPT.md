# 🚀 Complete Rork Junior Prompt (With All Files)

Paste this entire prompt into Rork Junior to generate the complete app with all utilities:

```
Create a React Native Expo app called "Would You Rather" with the following structure:

PROJECT STRUCTURE:
- Use TypeScript
- Use Expo SDK 51+
- Use Expo Router (file-based routing)
- Install dependencies: @react-native-community/slider

SCREENS (7 total using Expo Router):
1. app/(tabs)/index.tsx - Home feed with trending questions
2. app/(tabs)/dashboard.tsx - Creator stats + my questions
3. app/(tabs)/profile.tsx - User profile
4. app/question/[id].tsx - Question detail (dynamic route)
5. app/purchase.tsx - IAP bundles
6. app/admin.tsx - Admin moderation queue
7. app/predictions.tsx - User prediction history

NAVIGATION STRUCTURE (Expo Router):
- Bottom tabs: (tabs)/index, (tabs)/dashboard, (tabs)/profile
- Stack screens: question/[id], purchase, admin, predictions
- File-based routing (no manual navigator setup needed)

STYLING:
- iOS-inspired design
- Colors: #007AFF (primary blue), #34C759 (success green), #FF3B30 (error red)
- Use StyleSheet for all styling
- Clean, modern cards with shadows

DEPENDENCIES TO INSTALL:
- expo-router
- @react-native-community/slider
- react-native-safe-area-context
- react-native-screens

Also create these utility files with the following content:

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
  predictionAccuracy: number;
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
  predictedA: number;
  accuracyScore?: number;
  createdAt: Date;
}

export interface QuestionAnswer {
  id: string;
  questionId: string;
  creatorId: string;
  anonymousText: string;
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

export const REVENUE_CONFIG = {
  platformFee: 0.3,
  creatorShare: 0.7,
  minimumPayout: 10.0,
};

---
FILE: constants/config.ts
---
export const ADMIN_EMAILS = [
  'admin@wouldyourather.com',
];

export const MODERATION_THRESHOLDS = {
  autoFlagUserReports: 3,
  highPriority: 5,
  autoDelete: 10,
  minQuestionLength: 10,
  maxQuestionLength: 200,
};

export const VISIBILITY_RULES = {
  paidCreatorCanSeeOwnQuestions: true,
  paidCreatorCanSeeOwnAnswers: true,
  minVotesBeforeShowingStats: 10,
};

Generate a working Expo Router app with:
- Mock data for questions
- Working file-based routing
- Bottom tab navigation
- All utility files created
- TypeScript types properly set up
```

---

## ✅ Then Ask Rork to Import Screen Content

After the scaffold is created, tell Rork:

```
Now fetch and replace the screen files with production code from this GitHub repo:
https://github.com/bippal/newattempt/tree/claude/would-you-rather-game-01BJHm1dAi1bb5hkxwHw7vWn

Replace these files:
- app/(tabs)/index.tsx
- app/(tabs)/dashboard.tsx
- app/(tabs)/profile.tsx
- app/question/[id].tsx
- app/purchase.tsx
- app/admin.tsx
- app/predictions.tsx
- utils/moderation.ts
- utils/purchase.ts
```
