import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/colors.dart';
import '../../../../shared/widgets/screen_layout.dart';

class RechargeScreen extends StatelessWidget {
  const RechargeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      body: ScreenLayout(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Row(
              children: [
                GestureDetector(
                  onTap: () => context.pop(),
                  child: const Row(
                    children: [
                      Icon(Icons.arrow_back, size: 20, color: AppColors.charcoal),
                      SizedBox(width: 8),
                      Text(
                        'Volver',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: AppColors.charcoal,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            const Text(
              '¿Cómo vas a pagar?',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w900,
                color: AppColors.charcoal,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Selecciona tu método de pago preferido',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: AppColors.grayNeutral,
              ),
            ),
            const SizedBox(height: 40),
            _RechargeMethodOption(
              icon: Icons.account_balance_rounded,
              title: 'Transferencia',
              desc: 'Transferencia bancaria directa',
              color: AppColors.salmon,
              onTap: () => context.push('/payments/recharge/detail?method=transfer'),
            ),
            const SizedBox(height: 16),
            _RechargeMethodOption(
              icon: Icons.account_balance_wallet_rounded,
              title: 'Depósito',
              desc: 'Depósito en efectivo o cheque',
              color: AppColors.primaryLight,
              onTap: () => context.push('/payments/recharge/detail?method=deposit'),
            ),
            const SizedBox(height: 16),
            _RechargeMethodOption(
              icon: Icons.phone_android_rounded,
              title: 'Pago Móvil',
              desc: 'Pago móvil interbancario',
              color: AppColors.primary,
              onTap: () => context.push('/payments/recharge/detail?method=mobilePayment'),
            ),
            const SizedBox(height: 32),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 24),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF1F0),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFFFD1CF).withValues(alpha: 0.5)),
              ),
              child: const Text(
                '💡 Todos los métodos de pago son seguros y verificados',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFFE55C52),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RechargeMethodOption extends StatelessWidget {
  final IconData icon;
  final String title;
  final String desc;
  final Color color;
  final VoidCallback onTap;

  const _RechargeMethodOption({
    required this.icon,
    required this.title,
    required this.desc,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.borderLightGray.withValues(alpha: 0.4)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.8),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 24, color: Colors.white),
            ),
            const SizedBox(width: 18),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppColors.charcoal,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    desc,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: AppColors.grayNeutral.withValues(alpha: 0.7),
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right_rounded,
              size: 24,
              color: AppColors.grayNeutral.withValues(alpha: 0.3),
            ),
          ],
        ),
      ),
    );
  }
}
