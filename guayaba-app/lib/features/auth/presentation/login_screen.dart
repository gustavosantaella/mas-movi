import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guayaba_app/core/constants.dart';
import '../../../core/theme/colors.dart';
import '../../../shared/widgets/gradient_button.dart';
import '../../../shared/widgets/app_input.dart';
import '../../../services/auth/auth_repository.dart';
import '../../auth/providers/auth_provider.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _rememberMe = false;
  bool _loading = false;
  int _loginMethod = 0; // 0: Email, 1: Phone
  late AnimationController _logoAnim;
  late Animation<double> _logoScale;
  late Animation<double> _logoOpacity;

  @override
  void initState() {
    super.initState();
    _logoAnim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _logoScale = Tween<double>(
      begin: 0.7,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _logoAnim, curve: Curves.easeOutBack));
    _logoOpacity = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(parent: _logoAnim, curve: Curves.easeOut));
    _logoAnim.forward();
  }

  @override
  void dispose() {
    _logoAnim.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  bool get _isValidIdentifier {
    final text = _emailCtrl.text.trim();
    if (_loginMethod == 0) {
      return RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(text);
    } else {
      return RegExp(r'^\+?[0-9]{10,15}$').hasMatch(text);
    }
  }

  bool get _isValidPassword {
    final p = _passwordCtrl.text;
    return p.length >= 8 &&
        RegExp(r'[A-Z]').hasMatch(p) &&
        RegExp(r'[^A-Za-z0-9]').hasMatch(p);
  }

  bool get _canSubmit => _isValidIdentifier && _isValidPassword;

  Future<void> _handleLogin() async {
    debugPrint('Login attempt with email: ${_emailCtrl.text}');
    debugPrint('URL is: ${apiBaseUrl}');
    setState(() => _loading = true);
    try {
      final repo = AuthRepository();
      final token = await repo.login(
        email: _emailCtrl.text,
        password: _passwordCtrl.text,
        rememberPassword: _rememberMe,
      );
      await ref.read(authProvider).signIn(token);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(e.toString()),
            backgroundColor: AppColors.accent,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          child: Column(
            children: [
              const SizedBox(height: 40),
              // ─── Logo ──────────────
              AnimatedBuilder(
                animation: _logoAnim,
                builder:
                    (_, child) => Opacity(
                      opacity: _logoOpacity.value,
                      child: Transform.scale(
                        scale: _logoScale.value,
                        child: child,
                      ),
                    ),
                child: Image.asset(
                  'assets/images/guayaba-logo.png',
                  height: 100,
                ),
              ),
              const SizedBox(height: 30),
              // ─── Title ─────────────
              const Text(
                'Iniciar Sesión',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                  color: AppColors.charcoal,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Ingresa tus credenciales para continuar',
                style: TextStyle(fontSize: 14, color: AppColors.grayNeutral),
              ),
              const SizedBox(height: 30),
              // ─── Login Method Selector ───────
              Container(
                height: 48,
                decoration: BoxDecoration(
                  color: AppColors.bgLightGray,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.borderLightGray),
                ),
                child: Stack(
                  children: [
                    AnimatedAlign(
                      duration: const Duration(milliseconds: 250),
                      curve: Curves.easeInOut,
                      alignment:
                          _loginMethod == 0
                              ? Alignment.centerLeft
                              : Alignment.centerRight,
                      child: FractionallySizedBox(
                        widthFactor: 0.5,
                        child: Container(
                          margin: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.04),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap:
                                () => setState(() {
                                  _loginMethod = 0;
                                  _emailCtrl.clear();
                                }),
                            behavior: HitTestBehavior.opaque,
                            child: Center(
                              child: Text(
                                'Correo',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight:
                                      _loginMethod == 0
                                          ? FontWeight.w700
                                          : FontWeight.w600,
                                  color:
                                      _loginMethod == 0
                                          ? AppColors.salmon
                                          : AppColors.grayNeutral,
                                ),
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: GestureDetector(
                            onTap:
                                () => setState(() {
                                  _loginMethod = 1;
                                  _emailCtrl.clear();
                                }),
                            behavior: HitTestBehavior.opaque,
                            child: Center(
                              child: Text(
                                'Teléfono',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight:
                                      _loginMethod == 1
                                          ? FontWeight.w700
                                          : FontWeight.w600,
                                  color:
                                      _loginMethod == 1
                                          ? AppColors.salmon
                                          : AppColors.grayNeutral,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              // ─── Input Field ────────────────
              AppInput(
                label:
                    _loginMethod == 0
                        ? 'Correo electrónico'
                        : 'Número de teléfono',
                icon:
                    _loginMethod == 0
                        ? Icons.mail_outline
                        : Icons.phone_android_outlined,
                placeholder:
                    _loginMethod == 0 ? 'tu@correo.com' : '04121234567',
                type: _loginMethod == 0 ? 'email' : 'number',
                controller: _emailCtrl,
                onChanged: (_) => setState(() {}),
              ),
              // ─── Password ──────────
              AppInput(
                label: 'Contraseña',
                icon: Icons.lock_outline,
                placeholder: '••••••••',
                type: 'password',
                controller: _passwordCtrl,
                onChanged: (_) => setState(() {}),
                showPasswordValidator: true,
                helpDescription:
                    'Mínimo 8 caracteres, 1 mayúscula y 1 símbolo especial.',
              ),
              // ─── Forgot password ───
              Align(
                alignment: Alignment.centerRight,
                child: GestureDetector(
                  onTap: () => context.push('/forgot-password'),
                  child: const Text(
                    '¿Olvidaste tu contraseña?',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.salmon,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              // ─── Remember me ───────
              GestureDetector(
                onTap: () => setState(() => _rememberMe = !_rememberMe),
                child: Row(
                  children: [
                    Container(
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(
                          color:
                              _rememberMe
                                  ? AppColors.salmon
                                  : const Color(0xFFD1D5DB),
                          width: 1.5,
                        ),
                        color:
                            _rememberMe ? AppColors.salmon : Colors.transparent,
                      ),
                      child:
                          _rememberMe
                              ? const Icon(
                                Icons.check,
                                size: 14,
                                color: Colors.white,
                              )
                              : null,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Recordarme',
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.charcoal,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              // ─── Button ────────────
              GradientButton(
                label: 'Iniciar Sesión',
                onPressed: _handleLogin,
                loading: _loading,
                disabled: !_canSubmit,
              ),
              const SizedBox(height: 30),
              // ─── Footer ────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    '¿No tienes cuenta? ',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppColors.grayNeutral,
                    ),
                  ),
                  GestureDetector(
                    onTap: () => context.go('/register'),
                    child: const Text(
                      'Regístrate',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppColors.salmon,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
