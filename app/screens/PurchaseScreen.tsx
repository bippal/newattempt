import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { IAPPack, User } from '../../types';
import {
  getAvailableProducts,
  purchaseProduct,
  restorePurchases,
  formatPrice,
} from '../../utils/purchase';
import { IAP_PACKS } from '../../constants/pricing';

interface PurchaseScreenProps {
  navigation: any;
  currentUser: User;
  onPurchaseSuccess?: (credits: number) => void;
}

export default function PurchaseScreen({
  navigation,
  currentUser,
  onPurchaseSuccess,
}: PurchaseScreenProps) {
  const [products, setProducts] = useState<IAPPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const availableProducts = await getAvailableProducts();
      setProducts(availableProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      Alert.alert('Error', 'Failed to load products. Please try again.');
      setProducts(IAP_PACKS); // Fallback to hardcoded prices
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (product: IAPPack) => {
    try {
      setPurchasing(product.id);

      const result = await purchaseProduct(
        `com.wouldyourather.${product.id}`
      );

      if (result.success) {
        Alert.alert(
          'Purchase Successful!',
          `You received ${result.credits === Infinity ? 'unlimited' : result.credits} question credits.`,
          [
            {
              text: 'OK',
              onPress: () => {
                if (onPurchaseSuccess) {
                  onPurchaseSuccess(result.credits || 0);
                }
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Purchase Failed',
          result.error || 'Something went wrong. Please try again.'
        );
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      Alert.alert('Error', error.message || 'Purchase failed');
    } finally {
      setPurchasing(null);
    }
  };

  const handleRestore = async () => {
    try {
      setLoading(true);

      const restored = await restorePurchases();

      if (restored.length > 0) {
        const totalCredits = restored.reduce(
          (sum, r) => sum + (r.credits || 0),
          0
        );

        Alert.alert(
          'Restore Successful',
          `Restored ${restored.length} purchase(s) with ${totalCredits} credits.`
        );

        if (onPurchaseSuccess) {
          onPurchaseSuccess(totalCredits);
        }
      } else {
        Alert.alert(
          'No Purchases Found',
          'No previous purchases to restore.'
        );
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'Failed to restore purchases');
    } finally {
      setLoading(false);
    }
  };

  const renderProductCard = (product: IAPPack) => {
    const isPopular = product.id === 'pro';
    const isPurchasing = purchasing === product.id;

    return (
      <TouchableOpacity
        key={product.id}
        style={[styles.productCard, isPopular && styles.productCardPopular]}
        onPress={() => handlePurchase(product)}
        disabled={isPurchasing || loading}
      >
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>⭐ MOST POPULAR</Text>
          </View>
        )}

        <View style={styles.productHeader}>
          <Text style={styles.productLabel}>{product.label}</Text>
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}</Text>
            </View>
          )}
        </View>

        <View style={styles.productDetails}>
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
          <Text style={styles.productQuestions}>
            {product.questions === Infinity
              ? 'Unlimited Questions'
              : `${product.questions} Question${product.questions > 1 ? 's' : ''}`}
          </Text>
        </View>

        {product.questions !== Infinity && (
          <Text style={styles.pricePerQuestion}>
            ${(product.price / product.questions).toFixed(2)} per question
          </Text>
        )}

        <View style={styles.benefits}>
          <Text style={styles.benefit}>✓ Full creator stats</Text>
          <Text style={styles.benefit}>✓ See your questions/answers</Text>
          <Text style={styles.benefit}>✓ 70% revenue share</Text>
          {product.questions === Infinity && (
            <Text style={styles.benefit}>✓ Lifetime access</Text>
          )}
        </View>

        {isPurchasing ? (
          <ActivityIndicator color="#FFFFFF" style={styles.purchaseButton} />
        ) : (
          <View style={styles.purchaseButton}>
            <Text style={styles.purchaseButtonText}>Purchase</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Become a Creator</Text>
        <Text style={styles.subtitle}>
          Create questions, earn revenue, and see exclusive stats
        </Text>
      </View>

      <View style={styles.currentCredits}>
        <Text style={styles.currentCreditsLabel}>Current Credits:</Text>
        <Text style={styles.currentCreditsValue}>
          {currentUser.credits === Infinity ? '∞' : currentUser.credits}
        </Text>
      </View>

      <View style={styles.productsContainer}>
        {products.map((product) => renderProductCard(product))}
      </View>

      <View style={styles.features}>
        <Text style={styles.featuresTitle}>What You Get:</Text>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📊</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Full Creator Stats</Text>
            <Text style={styles.featureDescription}>
              See votes, percentages, and earnings for all your questions
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>👀</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Your Questions Always Visible</Text>
            <Text style={styles.featureDescription}>
              View and manage your questions anytime from "My Questions"
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>💰</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>70% Revenue Share</Text>
            <Text style={styles.featureDescription}>
              Earn money when users vote on your questions
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🎯</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Prediction Analytics</Text>
            <Text style={styles.featureDescription}>
              See how accurately users predicted your question outcomes
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
        <Text style={styles.restoreButtonText}>Restore Purchases</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Purchases are processed securely through your app store.
        </Text>
        <Text style={styles.footerText}>
          By purchasing, you agree to our Terms of Service.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
  },
  currentCredits: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F8FF',
    marginBottom: 20,
  },
  currentCreditsLabel: {
    fontSize: 16,
    color: '#000000',
  },
  currentCreditsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  productsContainer: {
    padding: 15,
    gap: 15,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  productCardPopular: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  discountBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  productDetails: {
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  productQuestions: {
    fontSize: 16,
    color: '#8E8E93',
  },
  pricePerQuestion: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 15,
  },
  benefits: {
    gap: 8,
    marginBottom: 15,
  },
  benefit: {
    fontSize: 14,
    color: '#000000',
  },
  purchaseButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  features: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  restoreButton: {
    margin: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
