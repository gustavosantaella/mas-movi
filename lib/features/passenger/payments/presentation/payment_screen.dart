import 'package:flutter/material.dart';
import '../../../../core/theme/colors.dart';
import '../../../../shared/widgets/screen_layout.dart';

class PaymentScreen extends StatelessWidget {
  const PaymentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: ScreenLayout(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const ScreenHeader(title: 'Pagos'),
            const SizedBox(height: 20),
            _PaymentOption(
              icon: Icons.qr_code,
              title: 'Escanear código QR',
              desc: 'Paga tu pasaje escaneando el QR del autobús',
              color: AppColors.salmon,
              onTap: () {},
            ),
            const SizedBox(height: 12),
            _PaymentOption(
              icon: Icons.account_balance_wallet,
              title: 'Mi billetera',
              desc: 'Consulta tu saldo y transacciones',
              color: AppColors.primary,
              onTap: () {},
            ),
          ],
        ),
      ),
    );
  }
}

class _PaymentOption extends StatelessWidget {
  final IconData icon;
  final String title;
  final String desc;
  final Color color;
  final VoidCallback onTap;

  const _PaymentOption({
    required this.icon, required this.title, required this.desc,
    required this.color, required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: AppColors.bgLightGray,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderLightGray),
        ),
        child: Row(
          children: [
            Container(
              width: 52, height: 52,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, size: 28, color: color),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.charcoal)),
                  const SizedBox(height: 3),
                  Text(desc, style: const TextStyle(fontSize: 13, color: AppColors.grayNeutral)),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, size: 20, color: AppColors.grayNeutral),
          ],
        ),
      ),
    );
  }
}
