import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/colors.dart';

/// Bottom tab shell for passenger screens
class PassengerShell extends StatelessWidget {
  final Widget child;
  const PassengerShell({super.key, required this.child});

  static const _tabs = [
    _TabItem('/home', Icons.home_outlined, Icons.home, 'Inicio'),
    _TabItem('/payments', Icons.account_balance_wallet_outlined, Icons.account_balance_wallet, 'Pagos'),
    _TabItem('/pay-fare', Icons.qr_code, Icons.qr_code, ''),
    _TabItem('/ai-route', Icons.smart_toy_outlined, Icons.smart_toy, 'IA'),
    _TabItem('/rewards', Icons.show_chart, Icons.show_chart, 'Recompensas'),
  ];

  int _currentIndex(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    for (var i = 0; i < _tabs.length; i++) {
      if (location == _tabs[i].path) return i;
    }
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final idx = _currentIndex(context);
    final bottomPad = MediaQuery.of(context).padding.bottom;

    return Scaffold(
      body: child,
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
            final isCenter = i == 2;
            final isActive = idx == i;

            if (isCenter) {
              return GestureDetector(
                onTap: () => context.push('/pay-fare'),
                child: Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: AppColors.salmon,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(color: AppColors.salmon.withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 4)),
                    ],
                  ),
                  child: const Icon(Icons.qr_code, color: Colors.white, size: 26),
                ),
              );
            }

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
