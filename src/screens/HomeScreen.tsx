import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { BalanceCard } from '../components/BalanceCard';
import { TransactionItem } from '../components/TransactionItem';
import { FAB } from '../components/FAB';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const HomeScreen = () => {
  const { transactions, balance, totalIncome, totalExpenses, isLoading, profile } = useAppContext();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const recentTransactions = transactions.slice(0, 5);

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Good morning, {profile.name || 'there'} 👋</Text>
        <Text style={styles.appName}>Expense Tracker</Text>
      </View>
      <View style={styles.avatarContainer}>
        <MaterialCommunityIcons name="account-circle" size={40} color={colors.textMuted} />
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="wallet-outline" size={80} color={colors.surfaceElevated} />
      <Text style={styles.emptyTitle}>No transactions yet</Text>
      <Text style={styles.emptySubtitle}>Tap the + button to add your first expense or income.</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <StatusBar barStyle="light-content" />
        <Text style={{ color: colors.textMuted }}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={recentTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        ListHeaderComponent={
          <View style={styles.content}>
            {renderHeader()}
            <View style={styles.cardContainer}>
              <BalanceCard balance={balance} income={totalIncome} expenses={totalExpenses} />
            </View>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
          </View>
        }
        ListEmptyComponent={renderEmptyState()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <FAB onPress={() => navigation.navigate('AddTransaction', {})} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.bodyMedium,
    color: colors.textMuted,
  },
  appName: {
    ...typography.displayMedium,
    color: colors.text,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.displayMedium,
    fontSize: 20,
    color: colors.text,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  emptyTitle: {
    ...typography.displayMedium,
    fontSize: 18,
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default HomeScreen;
