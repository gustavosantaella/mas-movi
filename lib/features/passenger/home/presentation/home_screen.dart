import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/colors.dart';
import '../../../shared/profile/presentation/profile_screen.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // final user = ref.watch(authProvider).state.user; // TODO: wire real balance

    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ─── Header ─────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () => openProfileSheet(context, ref),
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppColors.salmon.withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.person, size: 22, color: AppColors.salmon),
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'Guayaba',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: AppColors.charcoal,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // ─── Balance Card (salmon gradient) ─────────
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppColors.salmon, AppColors.salmonLight],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.salmon.withValues(alpha: 0.3),
                        blurRadius: 20,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Stack(
                    children: [
                      // Decorative circle top-right
                      Positioned(
                        top: -20,
                        right: -20,
                        child: Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white.withValues(alpha: 0.1),
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(24, 24, 24, 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Saldo Disponible',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: Colors.white.withValues(alpha: 0.85),
                              ),
                            ),
                            const SizedBox(height: 4),
                            const Row(
                              children: [
                                Text(
                                  'Bs.',
                                  style: TextStyle(
                                    fontSize: 28,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.white,
                                  ),
                                ),
                                Text(
                                  '45.80',
                                  style: TextStyle(
                                    fontSize: 38,
                                    fontWeight: FontWeight.w900,
                                    color: Colors.white,
                                    letterSpacing: -1,
                                  ),
                                ),
                                Spacer(),
                                Icon(Icons.account_balance_wallet, size: 28, color: Colors.white),
                              ],
                            ),
                            const SizedBox(height: 16),
                            // Recargar button
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.account_balance_wallet_outlined, size: 18, color: AppColors.salmon),
                                  SizedBox(width: 8),
                                  Text(
                                    'Recargar Monedero',
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.salmon,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // ─── Quick Actions (2 cards) ────────────
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  children: [
                    _QuickActionCard(
                      icon: Icons.auto_awesome,
                      iconBgColor: const Color(0xFFF0EAFF),
                      iconColor: const Color(0xFF7C5CFC),
                      label: 'Análisis con IA',
                      onTap: () => context.go('/ai-route'),
                    ),
                    const SizedBox(width: 14),
                    _QuickActionCard(
                      icon: Icons.trending_up,
                      iconBgColor: const Color(0xFFE0F7F0),
                      iconColor: AppColors.successGreen,
                      label: 'Estadísticas',
                      onTap: () {},
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),

              // ─── Recent Activity Header ─────────
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Actividad Reciente',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.charcoal,
                      ),
                    ),
                    GestureDetector(
                      onTap: () => context.push('/trip-history'),
                      child: const Text(
                        'Ver todo >',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.salmon,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 14),

              // ─── Activity Items ─────────
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  children: [
                    _ActivityItem(
                      icon: Icons.directions_bus,
                      iconBgColor: AppColors.salmon.withValues(alpha: 0.12),
                      iconColor: AppColors.salmon,
                      title: 'Viaje',
                      subtitle: 'Metro Línea 1: Plaza Venezu...',
                      date: 'Hoy, 08:45',
                      amount: '-Bs. 2.50',
                      amountColor: AppColors.charcoal,
                    ),
                    const SizedBox(height: 10),
                    _ActivityItem(
                      icon: Icons.account_balance_wallet,
                      iconBgColor: AppColors.successGreen.withValues(alpha: 0.12),
                      iconColor: AppColors.successGreen,
                      title: 'Recarga',
                      subtitle: 'Pago Móvil Mercantil •••• 4532',
                      date: 'Ayer, 18:30',
                      amount: '+Bs. 50',
                      amountColor: AppColors.successGreen,
                    ),
                    const SizedBox(height: 10),
                    _ActivityItem(
                      icon: Icons.directions_bus,
                      iconBgColor: AppColors.salmon.withValues(alpha: 0.12),
                      iconColor: AppColors.salmon,
                      title: 'Viaje',
                      subtitle: 'Metrobús: Altamira → Los Pa...',
                      date: '14 Mar, 14:20',
                      amount: '-Bs. 1.80',
                      amountColor: AppColors.charcoal,
                    ),
                  ],
                ),
              ),

              // Bottom padding for tab bar
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Quick Action Card ────────────────
class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final Color iconBgColor;
  final Color iconColor;
  final String label;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.icon,
    required this.iconBgColor,
    required this.iconColor,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppColors.borderLightGray),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: iconBgColor,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, size: 24, color: iconColor),
              ),
              const SizedBox(height: 10),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.charcoal,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Activity Item ────────────────────
class _ActivityItem extends StatelessWidget {
  final IconData icon;
  final Color iconBgColor;
  final Color iconColor;
  final String title;
  final String subtitle;
  final String date;
  final String amount;
  final Color amountColor;

  const _ActivityItem({
    required this.icon,
    required this.iconBgColor,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.date,
    required this.amount,
    required this.amountColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLightGray),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: iconBgColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, size: 22, color: iconColor),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.charcoal,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(fontSize: 12, color: AppColors.grayNeutral),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  date,
                  style: TextStyle(
                    fontSize: 11,
                    color: AppColors.grayNeutral.withValues(alpha: 0.7),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(
            amount,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: amountColor,
            ),
          ),
        ],
      ),
    );
  }
}
