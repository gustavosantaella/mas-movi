import 'package:flutter/material.dart';
import '../../../../../core/theme/colors.dart';
import '../../../../../shared/widgets/app_bottom_sheet.dart';

void showTransactionDetail({
  required BuildContext context,
  required Map<String, dynamic> transaction,
}) {
  // Logic to filter out null values as requested
  final fields = _getDisplayFields(transaction);

  showAppBottomSheet(
    context: context,
    initialSize: 0.6,
    child: Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Center(
            child: Text(
              'Detalle de Transacción',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: AppColors.charcoal,
              ),
            ),
          ),
          const SizedBox(height: 32),
          ...fields.entries.map((entry) => _buildDetailRow(entry.key, entry.value)).toList(),
          const SizedBox(height: 20),
        ],
      ),
    ),
  );
}

Map<String, String> _getDisplayFields(Map<String, dynamic> t) {
  final Map<String, String> result = {};

  if (t['uuid'] != null) result['ID Transacción'] = t['uuid'].toString();
  if (t['reference'] != null) result['Referencia'] = t['reference'].toString();
  
  // Format amount
  final amount = t['amount'] ?? 0;
  result['Monto'] = 'Bs. ${amount.toString()}';

  if (t['tax'] != null && t['tax'] != 0) {
    result['Impuesto'] = 'Bs. ${t['tax'].toString()}';
  }

  // Type label mapping
  final type = t['type'] ?? 'unknown';
  String typeLabel = type;
  if (type == 'transfer') typeLabel = 'Transferencia';
  if (type == 'recharge') typeLabel = 'Recarga';
  if (type == 'pgm') typeLabel = 'Pago de Pasaje';
  result['Tipo'] = typeLabel;

  if (t['from_bank'] != null) result['Banco'] = t['from_bank'].toString();
  if (t['extras'] != null && t['extras'].toString().isNotEmpty) {
    result['Notas'] = t['extras'].toString();
  }

  // Date
  if (t['created_at'] != null) {
    final date = DateTime.tryParse(t['created_at'])?.toLocal();
    if (date != null) {
      result['Fecha'] = '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
    }
  }

  return result;
}

Widget _buildDetailRow(String label, String value) {
  return Padding(
    padding: const EdgeInsets.only(bottom: 20),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 120,
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.grayNeutral,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppColors.charcoal,
            ),
          ),
        ),
      ],
    ),
  );
}
