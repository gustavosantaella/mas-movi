import { StyleSheet } from 'react-native';

import { Colors, BorderRadius } from '@/theme';

export const homeStyles = StyleSheet.create({
  // ─── Screen ────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // ─── Header ────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.salmon,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  headerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.salmon,
  },

  // ─── Balance Card ──────────────────────────────────────
  balanceCard: {
    borderRadius: BorderRadius.xl,
    padding: 24,
    marginBottom: 20,
    overflow: 'hidden',
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 6,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
  },
  walletIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rechargeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.pill,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  rechargeText: {
    color: Colors.salmon,
    fontSize: 16,
    fontWeight: '700',
  },

  // ─── Quick Actions ─────────────────────────────────────
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.xl,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.charcoal,
    textAlign: 'center',
  },

  // ─── Section Header ────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.salmon,
  },

  // ─── Activity Items ────────────────────────────────────
  activityList: {
    gap: 12,
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  activityIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 13,
    color: Colors.grayNeutral,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: Colors.grayNeutral,
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  amountNegative: {
    color: Colors.charcoal,
  },
  amountPositive: {
    color: Colors.successGreen,
  },
});
