import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_gallery_saver_plus/image_gallery_saver_plus.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../../core/theme/colors.dart';
import '../../../auth/providers/auth_provider.dart';
import '../../../shared/providers/settings_provider.dart';

class GenerateQrScreen extends ConsumerStatefulWidget {
  const GenerateQrScreen({super.key});

  @override
  ConsumerState<GenerateQrScreen> createState() => _GenerateQrScreenState();
}

class _GenerateQrScreenState extends ConsumerState<GenerateQrScreen> {
  final TextEditingController _amountController = TextEditingController();
  final GlobalKey qrKey = GlobalKey();
  bool _showQr = false;
  double _amount = 0.0;

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  void _generateQr() {
    final val = double.tryParse(_amountController.text);
    if (val == null || val <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Por favor ingresa un monto válido'),
          backgroundColor: AppColors.accent,
        ),
      );
      return;
    }
    setState(() {
      _amount = val;
      _showQr = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).state.user;
    final driverId = user?.id ?? 0;
    final qrData = '{"driverId":$driverId,"amount":$_amount}';

    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: SafeArea(
        child: Column(
          children: [
            // ─── Header ───────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () {
                      if (_showQr) {
                        setState(() => _showQr = false);
                      } else {
                        Navigator.of(context).pop();
                      }
                    },
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.charcoal.withValues(alpha: 0.06),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        _showQr ? Icons.close : Icons.arrow_back_ios_new,
                        size: 18,
                        color: AppColors.charcoal,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Text(
                      _showQr ? 'Tu Código QR' : 'Generar Pasaje',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
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

            // ─── Content ─────────────────
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.only(bottom: 40),
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: _showQr 
                    ? _buildQrView(qrData, driverId)
                    : _buildInputView(),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputView() {
    return Padding(
      key: const ValueKey('input'),
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          const SizedBox(height: 40),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.salmon.withValues(alpha: 0.05),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.qr_code_2_rounded, size: 64, color: AppColors.salmon),
          ),
          const SizedBox(height: 24),
          const Text(
            'Configura el monto',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w800,
              color: AppColors.charcoal,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Ingresa el costo del pasaje para generar el código que los pasajeros escanearán.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 15,
              color: AppColors.grayNeutral.withValues(alpha: 0.8),
              height: 1.5,
            ),
          ),
          const SizedBox(height: 40),
          
          // Amount Input
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.bgLightGray,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.borderLightGray, width: 2),
            ),
            child: TextField(
              controller: _amountController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: AppColors.charcoal),
              textAlign: TextAlign.center,
              decoration: const InputDecoration(
                hintText: '0.00',
                prefixText: 'Bs. ',
                border: InputBorder.none,
                hintStyle: TextStyle(color: AppColors.grayNeutral),
              ),
            ),
          ),
          
          const SizedBox(height: 40),
          
          // Accept Button
          SizedBox(
            width: double.infinity,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(18),
                gradient: const LinearGradient(colors: AppGradients.salmonButton),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.salmon.withValues(alpha: 0.35),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: _generateQr,
                  borderRadius: BorderRadius.circular(18),
                  child: const Padding(
                    padding: EdgeInsets.symmetric(vertical: 18),
                    child: Text(
                      'Generar Código QR',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQrView(String qrData, int driverId) {
    return Column(
      key: const ValueKey('qr'),
      children: [
        const SizedBox(height: 8),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40),
          child: Text(
            'Pasaje configurado en Bs. $_amount.\nImprímelo y pégalo en tu unidad.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: AppColors.grayNeutral.withValues(alpha: 0.8),
              height: 1.4,
            ),
          ),
        ),
        const SizedBox(height: 24),
        
        // QR Card
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(28),
              boxShadow: [
                BoxShadow(
                  color: AppColors.salmon.withValues(alpha: 0.2),
                  blurRadius: 30,
                  offset: const Offset(0, 12),
                ),
              ],
            ),
            child: RepaintBoundary(
              key: qrKey,
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(28),
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: AppGradients.salmonButton,
                  ),
                ),
                child: Container(
                  padding: const EdgeInsets.fromLTRB(28, 28, 28, 20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 28,
                            height: 28,
                            decoration: BoxDecoration(
                              color: AppColors.salmon.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.directions_bus, size: 16, color: AppColors.salmon),
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'Guayaba',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: AppColors.salmon,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Pagar Bs. $_amount',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: AppColors.charcoal,
                        ),
                      ),
                      const SizedBox(height: 20),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppColors.bgLightGray,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: QrImageView(
                          data: qrData,
                          size: 180,
                          version: QrVersions.auto,
                          eyeStyle: const QrEyeStyle(eyeShape: QrEyeShape.square, color: AppColors.charcoal),
                          dataModuleStyle: const QrDataModuleStyle(dataModuleShape: QrDataModuleShape.square, color: AppColors.charcoal),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.charcoal,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          'Conductor #$driverId',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
        
        const SizedBox(height: 28),
        
        // Download Button
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40),
          child: Container(
            width: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(18),
              gradient: const LinearGradient(colors: AppGradients.salmonButton),
              boxShadow: [
                BoxShadow(
                  color: AppColors.salmon.withValues(alpha: 0.35),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () => _downloadQr(context, ref, qrKey),
                borderRadius: BorderRadius.circular(18),
                child: const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.download_rounded, size: 22, color: Colors.white),
                      SizedBox(width: 10),
                      Text(
                        'Descargar QR',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
        
        const SizedBox(height: 32),
        
        // Instructions
        const _InstructionsCard(),
      ],
    );
  }

  Future<void> _downloadQr(BuildContext context, WidgetRef ref, GlobalKey qrKey) async {
    try {
      final boundary = qrKey.currentContext?.findRenderObject() as RenderRepaintBoundary?;
      if (boundary == null) return;
      final image = await boundary.toImage(pixelRatio: 3.0);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      if (byteData == null) return;
      final pngBytes = byteData.buffer.asUint8List();
      await ImageGallerySaverPlus.saveImage(Uint8List.fromList(pngBytes), quality: 100, name: 'guayaba_qr_${DateTime.now().millisecondsSinceEpoch}');
      await ref.read(settingsProvider).markQrDownloaded();
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Row(
              children: [
                Icon(Icons.check_circle, color: Colors.white, size: 20),
                SizedBox(width: 8),
                Text('QR guardado en la galería ✓', style: TextStyle(fontWeight: FontWeight.w600)),
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
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error al guardar: $e'),
            backgroundColor: const Color(0xFFE53935),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      }
    }
  }
}

class _InstructionsCard extends StatelessWidget {
  const _InstructionsCard();
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: AppColors.borderLightGray, width: 1.5),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: AppColors.salmon.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.lightbulb_outline, size: 18, color: AppColors.salmon),
                ),
                const SizedBox(width: 10),
                const Text('¿Cómo funciona?', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.charcoal)),
              ],
            ),
            const SizedBox(height: 20),
            const _InstructionStep(number: '1', color: AppColors.salmon, text: 'Descarga el Código QR e imprímelo'),
            const _InstructionStep(number: '2', color: Color(0xFF7C5CFC), text: 'Pégalo en una parte visible de tu unidad'),
            const _InstructionStep(number: '3', color: AppColors.successGreen, text: 'El pasajero escanea y paga el monto exacto configurado.', isLast: true),
          ],
        ),
      ),
    );
  }
}

class _InstructionStep extends StatelessWidget {
  final String number;
  final Color color;
  final String text;
  final bool isLast;
  const _InstructionStep({required this.number, required this.color, required this.text, this.isLast = false});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: isLast ? 0 : 18),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 30, height: 30,
            decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(10)),
            child: Center(child: Text(number, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: color))),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 5),
                  child: Text(text, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.charcoal, height: 1.4)),
                ),
                if (!isLast) Container(margin: const EdgeInsets.only(top: 10), height: 1, color: AppColors.borderLightGray),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
