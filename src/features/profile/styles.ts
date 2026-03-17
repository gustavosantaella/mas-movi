import { StyleSheet } from 'react-native';

import { Colors, BorderRadius } from '@/theme';

export const profileStyles = StyleSheet.create({
  // ─── Bottom Sheet Container ────────────────────────────
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: Colors.bgWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  content: {
    paddingHorizontal: 24,
  },

  // ─── Avatar ───────────────────────────────────────────
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.salmonLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.salmon,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.bgWhite,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.charcoal,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 15,
    color: Colors.grayNeutral,
    fontWeight: '500',
    marginBottom: 10,
  },
  userIdBadge: {
    backgroundColor: Colors.bgLightGray,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
  },
  userIdText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.charcoal,
    fontFamily: 'monospace',
  },

  // ─── Info Cards ────────────────────────────────────────
  infoCardsSection: {
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: Colors.bgLightGray,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.salmon,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: Colors.charcoal,
    fontWeight: '600',
  },

  // ─── Settings List ────────────────────────────────────
  settingsList: {
    gap: 8,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingText: {
    flex: 1,
    fontSize: 15,
    color: Colors.charcoal,
    fontWeight: '600',
  },

  // ─── Close Button ─────────────────────────────────────
  closeButton: {
    borderRadius: BorderRadius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
