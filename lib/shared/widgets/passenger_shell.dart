import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/colors.dart';
import '../../services/database/trip_service.dart';
import '../../services/socket/payment_socket_service.dart';
import '../../services/location/location_helper.dart';
import 'app_bottom_sheet.dart';
import 'gradient_button.dart';

/// Bottom tab shell for passenger screens.
/// Center button is dynamic: QR scan when no active trip, green $ when active.
class PassengerShell extends StatefulWidget {
  final Widget child;
  const PassengerShell({super.key, required this.child});

  @override
  State<PassengerShell> createState() => _PassengerShellState();
}

class _PassengerShellState extends State<PassengerShell> {
  Map<String, dynamic>? _activeTrip;

  static const _tabs = [
    _TabItem('/home', Icons.home_outlined, Icons.home, 'Inicio'),
    _TabItem('/payments', Icons.account_balance_wallet_outlined, Icons.account_balance_wallet, 'Pagos'),
    _TabItem('/pay-fare', Icons.qr_code, Icons.qr_code, ''), // placeholder, overridden by center
    _TabItem('/rewards', Icons.show_chart, Icons.show_chart, 'Recompensas'),
  ];

  @override
  void initState() {
    super.initState();
    _checkActiveTrip();
  }

  @override
  void didUpdateWidget(covariant PassengerShell oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Re-check when the child (route) changes
    _checkActiveTrip();
  }

  Future<void> _checkActiveTrip() async {
    final trip = await TripService.getActiveTrip();
    if (mounted) setState(() => _activeTrip = trip);
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
    final hasActiveTrip = _activeTrip != null;

    return Scaffold(
      body: widget.child,
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
            final isCenter = i == 2;
            final isActive = idx == i;

            if (isCenter) {
              return GestureDetector(
                onTap: () {
                  if (hasActiveTrip) {
                    _showPaymentSheet(context);
                  } else {
                    context.push('/pay-fare');
                  }
                },
                child: Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: hasActiveTrip ? AppColors.successGreen : AppColors.salmon,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: (hasActiveTrip ? AppColors.successGreen : AppColors.salmon)
                            .withValues(alpha: 0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(
                    hasActiveTrip ? Icons.attach_money : Icons.qr_code,
                    color: Colors.white,
                    size: 26,
                  ),
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

  void _showPaymentSheet(BuildContext context) {
    final trip = _activeTrip!;
    final from = trip['direction_from'] as String? ?? 'Ubicación desconocida';
    final driverId = trip['driver_id'];
    final tripId = trip['id'] as int;
    final sessionId = trip['session_id'] as String? ?? '';
    final passengerId = trip['passenger_id'] as int? ?? 0;
    // Default fare
    const fare = 1.50;

    showAppBottomSheet(
      context: context,
      initialSize: 0.42,
      minSize: 0.3,
      maxSize: 0.5,
      child: _ActiveTripPaymentSheet(
        tripId: tripId,
        from: from,
        driverId: driverId?.toString() ?? '—',
        fare: fare,
        sessionId: sessionId,
        passengerId: passengerId,
        onPaid: () {
          // Refresh the active trip state
          setState(() => _activeTrip = null);
        },
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

// ─── Payment Sheet for Active Trip ─────────────────────
class _ActiveTripPaymentSheet extends StatefulWidget {
  final int tripId;
  final String from;
  final String driverId;
  final double fare;
  final String sessionId;
  final int passengerId;
  final VoidCallback onPaid;

  const _ActiveTripPaymentSheet({
    required this.tripId,
    required this.from,
    required this.driverId,
    required this.fare,
    required this.sessionId,
    required this.passengerId,
    required this.onPaid,
  });

  @override
  State<_ActiveTripPaymentSheet> createState() => _ActiveTripPaymentSheetState();
}

class _ActiveTripPaymentSheetState extends State<_ActiveTripPaymentSheet> {
  bool _loading = false;

  Future<void> _handlePay() async {
    setState(() => _loading = true);
    try {
      // Get landing location
      final position = await LocationHelper.getCurrentPosition();
      final landingLat = position?.latitude ?? 0.0;
      final landingLong = position?.longitude ?? 0.0;
      String? directionTo;
      if (landingLat != 0.0 && landingLong != 0.0) {
        directionTo = await LocationHelper.getAddress(landingLat, landingLong);
      }

      // Send payment via WebSocket
      final socketService = PaymentSocketService();
      socketService.connect();
      await Future.delayed(const Duration(milliseconds: 500));
      socketService.passengerPay(
        sessionId: widget.sessionId,
        passengerId: widget.passengerId,
        amount: widget.fare,
        lat: landingLat,
        lng: landingLong,
      );

      // Complete the trip in SQLite
      await TripService.completeTrip(
        tripId: widget.tripId,
        landingLat: landingLat,
        landingLong: landingLong,
        amount: widget.fare,
        directionTo: directionTo,
      );

      await Future.delayed(const Duration(milliseconds: 300));
      socketService.dispose();

      if (mounted) {
        Navigator.of(context).pop();
        widget.onPaid();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Row(
              children: [
                Icon(Icons.check_circle, color: Colors.white, size: 20),
                SizedBox(width: 8),
                Text('¡Pago realizado con éxito!',
                    style: TextStyle(fontWeight: FontWeight.w600)),
              ],
            ),
            backgroundColor: AppColors.successGreen,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            margin: const EdgeInsets.all(16),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: const Color(0xFFE53935),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 8),
          Container(
            width: 64, height: 64,
            decoration: BoxDecoration(
              color: AppColors.successGreen.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.directions_bus, size: 32, color: AppColors.successGreen),
          ),
          const SizedBox(height: 16),
          const Text('Viaje en curso',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.charcoal)),
          const SizedBox(height: 6),
          Text(
            widget.from,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 14, color: AppColors.grayNeutral),
          ),
          const SizedBox(height: 16),

          // Fare card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.bgLightGray,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.borderLightGray),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Pasaje',
                        style: TextStyle(fontSize: 13, color: AppColors.grayNeutral)),
                    const SizedBox(height: 2),
                    Text('Conductor #${widget.driverId}',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.charcoal)),
                  ],
                ),
                Text(
                  'Bs. ${widget.fare.toStringAsFixed(2)}',
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.charcoal),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          GradientButton(
            label: 'Pagar pasaje',
            onPressed: _handlePay,
            loading: _loading,
          ),
          const SizedBox(height: 6),
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Continuar viaje',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.grayNeutral)),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}
