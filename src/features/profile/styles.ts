import { StyleSheet } from 'react-native';

import { Colors, BorderRadius } from '@/theme';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // ─── Avatar ───────────────────────────────────────────
  avatarSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.circle,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.bgCard,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // ─── Info Card ────────────────────────────────────────
  infoCard: {
    borderRadius: BorderRadius.lg,
    padding: 20,
    marginBottom: 35,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.bgPrimarySubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '700',
    fontFamily: 'monospace',
  },

  // ─── Settings ─────────────────────────────────────────
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 15,
  },
  settingsList: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  settingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },

  // ─── Logout ───────────────────────────────────────────
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgDangerSubtle,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDanger,
  },
  logoutText: {
    color: Colors.textDanger,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});
