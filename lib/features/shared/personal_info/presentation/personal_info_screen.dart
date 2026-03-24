import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/colors.dart';
import '../../../../shared/widgets/screen_layout.dart';
import '../../../../shared/widgets/app_input.dart';
import '../../../../shared/widgets/gradient_button.dart';
import '../../../../shared/helpers/date_formatter.dart';
import '../../../auth/providers/auth_provider.dart';
import '../../../../services/auth/auth_repository.dart';

class PersonalInfoScreen extends ConsumerStatefulWidget {
  const PersonalInfoScreen({super.key});

  @override
  ConsumerState<PersonalInfoScreen> createState() => _PersonalInfoScreenState();
}

class _PersonalInfoScreenState extends ConsumerState<PersonalInfoScreen> {
  final _firstNameCtrl = TextEditingController();
  final _lastNameCtrl = TextEditingController();
  final _dobCtrl = TextEditingController();
  String? _dobIso;
  String _email = '';
  String _dni = '';
  String _sex = '';
  bool _loading = false;
  bool _initialized = false;

  @override
  void dispose() {
    _firstNameCtrl.dispose();
    _lastNameCtrl.dispose();
    _dobCtrl.dispose();
    super.dispose();
  }

  void _initFields() {
    if (_initialized) return;
    final user = ref.read(authProvider).state.user;
    if (user == null) return;
    _firstNameCtrl.text = user.firstName;
    _lastNameCtrl.text = user.lastName;
    _dobCtrl.text = DateFormatter.toDMY(user.dateOfBirth);
    _email = user.email;
    _dni = user.dni;
    _sex = user.sex;
    _initialized = true;
  }

  Future<void> _save() async {
    final token = ref.read(authProvider).state.token;
    if (token == null) return;
    setState(() => _loading = true);

    try {
      final repo = AuthRepository();
      final updated = await repo.updateProfile(token, {
        'firstName': _firstNameCtrl.text.trim(),
        'lastName': _lastNameCtrl.text.trim(),
        'dateOfBirth': _dobIso ?? _dobCtrl.text.trim(),
        'sex': _sex,
      });
      ref.read(authProvider).updateUser(updated);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Datos actualizados correctamente'),
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
    ref.watch(authProvider); // rebuild on auth changes
    _initFields();

    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: ScreenLayout(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ScreenHeader(
                title: 'Información personal',
                onBack: () => Navigator.of(context).pop()),
            const SizedBox(height: 20),

            // ─── Email (read-only) ──────────────────
            _ReadOnlyField(
              icon: Icons.email_outlined,
              label: 'Correo electrónico',
              value: _email,
            ),
            const SizedBox(height: 8),
            _ReadOnlyField(
              icon: Icons.badge_outlined,
              label: 'Cédula',
              value: _dni,
            ),
            const SizedBox(height: 8),

            // ─── Editable fields ────────────────────
            AppInput(
              label: 'Nombre',
              icon: Icons.person_outline,
              placeholder: 'Tu nombre',
              controller: _firstNameCtrl,
            ),
            AppInput(
              label: 'Apellido',
              icon: Icons.person_outline,
              placeholder: 'Tu apellido',
              controller: _lastNameCtrl,
            ),
            AppInput(
              label: 'Fecha de nacimiento',
              icon: Icons.calendar_today,
              type: 'date',
              controller: _dobCtrl,
              onChanged: (iso) => _dobIso = iso,
            ),

            // ─── Sex selector ───────────────────────
            const Text(
              'Sexo',
              style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.grayNeutral),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                _SexChip(
                  label: 'Masculino',
                  selected: _sex == 'M',
                  onTap: () => setState(() => _sex = 'M'),
                ),
                const SizedBox(width: 10),
                _SexChip(
                  label: 'Femenino',
                  selected: _sex == 'F',
                  onTap: () => setState(() => _sex = 'F'),
                ),
              ],
            ),

            const SizedBox(height: 32),

            GradientButton(
              label: 'Guardar cambios',
              onPressed: _save,
              loading: _loading,
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

// ─── Read-only field ────────────────────────────────────
class _ReadOnlyField extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _ReadOnlyField({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label,
              style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.grayNeutral)),
          const SizedBox(height: 8),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: AppColors.bgLightGray.withValues(alpha: 0.6),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.borderLightGray),
            ),
            child: Row(
              children: [
                Icon(icon, size: 20, color: AppColors.grayNeutral),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    value.isEmpty ? '—' : value,
                    style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: AppColors.grayNeutral),
                  ),
                ),
                const Icon(Icons.lock_outline,
                    size: 16, color: AppColors.grayNeutral),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Sex chip ───────────────────────────────────────────
class _SexChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _SexChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            color: selected ? AppColors.salmon.withValues(alpha: 0.1) : AppColors.bgLightGray,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: selected ? AppColors.salmon : AppColors.borderLightGray,
              width: selected ? 1.5 : 1,
            ),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: selected ? AppColors.salmon : AppColors.grayNeutral,
            ),
          ),
        ),
      ),
    );
  }
}
