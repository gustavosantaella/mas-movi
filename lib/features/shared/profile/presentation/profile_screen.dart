import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/colors.dart';
import '../../../auth/providers/auth_provider.dart';
import '../../../../shared/widgets/app_bottom_sheet.dart';

/// Opens the profile as a modal bottom sheet.
/// Call this from any screen: `openProfileSheet(context, ref);`
void openProfileSheet(BuildContext context, WidgetRef ref) {
  showAppBottomSheet(
    context: context,
    initialSize: 0.88,
    builder: (scrollController) => _ProfileContent(scrollController: scrollController),
  );
}

class _ProfileContent extends ConsumerWidget {
  final ScrollController scrollController;
  const _ProfileContent({required this.scrollController});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).state.user;
    final fullName = user != null
        ? '${user.firstName} ${user.lastName}'.toUpperCase()
        : 'USUARIO';
    final role = (user?.isDriver ?? false) ? 'Conductor' : 'Pasajero';
    final memberId = user != null
        ? '#GUA-${user.id.toString().padLeft(4, '0')}'
        : '#GUA-0000';

    return ListView(
      controller: scrollController,
      padding: const EdgeInsets.only(bottom: 40),
      children: [
        const SizedBox(height: 12),

        // ─── Avatar ──────────
        Center(
          child: Stack(
            alignment: Alignment.bottomRight,
            children: [
              Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  color: AppColors.salmon.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: AppColors.salmon.withValues(alpha: 0.3),
                    width: 2,
                  ),
                ),
                child: const Icon(Icons.person, size: 44, color: AppColors.salmon),
              ),
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: AppColors.salmon,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                ),
                child: const Icon(Icons.camera_alt, size: 14, color: Colors.white),
              ),
            ],
          ),
        ),

        const SizedBox(height: 14),

        // ─── Name & role ─────
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40),
          child: Text(
            fullName,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: AppColors.charcoal,
              letterSpacing: 0.3,
            ),
          ),
        ),
        const SizedBox(height: 4),
        Center(
          child: Text(
            role,
            style: const TextStyle(fontSize: 14, color: AppColors.grayNeutral),
          ),
        ),
        const SizedBox(height: 8),
        // ID badge
        Center(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.charcoal),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              memberId,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: AppColors.charcoal,
                letterSpacing: 0.5,
              ),
            ),
          ),
        ),

        const SizedBox(height: 28),

        // ─── Info cards ──────
        _InfoCard(label: 'Email', value: user?.email ?? '—'),
        _InfoCard(label: 'Nombre', value: fullName),
        const _InfoCard(label: 'Miembro desde', value: 'Marzo de 2026'),

        const SizedBox(height: 20),

        // ─── Action tiles ────
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: [
              _ActionTile(
                icon: Icons.person_outline,
                iconBgColor: AppColors.salmon.withValues(alpha: 0.1),
                iconColor: AppColors.salmon,
                label: 'Información Personal',
                onTap: () {
                  Navigator.of(context).pop();
                  context.push('/personal-info');
                },
              ),
              const SizedBox(height: 10),
              _ActionTile(
                icon: Icons.verified_user_outlined,
                iconBgColor: AppColors.salmon.withValues(alpha: 0.1),
                iconColor: AppColors.salmon,
                label: 'Seguridad',
                onTap: () {
                  Navigator.of(context).pop();
                  context.push('/security');
                },
              ),
              const SizedBox(height: 10),
              _ActionTile(
                icon: Icons.support_agent,
                iconBgColor: AppColors.grayNeutral.withValues(alpha: 0.1),
                iconColor: AppColors.grayNeutral,
                label: 'Soporte Técnico',
                onTap: () {},
              ),
            ],
          ),
        ),

        const SizedBox(height: 28),

        // ─── Logout button ───
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: GestureDetector(
            onTap: () {
              Navigator.of(context).pop();
              ref.read(authProvider).signOut();
            },
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.salmon, AppColors.coralIntense],
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.salmon.withValues(alpha: 0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.logout, size: 20, color: Colors.white),
                  SizedBox(width: 10),
                  Text(
                    'Cerrar sesión',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

// ─── Fallback full screen (for GoRouter route) ──
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // When navigated via route, open as bottom sheet on top of current page
    WidgetsBinding.instance.addPostFrameCallback((_) {
      openProfileSheet(context, ref);
      Navigator.of(context).pop(); // pop the empty ProfileScreen route
    });
    return const SizedBox.shrink();
  }
}

// ─── Info Card ───────────────────────
class _InfoCard extends StatelessWidget {
  final String label;
  final String value;

  const _InfoCard({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.fromLTRB(16, 10, 16, 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.borderLightGray),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.salmon,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: AppColors.charcoal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Action Tile ─────────────────────
class _ActionTile extends StatelessWidget {
  final IconData icon;
  final Color iconBgColor;
  final Color iconColor;
  final String label;
  final VoidCallback onTap;

  const _ActionTile({
    required this.icon,
    required this.iconBgColor,
    required this.iconColor,
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
                color: iconBgColor,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, size: 22, color: iconColor),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                label,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: AppColors.charcoal,
                ),
              ),
            ),
            const Icon(Icons.chevron_right, size: 20, color: AppColors.grayNeutral),
          ],
        ),
      ),
    );
  }
}
