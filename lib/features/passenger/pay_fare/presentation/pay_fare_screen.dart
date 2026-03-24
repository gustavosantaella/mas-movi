import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../../../services/socket/payment_socket_service.dart';
import '../../../../core/theme/colors.dart';
import '../../../../shared/widgets/app_bottom_sheet.dart';
import '../../../../shared/widgets/gradient_button.dart';
import '../../../auth/providers/auth_provider.dart';

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
                    'Escanear código QR',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: AppColors.charcoal,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Apunta al QR del autobús para pagar',
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
                                      'Se descontará de tu saldo',
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
//  QR Scanner Page
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
      // Not valid JSON — show error
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

    // Show confirmation sheet
    if (mounted) {
      Navigator.of(context).pop(); // close scanner
      _showPaymentConfirmation(context, qrData, widget.passengerId);
    }
  }

  void _showPaymentConfirmation(
      BuildContext context, Map<String, dynamic> qrData, int passengerId) {
    final fare = qrData['fare'] ?? '—';
    final driverId = qrData['driverId'] ?? '—';
    final sessionId = qrData['sessionId']?.toString() ?? '';

    // Connect and notify driver of scan (+1 counter)
    final socketService = PaymentSocketService();
    socketService.connect();
    Future.delayed(const Duration(milliseconds: 500), () {
      socketService.passengerScan(
        sessionId: sessionId,
        passengerId: passengerId,
      );
    });

    showAppBottomSheet(
      context: context,
      initialSize: 0.45,
      minSize: 0.35,
      maxSize: 0.55,
      child: _PaymentConfirmSheet(
        fare: fare.toString(),
        driverId: driverId.toString(),
        sessionId: sessionId,
        passengerId: passengerId,
        socketService: socketService,
      ),
    );
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
                  'Apunta al código QR del conductor',
                  style: TextStyle(
                      fontSize: 14,
                      color: Colors.white,
                      fontWeight: FontWeight.w500),
                ),
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
//  Payment confirmation bottom sheet
// ═══════════════════════════════════════════════════
class _PaymentConfirmSheet extends StatefulWidget {
  final String fare;
  final String driverId;
  final String sessionId;
  final int passengerId;
  final PaymentSocketService socketService;
  const _PaymentConfirmSheet({
    required this.fare,
    required this.driverId,
    required this.sessionId,
    required this.passengerId,
    required this.socketService,
  });

  @override
  State<_PaymentConfirmSheet> createState() => _PaymentConfirmSheetState();
}

class _PaymentConfirmSheetState extends State<_PaymentConfirmSheet> {
  bool _loading = false;

  @override
  void dispose() {
    widget.socketService.dispose();
    super.dispose();
  }

  Future<void> _confirmPayment() async {
    setState(() => _loading = true);
    try {
      // Send payment via WebSocket
      widget.socketService.passengerPay(
        sessionId: widget.sessionId,
        passengerId: widget.passengerId,
        amount: double.tryParse(widget.fare) ?? 1.50,
        lat: 0.0,  // TODO: get real location
        lng: 0.0,  // TODO: get real location
      );

      // Brief delay to let the WS message arrive
      await Future.delayed(const Duration(milliseconds: 300));

      if (mounted) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('¡Pago realizado con éxito!'),
            backgroundColor: AppColors.successGreen,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(e.toString()),
              backgroundColor: AppColors.salmon),
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
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: AppColors.successGreen.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check_circle_outline,
                size: 32, color: AppColors.successGreen),
          ),
          const SizedBox(height: 16),
          const Text(
            'Confirmar pago',
            style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: AppColors.charcoal),
          ),
          const SizedBox(height: 8),
          const Text(
            '¿Deseas pagar este pasaje?',
            textAlign: TextAlign.center,
            style: TextStyle(
                fontSize: 14, color: AppColors.grayNeutral, height: 1.4),
          ),
          const SizedBox(height: 20),

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
                const Text('Monto:', style: TextStyle(fontSize: 15, color: AppColors.grayNeutral)),
                Text(
                  'Bs. ${widget.fare}',
                  style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: AppColors.charcoal),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          GradientButton(
            label: 'Confirmar pago',
            onPressed: _confirmPayment,
            loading: _loading,
          ),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancelar',
                style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.grayNeutral)),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}
