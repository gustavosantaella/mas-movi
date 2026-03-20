import { StyleSheet } from 'react-native';

import { Colors, BorderRadius } from '@/theme';

export const driverStyles = StyleSheet.create({
  // ─── Screen ────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // ─── Earnings Card ─────────────────────────────────────
  earningsCard: {
    borderRadius: BorderRadius.xl,
    padding: 24,
    marginBottom: 20,
    overflow: 'hidden',
  },
  earningsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  earningsLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 6,
  },
  earningsValue: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
  },
  earningsIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  earningsStatBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  earningsStatValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  earningsStatLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  // ─── Status Toggle ─────────────────────────────────────
  statusContainer: {
    marginBottom: 24,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.grayNeutral,
    marginBottom: 10,
  },
  statusPillRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgLightGray,
    borderRadius: BorderRadius.pill,
    padding: 4,
  },
  statusPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPillActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statusPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.grayNeutral,
  },
  statusPillTextActive: {
    color: Colors.teal,
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
    fontSize: 13,
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
    color: Colors.teal,
  },

  // ─── Trip Cards ────────────────────────────────────────
  tripCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripCardPassenger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tripCardAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.tealBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  tripCardTime: {
    fontSize: 12,
    color: Colors.grayNeutral,
  },
  tripCardAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.teal,
  },
  tripCardRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLightGray,
  },
  tripCardRouteText: {
    flex: 1,
    fontSize: 13,
    color: Colors.grayNeutral,
    lineHeight: 18,
  },
  tripCardRouteDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // ─── Active Trip ───────────────────────────────────────
  activeTripCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: BorderRadius.xl,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: Colors.tealSoft,
  },
  activeTripBadge: {
    backgroundColor: Colors.teal,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  activeTripBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  activeTripRoute: {
    marginBottom: 16,
  },
  activeTripLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.teal,
    marginBottom: 4,
  },
  activeTripValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  activeTripDivider: {
    height: 1,
    backgroundColor: Colors.tealSoft,
    marginVertical: 8,
  },
  activeTripStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activeTripStat: {
    alignItems: 'center',
  },
  activeTripStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.charcoal,
  },
  activeTripStatLabel: {
    fontSize: 12,
    color: Colors.grayNeutral,
    marginTop: 2,
  },

  // ─── Earnings Chart ────────────────────────────────────
  chartContainer: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.xl,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: 16,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  chartLabel: {
    width: 32,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.grayNeutral,
  },
  chartBarBg: {
    flex: 1,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.bgLightGray,
    overflow: 'hidden',
  },
  chartBar: {
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.teal,
  },
  chartValue: {
    width: 60,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.charcoal,
    textAlign: 'right',
  },

  // ─── Payout Card ───────────────────────────────────────
  payoutCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.xl,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  payoutLabel: {
    fontSize: 14,
    color: Colors.grayNeutral,
    fontWeight: '500',
  },
  payoutValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  payoutButton: {
    backgroundColor: Colors.teal,
    borderRadius: BorderRadius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  payoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // ─── Vehicle Info ──────────────────────────────────────
  vehicleCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.xl,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  vehicleIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.tealBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  vehiclePlate: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.teal,
    marginTop: 2,
  },
  vehicleStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  vehicleStatBox: {
    flex: 1,
    backgroundColor: Colors.bgLightGray,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  vehicleStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.charcoal,
  },
  vehicleStatLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.grayNeutral,
    marginTop: 2,
  },

  // ─── QR Generate ───────────────────────────────────────
  qrContainer: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.xl,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    width: '100%',
    maxWidth: 340,
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.charcoal,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.charcoal,
    marginBottom: 6,
  },
  qrSubtitle: {
    fontSize: 14,
    color: Colors.grayNeutral,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  qrVehicleInfo: {
    backgroundColor: Colors.tealBg,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  qrVehicleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.teal,
  },

  // ─── Settings ──────────────────────────────────────────
  settingsGroup: {
    marginBottom: 24,
  },
  settingsGroupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.grayNeutral,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingsItem: {
    backgroundColor: Colors.bgWhite,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLightGray,
  },
  settingsItemFirst: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLightGray,
  },
  settingsItemLast: {
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  settingsItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingsItemLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.charcoal,
  },
  settingsItemArrow: {
    marginLeft: 8,
  },

  // ─── Empty state ───────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.grayNeutral,
    marginTop: 12,
    textAlign: 'center',
  },

  // ─── Filter Tabs ───────────────────────────────────────
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.bgLightGray,
  },
  filterChipActive: {
    backgroundColor: Colors.teal,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.grayNeutral,
  },
  filterChipTextActive: {
    color: '#fff',
  },
});
