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

  // Check for excessive punctuation (!!!! or ????)
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

  // Check length
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

  // Check if options are identical
  if (textA.toLowerCase() === textB.toLowerCase()) {
    errors.push('Options A and B must be different');
  }

  // Check if options are too similar
  const similarity = calculateSimilarity(textA, textB);
  if (similarity > 0.9) {
    errors.push('Options A and B are too similar');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate similarity between two strings (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Levenshtein distance algorithm
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
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
  // Validate format first
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

  // Check profanity in both options
  const moderationA = checkProfanity(textA);
  const moderationB = checkProfanity(textB);

  const combinedReasons = [...moderationA.reasons, ...moderationB.reasons];
  const shouldAutoDelete = moderationA.shouldAutoDelete || moderationB.shouldAutoDelete;
  const shouldFlag = moderationA.shouldFlag || moderationB.shouldFlag;
  const severity = moderationA.severity === 'high' || moderationB.severity === 'high' ? 'high' :
                   moderationA.severity === 'medium' || moderationB.severity === 'medium' ? 'medium' : 'low';

  // Check flag count threshold
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
