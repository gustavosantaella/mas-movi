import { StyleSheet, Platform } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/theme';

export const authStyles = StyleSheet.create({
  /* ─── Container ───────────────────────────────────── */
  container: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.huge,
  },

  /* ─── Logo ────────────────────────────────────────── */
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },

  /* ─── Title ───────────────────────────────────────── */
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.charcoal,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.grayNeutral,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },

  /* ─── Inputs ──────────────────────────────────────── */
  inputGroup: {
    marginBottom: Spacing.base,
  },
  helpText: {
    fontSize: 12,
    color: Colors.grayNeutral,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.grayNeutral,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgLightGray,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
    paddingHorizontal: Spacing.base,
    height: 54,
  },
  inputWrapperFocused: {
    borderColor: Colors.salmon,
    backgroundColor: Colors.bgWhite,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.charcoal,
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  eyeButton: {
    padding: Spacing.xs,
  },

  /* ─── Button ──────────────────────────────────────── */
  buttonContainer: {
    marginTop: Spacing.xl,
  },

  /* ─── Footer link ─────────────────────────────────── */
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: 14,
    color: Colors.grayNeutral,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.salmon,
  },

  /* ─── Checkbox (register) ─────────────────────────── */
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.lg,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.borderLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  checkboxBoxChecked: {
    backgroundColor: Colors.salmon,
    borderColor: Colors.salmon,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.grayNeutral,
  },
  checkboxLink: {
    color: Colors.salmon,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
