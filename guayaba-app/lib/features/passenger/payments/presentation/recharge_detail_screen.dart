import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/colors.dart';
import '../../../../core/constants.dart';
import '../../../../shared/widgets/screen_layout.dart';

enum RechargeMethod { transfer, deposit, mobilePayment }

class RechargeDetailScreen extends StatelessWidget {
  final RechargeMethod method;

  const RechargeDetailScreen({super.key, required this.method});

  @override
  Widget build(BuildContext context) {
    final title = _getTitle();
    final subtitle = _getSubtitle();
    final icon = _getIcon();
    final iconColor = _getIconColor();
    final fields = _getFields();

    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      body: ScreenLayout(
        child: Column(
          children: [
            _buildHeader(context),
            const SizedBox(height: 24),
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.04),
                    blurRadius: 15,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Row(
                      children: [
                        Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(
                            color: iconColor.withValues(alpha: 0.8),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(icon, size: 24, color: Colors.white),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                title,
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.charcoal,
                                ),
                              ),
                              Text(
                                subtitle,
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: AppColors.grayNeutral,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F1F1)),
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: fields.map((f) => _buildCopyField(f.label, f.value)).toList(),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: () {
                  context.push('/payments/recharge/reference');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.salmon,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text(
                  'Ya Pagué',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF1F0),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFFFD1CF).withValues(alpha: 0.5)),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.lock_outline_rounded, size: 16, color: Color(0xFFE55C52)),
                  SizedBox(width: 8),
                  Text(
                    'Asegúrate de guardar el comprobante de pago',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFFE55C52),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      children: [
        GestureDetector(
          onTap: () => context.pop(),
          child: const Row(
            children: [
              Icon(Icons.arrow_back, size: 20, color: AppColors.charcoal),
              SizedBox(width: 8),
              Text(
                'Cambiar método de pago',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: AppColors.charcoal,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCopyField(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0xFFF9FAFB),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderLightGray.withValues(alpha: 0.5)),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: const TextStyle(fontSize: 12, color: AppColors.grayNeutral),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    value,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppColors.charcoal,
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              icon: const Icon(Icons.copy_rounded, size: 20, color: AppColors.grayNeutral),
              onPressed: () {
                Clipboard.setData(ClipboardData(text: value));
                // Show toast or snackbar
              },
            ),
          ],
        ),
      ),
    );
  }

  String _getTitle() {
    switch (method) {
      case RechargeMethod.transfer: return 'Datos para Transferencia';
      case RechargeMethod.deposit: return 'Datos para Depósito';
      case RechargeMethod.mobilePayment: return 'Datos para Pago Móvil';
    }
  }

  String _getSubtitle() {
    switch (method) {
      case RechargeMethod.transfer: return 'Copia los datos y realiza la transferencia';
      case RechargeMethod.deposit: return 'Copia los datos para realizar el depósito';
      case RechargeMethod.mobilePayment: return 'Copia los datos y realiza el pago móvil';
    }
  }

  IconData _getIcon() {
    switch (method) {
      case RechargeMethod.transfer: return Icons.account_balance_rounded;
      case RechargeMethod.deposit: return Icons.account_balance_wallet_rounded;
      case RechargeMethod.mobilePayment: return Icons.phone_android_rounded;
    }
  }

  Color _getIconColor() {
    switch (method) {
      case RechargeMethod.transfer: return AppColors.salmon;
      case RechargeMethod.deposit: return AppColors.primaryLight;
      case RechargeMethod.mobilePayment: return AppColors.primary;
    }
  }

  List<_Field> _getFields() {
    final amountStr = 'Bs. ${PaymentInfo.defaultRechargeAmount.toStringAsFixed(2)}';
    
    if (method == RechargeMethod.mobilePayment) {
      return [
        _Field('Banco Destino', PaymentInfo.bankName),
        _Field('RIF', PaymentInfo.rif),
        _Field('Teléfono', PaymentInfo.phone),
        _Field('Monto a Pagar', amountStr),
      ];
    }

    final montoLabel = method == RechargeMethod.transfer ? 'Monto a Transferir' : 'Monto a Depositar';

    return [
      _Field('Titular', PaymentInfo.holderName),
      _Field('Número de Cuenta', PaymentInfo.accountNumber),
      _Field('RIF', PaymentInfo.rif),
      _Field('Tipo de Cuenta', PaymentInfo.accountType),
      _Field('Banco Destino', PaymentInfo.bankName),
      _Field(montoLabel, amountStr),
    ];
  }
}

class _Field {
  final String label;
  final String value;
  _Field(this.label, this.value);
}
