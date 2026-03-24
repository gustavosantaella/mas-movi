import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/colors.dart';
import '../../features/driver/providers/driver_session_provider.dart';

/// Bottom tab shell for driver screens
class DriverShell extends ConsumerWidget {
  final Widget child;
  const DriverShell({super.key, required this.child});

  static const _tabs = [
    _TabItem('/driver', Icons.home_outlined, Icons.home, 'Inicio'),
    _TabItem('/driver/activity', Icons.access_time_outlined, Icons.access_time_filled, 'Actividad'),
    _TabItem('/driver/payments', Icons.account_balance_wallet_outlined, Icons.account_balance_wallet, 'Pagos'),
    _TabItem('/driver/settings', Icons.settings_outlined, Icons.settings, 'Más'),
  ];

  int _currentIndex(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    for (var i = 0; i < _tabs.length; i++) {
      if (location == _tabs[i].path) return i;
    }
    return 0;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final idx = _currentIndex(context);
    final bottomPad = MediaQuery.of(context).padding.bottom;
    final session = ref.watch(driverSessionProvider).state;

    return Scaffold(
      body: Column(
        children: [
          // ─── Session status bar ──────────────
          if (session.isActive)
            Container(
              width: double.infinity,
              padding: EdgeInsets.only(
                top: MediaQuery.of(context).padding.top + 4,
                bottom: 6,
              ),
              decoration: const BoxDecoration(
                color: AppColors.successGreen,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 7, height: 7,
                    decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'En servicio  •  ${session.passengerCount} pasajeros',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          // ─── Screen content ──────────────────
          Expanded(child: child),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: AppColors.borderLightGray, width: 1)),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.06), offset: const Offset(0, -2), blurRadius: 8),
          ],
        ),
        padding: EdgeInsets.only(bottom: bottomPad, top: 8),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: List.generate(_tabs.length, (i) {
            final tab = _tabs[i];
            final isActive = idx == i;

            return GestureDetector(
              onTap: () => context.go(tab.path),
              behavior: HitTestBehavior.opaque,
              child: SizedBox(
                width: 60,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      isActive ? tab.activeIcon : tab.icon,
                      size: 24,
                      color: isActive ? AppColors.salmon : AppColors.grayNeutral,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      tab.label,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: isActive ? AppColors.salmon : AppColors.grayNeutral,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ),
      ),
    );
  }
}

class _TabItem {
  final String path;
  final IconData icon;
  final IconData activeIcon;
  final String label;
  const _TabItem(this.path, this.icon, this.activeIcon, this.label);
}
