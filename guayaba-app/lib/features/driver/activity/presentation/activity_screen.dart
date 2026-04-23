import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/colors.dart';
import '../../../../shared/widgets/screen_layout.dart';
import '../../../shared/profile/presentation/profile_screen.dart';
import '../../../../shared/widgets/recent_trips_section.dart';

class ActivityScreen extends ConsumerWidget {
  const ActivityScreen({super.key});

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

            const Text('Actividad',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.charcoal)),
            const SizedBox(height: 16),

            const Expanded(
              child: SingleChildScrollView(
                child: RecentTripsSection(role: 'driver'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
