import { StyleSheet } from 'react-native';

import { Colors, BorderRadius } from '@/theme';

export const aiRouteStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCard,
  },

  // ─── Map ──────────────────────────────────────────────
  mapContainer: {
    flex: 0.45,
    width: '100%',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  floatingBadge: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  badgeText: {
    color: Colors.textPrimary,
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  backButtonBlur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  // ─── Chat ─────────────────────────────────────────────
  chatContainer: {
    flex: 0.55,
  },
  chatBackground: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  messagesScroll: {
    padding: 24,
    paddingTop: 30,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: BorderRadius.lg,
    marginBottom: 16,
  },
  messageAI: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgSurface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.bgSurfaceLight,
  },
  messageUser: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  textAI: {
    color: Colors.textOnSurface,
  },
  textUser: {
    color: Colors.textPrimary,
  },

  // ─── Input ────────────────────────────────────────────
  inputOuterContainer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: Colors.bgDarkDeep,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  inputInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.pill,
    paddingLeft: 20,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.bgSurfaceLight,
  },
  input: {
    flex: 1,
    height: 40,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
