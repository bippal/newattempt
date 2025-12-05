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
 * 4. Link payment processing to your backend
 */

// Uncomment when react-native-iap is installed:
// import {
//   initConnection,
//   endConnection,
//   getProducts,
//   requestPurchase,
//   finishTransaction,
//   purchaseUpdatedListener,
//   purchaseErrorListener,
//   Product,
//   Purchase,
// } from 'react-native-iap';

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
    // Uncomment when react-native-iap is installed:
    // const result = await initConnection();
    // console.log('IAP connection initialized:', result);
    // return true;

    // Mock for now
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
    const productIds = getProductIds();

    // Uncomment when react-native-iap is installed:
    // const products = await getProducts({ skus: productIds });
    //
    // return products.map(product => {
    //   const pack = IAP_PACKS.find(p =>
    //     product.productId.includes(p.id)
    //   );
    //   return {
    //     ...pack!,
    //     price: parseFloat(product.price),
    //   };
    // });

    // Mock for now - return configured packs
    return IAP_PACKS;
  } catch (error) {
    console.error('Failed to get products:', error);
    return IAP_PACKS; // Fallback to hardcoded prices
  }
}

/**
 * Purchase a product
 */
export async function purchaseProduct(productId: string): Promise<PurchaseResult> {
  try {
    console.log('Attempting purchase:', productId);

    // Uncomment when react-native-iap is installed:
    // const purchase = await requestPurchase({ sku: productId });
    //
    // if (purchase) {
    //   // Verify purchase with your backend
    //   const verification = await verifyPurchaseWithBackend(purchase);
    //
    //   if (verification.success) {
    //     await finishTransaction({ purchase });
    //
    //     const pack = IAP_PACKS.find(p => productId.includes(p.id));
    //
    //     return {
    //       success: true,
    //       productId,
    //       transactionId: purchase.transactionId,
    //       credits: pack?.questions || 0,
    //     };
    //   }
    // }

    // Mock purchase for testing
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
 * Verify purchase with backend
 * IMPORTANT: Always verify purchases server-side to prevent fraud
 */
async function verifyPurchaseWithBackend(purchase: any): Promise<{ success: boolean }> {
  try {
    // TODO: Implement backend verification
    // const response = await fetch('https://your-api.com/verify-purchase', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     receipt: purchase.transactionReceipt,
    //     productId: purchase.productId,
    //     transactionId: purchase.transactionId,
    //   }),
    // });
    //
    // const data = await response.json();
    // return { success: data.valid };

    // Mock for now
    return { success: true };
  } catch (error) {
    console.error('Verification failed:', error);
    return { success: false };
  }
}

/**
 * Restore previous purchases (required by App Store)
 */
export async function restorePurchases(): Promise<PurchaseResult[]> {
  try {
    console.log('Restoring purchases...');

    // Uncomment when react-native-iap is installed:
    // const purchases = await getAvailablePurchases();
    //
    // const results = await Promise.all(
    //   purchases.map(async purchase => {
    //     const verification = await verifyPurchaseWithBackend(purchase);
    //
    //     if (verification.success) {
    //       const pack = IAP_PACKS.find(p =>
    //         purchase.productId.includes(p.id)
    //       );
    //
    //       return {
    //         success: true,
    //         productId: purchase.productId,
    //         transactionId: purchase.transactionId,
    //         credits: pack?.questions || 0,
    //       };
    //     }
    //
    //     return { success: false };
    //   })
    // );
    //
    // return results.filter(r => r.success);

    // Mock for now
    return [];
  } catch (error) {
    console.error('Restore failed:', error);
    return [];
  }
}

/**
 * Setup purchase listeners
 */
export function setupPurchaseListeners(
  onPurchaseUpdate: (purchase: any) => void,
  onPurchaseError: (error: any) => void
) {
  // Uncomment when react-native-iap is installed:
  // const purchaseUpdateSubscription = purchaseUpdatedListener(onPurchaseUpdate);
  // const purchaseErrorSubscription = purchaseErrorListener(onPurchaseError);
  //
  // return () => {
  //   purchaseUpdateSubscription.remove();
  //   purchaseErrorSubscription.remove();
  // };

  // Mock for now
  return () => {};
}

/**
 * Cleanup IAP connection
 */
export async function cleanupIAP(): Promise<void> {
  try {
    // Uncomment when react-native-iap is installed:
    // await endConnection();
    console.log('IAP connection closed');
  } catch (error) {
    console.error('Failed to cleanup IAP:', error);
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

/**
 * Check if user has active subscription/lifetime access
 */
export async function hasLifetimeAccess(userId: string): Promise<boolean> {
  try {
    // TODO: Check with backend
    // const response = await fetch(`https://your-api.com/user/${userId}/subscription`);
    // const data = await response.json();
    // return data.hasLifetime;

    // Mock for now
    return false;
  } catch (error) {
    console.error('Failed to check subscription:', error);
    return false;
  }
}
