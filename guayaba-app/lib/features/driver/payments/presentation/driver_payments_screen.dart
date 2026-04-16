import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/colors.dart';
import '../../../../shared/widgets/screen_layout.dart';
import '../../../shared/profile/presentation/profile_screen.dart';

class DriverPaymentsScreen extends ConsumerWidget {
  const DriverPaymentsScreen({super.key});

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

            const Text('Pagos recibidos',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.charcoal)),
            const SizedBox(height: 16),

            // ─── Empty state card ────
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
                  Icon(Icons.account_balance_wallet_outlined, size: 40, color: AppColors.grayNeutral),
                  SizedBox(height: 12),
                  Text('Sin pagos aún',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.charcoal)),
                  SizedBox(height: 4),
                  Text('Los pagos de pasajeros aparecerán aquí',
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
