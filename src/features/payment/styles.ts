import { StyleSheet } from 'react-native';

import { Colors, BorderRadius } from '@/theme';

export const paymentStyles = StyleSheet.create({
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
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.xl,
    padding: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.grayNeutral,
    marginBottom: 6,
  },
  balanceValue: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.charcoal,
    letterSpacing: -1,
    marginBottom: 16,
  },
  balanceStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.bgLightGray,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.grayNeutral,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.charcoal,
  },

  // ─── Section Header ────────────────────────────────────
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.grayNeutral,
    marginTop: 4,
  },

  // ─── Quick Recharge Grid ───────────────────────────────
  rechargeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  rechargeOption: {
    width: '48%' as unknown as number,
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderLightGray,
  },
  rechargeOptionSelected: {
    borderColor: Colors.salmon,
    backgroundColor: '#FFF5F3',
  },
  rechargeOptionText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.charcoal,
  },
  rechargeButton: {
    backgroundColor: Colors.peach,
    borderRadius: BorderRadius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  rechargeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.salmon,
  },

  // ─── Payment Method Card ───────────────────────────────
  methodCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: 2,
  },
  methodDetail: {
    fontSize: 13,
    color: Colors.grayNeutral,
  },
  methodArrow: {
    marginLeft: 8,
  },

  // ─── Add Method Button ─────────────────────────────────
  addMethodButton: {
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderLightGray,
    borderStyle: 'dashed',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  addMethodText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.grayNeutral,
  },

  // ─── Bank Transfer Info Card ───────────────────────────
  bankTransferCard: {
    backgroundColor: Colors.peach,
    borderRadius: BorderRadius.lg,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 20,
  },
  bankTransferIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.salmon,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankTransferInfo: {
    flex: 1,
  },
  bankTransferTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: 4,
  },
  bankTransferDesc: {
    fontSize: 13,
    color: Colors.grayNeutral,
    lineHeight: 19,
  },
});
