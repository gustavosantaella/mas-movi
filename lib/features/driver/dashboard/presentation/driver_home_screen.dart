import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/colors.dart';
import '../../../../shared/widgets/recent_trips_section.dart';
import '../../../../shared/widgets/app_bottom_sheet.dart';
import '../../../../shared/widgets/gradient_button.dart';
import '../../../shared/profile/presentation/profile_screen.dart';
import '../../../shared/providers/settings_provider.dart';
import '../../../shared/providers/trip_refresh_provider.dart';
import '../../../auth/providers/auth_provider.dart';
import '../../providers/driver_session_provider.dart';

class DriverHomeScreen extends ConsumerWidget {
  const DriverHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(driverSessionProvider).state;
    final settings = ref.watch(settingsProvider);
    final qrDownloaded = settings.qrDownloaded;

    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: SafeArea(
        child: RefreshIndicator(
          color: AppColors.salmon,
          onRefresh: () async {
            ref.read(tripRefreshProvider.notifier).state++;
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
            // ─── Avatar + Name ───────
            GestureDetector(
              onTap: () => openProfileSheet(context, ref),
              child: Row(
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    decoration: const BoxDecoration(
                      color: AppColors.peach,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.person, size: 22, color: AppColors.salmon),
                  ),
                  const SizedBox(width: 12),
                  const Text('Guayaba',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.charcoal)),
                ],
              ),
            ),
            const SizedBox(height: 20),
            // ─── Balance Card ────────
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.charcoal,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Saldo disponible',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white.withValues(alpha: 0.6))),
                  const SizedBox(height: 6),
                  const Text('Bs. 0,00',
                      style: TextStyle(fontSize: 36, fontWeight: FontWeight.w800, color: Colors.white)),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Icon(Icons.trending_up, size: 16, color: AppColors.successGreen),
                      const SizedBox(width: 6),
                      const Text('Hoy: Bs. 0',
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.successGreen)),
                      const SizedBox(width: 20),
                      const Icon(Icons.people_outline, size: 16, color: AppColors.grayNeutral),
                      const SizedBox(width: 6),
                      const Text('0 pasajeros',
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.grayNeutral)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // ─── Stats Grid ──────────
            const Text('Resumen del día',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.charcoal)),
            const SizedBox(height: 14),
            Row(
              children: [
                _StatCard(icon: Icons.directions_bus, label: 'Viajes', value: '0', color: AppColors.salmon),
                const SizedBox(width: 12),
                _StatCard(icon: Icons.attach_money, label: 'Ingresos', value: 'Bs. 0', color: AppColors.successGreen),
                const SizedBox(width: 12),
                _StatCard(icon: Icons.star_outline, label: 'Rating', value: '—', color: AppColors.salmonLight),
              ],
            ),
            const SizedBox(height: 24),
            const RecentTripsSection(),
          ],
        ),
      ),
        ),
      ),
      floatingActionButton: Container(
        margin: const EdgeInsets.only(bottom: 60),
        child: session.isActive
            // ─── State 3: Session active → Finalizar Jornada ───
            ? FloatingActionButton.extended(
                onPressed: () => _showEndSessionSheet(context, ref),
                backgroundColor: const Color(0xFFE53935),
                elevation: 8,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                icon: const Icon(Icons.stop_circle_outlined, color: Colors.white),
                label: const Text(
                  'Finalizar Jornada',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                ),
              )
            : !qrDownloaded
                // ─── State 1: QR not downloaded → Generar QR ───
                ? FloatingActionButton.extended(
                    onPressed: () => context.push('/generate-qr'),
                    backgroundColor: AppColors.charcoal,
                    elevation: 8,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    icon: const Icon(Icons.qr_code, color: Colors.white),
                    label: const Text(
                      'Generar QR',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                    ),
                  )
                // ─── State 2: QR downloaded → ¡Dale Guaya! ───
                : FloatingActionButton.extended(
                    onPressed: () {
                      final user = ref.read(authProvider).state.user;
                      ref.read(driverSessionProvider).startSession(driverId: user?.id ?? 0);
                    },
                    backgroundColor: AppColors.salmon,
                    elevation: 8,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    icon: const Icon(Icons.qr_code_scanner, color: Colors.white),
                    label: const Text(
                      '¡Dale Guaya!',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: 0.5),
                    ),
                  ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }

  void _showEndSessionSheet(BuildContext context, WidgetRef ref) {
    final session = ref.read(driverSessionProvider).state;

    showAppBottomSheet(
      context: context,
      initialSize: 0.35,
      minSize: 0.25,
      maxSize: 0.45,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.warning_amber_rounded, size: 48, color: Color(0xFFE53935)),
            const SizedBox(height: 12),
            const Text(
              '¿Finalizar jornada?',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.charcoal),
            ),
            const SizedBox(height: 8),
            Text(
              'Pasajeros atendidos: ${session.passengerCount}',
              style: const TextStyle(fontSize: 15, color: AppColors.grayNeutral),
            ),
            const SizedBox(height: 24),
            GradientButton(
              label: 'Finalizar',
              onPressed: () {
                ref.read(driverSessionProvider).endSession();
                Navigator.of(context).pop();
              },
              colors: const [Color(0xFFE53935), Color(0xFFEF5350)],
            ),
            const SizedBox(height: 10),
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text(
                'Cancelar',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.grayNeutral),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatCard({required this.icon, required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.bgLightGray,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderLightGray),
        ),
        child: Column(
          children: [
            Container(
              width: 40, height: 40,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, size: 22, color: color),
            ),
            const SizedBox(height: 10),
            Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.charcoal)),
            const SizedBox(height: 2),
            Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.grayNeutral)),
          ],
        ),
      ),
    );
  }
}
