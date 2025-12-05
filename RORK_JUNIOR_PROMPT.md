# 📱 Rork Junior Scaffold Prompt (Copy-Paste Ready)

## Quick Start: Paste this into Rork Junior to generate mobile app scaffold

```
Create a React Native Expo app called "Would You Rather" with the following structure:

PROJECT STRUCTURE:
- Use TypeScript
- Use Expo SDK 50+
- Use React Navigation (Stack Navigator)
- Install dependencies: @react-native-community/slider

SCREENS (6 total):
1. Home.tsx - Main feed with trending questions
2. QuestionDetail.tsx - Vote + predict slider
3. CreatorDashboard.tsx - Creator stats + my questions
4. PurchaseScreen.tsx - IAP bundles
5. AdminPanel.tsx - Admin moderation queue
6. MyPredictions.tsx - User prediction history (basic scaffold)

NAVIGATION STRUCTURE:
- Root Stack Navigator:
  - Home (default)
  - QuestionDetail
  - CreatorDashboard
  - PurchaseScreen
  - AdminPanel
  - MyPredictions

CORE FEATURES:
- Bottom tab navigation with Home, Dashboard, and Profile tabs
- TypeScript interfaces for Question, User, Vote
- Mock user authentication (hardcoded admin: true/false)
- Placeholder API calls (console.log for now)

STYLING:
- iOS-inspired design
- Colors: #007AFF (primary blue), #34C759 (success green), #FF3B30 (error red)
- Use StyleSheet for all styling
- Clean, modern cards with shadows

DEPENDENCIES TO INSTALL:
- @react-navigation/native
- @react-navigation/stack
- @react-native-community/slider
- react-native-screens
- react-native-safe-area-context

FILE STRUCTURE:
app/
  screens/
    Home.tsx
    QuestionDetail.tsx
    CreatorDashboard.tsx
    PurchaseScreen.tsx
    AdminPanel.tsx
    MyPredictions.tsx
  navigation/
    AppNavigator.tsx
types/
  index.ts
constants/
  pricing.ts
  config.ts
App.tsx

Generate a working Expo app that I can preview immediately with:
- Mock data for questions
- Working navigation between screens
- Basic UI for all 6 screens
- TypeScript types properly set up
```

---

## 🎯 What This Will Generate

Rork Junior will create:
1. Complete Expo project structure
2. All 6 screens with basic UI
3. Working navigation
4. Mock data
5. TypeScript setup
6. Immediately previewable app

---

## 📋 After Rork Generates Scaffold

### Step 1: Copy Files from Claude
You now have the full production code in these 10 files from Claude:

1. `types/index.ts` - All TypeScript interfaces
2. `app/screens/Home.tsx` - Full home screen
3. `app/screens/QuestionDetail.tsx` - Vote + prediction
4. `app/screens/CreatorDashboard.tsx` - Creator stats
5. `app/screens/PurchaseScreen.tsx` - IAP integration
6. `app/screens/AdminPanel.tsx` - Moderation panel
7. `constants/pricing.ts` - IAP configuration
8. `constants/config.ts` - App configuration
9. `utils/moderation.ts` - Content moderation
10. `utils/purchase.ts` - IAP utilities

### Step 2: Paste Files into Rork Junior
1. Open each screen file in Rork Junior
2. **Manually paste** the production code from Claude
3. Preview updates immediately
4. Repeat for all files

### Step 3: Test Full Flow
1. Navigate to Home → See trending questions
2. Tap question → Vote + predict slider
3. Submit vote → See accuracy
4. Go to Purchase → See IAP bundles
5. (If admin) → Open Admin Panel → See flagged questions

---

## 🚀 3-Hour MVP Timeline

| Time | Task | Tool |
|------|------|------|
| 0-15min | Paste prompt → Rork generates scaffold | Rork Junior |
| 15-45min | Copy-paste production files from Claude | Manual |
| 45-90min | Test navigation + UI flow | Rork Preview |
| 90-120min | Set up IAP products in App Store Connect | Browser |
| 120-150min | Connect backend API endpoints | Code Editor |
| 150-180min | Final testing + deploy TestFlight | Xcode |

---

## 📱 Backend API Endpoints Needed

```typescript
// Questions
GET    /api/questions/trending
GET    /api/questions/:id
POST   /api/questions
DELETE /api/questions/:id

// Votes
POST   /api/votes
GET    /api/votes/:questionId/user/:userId

// Users
GET    /api/users/:id
PATCH  /api/users/:id/credits

// Admin
GET    /api/admin/flagged-questions
DELETE /api/admin/questions/:id
POST   /api/admin/ban-user

// IAP
POST   /api/iap/verify-purchase
```

---

## 🔧 Environment Variables

Create `.env`:
```
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_IOS_PRODUCT_PREFIX=com.wouldyourather
EXPO_PUBLIC_ANDROID_PRODUCT_PREFIX=com.wouldyourather
```

---

## 📦 Required npm Packages

```bash
# Already in scaffold
npm install @react-navigation/native @react-navigation/stack
npm install @react-native-community/slider

# Add for production
npm install react-native-iap  # For IAP
npm install @react-native-async-storage/async-storage  # For local storage
npm install axios  # For API calls
```

---

## ✅ Pre-Launch Checklist

- [ ] All screens working
- [ ] Navigation tested
- [ ] IAP products configured in App Store Connect
- [ ] Backend API connected
- [ ] Admin panel restricted to admin users
- [ ] Content moderation filters active
- [ ] Privacy policy + Terms of Service
- [ ] App icons + splash screen
- [ ] TestFlight build uploaded

---

## 🎨 Customization Tips

### Change App Theme
Edit `constants/config.ts`:
```typescript
export const THEME = {
  primaryColor: '#007AFF',  // Change to your brand color
  accentColor: '#34C759',
  errorColor: '#FF3B30',
}
```

### Adjust IAP Pricing
Edit `constants/pricing.ts`:
```typescript
export const IAP_PACKS = [
  { id: 'single', price: 1.99, questions: 1 },  // Adjust prices
  // ...
]
```

### Customize Moderation
Edit `constants/config.ts`:
```typescript
export const BANNED_WORDS = [
  // Add your banned words
]
```

---

## 🆘 Troubleshooting

**Q: Preview not updating?**
- Hard refresh Rork Junior
- Check for TypeScript errors in console

**Q: Navigation broken?**
- Ensure all screen names match in AppNavigator.tsx
- Check import paths

**Q: IAP not working?**
- Install `react-native-iap`
- Configure products in App Store Connect
- Test with sandbox account

---

## 🎯 Success Metrics

Track these after launch:
- User signups
- Question creation rate
- IAP conversion rate
- Average prediction accuracy
- Admin moderation actions

---

Ready to build? Copy the prompt above into Rork Junior NOW! 🚀
