import 'package:flutter/material.dart';
import '../../../../core/theme/colors.dart';
import '../../../../shared/widgets/screen_layout.dart';

class TripHistoryScreen extends StatelessWidget {
  const TripHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: ScreenLayout(
        child: Column(
          children: [
            ScreenHeader(title: 'Historial de viajes', onBack: () => Navigator.of(context).pop()),
            const SizedBox(height: 40),
            const Icon(Icons.directions_bus, size: 48, color: AppColors.grayNeutral),
            const SizedBox(height: 16),
            const Text('Sin viajes aún',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.charcoal)),
          ],
        ),
      ),
    );
  }
}
