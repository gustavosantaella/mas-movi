import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/colors.dart';
import '../../../../shared/widgets/screen_layout.dart';
import '../../../shared/profile/presentation/profile_screen.dart';

class DriverHomeScreen extends ConsumerWidget {
  const DriverHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: ScreenLayout(
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
            // ─── Recent Activity ─────
            const Text('Actividad reciente',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.charcoal)),
            const SizedBox(height: 14),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 40),
              decoration: BoxDecoration(
                color: AppColors.bgLightGray,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderLightGray),
              ),
              child: const Column(
                children: [
                  Icon(Icons.receipt_long, size: 40, color: AppColors.grayNeutral),
                  SizedBox(height: 12),
                  Text('No hay actividad aún',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.charcoal)),
                  SizedBox(height: 4),
                  Text('Genera un QR para empezar a cobrar pasajes',
                      style: TextStyle(fontSize: 13, color: AppColors.grayNeutral)),
                ],
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
