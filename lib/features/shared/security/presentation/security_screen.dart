import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../shared/verify_entity/presentation/verify_entity_screen.dart';
import '../../../../core/theme/colors.dart';
import '../../../../shared/widgets/screen_layout.dart';
import '../../../../shared/widgets/app_bottom_sheet.dart';
import '../../../../shared/widgets/gradient_button.dart';
import '../../../../shared/widgets/app_input.dart';
import '../../../auth/providers/auth_provider.dart';
import '../../../../services/auth/auth_repository.dart';

class SecurityScreen extends ConsumerWidget {
  const SecurityScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final user = auth.state.user;
    final token = auth.state.token;

    final emailVerified = user?.emailConfirmed ?? false;
    final entityVerified = user?.entityConfirmed ?? false;

    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: ScreenLayout(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ScreenHeader(title: 'Seguridad', onBack: () => Navigator.of(context).pop()),
            const SizedBox(height: 20),

            // ─── Section: Verificación ─────
            const Text(
              'Verificación',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.charcoal),
            ),
            const SizedBox(height: 14),

            // Email verification
            _VerificationTile(
              icon: Icons.email_outlined,
              label: 'Correo electrónico',
              subtitle: emailVerified ? 'Verificado' : 'No verificado',
              isVerified: emailVerified,
              onTap: emailVerified
                  ? null
                  : () => _showResendEmailSheet(context, token),
            ),
            const SizedBox(height: 10),

            // Entity verification
            _VerificationTile(
              icon: Icons.badge_outlined,
              label: 'Entidad verificada',
              subtitle: entityVerified ? 'Verificada' : 'No verificada',
              isVerified: entityVerified,
              onTap: entityVerified
                  ? null
                  : () => showVerifyEntitySheet(context),
            ),

            const SizedBox(height: 32),

            // ─── Section: Contraseña ───────
            const Text(
              'Contraseña',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.charcoal),
            ),
            const SizedBox(height: 14),

            _ActionTile(
              icon: Icons.lock_outline,
              label: 'Cambiar contraseña',
              subtitle: 'Actualiza tu contraseña de acceso',
              onTap: () => _showChangePasswordSheet(context, token),
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  // ─── Resend email confirmation bottom sheet ──
  void _showResendEmailSheet(BuildContext context, String? token) {
    showAppBottomSheet(
      context: context,
      initialSize: 0.4,
      minSize: 0.3,
      maxSize: 0.5,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: AppColors.salmon.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.email_outlined, size: 32, color: AppColors.salmon),
            ),
            const SizedBox(height: 16),
            const Text(
              'Verificar correo electrónico',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.charcoal),
            ),
            const SizedBox(height: 8),
            const Text(
              '¿Deseas reenviar el correo de confirmación a tu email registrado?',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: AppColors.grayNeutral, height: 1.4),
            ),
            const SizedBox(height: 24),
            _ResendButton(token: token),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  // ─── Change password bottom sheet ──
  void _showChangePasswordSheet(BuildContext context, String? token) {
    showAppBottomSheet(
      context: context,
      initialSize: 0.65,
      minSize: 0.5,
      maxSize: 0.85,
      child: _ChangePasswordForm(token: token),
    );
  }
}

// ═══════════════════════════════════════════
//  Verification status tile
// ═══════════════════════════════════════════
class _VerificationTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final bool isVerified;
  final VoidCallback? onTap;

  const _VerificationTile({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.isVerified,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.borderLightGray),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: (isVerified ? AppColors.successGreen : AppColors.salmon).withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, size: 22, color: isVerified ? AppColors.successGreen : AppColors.salmon),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.charcoal)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: TextStyle(fontSize: 12, color: isVerified ? AppColors.successGreen : AppColors.salmon, fontWeight: FontWeight.w500)),
                ],
              ),
            ),
            Icon(
              isVerified ? Icons.check_circle : Icons.cancel,
              size: 24,
              color: isVerified ? AppColors.successGreen : AppColors.salmon,
            ),
            if (!isVerified) ...[
              const SizedBox(width: 4),
              const Icon(Icons.chevron_right, size: 20, color: AppColors.grayNeutral),
            ],
          ],
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════
//  Action tile
// ═══════════════════════════════════════════
class _ActionTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final VoidCallback? onTap;

  const _ActionTile({
    required this.icon,
    required this.label,
    required this.subtitle,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.borderLightGray),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: AppColors.salmon.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, size: 22, color: AppColors.salmon),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.charcoal)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: const TextStyle(fontSize: 12, color: AppColors.grayNeutral)),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, size: 20, color: AppColors.grayNeutral),
          ],
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════
//  Resend confirmation button (stateful for loading)
// ═══════════════════════════════════════════
class _ResendButton extends StatefulWidget {
  final String? token;
  const _ResendButton({this.token});

  @override
  State<_ResendButton> createState() => _ResendButtonState();
}

class _ResendButtonState extends State<_ResendButton> {
  bool _loading = false;
  bool _sent = false;

  Future<void> _resend() async {
    if (widget.token == null) return;
    setState(() => _loading = true);
    try {
      final repo = AuthRepository();
      await repo.resendConfirmationEmail(widget.token!);
      setState(() => _sent = true);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.salmon),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_sent) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.successGreen.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.check_circle, size: 20, color: AppColors.successGreen),
            SizedBox(width: 8),
            Text('Correo enviado', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.successGreen)),
          ],
        ),
      );
    }

    return GradientButton(
      label: 'Reenviar correo',
      onPressed: _resend,
      loading: _loading,
    );
  }
}

// ═══════════════════════════════════════════
//  Change password form
// ═══════════════════════════════════════════
class _ChangePasswordForm extends StatefulWidget {
  final String? token;
  const _ChangePasswordForm({this.token});

  @override
  State<_ChangePasswordForm> createState() => _ChangePasswordFormState();
}

class _ChangePasswordFormState extends State<_ChangePasswordForm> {
  final _currentCtrl = TextEditingController();
  final _newCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _currentCtrl.dispose();
    _newCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  bool get _isValid {
    final newPw = _newCtrl.text;
    final confirm = _confirmCtrl.text;
    return _currentCtrl.text.isNotEmpty &&
        newPw.length >= 8 &&
        RegExp(r'[A-Z]').hasMatch(newPw) &&
        RegExp(r'[^A-Za-z0-9]').hasMatch(newPw) &&
        newPw == confirm;
  }

  Future<void> _submit() async {
    if (widget.token == null) return;
    setState(() => _loading = true);
    try {
      final repo = AuthRepository();
      await repo.changePassword(
        token: widget.token!,
        currentPassword: _currentCtrl.text,
        newPassword: _newCtrl.text,
      );
      if (mounted) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Contraseña actualizada correctamente'),
            backgroundColor: AppColors.successGreen,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.salmon),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 8),
          const Text(
            'Cambiar contraseña',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.charcoal),
          ),
          const SizedBox(height: 4),
          const Text(
            'Ingresa tu contraseña actual y la nueva contraseña',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, color: AppColors.grayNeutral),
          ),
          const SizedBox(height: 20),

          AppInput(
            label: 'Contraseña actual',
            icon: Icons.lock_outline,
            placeholder: '••••••••',
            type: 'password',
            controller: _currentCtrl,
            onChanged: (_) => setState(() {}),
          ),
          AppInput(
            label: 'Nueva contraseña',
            icon: Icons.lock_reset,
            placeholder: '••••••••',
            type: 'password',
            controller: _newCtrl,
            showPasswordValidator: true,
            onChanged: (_) => setState(() {}),
          ),
          AppInput(
            label: 'Confirmar nueva contraseña',
            icon: Icons.shield_outlined,
            placeholder: '••••••••',
            type: 'password',
            controller: _confirmCtrl,
            onChanged: (_) => setState(() {}),
          ),

          if (_confirmCtrl.text.isNotEmpty && _newCtrl.text != _confirmCtrl.text)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(children: [
                const Icon(Icons.error_outline, size: 14, color: AppColors.salmon),
                const SizedBox(width: 6),
                const Text('Las contraseñas no coinciden', style: TextStyle(fontSize: 12, color: AppColors.salmon)),
              ]),
            ),

          const SizedBox(height: 8),

          GradientButton(
            label: 'Actualizar contraseña',
            onPressed: _isValid ? _submit : null,
            loading: _loading,
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
