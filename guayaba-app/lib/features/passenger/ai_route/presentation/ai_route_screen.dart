import 'package:flutter/material.dart';
import '../../../../core/theme/colors.dart';
import '../../../../shared/widgets/screen_layout.dart';

class AiRouteScreen extends StatelessWidget {
  const AiRouteScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: ScreenLayout(
        child: Column(
          children: [
            const ScreenHeader(title: 'Asistente IA'),
            const SizedBox(height: 60),
            Container(
              width: 80, height: 80,
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.smart_toy, size: 40, color: AppColors.primary),
            ),
            const SizedBox(height: 20),
            const Text('Asistente de rutas',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.charcoal)),
            const SizedBox(height: 8),
            const Text('Pregúntame cuál ruta tomar para llegar a tu destino',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: AppColors.grayNeutral)),
          ],
        ),
      ),
    );
  }
}
