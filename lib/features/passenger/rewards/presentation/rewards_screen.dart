import 'package:flutter/material.dart';
import '../../../../core/theme/colors.dart';
import '../../../../shared/widgets/screen_layout.dart';

class RewardsScreen extends StatelessWidget {
  const RewardsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: ScreenLayout(
        child: Column(
          children: [
            const ScreenHeader(title: 'Recompensas'),
            const SizedBox(height: 60),
            Container(
              width: 80, height: 80,
              decoration: BoxDecoration(
                color: AppColors.salmonLight.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.emoji_events, size: 40, color: AppColors.salmonLight),
            ),
            const SizedBox(height: 20),
            const Text('Recompensas',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.charcoal)),
            const SizedBox(height: 8),
            const Text('Acumula puntos con cada viaje y canjéalos',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: AppColors.grayNeutral)),
          ],
        ),
      ),
    );
  }
}
