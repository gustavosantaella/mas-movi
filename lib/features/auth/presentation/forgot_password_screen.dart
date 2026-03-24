import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/colors.dart';
import '../../../shared/widgets/gradient_button.dart';
import '../../../shared/widgets/app_input.dart';
import '../../auth/data/auth_repository.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen>
    with SingleTickerProviderStateMixin {
  final _emailCtrl = TextEditingController();
  bool _loading = false;
  bool _sent = false;
  int _cooldown = 0;
  Timer? _timer;

  // Logo animation
  late final AnimationController _logoCtrl;
  late final Animation<double> _logoScale;
  late final Animation<double> _logoOpacity;

  @override
  void initState() {
    super.initState();
    _logoCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 600));
    _logoScale = Tween(begin: 0.7, end: 1.0).animate(CurvedAnimation(parent: _logoCtrl, curve: Curves.elasticOut));
    _logoOpacity = Tween(begin: 0.0, end: 1.0).animate(CurvedAnimation(parent: _logoCtrl, curve: Curves.easeIn));
    _logoCtrl.forward();
  }

  @override
  void dispose() {
    _logoCtrl.dispose();
    _emailCtrl.dispose();
    _timer?.cancel();
    super.dispose();
  }

  bool get _isValidEmail =>
      RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(_emailCtrl.text.trim());

  void _startCooldown() {
    setState(() => _cooldown = 30);
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      setState(() {
        _cooldown--;
        if (_cooldown <= 0) {
          t.cancel();
          _cooldown = 0;
        }
      });
    });
  }

  Future<void> _handleSubmit() async {
    setState(() => _loading = true);
    try {
      final repo = AuthRepository();
      await repo.forgotPassword(_emailCtrl.text.trim());
    } catch (_) {
      // Always show success to prevent email enumeration
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
          _sent = true;
        });
        _startCooldown();
      }
    }
  }

  Future<void> _handleResend() async {
    try {
      final repo = AuthRepository();
      await repo.forgotPassword(_emailCtrl.text.trim());
    } catch (_) {}
    _startCooldown();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 28),
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          child: Column(
            children: [
              const SizedBox(height: 16),

              // ─── Back button ─────────
              Align(
                alignment: Alignment.centerLeft,
                child: GestureDetector(
                  onTap: () => Navigator.of(context).pop(),
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0F0F3),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.arrow_back, size: 22, color: AppColors.charcoal),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // ─── Logo ────────────────
              AnimatedBuilder(
                animation: _logoCtrl,
                builder: (_, child) => Opacity(
                  opacity: _logoOpacity.value,
                  child: Transform.scale(scale: _logoScale.value, child: child),
                ),
                child: Image.asset('assets/images/guayaba-logo.png', width: 80, height: 80),
              ),
              const SizedBox(height: 24),

              // ─── Content ─────────────
              if (_sent) _buildSentState() else _buildFormState(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFormState() {
    return Column(
      children: [
        const Text(
          '¿Olvidaste tu contraseña?',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.charcoal, letterSpacing: -0.5),
        ),
        const SizedBox(height: 8),
        const Text(
          'Ingresa tu correo electrónico y te enviaremos un enlace para crear una nueva contraseña.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.grayNeutral, height: 1.5),
        ),
        const SizedBox(height: 32),

        AppInput(
          label: 'Correo electrónico',
          icon: Icons.mail_outline,
          placeholder: 'tu@correo.com',
          type: 'email',
          controller: _emailCtrl,
          onChanged: (_) => setState(() {}),
        ),
        const SizedBox(height: 8),

        GradientButton(
          label: 'Enviar enlace',
          onPressed: _isValidEmail ? _handleSubmit : null,
          loading: _loading,
        ),
        const SizedBox(height: 32),

        // Footer
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('¿Recordaste tu contraseña? ', style: TextStyle(fontSize: 14, color: AppColors.grayNeutral)),
            GestureDetector(
              onTap: () => context.go('/login'),
              child: const Text('Iniciar sesión', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.salmon)),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSentState() {
    return Column(
      children: [
        // Mail icon
        Container(
          width: 72,
          height: 72,
          decoration: BoxDecoration(
            color: AppColors.salmon.withValues(alpha: 0.08),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.mail, size: 36, color: AppColors.salmon),
        ),
        const SizedBox(height: 20),

        const Text(
          'Revisa tu correo',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.charcoal, letterSpacing: -0.5),
        ),
        const SizedBox(height: 8),

        Text.rich(
          TextSpan(
            text: 'Si existe una cuenta con ',
            children: [
              TextSpan(
                text: _emailCtrl.text.trim(),
                style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.charcoal),
              ),
              const TextSpan(text: ', recibirás un enlace para restablecer tu contraseña.'),
            ],
          ),
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.grayNeutral, height: 1.5),
        ),
        const SizedBox(height: 12),
        const Text(
          'Revisa tu bandeja de spam si no lo ves en unos minutos.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 13, color: AppColors.grayNeutral),
        ),
        const SizedBox(height: 24),

        // Resend link
        GestureDetector(
          onTap: _cooldown > 0 ? null : _handleResend,
          child: Text(
            _cooldown > 0 ? 'Reenviar correo en ${_cooldown}s' : 'Reenviar correo',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: _cooldown > 0 ? AppColors.grayNeutral : AppColors.salmon,
            ),
          ),
        ),
        const SizedBox(height: 24),

        GradientButton(
          label: 'Volver al inicio de sesión',
          onPressed: () => context.go('/login'),
        ),
      ],
    );
  }
}
