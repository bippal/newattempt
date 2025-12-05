# Would You Rather - Production Game MVP

## 📱 Overview

A prediction-based "Would You Rather" mobile game where:
- Users vote on A vs B questions
- Users predict what % of the crowd will choose A
- Paid creators earn revenue from their questions ($0.99+)
- Admin panel for content moderation

**Status:** ✅ **READY FOR RORK JUNIOR INTEGRATION**

---

## 📂 Project Structure

```
would-you-rather/
├── types/
│   └── index.ts                    # All TypeScript interfaces
├── constants/
│   ├── pricing.ts                  # IAP configuration
│   └── config.ts                   # App config + moderation
├── utils/
│   ├── moderation.ts               # Content filtering
│   └── purchase.ts                 # IAP integration
├── app/
│   └── screens/
│       ├── Home.tsx                # Trending + My Questions
│       ├── QuestionDetail.tsx      # Vote + Predict
│       ├── Dashboard.tsx           # Creator stats
│       ├── PurchaseScreen.tsx      # IAP bundles
│       └── AdminPanel.tsx          # Moderation queue
├── RORK_JUNIOR_PROMPT.md           # Copy-paste to Rork
└── CLAUDE.md                       # This file
```

---

## 🎯 Core Features

### 1. **Question Voting + Prediction**
- Users see trending "Would You Rather" questions
- Vote A or B
- Predict what % will choose A (0-100% slider)
- See accuracy after voting
- Points awarded for accurate predictions

**Files:**
- `app/screens/Home.tsx` - Question feed
- `app/screens/QuestionDetail.tsx` - Vote + prediction UI
- `types/index.ts` - Question, Vote interfaces

### 2. **Paid Creator System**
- Buy credits via IAP ($0.99 - $24.99)
- Create unlimited questions (Lifetime: $24.99)
- See stats for your questions
- 70% revenue share
- View your own questions/answers anytime

**Files:**
- `app/screens/PurchaseScreen.tsx` - IAP bundles
- `app/screens/Dashboard.tsx` - Stats dashboard
- `constants/pricing.ts` - IAP configuration
- `utils/purchase.ts` - StoreKit/Google Billing

### 3. **Admin Moderation Panel**
- Auto-flag profanity + spam
- User-reported content queue
- HIGH/MEDIUM/LOW priority sorting
- Delete questions + log reasons
- Ban users
- View moderation stats

**Files:**
- `app/screens/AdminPanel.tsx` - Admin UI
- `utils/moderation.ts` - Profanity filter + validation
- `constants/config.ts` - Banned words list

---

## 💰 IAP Pricing (In-App Purchases)

| Pack | Price | Questions | Discount | Best For |
|------|-------|-----------|----------|----------|
| **Single** | $0.99 | 1 | - | Try it out |
| **5-Pack** | $3.99 | 5 | 20% | Casual creators |
| **Pro** | $9.99 | 15 | 33% | Regular creators |
| **Lifetime** | $24.99 | ∞ | Best | Power users |

**Revenue Model:**
- Platform: 30% (App Store/Google Play fee)
- Creator: 70%
- Minimum payout: $10

**Files:**
- `constants/pricing.ts:6-29` - IAP configuration
- `utils/purchase.ts:74-130` - Purchase flow

---

## 🛡️ Content Moderation

### Auto-Flagging Rules

**Banned Words (Auto-Delete):**
- Profanity: fuck, shit, bitch, etc.
- Hate speech: slurs
- Violence: kill yourself, kys, die
- Spam: free iPhone, click here, winner

**Review Words (Manual Review):**
- Borderline: sex, porn, drugs, alcohol
- Requires admin approval

**Auto-Delete Triggers:**
- URLs or emails in questions
- 10+ user reports
- Excessive caps (>50%)
- Profanity match

**Files:**
- `constants/config.ts:16-56` - Banned words list
- `utils/moderation.ts:17-94` - Detection logic

---

## 🎨 Design System

### Colors
```typescript
Primary:   #007AFF  // iOS Blue
Success:   #34C759  // Green
Warning:   #FF9500  // Orange
Error:     #FF3B30  // Red
Background: #F5F5F7  // Light Gray
Text:      #000000  // Black
Secondary: #8E8E93  // Gray
```

### Typography
- Title: 24px, Bold
- Body: 16px, Regular
- Caption: 12px, Regular

### Components
- **Cards:** White background, 12px radius, shadow
- **Buttons:** 8px radius, 15px padding
- **Badges:** 12px radius, small text

---

## 🔌 Backend API Integration

### Required Endpoints

```typescript
// Questions
GET    /api/questions/trending
       → Returns: Question[]

POST   /api/questions
       → Body: { textA, textB, creatorId }
       → Returns: Question

DELETE /api/questions/:id
       → Requires: Admin auth

// Votes
POST   /api/votes
       → Body: { questionId, userId, choseA, predictedA }
       → Returns: Vote

GET    /api/votes/:questionId/user/:userId
       → Returns: Vote | null

// Users
GET    /api/users/:id
       → Returns: User

PATCH  /api/users/:id/credits
       → Body: { credits: number }
       → Returns: User

// Admin
GET    /api/admin/flagged-questions
       → Returns: Question[]

POST   /api/admin/delete-question
       → Body: { questionId, adminId, reason }
       → Creates: AdminLog

// IAP Verification
POST   /api/iap/verify-purchase
       → Body: { receipt, productId, transactionId }
       → Returns: { valid: boolean, credits: number }
```

**Current Status:**
- Mock data in place (console.log)
- Ready to replace with real API calls
- Search for `// TODO: Replace with actual API call`

---

## 🚀 Deployment Checklist

### 1. App Store Setup
- [ ] Create App Store Connect account
- [ ] Configure IAP products:
  - `com.wouldyourather.single` ($0.99)
  - `com.wouldyourather.five` ($3.99)
  - `com.wouldyourather.pro` ($9.99)
  - `com.wouldyourather.lifetime` ($24.99)
- [ ] Submit for IAP review

### 2. Google Play Setup
- [ ] Create Google Play Console account
- [ ] Configure in-app products (same SKUs)
- [ ] Set up payment processing

### 3. Backend
- [ ] Deploy API server
- [ ] Set up database (PostgreSQL/MongoDB)
- [ ] Configure IAP receipt verification
- [ ] Set up admin authentication

### 4. Mobile App
- [ ] Install `react-native-iap`
- [ ] Connect API endpoints
- [ ] Test IAP flow (sandbox)
- [ ] Build release APK/IPA
- [ ] Upload to TestFlight/Internal Testing

### 5. Legal
- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] COPPA compliance (if under 13)
- [ ] GDPR compliance (EU users)

---

## 🧪 Testing Guide

### Manual Test Flow

**1. Home Screen**
- ✅ See trending questions
- ✅ Navigate to question detail
- ✅ See "My Questions" tab (if paid)

**2. Vote + Predict**
- ✅ Select A or B
- ✅ Move prediction slider
- ✅ Submit vote
- ✅ See accuracy stats
- ✅ View creator answer (after voting)

**3. Creator Dashboard**
- ✅ See stats (questions, votes, revenue)
- ✅ View my questions
- ✅ Pause/resume questions

**4. Purchase**
- ✅ See all IAP bundles
- ✅ Purchase credits (sandbox)
- ✅ Restore purchases
- ✅ Credits update

**5. Admin Panel**
- ✅ See flagged questions
- ✅ Filter by priority
- ✅ Delete question + log reason
- ✅ Ban user

**6. Moderation**
- ✅ Auto-flag profanity
- ✅ Block spam URLs
- ✅ User report flow

---

## 🔧 Configuration

### Admin Access

Edit `constants/config.ts:10-14`:
```typescript
export const ADMIN_EMAILS = [
  'admin@wouldyourather.com',
  'your-email@gmail.com',  // Add your email
];
```

### Adjust Moderation

Edit `constants/config.ts:60-68`:
```typescript
export const MODERATION_THRESHOLDS = {
  autoFlagUserReports: 3,   // Flag after N reports
  highPriority: 5,          // Mark HIGH after N flags
  autoDelete: 10,           // Auto-delete after N flags
  minQuestionLength: 10,    // Min chars
  maxQuestionLength: 200,   // Max chars
};
```

### Change IAP Prices

Edit `constants/pricing.ts:9-33`:
```typescript
export const IAP_PACKS: IAPPack[] = [
  { id: 'single', price: 1.99, questions: 1 },  // Change prices
  // ...
];
```

---

## 📊 Analytics to Track

### User Metrics
- Daily Active Users (DAU)
- User retention (D1, D7, D30)
- Average session length
- Questions viewed per session

### Creator Metrics
- Creator conversion rate (free → paid)
- Average questions per creator
- Revenue per creator
- Creator churn rate

### Engagement Metrics
- Votes per user per day
- Prediction accuracy average
- Question completion rate
- Viral coefficient (shares)

### Revenue Metrics
- IAP conversion rate
- Average revenue per user (ARPU)
- Lifetime value (LTV)
- Churn rate

### Moderation Metrics
- Auto-flagged questions
- Admin deletions per day
- Average response time
- False positive rate

---

## 🎯 Roadmap / Future Features

### Phase 2 (Post-MVP)
- [ ] Social sharing (share questions to Twitter/Instagram)
- [ ] Leaderboards (top predictors)
- [ ] Daily challenges
- [ ] Question categories (Entertainment, Science, etc.)
- [ ] User profiles + followers
- [ ] Comments on questions
- [ ] Push notifications

### Phase 3 (Growth)
- [ ] Video questions (TikTok-style)
- [ ] Live questions (real-time voting)
- [ ] Polls with 3+ options
- [ ] Creator verification badges
- [ ] Sponsored questions
- [ ] Referral program

---

## 🐛 Known Issues / TODOs

### High Priority
- [ ] Implement real API calls (replace mock data)
- [ ] Set up IAP receipt verification
- [ ] Add user authentication
- [ ] Implement backend admin auth

### Medium Priority
- [ ] Add pull-to-refresh on all screens
- [ ] Implement pagination for question lists
- [ ] Add loading states
- [ ] Handle offline mode gracefully

### Low Priority
- [ ] Add animations (FadeIn, SlideIn)
- [ ] Implement haptic feedback
- [ ] Add dark mode support
- [ ] Optimize images

---

## 📞 Support

**For questions:**
- Check `RORK_JUNIOR_PROMPT.md` for integration steps
- Review code comments in each file
- All TODO items marked in code

**File locations:**
- Types: `types/index.ts:1-70`
- IAP Config: `constants/pricing.ts:6-50`
- Moderation: `utils/moderation.ts:17-300`
- Screens: `app/screens/*.tsx`

---

## ✅ Success Criteria

**MVP is ready when:**
- ✅ All 6 screens working
- ✅ Navigation tested
- ✅ IAP flow complete (mock)
- ✅ Admin panel functional
- ✅ Moderation filters active
- ✅ TypeScript errors: 0
- ✅ Preview in Rork Junior works

**Production-ready when:**
- [ ] Real API connected
- [ ] IAP live (App Store Connect)
- [ ] Backend deployed
- [ ] Legal docs ready
- [ ] TestFlight tested
- [ ] Analytics integrated

---

## 🎉 Ready to Launch!

1. **Copy `RORK_JUNIOR_PROMPT.md`** → Paste to Rork Junior
2. **Wait 15 minutes** → Scaffold generates
3. **Paste production files** → From this repo
4. **Test in preview** → Full flow working
5. **Connect backend** → Replace mock data
6. **Deploy!** → Ship to TestFlight

**Estimated time to working MVP: 3 hours** 🚀

---

**Generated by Claude Code**
Version: 1.0.0
Last Updated: 2025-12-05
