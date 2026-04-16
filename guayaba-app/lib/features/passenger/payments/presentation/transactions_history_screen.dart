import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/theme/colors.dart';
import '../../../../core/network/api_client.dart';
import '../../../../shared/widgets/screen_layout.dart';
import './widgets/transaction_detail_bottom_sheet.dart';

class TransactionsHistoryScreen extends StatefulWidget {
  const TransactionsHistoryScreen({super.key});

  @override
  State<TransactionsHistoryScreen> createState() => _TransactionsHistoryScreenState();
}

class _TransactionsHistoryScreenState extends State<TransactionsHistoryScreen> {
  bool _loading = true;
  String? _error;
  List<dynamic> _transactions = [];

  @override
  void initState() {
    super.initState();
    _fetchTransactions();
  }

  Future<void> _fetchTransactions() async {
    setState(() { _loading = true; _error = null; });

    try {
      final api = ApiClient();
      final response = await api.dio.get('/mobility/transactions/me');
      final data = ApiClient.parseResponse(response);
      
      if (mounted) {
        setState(() {
          _transactions = data['data'] ?? [];
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Error al cargar las transacciones.';
          _loading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: ScreenHeader(
                title: 'Transacciones',
                onBack: () => Navigator.pop(context),
              ),
            ),
            
            Expanded(
              child: _buildContent(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContent() {
    if (_loading) {
      return const Center(child: CircularProgressIndicator(color: AppColors.salmon));
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 48, color: Colors.redAccent),
            const SizedBox(height: 16),
            Text(_error!),
            TextButton(onPressed: _fetchTransactions, child: const Text('Reintentar')),
          ],
        ),
      );
    }

    if (_transactions.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.history_toggle_off, size: 64, color: AppColors.grayNeutral.withValues(alpha: 0.3)),
            const SizedBox(height: 16),
            const Text(
              'No tienes transacciones aún',
              style: TextStyle(color: AppColors.grayNeutral, fontSize: 16),
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(20),
      itemCount: _transactions.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final t = _transactions[index];
        return _TransactionItem(
          transaction: t,
          onTap: () => showTransactionDetail(context: context, transaction: t),
        ).animate().fadeIn(delay: (index * 50).ms).slideX();
      },
    );
  }
}

class _TransactionItem extends StatelessWidget {
  final Map<String, dynamic> transaction;
  final VoidCallback onTap;

  const _TransactionItem({required this.transaction, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final type = transaction['type'] ?? 'unknown';
    final amount = transaction['amount'] ?? 0;
    
    IconData icon;
    Color color;
    String label;

    switch (type) {
      case 'transfer':
        icon = Icons.swap_horiz_rounded;
        color = AppColors.salmon;
        label = 'Transferencia';
        break;
      case 'recharge':
        icon = Icons.add_circle_outline_rounded;
        color = AppColors.successGreen;
        label = 'Recarga';
        break;
      case 'pgm':
        icon = Icons.directions_bus_rounded;
        color = AppColors.primary;
        label = 'Pago de Pasaje';
        break;
      default:
        icon = Icons.receipt_long_rounded;
        color = AppColors.grayNeutral;
        label = 'Otro';
    }

    final createdAt = transaction['created_at'] != null 
        ? DateTime.tryParse(transaction['created_at'])?.toLocal() 
        : null;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.bgLightGray,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderLightGray),
        ),
        child: Row(
          children: [
            Container(
              width: 48, height: 48,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.charcoal),
                  ),
                  if (createdAt != null)
                    Text(
                      '${createdAt.day}/${createdAt.month}/${createdAt.year}',
                      style: const TextStyle(fontSize: 12, color: AppColors.grayNeutral),
                    ),
                ],
              ),
            ),
            Text(
              'Bs. $amount',
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 16,
                color: type == 'recharge' ? AppColors.successGreen : AppColors.charcoal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
