import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User } from '../../types';

export default function Profile() {
  const router = useRouter();

  // TODO: Get current user from context/state
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user123',
    username: 'JohnDoe',
    credits: 5,
    predictionAccuracy: 78,
    isAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement logout
            console.log('Logout');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion
            console.log('Delete account');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {currentUser.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.username}>{currentUser.username}</Text>
        <Text style={styles.userId}>ID: {currentUser.id}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Stats</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {currentUser.credits === Infinity ? '∞' : currentUser.credits}
            </Text>
            <Text style={styles.statLabel}>Credits</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{currentUser.predictionAccuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {currentUser.isAdmin ? 'Yes' : 'No'}
            </Text>
            <Text style={styles.statLabel}>Admin</Text>
          </View>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/purchase')}
        >
          <Text style={styles.menuItemText}>💎 Buy Credits</Text>
          <Text style={styles.menuItemChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/predictions')}
        >
          <Text style={styles.menuItemText}>📊 My Predictions</Text>
          <Text style={styles.menuItemChevron}>›</Text>
        </TouchableOpacity>

        {currentUser.credits > 0 && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/dashboard')}
          >
            <Text style={styles.menuItemText}>📝 Creator Dashboard</Text>
            <Text style={styles.menuItemChevron}>›</Text>
          </TouchableOpacity>
        )}

        {currentUser.isAdmin && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin')}
          >
            <Text style={styles.menuItemText}>⚙️ Admin Panel</Text>
            <Text style={styles.menuItemChevron}>›</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Notifications', 'Coming soon!')}
        >
          <Text style={styles.menuItemText}>🔔 Notifications</Text>
          <Text style={styles.menuItemChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Privacy', 'Coming soon!')}
        >
          <Text style={styles.menuItemText}>🔒 Privacy</Text>
          <Text style={styles.menuItemChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Help', 'Coming soon!')}
        >
          <Text style={styles.menuItemText}>❓ Help & Support</Text>
          <Text style={styles.menuItemChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('About', 'Would You Rather v1.0.0')}
        >
          <Text style={styles.menuItemText}>ℹ️ About</Text>
          <Text style={styles.menuItemChevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>

        <TouchableOpacity
          style={[styles.menuItem, styles.dangerItem]}
          onPress={handleLogout}
        >
          <Text style={styles.dangerText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.dangerItem]}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.dangerText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Member since {currentUser.createdAt.toLocaleDateString()}
        </Text>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  userId: {
    fontSize: 14,
    color: '#8E8E93',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  dangerTitle: {
    color: '#FF3B30',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  menuItemText: {
    fontSize: 16,
    color: '#000000',
  },
  menuItemChevron: {
    fontSize: 20,
    color: '#8E8E93',
  },
  dangerItem: {
    borderBottomColor: '#FF3B30',
  },
  dangerText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 5,
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});
