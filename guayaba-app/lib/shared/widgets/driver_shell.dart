import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/colors.dart';
import '../../features/driver/providers/driver_session_provider.dart';

/// Bottom tab shell for driver screens.
/// Listens for passenger payment events and shows a success alert.
class DriverShell extends ConsumerStatefulWidget {
  final Widget child;
  const DriverShell({super.key, required this.child});

  @override
  ConsumerState<DriverShell> createState() => _DriverShellState();
}

class _DriverShellState extends ConsumerState<DriverShell> {
  StreamSubscription? _paymentSub;

  static const _tabs = [
    _TabItem('/driver', Icons.home_outlined, Icons.home, 'Inicio'),
    _TabItem('/driver/activity', Icons.access_time_outlined, Icons.access_time_filled, 'Actividad'),
    _TabItem('/driver/payments', Icons.account_balance_wallet_outlined, Icons.account_balance_wallet, 'Pagos'),
    _TabItem('/driver/settings', Icons.settings_outlined, Icons.settings, 'Más'),
  ];

  @override
  void initState() {
    super.initState();
    // Listen for payment events globally
    final notifier = ref.read(driverSessionProvider);
    _paymentSub = notifier.onPaymentReceived.listen(_onPaymentReceived);
  }

  @override
  void dispose() {
    _paymentSub?.cancel();
    super.dispose();
  }

  void _onPaymentReceived(Map<String, dynamic> data) {
    if (!mounted) return;
    final amount = data['amount'] ?? 0;
    final passengerId = data['passengerId'] ?? '—';

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.payments, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('¡Pago recibido!',
                      style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                  Text('Pasajero #$passengerId  •  Bs. $amount',
                      style: TextStyle(fontSize: 12, color: Colors.white.withValues(alpha: 0.9))),
                ],
              ),
            ),
          ],
        ),
        backgroundColor: AppColors.successGreen,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        duration: const Duration(seconds: 4),
      ),
    );
  }

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
          Expanded(child: widget.child),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: const Border(top: BorderSide(color: AppColors.borderLightGray, width: 1)),
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
