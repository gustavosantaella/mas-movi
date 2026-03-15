import { StyleSheet } from 'react-native';

import { Colors, BorderRadius } from '@/theme';

export const qrScannerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgBlack,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionText: {
    color: Colors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: BorderRadius.xl,
  },
  permissionButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  camera: {
    flex: 1,
  },
  topOverlay: {
    width: '100%',
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.bgSurfaceLight,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: Colors.textOnSurface,
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },

  // ─── Scanner Frame ────────────────────────────────────
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: Colors.success,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: BorderRadius.lg,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: BorderRadius.lg,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: BorderRadius.lg,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: BorderRadius.lg,
  },

  // ─── Controls ─────────────────────────────────────────
  bottomOverlay: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 30,
    paddingBottom: 50,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.bgSurfaceHover,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconLabel: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  flashButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.bgSurfaceMedium,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.bgSurfaceBright,
  },
});
