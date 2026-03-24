import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:uuid/uuid.dart';
import '../../../../services/ble/ble_driver_service.dart';
import '../../../../core/theme/colors.dart';
import '../../../auth/providers/auth_provider.dart';

class GenerateQrScreen extends ConsumerStatefulWidget {
  const GenerateQrScreen({super.key});

  @override
  ConsumerState<GenerateQrScreen> createState() => _GenerateQrScreenState();
}

class _GenerateQrScreenState extends ConsumerState<GenerateQrScreen>
    with TickerProviderStateMixin {
  late final String _sessionId;
  late final BleDriverService _bleService;
  int _passengerCount = 0;

  // Toast animation
  final List<_ToastEntry> _toasts = [];

  @override
  void initState() {
    super.initState();
    _sessionId = const Uuid().v4();
    _bleService = BleDriverService(
      sessionId: _sessionId.substring(0, 8),
    );
    _bleService.onPaymentReceived.listen((data) {
      _onPaymentReceived(
        passengerName: data['passengerName'] ?? 'Pasajero',
      );
    });
    _bleService.start();
  }

  @override
  void dispose() {
    _bleService.dispose();
    for (final t in _toasts) {
      t.controller.dispose();
    }
    super.dispose();
  }

  void _onPaymentReceived({String passengerName = 'Pasajero'}) {
    setState(() => _passengerCount++);

    final ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    final entry = _ToastEntry(
      controller: ctrl,
      name: passengerName,
      amount: 'Bs. 1,50',
      count: _passengerCount,
    );

    setState(() => _toasts.add(entry));
    ctrl.forward();

    Future.delayed(const Duration(seconds: 3), () {
      ctrl.reverse().then((_) {
        if (mounted) {
          setState(() => _toasts.remove(entry));
          ctrl.dispose();
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).state.user;
    final driverId = user?.id ?? 0;

    final qrData =
        '{"driverId":$driverId,"fare":1.5,"sessionId":"$_sessionId","ts":${DateTime.now().millisecondsSinceEpoch}}';

    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: SafeArea(
        child: Stack(
          children: [
            // ─── Main content ─────────────────────────
            Column(
              children: [
                // ─── Header ───────────────────────────
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                  child: Row(
                    children: [
                      GestureDetector(
                        onTap: () => Navigator.of(context).pop(),
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.charcoal.withValues(alpha: 0.06),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.arrow_back_ios_new,
                              size: 18, color: AppColors.charcoal),
                        ),
                      ),
                      const Expanded(
                        child: Text(
                          'Cobrar pasaje',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: AppColors.charcoal,
                            letterSpacing: -0.3,
                          ),
                        ),
                      ),
                      // Passenger counter badge
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppColors.successGreen.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.people_outline,
                                size: 16, color: AppColors.successGreen),
                            const SizedBox(width: 4),
                            Text(
                              '$_passengerCount',
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: AppColors.successGreen,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // ─── Body ─────────────────────────────
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Fare card
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 24, vertical: 20),
                        decoration: BoxDecoration(
                          color: AppColors.charcoal,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Column(
                          children: [
                            Text(
                              'Tarifa del pasaje',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: Colors.white.withValues(alpha: 0.6),
                              ),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'Bs. 1,50',
                              style: TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 28),

                      // QR container
                      Container(
                          padding: const EdgeInsets.all(5),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(24),
                            gradient: const LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: AppGradients.salmonButton,
                            ),
                          ),
                          child: Container(
                            padding: const EdgeInsets.all(18),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: QrImageView(
                              data: qrData,
                              size: 200,
                              version: QrVersions.auto,
                              eyeStyle: const QrEyeStyle(
                                eyeShape: QrEyeShape.square,
                                color: AppColors.charcoal,
                              ),
                              dataModuleStyle: const QrDataModuleStyle(
                                dataModuleShape: QrDataModuleShape.square,
                                color: AppColors.charcoal,
                              ),
                            ),
                          ),
                      ),
                      const SizedBox(height: 24),

                      const Text(
                        'Muestra este QR a los pasajeros',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppColors.charcoal,
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Se renueva automáticamente',
                        style: TextStyle(
                          fontSize: 13,
                          color: AppColors.grayNeutral,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Status
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 40),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: AppColors.bgLightGray,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.borderLightGray),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: AppColors.successGreen,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: AppColors.successGreen
                                        .withValues(alpha: 0.5),
                                    blurRadius: 6,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 10),
                            const Text(
                              'Listo para cobrar',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppColors.charcoal,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // ─── Stacked toasts (top) ─────────────────
            Positioned(
              top: 8,
              left: 16,
              right: 16,
              child: Column(
                children: _toasts.map((t) => _PaymentToast(entry: t)).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Toast data ─────────────────────────────────────────
class _ToastEntry {
  final AnimationController controller;
  final String name;
  final String amount;
  final int count;

  _ToastEntry({
    required this.controller,
    required this.name,
    required this.amount,
    required this.count,
  });
}

// ─── Toast widget ───────────────────────────────────────
class _PaymentToast extends StatelessWidget {
  final _ToastEntry entry;
  const _PaymentToast({required this.entry});

  @override
  Widget build(BuildContext context) {
    final slide = Tween<Offset>(
      begin: const Offset(0, -1.5),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: entry.controller,
      curve: Curves.easeOutBack,
      reverseCurve: Curves.easeIn,
    ));

    final fade = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: entry.controller, curve: Curves.easeOut),
    );

    return SlideTransition(
      position: slide,
      child: FadeTransition(
        opacity: fade,
        child: Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: AppColors.successGreen,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: AppColors.successGreen.withValues(alpha: 0.35),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check, size: 20, color: Colors.white),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      '¡Pago recibido!',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${entry.name} · ${entry.amount}',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: Colors.white.withValues(alpha: 0.85),
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                '#${entry.count}',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: Colors.white.withValues(alpha: 0.7),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
