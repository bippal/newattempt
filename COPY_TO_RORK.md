# 📋 Copy These Files to Rork Junior

## 🎯 Quick Setup Guide

You've already copied the screen files. Now create these 5 additional files:

---

## ✅ Files to Create

### 1. Create folder: `types/`
**File: `types/index.ts`**

👉 **Copy from:** https://github.com/bippal/newattempt/blob/claude/would-you-rather-game-01BJHm1dAi1bb5hkxwHw7vWn/types/index.ts

Or copy from this repo: `/types/index.ts`

---

### 2. Create folder: `constants/`

**File: `constants/pricing.ts`**

👉 **Copy from:** https://github.com/bippal/newattempt/blob/claude/would-you-rather-game-01BJHm1dAi1bb5hkxwHw7vWn/constants/pricing.ts

Or copy from this repo: `/constants/pricing.ts`

**File: `constants/config.ts`**

👉 **Copy from:** https://github.com/bippal/newattempt/blob/claude/would-you-rather-game-01BJHm1dAi1bb5hkxwHw7vWn/constants/config.ts

Or copy from this repo: `/constants/config.ts`

---

### 3. Create folder: `utils/`

**File: `utils/moderation.ts`**

👉 **Copy from:** https://github.com/bippal/newattempt/blob/claude/would-you-rather-game-01BJHm1dAi1bb5hkxwHw7vWn/utils/moderation.ts

Or copy from this repo: `/utils/moderation.ts`

**File: `utils/purchase.ts`**

👉 **Copy from:** https://github.com/bippal/newattempt/blob/claude/would-you-rather-game-01BJHm1dAi1bb5hkxwHw7vWn/utils/purchase.ts

Or copy from this repo: `/utils/purchase.ts`

---

## 📂 Final Folder Structure in Rork

```
your-rork-project/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx ✅ (copied)
│   │   ├── dashboard.tsx ✅ (copied)
│   │   └── profile.tsx ✅ (copied)
│   ├── question/
│   │   └── [id].tsx ✅ (copied)
│   ├── admin.tsx ✅ (copied)
│   ├── purchase.tsx ✅ (copied)
│   └── predictions.tsx ✅ (copied)
├── types/ ⬅️ CREATE THIS
│   └── index.ts ⬅️ COPY CONTENT
├── constants/ ⬅️ CREATE THIS
│   ├── pricing.ts ⬅️ COPY CONTENT
│   └── config.ts ⬅️ COPY CONTENT
└── utils/ ⬅️ CREATE THIS
    ├── moderation.ts ⬅️ COPY CONTENT
    └── purchase.ts ⬅️ COPY CONTENT
```

---

## 🚀 Quick Steps

1. **In Rork Junior**, create 3 new folders at project root:
   - `types/`
   - `constants/`
   - `utils/`

2. **Create files inside each folder** (see list above)

3. **Copy content** from GitHub links or from this repo

4. **Done!** Your Rork project now has all the TypeScript types and utilities

---

## 💡 What Each File Does

- **types/index.ts** - TypeScript interfaces (User, Question, Vote, etc.)
- **constants/pricing.ts** - IAP prices ($0.99-$24.99 bundles)
- **constants/config.ts** - Banned words list + moderation settings
- **utils/moderation.ts** - Profanity filter + spam detection
- **utils/purchase.ts** - In-app purchase integration (iOS + Android)

---

All files are on GitHub branch: `claude/would-you-rather-game-01BJHm1dAi1bb5hkxwHw7vWn`
