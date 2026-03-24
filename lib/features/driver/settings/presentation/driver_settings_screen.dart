import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/colors.dart';
import '../../../../shared/widgets/screen_layout.dart';
import '../../../auth/providers/auth_provider.dart';
import '../../../shared/verify_entity/presentation/verify_entity_screen.dart';

class DriverSettingsScreen extends ConsumerWidget {
  const DriverSettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: ScreenLayout(
        child: Column(
          children: [
            const ScreenHeader(title: 'Configuración'),
            const SizedBox(height: 8),
            _SettingsTile(icon: Icons.person_outline, label: 'Perfil', onTap: () => context.push('/profile')),
            _SettingsTile(icon: Icons.edit_outlined, label: 'Información personal', onTap: () => context.push('/personal-info')),
            _SettingsTile(icon: Icons.lock_outline, label: 'Seguridad', onTap: () => context.push('/security')),
            _SettingsTile(icon: Icons.history, label: 'Historial de viajes', onTap: () => context.push('/trip-history')),
            _SettingsTile(icon: Icons.verified_user_outlined, label: 'Verificar identidad', onTap: () => showVerifyEntitySheet(context)),
            const SizedBox(height: 20),
            _SettingsTile(
              icon: Icons.logout,
              label: 'Cerrar sesión',
              color: AppColors.accent,
              onTap: () => ref.read(authProvider).signOut(),
            ),
          ],
        ),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color? color;
  final VoidCallback onTap;

  const _SettingsTile({required this.icon, required this.label, this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final c = color ?? AppColors.charcoal;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: AppColors.bgLightGray,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.borderLightGray),
        ),
        child: Row(
          children: [
            Icon(icon, size: 22, color: c),
            const SizedBox(width: 14),
            Expanded(child: Text(label, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: c))),
            Icon(Icons.chevron_right, size: 20, color: AppColors.grayNeutral),
          ],
        ),
      ),
    );
  }
}
