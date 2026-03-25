import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../../../services/socket/payment_socket_service.dart';
import '../../../../services/database/trip_service.dart';
import '../../../../services/location/location_helper.dart';
import '../../../../core/theme/colors.dart';
import '../../../../core/constants.dart';
import '../../../auth/providers/auth_provider.dart';
import '../../../shared/providers/trip_refresh_provider.dart';

class PayFareScreen extends ConsumerWidget {
  const PayFareScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: SafeArea(
        child: Column(
          children: [
            // ─── Header ────────────────────────────────
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
                      'Pagar pasaje',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: AppColors.charcoal,
                        letterSpacing: -0.3,
                      ),
                    ),
                  ),
                  const SizedBox(width: 34),
                ],
              ),
            ),

            // ─── Body ─────────────────────────────────
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Hero icon
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      color: AppColors.salmon.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: AppGradients.salmonButton,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color:
                                  AppColors.salmon.withValues(alpha: 0.3),
                              blurRadius: 16,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Icon(Icons.qr_code_scanner,
                            size: 30, color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  const Text(
                    'Escanea y paga',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: AppColors.charcoal,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Apunta al QR del autobús y se paga automáticamente',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      color: AppColors.grayNeutral,
                    ),
                  ),
                  const SizedBox(height: 36),

                  // ─── Scan button ────────────────────────
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () => _openScanner(context, ref),
                        borderRadius: BorderRadius.circular(20),
                        child: Container(
                          padding: const EdgeInsets.all(18),
                          decoration: BoxDecoration(
                            color: AppColors.bgLightGray,
                            borderRadius: BorderRadius.circular(20),
                            border:
                                Border.all(color: AppColors.borderLightGray),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 52,
                                height: 52,
                                decoration: BoxDecoration(
                                  color:
                                      AppColors.salmon.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: const Icon(Icons.qr_code,
                                    size: 28, color: AppColors.salmon),
                              ),
                              const SizedBox(width: 16),
                              const Expanded(
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Abrir escáner',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w700,
                                        color: AppColors.charcoal,
                                      ),
                                    ),
                                    SizedBox(height: 3),
                                    Text(
                                      'Escanea el QR y se paga de una vez',
                                      style: TextStyle(
                                        fontSize: 13,
                                        color: AppColors.grayNeutral,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: AppColors.salmon
                                      .withValues(alpha: 0.08),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Icon(Icons.arrow_forward_ios,
                                    size: 14,
                                    color: AppColors.salmon
                                        .withValues(alpha: 0.7)),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),
                  // Fare info
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 40),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: AppColors.bgLightGray,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.borderLightGray),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.info_outline,
                            size: 16, color: AppColors.grayNeutral),
                        SizedBox(width: 8),
                        Text(
                          'Tarifa actual: Bs. 1,50',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.grayNeutral,
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
      ),
    );
  }

  void _openScanner(BuildContext context, WidgetRef ref) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => _QrScannerPage(
          passengerId: ref.read(authProvider).state.user?.id ?? 0,
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════
//  QR Scanner Page — Scan & Auto-Pay
// ═══════════════════════════════════════════════════
class _QrScannerPage extends StatefulWidget {
  final int passengerId;
  const _QrScannerPage({required this.passengerId});

  @override
  State<_QrScannerPage> createState() => _QrScannerPageState();
}

class _QrScannerPageState extends State<_QrScannerPage> {
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

  /// Verify driver is active, then pay immediately.
  Future<void> _checkAndPay(
      dynamic driverId, Map<String, dynamic> qrData) async {
    setState(() => _processing = true);

    try {
      final response = await Dio().get(
        '$apiBaseUrl/mobility/driver/$driverId/status',
      );

      if (!mounted) return;
      final data = response.data as Map<String, dynamic>;
      final isActive = data['active'] == true;

      if (!isActive) {
        // Show inactive dialog and go back
        await showDialog(
          context: context,
          barrierDismissible: false,
          builder: (_) => AlertDialog(
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20)),
            icon: const Icon(Icons.error_outline,
                size: 48, color: Color(0xFFE53935)),
            title: const Text('Conductor inactivo',
                style: TextStyle(fontWeight: FontWeight.w800)),
            content: const Text(
              'Este conductor no está en servicio en este momento. '
              'Intenta de nuevo o toma otra unidad.',
              textAlign: TextAlign.center,
            ),
            actionsAlignment: MainAxisAlignment.center,
            actions: [
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop(); // close dialog
                  if (mounted) Navigator.of(context).pop(); // close scanner
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE53935),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 32, vertical: 12),
                ),
                child: const Text('Entendido',
                    style: TextStyle(fontWeight: FontWeight.w700)),
              ),
            ],
          ),
        );
        return;
      }

      // ─── Driver is active → Auto-pay ──────────────────
      final sessionId = data['sessionId']?.toString() ?? '';
      final fare = qrData['fare'] ?? 1.50;
      final amount = fare is num ? fare.toDouble() : (double.tryParse(fare.toString()) ?? 1.50);

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

      // 2. Connect WebSocket & emit payment (driver gets +1)
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

      // Brief delay to let the WS message arrive
      await Future.delayed(const Duration(milliseconds: 300));
      socketService.dispose();

      if (!mounted) return;

      // 3. Trigger activity list refresh
      ProviderScope.containerOf(context).read(tripRefreshProvider.notifier).state++;

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
