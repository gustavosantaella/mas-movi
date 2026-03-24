import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../core/theme/colors.dart';
import '../../../../shared/widgets/app_bottom_sheet.dart';
import '../../../../shared/widgets/gradient_button.dart';
import '../../../auth/data/auth_repository.dart';
import '../../../auth/providers/auth_provider.dart';

/// Opens the identity verification bottom sheet.
void showVerifyEntitySheet(BuildContext context) {
  showAppBottomSheet(
    context: context,
    initialSize: 0.80,
    minSize: 0.5,
    maxSize: 0.95,
    child: const _VerifyEntityContent(),
  );
}

class _VerifyEntityContent extends ConsumerStatefulWidget {
  const _VerifyEntityContent();

  @override
  ConsumerState<_VerifyEntityContent> createState() =>
      _VerifyEntityContentState();
}

class _VerifyEntityContentState extends ConsumerState<_VerifyEntityContent> {
  final _picker = ImagePicker();
  final _repo = AuthRepository();

  // Step 0: capture | Step 1: review OCR data
  int _step = 0;

  File? _selfieFile;
  File? _docFrontFile;
  File? _docBackFile;

  bool _ocrLoading = false;
  String? _ocrError;
  Map<String, dynamic>? _ocrResult;
  final Map<String, String> _editedData = {};
  String? _editingField;

  bool _confirmLoading = false;

  // ─── Image picking ─────────────────────────
  Future<void> _pickSelfie() async {
    final picked = await _picker.pickImage(
      source: ImageSource.camera,
      preferredCameraDevice: CameraDevice.front,
      maxWidth: 1200,
      imageQuality: 85,
    );
    if (picked != null) setState(() => _selfieFile = File(picked.path));
  }

  Future<void> _pickDocument({required bool isFront}) async {
    final chosen = await showModalBottomSheet<ImageSource>(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: const EdgeInsets.fromLTRB(24, 20, 24, 32),
        decoration: const BoxDecoration(
          color: AppColors.bgWhite,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40, height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFD1D5DB),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 16),
            const Text('Seleccionar imagen',
                style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.charcoal)),
            const SizedBox(height: 16),
            _SourceOption(
              icon: Icons.camera_alt_outlined,
              label: 'Tomar foto',
              onTap: () => Navigator.pop(context, ImageSource.camera),
            ),
            const SizedBox(height: 8),
            _SourceOption(
              icon: Icons.photo_library_outlined,
              label: 'Elegir de galería',
              onTap: () => Navigator.pop(context, ImageSource.gallery),
            ),
          ],
        ),
      ),
    );
    if (chosen == null) return;

    final picked = await _picker.pickImage(
      source: chosen,
      maxWidth: 1200,
      imageQuality: 85,
    );
    if (picked == null) return;
    setState(() {
      if (isFront) {
        _docFrontFile = File(picked.path);
      } else {
        _docBackFile = File(picked.path);
      }
    });
  }

  bool get _allCaptured =>
      _selfieFile != null && _docFrontFile != null && _docBackFile != null;

  // ─── OCR verification ──────────────────────
  Future<void> _verifyIdentity() async {
    if (!_allCaptured) return;
    setState(() {
      _ocrLoading = true;
      _ocrError = null;
    });

    try {
      final result = await _repo.verifyIdentity(
        selfiePath: _selfieFile!.path,
        documentPath: _docFrontFile!.path,
      );
      setState(() {
        _ocrResult = result;
        _editedData.addAll({
          'firstName':
              (result['documentData']?['firstName'] ?? '').toString(),
          'lastName':
              (result['documentData']?['lastName'] ?? '').toString(),
          'dateOfBirth':
              (result['documentData']?['dateOfBirth'] ?? '').toString(),
          'sex': (result['documentData']?['sex'] ?? '').toString(),
          'documentNumber':
              (result['documentData']?['documentNumber'] ?? '').toString(),
        });
        _step = 1;
      });
    } catch (e) {
      setState(() => _ocrError = e.toString());
    } finally {
      setState(() => _ocrLoading = false);
    }
  }

  // ─── Confirm entity ────────────────────────
  Future<void> _confirmEntity() async {
    final token = ref.read(authProvider).state.token;
    if (token == null) return;
    setState(() => _confirmLoading = true);

    try {
      await _repo.confirmEntity(token, {
        'firstName': _editedData['firstName'],
        'lastName': _editedData['lastName'],
        'dateOfBirth': _editedData['dateOfBirth'],
        'sex': _editedData['sex'],
        'dni': _editedData['documentNumber'],
      });

      // Refresh user profile
      try {
        final profile = await _repo.getProfile(token);
        ref.read(authProvider).updateUser(profile);
      } catch (_) {}

      if (mounted) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Identidad verificada correctamente'),
            backgroundColor: AppColors.successGreen,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(e.toString()),
              backgroundColor: AppColors.salmon),
        );
      }
    } finally {
      if (mounted) setState(() => _confirmLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 250),
      child: _step == 0 ? _buildCaptureStep() : _buildReviewStep(),
    );
  }

  // ═══════════════════════════════════════════
  //  Step 0: Capture selfie + documents
  // ═══════════════════════════════════════════
  Widget _buildCaptureStep() {
    return Padding(
      key: const ValueKey('capture'),
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
            child: const Icon(Icons.document_scanner_outlined,
                size: 32, color: AppColors.salmon),
          ),
          const SizedBox(height: 16),
          const Text(
            'Verificar identidad',
            style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: AppColors.charcoal),
          ),
          const SizedBox(height: 6),
          const Text(
            'Toma una selfie y fotos de tu cédula para verificar tu identidad mediante OCR',
            textAlign: TextAlign.center,
            style: TextStyle(
                fontSize: 13, color: AppColors.grayNeutral, height: 1.4),
          ),
          const SizedBox(height: 24),

          // Capture tiles
          _CaptureTile(
            icon: Icons.face,
            label: 'Selfie',
            subtitle: 'Foto de tu rostro',
            file: _selfieFile,
            onTap: _pickSelfie,
          ),
          const SizedBox(height: 10),
          _CaptureTile(
            icon: Icons.credit_card,
            label: 'Cédula – Frente',
            subtitle: 'Foto frontal de tu documento',
            file: _docFrontFile,
            onTap: () => _pickDocument(isFront: true),
          ),
          const SizedBox(height: 10),
          _CaptureTile(
            icon: Icons.credit_card,
            label: 'Cédula – Reverso',
            subtitle: 'Foto trasera de tu documento',
            file: _docBackFile,
            onTap: () => _pickDocument(isFront: false),
          ),

          if (_ocrError != null) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.salmon.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(children: [
                const Icon(Icons.error, size: 18, color: AppColors.salmon),
                const SizedBox(width: 8),
                Expanded(
                    child: Text(_ocrError!,
                        style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: AppColors.salmon))),
              ]),
            ),
          ],

          const SizedBox(height: 24),
          GradientButton(
            label: 'Verificar identidad',
            onPressed: _allCaptured ? _verifyIdentity : null,
            loading: _ocrLoading,
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════
  //  Step 1: Review OCR data
  // ═══════════════════════════════════════════
  Widget _buildReviewStep() {
    final facesMatch = _ocrResult?['facesMatch'] == true;
    final confidence = _ocrResult?['confidence'] ?? 0;

    final fields = [
      {'key': 'firstName', 'icon': Icons.person_outline, 'label': 'Nombre'},
      {'key': 'lastName', 'icon': Icons.person_outline, 'label': 'Apellido'},
      {
        'key': 'dateOfBirth',
        'icon': Icons.calendar_today,
        'label': 'Fecha de nacimiento'
      },
      {'key': 'sex', 'icon': Icons.wc, 'label': 'Sexo'},
      {
        'key': 'documentNumber',
        'icon': Icons.description_outlined,
        'label': 'N° de documento'
      },
    ];

    return Padding(
      key: const ValueKey('review'),
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 8),
          const Text(
            'Verifica tus datos',
            style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: AppColors.charcoal),
          ),
          const SizedBox(height: 6),
          const Text(
            'Datos extraídos de tu documento. Toca editar si necesitas corregir algo.',
            textAlign: TextAlign.center,
            style: TextStyle(
                fontSize: 13, color: AppColors.grayNeutral, height: 1.4),
          ),
          const SizedBox(height: 16),

          // Face match banner
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: facesMatch
                  ? const Color(0xFFDCFCE7)
                  : AppColors.salmon.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(children: [
              Icon(
                facesMatch ? Icons.check_circle : Icons.cancel,
                size: 22,
                color: facesMatch
                    ? const Color(0xFF16A34A)
                    : AppColors.salmon,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      facesMatch
                          ? 'Las fotos coinciden'
                          : 'Las fotos no coinciden',
                      style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: facesMatch
                              ? const Color(0xFF16A34A)
                              : AppColors.salmon),
                    ),
                    Text('Confianza: $confidence%',
                        style: const TextStyle(
                            fontSize: 12, color: AppColors.grayNeutral)),
                  ],
                ),
              ),
            ]),
          ),
          const SizedBox(height: 16),

          // Data fields
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.bgLightGray,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: fields.map((f) {
                final key = f['key'] as String;
                final icon = f['icon'] as IconData;
                final label = f['label'] as String;
                final isEditing = _editingField == key;
                final value = _editedData[key] ?? '';

                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: AppColors.salmon.withValues(alpha: 0.08),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(icon, size: 20, color: AppColors.salmon),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(label,
                              style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.grayNeutral,
                                  fontWeight: FontWeight.w500)),
                          if (isEditing)
                            TextField(
                              autofocus: true,
                              controller:
                                  TextEditingController(text: value),
                              style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.charcoal),
                              decoration: const InputDecoration(
                                  isDense: true,
                                  contentPadding:
                                      EdgeInsets.symmetric(vertical: 4)),
                              onChanged: (v) => setState(
                                  () => _editedData[key] = v),
                            )
                          else
                            Text(value.isEmpty ? 'N/A' : value,
                                style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.charcoal)),
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: () => setState(() => _editingField =
                          _editingField == key ? null : key),
                      child: Icon(
                        isEditing
                            ? Icons.check_circle
                            : Icons.edit_outlined,
                        size: 20,
                        color: isEditing
                            ? const Color(0xFF16A34A)
                            : AppColors.grayNeutral,
                      ),
                    ),
                  ]),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),

          // Buttons
          GradientButton(
            label: 'Confirmar y verificar',
            onPressed: _confirmEntity,
            loading: _confirmLoading,
          ),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () => setState(() {
              _step = 0;
              _selfieFile = null;
              _docFrontFile = null;
              _docBackFile = null;
              _ocrResult = null;
              _editedData.clear();
            }),
            child: const Text('Retomar fotos',
                style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.grayNeutral)),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}

// ─── Capture tile ──────────────────────────────────────
class _CaptureTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final File? file;
  final VoidCallback onTap;

  const _CaptureTile({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.file,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final captured = file != null;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color:
                captured ? AppColors.successGreen : AppColors.borderLightGray,
          ),
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
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: captured
                    ? AppColors.successGreen.withValues(alpha: 0.1)
                    : AppColors.salmon.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              clipBehavior: Clip.antiAlias,
              child: captured
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.file(file!,
                          fit: BoxFit.cover, width: 48, height: 48),
                    )
                  : Icon(icon, size: 24, color: AppColors.salmon),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label,
                      style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.charcoal)),
                  const SizedBox(height: 2),
                  Text(
                    captured ? 'Capturada ✓' : subtitle,
                    style: TextStyle(
                      fontSize: 12,
                      color: captured
                          ? AppColors.successGreen
                          : AppColors.grayNeutral,
                      fontWeight: captured
                          ? FontWeight.w600
                          : FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              captured ? Icons.check_circle : Icons.camera_alt_outlined,
              size: 22,
              color:
                  captured ? AppColors.successGreen : AppColors.grayNeutral,
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Source option for camera/gallery picker ───────────
class _SourceOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _SourceOption({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: AppColors.bgLightGray,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.borderLightGray),
        ),
        child: Row(
          children: [
            Icon(icon, size: 22, color: AppColors.salmon),
            const SizedBox(width: 14),
            Text(label,
                style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.charcoal)),
            const Spacer(),
            const Icon(Icons.chevron_right,
                size: 20, color: AppColors.grayNeutral),
          ],
        ),
      ),
    );
  }
}
