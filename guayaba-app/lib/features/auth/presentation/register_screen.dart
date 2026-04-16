import 'dart:io';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/colors.dart';
import '../../../core/constants.dart';
import '../../../shared/widgets/gradient_button.dart';
import '../../../shared/widgets/app_input.dart';
import '../../../services/auth/auth_repository.dart';

const _totalSteps = 4;

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> with TickerProviderStateMixin {
  int _currentStep = 0;

  // ─── Logo animation ─────────────
  late final AnimationController _logoCtrl;
  late final Animation<double> _logoScale;
  late final Animation<double> _logoOpacity;

  // ─── Step 0: Role ───────────────
  String? _role; // 'conductor' | 'pasajero'

  // ─── Step 1: Identity ───────────
  String? _documentPath;
  String? _selfiePath;
  bool _ocrLoading = false;
  String? _ocrError;
  Map<String, dynamic>? _ocrResult;

  // ─── Step 2: Verify Data ────────
  final Map<String, String> _editedData = {};
  String? _editingField;

  // ─── Step 3: Credentials ────────
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _acceptedTerms = false;
  bool _registerLoading = false;

  // ─── Success ────────────────────
  bool _showSuccess = false;

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
    _passwordCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  // ─── Navigation ─────────────────
  void _goNext() {
    if (_currentStep < _totalSteps - 1) {
      setState(() => _currentStep++);
    }
  }

  void _goToStep(int step) {
    setState(() => _currentStep = step);
  }

  void _goBack() {
    if (_currentStep == 0) {
      context.go('/login');
    } else if (_currentStep == 3 && _role == 'pasajero' && _ocrResult == null) {
      setState(() => _currentStep = 0);
    } else {
      setState(() => _currentStep--);
    }
  }

  // ─── Identity OCR ───────────────
  Future<void> _pickImage({required bool isSelfie}) async {
    final picker = ImagePicker();
    final source = await showDialog<ImageSource>(
      context: context,
      builder: (ctx) => SimpleDialog(
        title: Text(isSelfie ? 'Tomar selfie' : 'Seleccionar imagen'),
        children: [
          if (!isSelfie)
            SimpleDialogOption(
              onPressed: () => Navigator.pop(ctx, ImageSource.gallery),
              child: const Text('Galería'),
            ),
          SimpleDialogOption(
            onPressed: () => Navigator.pop(ctx, ImageSource.camera),
            child: const Text('Cámara'),
          ),
        ],
      ),
    );

    if (source == null) return;

    final file = await picker.pickImage(
      source: source,
      preferredCameraDevice: isSelfie ? CameraDevice.front : CameraDevice.rear,
      imageQuality: 80,
    );
    if (file == null) return;

    setState(() {
      if (isSelfie) {
        _selfiePath = file.path;
      } else {
        _documentPath = file.path;
      }
    });
  }

  Future<void> _verifyIdentity() async {
    if (_documentPath == null || _selfiePath == null) return;
    setState(() {
      _ocrLoading = true;
      _ocrError = null;
    });

    try {
      final repo = AuthRepository();
      final result = await repo.verifyIdentity(
        selfiePath: _selfiePath!,
        documentPath: _documentPath!,
      );
      setState(() {
        _ocrResult = result;
        _editedData.addAll({
          'firstName': (result['documentData']?['firstName'] ?? '').toString(),
          'lastName': (result['documentData']?['lastName'] ?? '').toString(),
          'dateOfBirth': (result['documentData']?['dateOfBirth'] ?? '').toString(),
          'sex': (result['documentData']?['sex'] ?? '').toString(),
          'documentNumber': (result['documentData']?['documentNumber'] ?? '').toString(),
        });
      });
      _goNext();
    } catch (e) {
      setState(() => _ocrError = e.toString());
    } finally {
      setState(() => _ocrLoading = false);
    }
  }

  // ─── Register ───────────────────
  Future<void> _handleRegister() async {
    setState(() => _registerLoading = true);
    try {
      final repo = AuthRepository();
      await repo.register(
        email: _emailCtrl.text.trim(),
        password: _passwordCtrl.text,
        userType: _role == 'conductor' ? 3 : 2,
        dni: _editedData['documentNumber'] ?? '',
        firstName: _editedData['firstName'],
        lastName: _editedData['lastName'],
        dateOfBirth: _editedData['dateOfBirth'],
        sex: _editedData['sex'],
      );
      setState(() => _showSuccess = true);
      await Future.delayed(const Duration(milliseconds: 1800));
      if (mounted) context.go('/login');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.salmon),
        );
      }
    } finally {
      if (mounted) setState(() => _registerLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // ─── Top bar: back + stepper ─────
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
                  child: Row(
                    children: [
                      GestureDetector(
                        onTap: _goBack,
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
                      const SizedBox(width: 12),
                      Expanded(child: _buildStepper()),
                      const SizedBox(width: 52),
                    ],
                  ),
                ),

                // ─── Logo ────────────────────────
                Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: AnimatedBuilder(
                    animation: _logoCtrl,
                    builder: (_, child) => Opacity(
                      opacity: _logoOpacity.value,
                      child: Transform.scale(scale: _logoScale.value, child: child),
                    ),
                    child: Image.asset('assets/images/guayaba-logo.png', width: 80, height: 80),
                  ),
                ),

                // ─── Step content ────────────────
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 250),
                      child: _buildCurrentStep(),
                    ),
                  ),
                ),

                // ─── Footer (step 0 only) ────────
                if (_currentStep == 0)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 24),
                    child: GestureDetector(
                      onTap: () => context.go('/login'),
                      child: RichText(
                        text: const TextSpan(
                          text: '¿Ya tienes cuenta? ',
                          style: TextStyle(fontSize: 14, color: AppColors.grayNeutral),
                          children: [
                            TextSpan(
                              text: 'Inicia sesión',
                              style: TextStyle(color: AppColors.salmon, fontWeight: FontWeight.w700),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
              ],
            ),

            // ─── Success overlay ──────────────
            if (_showSuccess) _buildSuccessOverlay(),
          ],
        ),
      ),
    );
  }

  // ═══════════════════════════════════════════
  //  Stepper dots
  // ═══════════════════════════════════════════
  Widget _buildStepper() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(_totalSteps * 2 - 1, (i) {
        if (i.isOdd) {
          final lineIdx = i ~/ 2;
          return Expanded(
            child: Container(
              height: 2,
              margin: const EdgeInsets.symmetric(horizontal: 8),
              color: lineIdx < _currentStep ? AppColors.salmon : AppColors.borderLightGray,
            ),
          );
        }
        final dotIdx = i ~/ 2;
        final isActive = dotIdx <= _currentStep;
        final isCompleted = dotIdx < _currentStep;
        return Container(
          width: 14,
          height: 14,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isCompleted ? AppColors.salmon : AppColors.bgWhite,
            border: Border.all(
              color: isActive ? AppColors.salmon : AppColors.borderLightGray,
              width: 2,
            ),
          ),
        );
      }),
    );
  }

  // ═══════════════════════════════════════════
  //  Step router
  // ═══════════════════════════════════════════
  Widget _buildCurrentStep() {
    switch (_currentStep) {
      case 0:
        return _StepRole(
          key: const ValueKey('step0'),
          selectedRole: _role,
          onSelectRole: (r) => setState(() => _role = r),
          onNext: _goNext,
        );
      case 1:
        return _StepIdentity(
          key: const ValueKey('step1'),
          documentPath: _documentPath,
          selfiePath: _selfiePath,
          onPickDocument: () => _pickImage(isSelfie: false),
          onPickSelfie: () => _pickImage(isSelfie: true),
          onNext: _verifyIdentity,
          onSkip: _role == 'pasajero' ? () => _goToStep(3) : null,
          loading: _ocrLoading,
          error: _ocrError,
        );
      case 2:
        return _StepVerifyData(
          key: const ValueKey('step2'),
          ocrResult: _ocrResult ?? {},
          editedData: _editedData,
          editingField: _editingField,
          role: _role,
          onToggleEdit: (f) => setState(() => _editingField = _editingField == f ? null : f),
          onUpdateField: (k, v) => setState(() => _editedData[k] = v),
          onNext: _goNext,
          onRetake: () {
            setState(() {
              _documentPath = null;
              _selfiePath = null;
              _ocrResult = null;
            });
            _goToStep(1);
          },
        );
      case 3:
        return _StepCredentials(
          key: const ValueKey('step3'),
          emailCtrl: _emailCtrl,
          passwordCtrl: _passwordCtrl,
          confirmCtrl: _confirmCtrl,
          acceptedTerms: _acceptedTerms,
          onToggleTerms: () => setState(() => _acceptedTerms = !_acceptedTerms),
          onRegister: _handleRegister,
          loading: _registerLoading,
        );
      default:
        return const SizedBox.shrink();
    }
  }

  // ═══════════════════════════════════════════
  //  Success overlay
  // ═══════════════════════════════════════════
  Widget _buildSuccessOverlay() {
    return AnimatedOpacity(
      opacity: _showSuccess ? 1.0 : 0.0,
      duration: const Duration(milliseconds: 300),
      child: Container(
        color: Colors.white.withValues(alpha: 0.95),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 88,
                height: 88,
                decoration: BoxDecoration(
                  color: AppColors.successGreen,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.successGreen.withValues(alpha: 0.4),
                      blurRadius: 16,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const Icon(Icons.check, size: 48, color: Colors.white),
              ),
              const SizedBox(height: 20),
              const Text(
                '¡Cuenta creada con éxito!',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.charcoal),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ═════════════════════════════════════════════════
//  STEP 0 — Role Selection
// ═════════════════════════════════════════════════
class _StepRole extends StatelessWidget {
  final String? selectedRole;
  final ValueChanged<String> onSelectRole;
  final VoidCallback onNext;

  const _StepRole({super.key, required this.selectedRole, required this.onSelectRole, required this.onNext});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Text(
          '¿Cómo usarás Guayaba?',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.charcoal, letterSpacing: -0.5),
        ),
        const SizedBox(height: 8),
        const Text(
          'Selecciona tu tipo de cuenta',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.grayNeutral),
        ),
        const SizedBox(height: 32),

        _RoleCard(
          icon: Icons.directions_car,
          iconColor: AppColors.salmon,
          iconBg: AppColors.peach,
          label: 'Soy Conductor',
          description: 'Ofrece viajes y gana dinero',
          isSelected: selectedRole == 'conductor',
          onTap: () => onSelectRole('conductor'),
        ),
        const SizedBox(height: 14),
        _RoleCard(
          icon: Icons.person_outline,
          iconColor: const Color(0xFF8B5CF6),
          iconBg: const Color(0xFFEDE9FE),
          label: 'Soy Pasajero',
          description: 'Paga viajes de forma fácil',
          isSelected: selectedRole == 'pasajero',
          onTap: () => onSelectRole('pasajero'),
        ),

        const SizedBox(height: 32),

        // Continue button
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: selectedRole != null ? onNext : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.salmon,
              foregroundColor: Colors.white,
              disabledBackgroundColor: AppColors.salmon.withValues(alpha: 0.5),
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Continuar', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                SizedBox(width: 8),
                Icon(Icons.arrow_forward, size: 18),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }
}

class _RoleCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final Color iconBg;
  final String label;
  final String description;
  final bool isSelected;
  final VoidCallback onTap;

  const _RoleCard({
    required this.icon, required this.iconColor, required this.iconBg,
    required this.label, required this.description,
    required this.isSelected, required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFFFF5F3) : AppColors.bgWhite,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? AppColors.salmon : AppColors.borderLightGray,
            width: 1.5,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 54, height: 54,
              decoration: BoxDecoration(color: iconBg, shape: BoxShape.circle),
              child: Icon(icon, size: 28, color: iconColor),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: AppColors.charcoal)),
                  const SizedBox(height: 3),
                  Text(description, style: const TextStyle(fontSize: 13, color: AppColors.grayNeutral)),
                ],
              ),
            ),
            Container(
              width: 22, height: 22,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: isSelected ? AppColors.salmon : AppColors.borderLightGray, width: 2),
              ),
              child: isSelected
                  ? Center(child: Container(width: 12, height: 12, decoration: const BoxDecoration(color: AppColors.salmon, shape: BoxShape.circle)))
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}

// ═════════════════════════════════════════════════
//  STEP 1 — Identity Verification (Camera/Gallery)
// ═════════════════════════════════════════════════
class _StepIdentity extends StatelessWidget {
  final String? documentPath;
  final String? selfiePath;
  final VoidCallback onPickDocument;
  final VoidCallback onPickSelfie;
  final VoidCallback onNext;
  final VoidCallback? onSkip;
  final bool loading;
  final String? error;

  const _StepIdentity({
    super.key,
    this.documentPath, this.selfiePath,
    required this.onPickDocument, required this.onPickSelfie,
    required this.onNext, this.onSkip,
    this.loading = false, this.error,
  });

  @override
  Widget build(BuildContext context) {
    final canContinue = documentPath != null && selfiePath != null && !loading;

    return Column(
      children: [
        const Text('Verifica tu identidad', textAlign: TextAlign.center,
          style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.charcoal, letterSpacing: -0.5)),
        const SizedBox(height: 8),
        const Text('Sube una foto de tu documento y tómate una selfie', textAlign: TextAlign.center,
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.grayNeutral)),
        const SizedBox(height: 24),

        // Document
        const Align(alignment: Alignment.centerLeft, child: Text('Documento de identidad', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.charcoal))),
        const SizedBox(height: 8),
        GestureDetector(
          onTap: onPickDocument,
          child: Container(
            height: 180,
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppColors.bgLightGray,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.borderLightGray, width: 1.5),
            ),
            child: documentPath != null
                ? ClipRRect(borderRadius: BorderRadius.circular(15), child: Image.file(File(documentPath!), fit: BoxFit.cover))
                : const Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Icon(Icons.badge_outlined, size: 40, color: AppColors.grayNeutral),
                    SizedBox(height: 8),
                    Text('Toca para subir o tomar foto', style: TextStyle(fontSize: 13, color: AppColors.grayNeutral, fontWeight: FontWeight.w500)),
                  ]),
          ),
        ),
        const SizedBox(height: 24),

        // Selfie
        const Align(alignment: Alignment.centerLeft, child: Text('Selfie', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.charcoal))),
        const SizedBox(height: 8),
        GestureDetector(
          onTap: onPickSelfie,
          child: Container(
            width: 140, height: 140,
            decoration: BoxDecoration(
              color: AppColors.bgLightGray,
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.borderLightGray, width: 1.5),
            ),
            clipBehavior: Clip.antiAlias,
            child: selfiePath != null
                ? Image.file(File(selfiePath!), fit: BoxFit.cover, width: 140, height: 140)
                : const Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Icon(Icons.camera_alt_outlined, size: 36, color: AppColors.grayNeutral),
                    SizedBox(height: 8),
                    Text('Tomar selfie', style: TextStyle(fontSize: 13, color: AppColors.grayNeutral, fontWeight: FontWeight.w500)),
                  ]),
          ),
        ),
        const SizedBox(height: 8),
        const Text('* Evite usar accesorios para que el reconocimiento sea más efectivo',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 12, color: AppColors.grayNeutral, fontStyle: FontStyle.italic)),
        const SizedBox(height: 16),

        if (error != null) ...[
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.salmon.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(children: [
              const Icon(Icons.error, size: 18, color: AppColors.salmon),
              const SizedBox(width: 8),
              Expanded(child: Text(error!, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.salmon))),
            ]),
          ),
          const SizedBox(height: 16),
        ],

        // Continue button
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: canContinue ? onNext : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.salmon,
              foregroundColor: Colors.white,
              disabledBackgroundColor: AppColors.salmon.withValues(alpha: 0.5),
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
            ),
            child: loading
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Text('Continuar', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                    SizedBox(width: 8),
                    Icon(Icons.arrow_forward, size: 18),
                  ]),
          ),
        ),

        if (onSkip != null) ...[
          const SizedBox(height: 12),
          TextButton(
            onPressed: onSkip,
            child: const Text('Saltar este paso', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.grayNeutral)),
          ),
        ],
        const SizedBox(height: 24),
      ],
    );
  }
}

// ═════════════════════════════════════════════════
//  STEP 2 — Verify Extracted Data
// ═════════════════════════════════════════════════
class _StepVerifyData extends StatelessWidget {
  final Map<String, dynamic> ocrResult;
  final Map<String, String> editedData;
  final String? editingField;
  final String? role;
  final ValueChanged<String> onToggleEdit;
  final void Function(String key, String value) onUpdateField;
  final VoidCallback onNext;
  final VoidCallback onRetake;

  const _StepVerifyData({
    super.key,
    required this.ocrResult, required this.editedData, this.editingField, this.role,
    required this.onToggleEdit, required this.onUpdateField,
    required this.onNext, required this.onRetake,
  });

  @override
  Widget build(BuildContext context) {
    final facesMatch = ocrResult['facesMatch'] == true;
    final confidence = ocrResult['confidence'] ?? 0;

    final fields = [
      {'key': 'firstName', 'icon': Icons.person_outline, 'label': 'Nombre'},
      {'key': 'lastName', 'icon': Icons.person_outline, 'label': 'Apellido'},
      {'key': 'dateOfBirth', 'icon': Icons.calendar_today, 'label': 'Fecha de nacimiento'},
      {'key': 'sex', 'icon': Icons.wc, 'label': 'Sexo'},
      {'key': 'documentNumber', 'icon': Icons.description_outlined, 'label': 'N° de documento'},
    ];

    return Column(
      children: [
        const Text('Verifica tus datos', textAlign: TextAlign.center,
          style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.charcoal, letterSpacing: -0.5)),
        const SizedBox(height: 8),
        const Text('Estos datos fueron extraídos de tu documento. Toca el ícono de editar si necesitas corregir algo.',
          textAlign: TextAlign.center, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.grayNeutral)),
        const SizedBox(height: 20),

        // Face match banner
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: facesMatch ? const Color(0xFFDCFCE7) : AppColors.salmon.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(children: [
            Icon(facesMatch ? Icons.check_circle : Icons.cancel, size: 22, color: facesMatch ? const Color(0xFF16A34A) : AppColors.salmon),
            const SizedBox(width: 10),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(facesMatch ? 'Las fotos coinciden' : 'Las fotos no coinciden',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: facesMatch ? const Color(0xFF16A34A) : AppColors.salmon)),
              Text('Confianza: $confidence%', style: const TextStyle(fontSize: 12, color: AppColors.grayNeutral)),
            ])),
          ]),
        ),
        const SizedBox(height: 20),

        // Data fields
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.bgLightGray,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            children: [
              ...fields.map((f) {
                final key = f['key'] as String;
                final icon = f['icon'] as IconData;
                final label = f['label'] as String;
                final isEditing = editingField == key;
                final value = editedData[key] ?? '';

                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(children: [
                    Container(
                      width: 36, height: 36,
                      decoration: BoxDecoration(color: AppColors.salmon.withValues(alpha: 0.08), shape: BoxShape.circle),
                      child: Icon(icon, size: 20, color: AppColors.salmon),
                    ),
                    const SizedBox(width: 12),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(label, style: const TextStyle(fontSize: 12, color: AppColors.grayNeutral, fontWeight: FontWeight.w500)),
                      if (isEditing)
                        TextField(
                          autofocus: true,
                          controller: TextEditingController(text: value),
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.charcoal),
                          decoration: const InputDecoration(isDense: true, contentPadding: EdgeInsets.symmetric(vertical: 4)),
                          onChanged: (v) => onUpdateField(key, v),
                        )
                      else
                        Text(value.isEmpty ? 'N/A' : value, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.charcoal)),
                    ])),
                    GestureDetector(
                      onTap: () => onToggleEdit(key),
                      child: Icon(isEditing ? Icons.check_circle : Icons.edit_outlined, size: 20,
                        color: isEditing ? const Color(0xFF16A34A) : AppColors.grayNeutral),
                    ),
                  ]),
                );
              }),
              if (role != null)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(children: [
                    Container(
                      width: 36, height: 36,
                      decoration: BoxDecoration(color: AppColors.salmon.withValues(alpha: 0.08), shape: BoxShape.circle),
                      child: const Icon(Icons.directions_car, size: 20, color: AppColors.salmon),
                    ),
                    const SizedBox(width: 12),
                    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      const Text('Rol', style: TextStyle(fontSize: 12, color: AppColors.grayNeutral, fontWeight: FontWeight.w500)),
                      Text(role == 'conductor' ? 'Conductor' : 'Pasajero', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.charcoal)),
                    ]),
                  ]),
                ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: onNext,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.salmon, foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
            ),
            child: const Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              Text('Confirmar y continuar', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              SizedBox(width: 8), Icon(Icons.arrow_forward, size: 18),
            ]),
          ),
        ),
        const SizedBox(height: 8),
        TextButton(
          onPressed: onRetake,
          child: const Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            Icon(Icons.refresh, size: 18, color: AppColors.salmon),
            SizedBox(width: 6),
            Text('Volver a tomar las fotos', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.salmon)),
          ]),
        ),
        const SizedBox(height: 24),
      ],
    );
  }
}

// ═════════════════════════════════════════════════
//  STEP 3 — Credentials (email, password, terms)
// ═════════════════════════════════════════════════
class _StepCredentials extends StatelessWidget {
  final TextEditingController emailCtrl;
  final TextEditingController passwordCtrl;
  final TextEditingController confirmCtrl;
  final bool acceptedTerms;
  final VoidCallback onToggleTerms;
  final VoidCallback onRegister;
  final bool loading;

  const _StepCredentials({
    super.key,
    required this.emailCtrl, required this.passwordCtrl, required this.confirmCtrl,
    required this.acceptedTerms, required this.onToggleTerms,
    required this.onRegister, this.loading = false,
  });

  @override
  Widget build(BuildContext context) {
    return StatefulBuilder(
      builder: (context, setLocalState) {
        final email = emailCtrl.text.trim();
        final password = passwordCtrl.text;
        final confirm = confirmCtrl.text;

        final isValidEmail = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(email);
        final isValidPassword = password.length >= 8 && RegExp(r'[A-Z]').hasMatch(password) && RegExp(r'[^A-Za-z0-9]').hasMatch(password);
        final passwordsMatch = password == confirm && confirm.isNotEmpty;
        final canSubmit = isValidEmail && isValidPassword && passwordsMatch && acceptedTerms;

        return Column(
          children: [
            const Text('Crear Cuenta', textAlign: TextAlign.center,
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.charcoal, letterSpacing: -0.5)),
            const SizedBox(height: 8),
            const Text('Completa tus datos para registrarte', textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.grayNeutral)),
            const SizedBox(height: 24),

            AppInput(
              label: 'Correo electrónico',
              icon: Icons.mail_outline,
              placeholder: 'tu@correo.com',
              type: 'email',
              controller: emailCtrl,
              onChanged: (_) => setLocalState(() {}),
            ),
            AppInput(
              label: 'Contraseña',
              icon: Icons.lock_outline,
              placeholder: '••••••••',
              type: 'password',
              controller: passwordCtrl,
              showPasswordValidator: true,
              helpDescription: 'Mínimo 8 caracteres, 1 mayúscula y 1 símbolo especial.',
              onChanged: (_) => setLocalState(() {}),
            ),
            AppInput(
              label: 'Confirmar contraseña',
              icon: Icons.shield_outlined,
              placeholder: '••••••••',
              type: 'password',
              controller: confirmCtrl,
              onChanged: (_) => setLocalState(() {}),
            ),

            // Password mismatch warning
            if (confirm.isNotEmpty && !passwordsMatch)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(children: [
                  const Icon(Icons.error_outline, size: 14, color: AppColors.salmon),
                  const SizedBox(width: 6),
                  const Text('Las contraseñas no coinciden',
                    style: TextStyle(fontSize: 12, color: AppColors.salmon, fontWeight: FontWeight.w500)),
                ]),
              ),

            const SizedBox(height: 4),

            // Terms checkbox
            GestureDetector(
              onTap: onToggleTerms,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 22, height: 22,
                    margin: const EdgeInsets.only(right: 12, top: 2),
                    decoration: BoxDecoration(
                      color: acceptedTerms ? AppColors.salmon : Colors.transparent,
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(
                        color: acceptedTerms ? AppColors.salmon : AppColors.borderLightGray,
                        width: 1.5,
                      ),
                    ),
                    child: acceptedTerms ? const Icon(Icons.check, size: 16, color: Colors.white) : null,
                  ),
                  Expanded(
                    child: Text.rich(
                      TextSpan(
                        text: 'Acepto los ',
                        style: const TextStyle(fontSize: 13, height: 1.5, color: AppColors.grayNeutral),
                        children: [
                          WidgetSpan(
                            child: GestureDetector(
                              onTap: () => launchUrl(Uri.parse(urlTermsAndConditions)),
                              child: const Text('Términos y Condiciones',
                                style: TextStyle(fontSize: 13, color: AppColors.salmon, fontWeight: FontWeight.w600, decoration: TextDecoration.underline)),
                            ),
                          ),
                          const TextSpan(text: ' y la '),
                          WidgetSpan(
                            child: GestureDetector(
                              onTap: () => launchUrl(Uri.parse(urlPrivacyPolicy)),
                              child: const Text('Política de Privacidad',
                                style: TextStyle(fontSize: 13, color: AppColors.salmon, fontWeight: FontWeight.w600, decoration: TextDecoration.underline)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            GradientButton(
              label: 'Registrarse',
              onPressed: canSubmit ? onRegister : null,
              loading: loading,
            ),
            const SizedBox(height: 24),
          ],
        );
      },
    );
  }
}
