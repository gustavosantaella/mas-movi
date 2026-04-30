import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../../../services/socket/payment_socket_service.dart';
import '../../../../services/database/trip_service.dart';
import '../../../../services/trip/trip_repository.dart';
import '../../../../services/location/location_helper.dart';
import '../../../../core/theme/colors.dart';


import '../../../auth/providers/auth_provider.dart';
import '../../../shared/providers/trip_refresh_provider.dart';

class PayFareScreen extends ConsumerStatefulWidget {
  const PayFareScreen({super.key});

  @override
  ConsumerState<PayFareScreen> createState() => _PayFareScreenState();
}

class _PayFareScreenState extends ConsumerState<PayFareScreen> {
    final user = ref.watch(authProvider).state.user;
    final balance = user?.balance ?? 0.0;

    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: SafeArea(
        child: Column(
          children: [
            // ─── Header ────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
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
                      child: const Icon(Icons.arrow_back_ios_new, size: 18, color: AppColors.charcoal),
                    ),
                  ),
                  const Expanded(
                    child: Text(
                      'Pagar pasaje',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.charcoal, letterSpacing: -0.3),
                    ),
                  ),
                  const SizedBox(width: 34),
                ],
              ),
            ),

            // ─── Body ─────────────────────────────────
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  children: [
                    const SizedBox(height: 20),
                    // Hero icon
                    Container(
                      width: 130,
                      height: 130,
                      decoration: BoxDecoration(
                        color: AppColors.salmon.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Icon(Icons.qr_code_2_rounded, size: 64, color: AppColors.salmon.withValues(alpha: 0.8)),
                      ),
                    ),
                    const SizedBox(height: 24),

                    const Text(
                      'Selecciona Pasajes',
                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.charcoal, letterSpacing: -0.5),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      '¿Cuántos pasajes deseas pagar?',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: AppColors.grayNeutral),
                    ),
                    const SizedBox(height: 32),

                    // ─── Counter Card ────────────────────────
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 24),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: AppColors.borderLightGray.withValues(alpha: 0.5)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.03),
                            blurRadius: 20,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              _buildCounterBtn(Icons.remove, () {
                                if (_passengerCount > 1) setState(() => _passengerCount--);
                              }, isSmall: true),
                              const SizedBox(width: 24),
                              Column(
                                children: [
                                  Text(
                                    '$_passengerCount',
                                    style: const TextStyle(fontSize: 48, fontWeight: FontWeight.w900, color: AppColors.charcoal),
                                  ),
                                  Text(
                                    _passengerCount == 1 ? 'pasaje' : 'pasajes',
                                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.grayNeutral),
                                  ),
                                ],
                              ),
                              const SizedBox(width: 24),
                              _buildCounterBtn(Icons.add, () {
                                if (_passengerCount < 10) setState(() => _passengerCount++);
                              }, isSmall: true, isAdd: true),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 32),

                    // ─── Scan Button ────────────────────────
                    GestureDetector(
                      onTap: () => _openScanner(context, ref),
                      child: Container(
                        width: double.infinity,
                        height: 58,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [AppColors.salmon, AppColors.salmonLight],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.salmon.withValues(alpha: 0.3),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Text(
                            'Escanear QR',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 16),

                    // ─── Balance Card ───────────────────────
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.borderLightGray.withValues(alpha: 0.5)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.account_balance_wallet_outlined, size: 18, color: AppColors.charcoal.withValues(alpha: 0.6)),
                              const SizedBox(width: 8),
                              Text(
                                'Saldo disponible',
                                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.charcoal.withValues(alpha: 0.6)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Bs. ${balance.toStringAsFixed(2)}',
                            style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: AppColors.charcoal, letterSpacing: -0.5),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showMultiPassDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 20, 24, 24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 40, height: 4,
                      decoration: BoxDecoration(
                        color: AppColors.borderLightGray,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'Multipasaje',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.charcoal),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Selecciona cuántos pasajes deseas pagar',
                      style: TextStyle(fontSize: 14, color: AppColors.grayNeutral),
                    ),
                    const SizedBox(height: 32),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildCounterBtn(Icons.remove, () {
                          if (_passengerCount > 1) {
                            setModalState(() => _passengerCount--);
                            setState(() {});
                          }
                        }),
                        const SizedBox(width: 32),
                        Text(
                          '$_passengerCount',
                          style: const TextStyle(fontSize: 48, fontWeight: FontWeight.w900, color: AppColors.charcoal),
                        ),
                        const SizedBox(width: 32),
                        _buildCounterBtn(Icons.add, () {
                          if (_passengerCount < 10) {
                            setModalState(() => _passengerCount++);
                            setState(() {});
                          }
                        }),
                      ],
                    ),
                    const SizedBox(height: 40),
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: () => Navigator.pop(context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.salmon,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          elevation: 0,
                        ),
                        child: const Text('Confirmar', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }
        );
      },
    );
  }

  Widget _buildCounterBtn(IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 56, height: 56,
        decoration: BoxDecoration(
          color: AppColors.bgLightGray,
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: AppColors.charcoal, size: 28),
      ),
    );
  }

  void _openScanner(BuildContext context, WidgetRef ref) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => _QrScannerPage(
          passengerId: ref.read(authProvider).state.user?.id ?? 0,
          passengerCount: _passengerCount,
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════
//  QR Scanner Page — Scan & Auto-Pay
// ═══════════════════════════════════════════════════
class _QrScannerPage extends ConsumerStatefulWidget {
  final int passengerId;
  final int passengerCount;
  const _QrScannerPage({required this.passengerId, this.passengerCount = 1});

  @override
  ConsumerState<_QrScannerPage> createState() => _QrScannerPageState();
}

class _QrScannerPageState extends ConsumerState<_QrScannerPage> {
  final _controller = MobileScannerController(
    detectionSpeed: DetectionSpeed.normal,
    facing: CameraFacing.back,
  );
  bool _scanned = false;
  bool _processing = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture capture) {
    if (_scanned) return;
    final barcode = capture.barcodes.firstOrNull;
    if (barcode == null || barcode.rawValue == null) return;

    setState(() => _scanned = true);
    _controller.stop();

    // Try to parse QR data
    Map<String, dynamic>? qrData;
    try {
      qrData = jsonDecode(barcode.rawValue!) as Map<String, dynamic>;
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Código QR no válido'),
            backgroundColor: AppColors.salmon,
          ),
        );
        Navigator.of(context).pop();
      }
      return;
    }

    final driverId = qrData['driverId'];
    if (driverId == null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('QR no contiene datos del conductor'),
            backgroundColor: AppColors.salmon,
          ),
        );
        Navigator.of(context).pop();
      }
      return;
    }

    // Check driver status and auto-pay
    _checkAndPay(driverId, qrData);
  }

  /// Pay immediately — no driver-active check required.
  Future<void> _checkAndPay(
      dynamic driverId, Map<String, dynamic> qrData) async {
    setState(() => _processing = true);

    try {
      // Use driverId as the session room for fire-and-forget WS notification
      final sessionId = driverId.toString();
      final fareValue = qrData['amount'] ?? 1.50;
      final farePerPerson = fareValue is num ? fareValue.toDouble() : (double.tryParse(fareValue.toString()) ?? 1.50);
      final amount = farePerPerson * widget.passengerCount;

      // Get current location
      final position = await LocationHelper.getCurrentPosition();
      final lat = position?.latitude ?? 0.0;
      final lng = position?.longitude ?? 0.0;
      String? address;
      if (lat != 0.0 && lng != 0.0) {
        address = await LocationHelper.getAddress(lat, lng);
      }

      // 1. Create & complete trip in SQLite
      final parsedDriverId = driverId is int ? driverId : int.tryParse(driverId.toString());
      final now = DateTime.now();
      
      final tripId = await TripService.createTrip(
        boardingLat: lat,
        boardingLong: lng,
        driverId: parsedDriverId,
        passengerId: widget.passengerId,
        sessionId: sessionId,
        directionFrom: address,
      );

      await TripService.completeTrip(
        tripId: tripId,
        landingLat: lat,
        landingLong: lng,
        amount: amount,
        directionTo: address,
      );

      // 1b. Save trip to backend
      try {
        final tripRepo = TripRepository();
        await tripRepo.saveTrip(
          boardingLat: lat,
          boardingLong: lng,
          landingLat: lat,
          landingLong: lng,
          driverId: parsedDriverId,
          passengerId: widget.passengerId,
          sessionId: sessionId,
          amount: amount,
          directionFrom: address,
          directionTo: address,
          status: 'completed',
          boardedAt: now,
          landedAt: now,
          passengerCount: widget.passengerCount,
        );
      } catch (e) {
        // Silently fail to not break the successful payment UX
      }

      // 2. Fire-and-forget WebSocket notification (driver may or may not be online)
      try {
        final socketService = PaymentSocketService();
        socketService.connect();
        await Future.delayed(const Duration(milliseconds: 500));
        socketService.passengerPay(
          sessionId: sessionId,
          passengerId: widget.passengerId,
          amount: amount,
          lat: lat,
          lng: lng,
        );
        await Future.delayed(const Duration(milliseconds: 300));
        socketService.dispose();
      } catch (_) {
        // Best-effort — driver doesn't need to be online
      }

      if (!mounted) return;

      // 3. Trigger activity list refresh and update balance
      ref.read(tripRefreshProvider.notifier).state++;
      await ref.read(authProvider.notifier).refreshProfile();

      // 4. Show success overlay and pop back
      await _showSuccessOverlay(amount);

    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error al procesar pago: $e'),
            backgroundColor: const Color(0xFFE53935),
          ),
        );
        Navigator.of(context).pop();
      }
    }
  }

  /// Full-screen success overlay with animation.
  Future<void> _showSuccessOverlay(double amount) async {
    await showDialog(
      context: context,
      barrierDismissible: false,
      barrierColor: Colors.black.withValues(alpha: 0.7),
      builder: (_) => _SuccessOverlay(amount: amount),
    );

    // Pop all the way back to passenger home
    if (mounted) {
      Navigator.of(context).popUntil((route) => route.isFirst);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scanArea = MediaQuery.of(context).size.width * 0.7;

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Camera
          MobileScanner(
            controller: _controller,
            onDetect: _onDetect,
          ),

          // Overlay
          CustomPaint(
            size: MediaQuery.of(context).size,
            painter: _ScanOverlayPainter(scanAreaSize: scanArea),
          ),

          // Top bar
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.arrow_back,
                          size: 22, color: Colors.white),
                    ),
                  ),
                  const Expanded(
                    child: Text(
                      'Escáner QR',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () => _controller.toggleTorch(),
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.flash_on,
                          size: 22, color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Bottom hint
          Positioned(
            bottom: 80,
            left: 0,
            right: 0,
            child: Center(
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.6),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  'Escanea el QR y se paga automáticamente',
                  style: TextStyle(
                      fontSize: 14,
                      color: Colors.white,
                      fontWeight: FontWeight.w500),
                ),
              ),
            ),
          ),

          // Processing indicator
          if (_processing)
            Container(
              color: Colors.black.withValues(alpha: 0.6),
              child: const Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircularProgressIndicator(color: AppColors.salmon),
                    SizedBox(height: 16),
                    Text(
                      'Procesando pago...',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

// ─── Scan overlay painter ────────────────────────────────
class _ScanOverlayPainter extends CustomPainter {
  final double scanAreaSize;
  _ScanOverlayPainter({required this.scanAreaSize});

  @override
  void paint(Canvas canvas, Size size) {
    final bgPaint = Paint()..color = Colors.black.withValues(alpha: 0.5);
    final borderPaint = Paint()
      ..color = AppColors.salmon
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;

    final left = (size.width - scanAreaSize) / 2;
    final top = (size.height - scanAreaSize) / 2;
    final scanRect =
        RRect.fromRectAndRadius(
          Rect.fromLTWH(left, top, scanAreaSize, scanAreaSize),
          const Radius.circular(20),
        );

    // Dark overlay with cutout
    final path = Path()
      ..addRect(Rect.fromLTWH(0, 0, size.width, size.height))
      ..addRRect(scanRect)
      ..fillType = PathFillType.evenOdd;
    canvas.drawPath(path, bgPaint);

    // Border
    canvas.drawRRect(scanRect, borderPaint);

    // Corner accents
    const cornerLen = 30.0;
    final accentPaint = Paint()
      ..color = AppColors.salmon
      ..style = PaintingStyle.stroke
      ..strokeWidth = 5
      ..strokeCap = StrokeCap.round;

    // Top-left
    canvas.drawLine(Offset(left + 10, top), Offset(left + cornerLen, top), accentPaint);
    canvas.drawLine(Offset(left, top + 10), Offset(left, top + cornerLen), accentPaint);
    // Top-right
    canvas.drawLine(Offset(left + scanAreaSize - cornerLen, top), Offset(left + scanAreaSize - 10, top), accentPaint);
    canvas.drawLine(Offset(left + scanAreaSize, top + 10), Offset(left + scanAreaSize, top + cornerLen), accentPaint);
    // Bottom-left
    canvas.drawLine(Offset(left + 10, top + scanAreaSize), Offset(left + cornerLen, top + scanAreaSize), accentPaint);
    canvas.drawLine(Offset(left, top + scanAreaSize - cornerLen), Offset(left, top + scanAreaSize - 10), accentPaint);
    // Bottom-right
    canvas.drawLine(Offset(left + scanAreaSize - cornerLen, top + scanAreaSize), Offset(left + scanAreaSize - 10, top + scanAreaSize), accentPaint);
    canvas.drawLine(Offset(left + scanAreaSize, top + scanAreaSize - cornerLen), Offset(left + scanAreaSize, top + scanAreaSize - 10), accentPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// ═══════════════════════════════════════════════════
//  Success Overlay — animated confirmation
// ═══════════════════════════════════════════════════
class _SuccessOverlay extends StatefulWidget {
  final double amount;
  const _SuccessOverlay({required this.amount});

  @override
  State<_SuccessOverlay> createState() => _SuccessOverlayState();
}

class _SuccessOverlayState extends State<_SuccessOverlay>
    with SingleTickerProviderStateMixin {
  late AnimationController _animCtrl;
  late Animation<double> _scale;
  late Animation<double> _opacity;

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _scale = CurvedAnimation(parent: _animCtrl, curve: Curves.elasticOut);
    _opacity = CurvedAnimation(parent: _animCtrl, curve: Curves.easeIn);
    _animCtrl.forward();

    // Auto-dismiss after 2 seconds
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) Navigator.of(context).pop();
    });
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _opacity,
      child: Center(
        child: ScaleTransition(
          scale: _scale,
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 40),
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(28),
              boxShadow: [
                BoxShadow(
                  color: AppColors.successGreen.withValues(alpha: 0.3),
                  blurRadius: 30,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Check icon
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: AppColors.successGreen.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_circle,
                    size: 52,
                    color: AppColors.successGreen,
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  '¡Pago exitoso!',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: AppColors.charcoal,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Bs. ${widget.amount.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                    color: AppColors.successGreen,
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Tu pasaje ha sido pagado',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.grayNeutral,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
