import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/colors.dart';
import '../../../../core/network/api_client.dart';
import '../../../../services/trip/trip_repository.dart';
import '../../../../shared/widgets/screen_layout.dart';

class PassengerStatsScreen extends ConsumerStatefulWidget {
  const PassengerStatsScreen({super.key});

  @override
  ConsumerState<PassengerStatsScreen> createState() => _PassengerStatsScreenState();
}

class _PassengerStatsScreenState extends ConsumerState<PassengerStatsScreen> {
  bool _loading = true;
  String? _error;
  List<dynamic> _transactions = [];
  List<Map<String, dynamic>> _trips = [];
  
  // Calculated stats
  double _totalSpent = 0;
  int _totalTrips = 0;
  double _totalRecharges = 0;
  double _spentThisMonth = 0;
  double _spentLastMonth = 0;
  Map<String, double> _spendingByMonth = {};

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final api = ApiClient();
      
      // Fetch Transactions
      final transResponse = await api.dio.get('/transactions/me');
      final transData = ApiClient.parseResponse(transResponse);
      final List<dynamic> transactions = transData['data'] ?? [];

      // Fetch Trips (for accurate trip counting)
      final trips = await TripRepository().getRecentTrips(role: 'passenger', limit: 100);
      
      _processStats(transactions, trips);

      if (mounted) {
        setState(() {
          _transactions = transactions;
          _trips = trips;
          _loading = false;
        });
      }
    } catch (e) {
      debugPrint('Error loading stats: $e');
      if (mounted) {
        setState(() {
          _error = 'No pudimos cargar tus estadísticas. Intenta de nuevo.';
          _loading = false;
        });
      }
    }
  }

  void _processStats(List<dynamic> transactions, List<Map<String, dynamic>> trips) {
    _totalSpent = 0;
    _totalTrips = 0;
    _totalRecharges = 0;
    _spentThisMonth = 0;
    _spentLastMonth = 0;
    _spendingByMonth = {};

    final now = DateTime.now();
    final firstDayLastMonth = DateTime(now.year, now.month - 1, 1);
    final sixMonthsAgo = DateTime(now.year, now.month - 5, 1);

    // 1. Process Trips for counting AND spending
    for (var trip in trips) {
      if (trip['status'] == 'completed') {
        _totalTrips++;
        
        final rawAmount = trip['amount'];
        double amount = 0.0;
        if (rawAmount is num) {
          amount = rawAmount.toDouble();
        } else if (rawAmount is String) {
          amount = double.tryParse(rawAmount) ?? 0.0;
        }
        
        _totalSpent += amount;

        final createdAtStr = trip['created_at'];
        if (createdAtStr != null) {
          final createdAt = DateTime.tryParse(createdAtStr);
          if (createdAt != null) {
            // This month vs last month comparison
            if (createdAt.year == now.year && createdAt.month == now.month) {
              _spentThisMonth += amount;
            } else if (createdAt.year == firstDayLastMonth.year && createdAt.month == firstDayLastMonth.month) {
              _spentLastMonth += amount;
            }

            if (createdAt.isAfter(sixMonthsAgo)) {
              final monthKey = DateFormat('MMM').format(createdAt);
              _spendingByMonth[monthKey] = (_spendingByMonth[monthKey] ?? 0) + amount;
            }
          }
        }
      }
    }

    // 2. Process Transactions only for recharges
    for (var t in transactions) {
      final type = t['type'];
      if (type == 'recharge') {
        final rawAmount = t['amount'];
        double amount = 0.0;
        if (rawAmount is num) {
          amount = rawAmount.toDouble();
        } else if (rawAmount is String) {
          amount = double.tryParse(rawAmount) ?? 0.0;
        }
        _totalRecharges += amount;
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
                title: 'Mis Estadísticas',
                onBack: () => Navigator.pop(context),
              ),
            ),
            Expanded(
              child: _loading 
                ? const Center(child: CircularProgressIndicator(color: AppColors.salmon))
                : _error != null
                  ? _buildError()
                  : _buildContent(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildError() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.bar_chart_outlined, size: 80, color: AppColors.borderLightGray),
            const SizedBox(height: 24),
            Text(
              _error!,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.grayNeutral, fontSize: 16),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _loadData,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.salmon,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('Reintentar', style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContent() {
    return RefreshIndicator(
      onRefresh: _loadData,
      color: AppColors.salmon,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSummaryCards(),
            const SizedBox(height: 24),
            _buildMonthlyComparison(),
            const SizedBox(height: 32),
            _buildSpendingChart(),
            const SizedBox(height: 32),
            _buildHighlights(),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryCards() {
    return Row(
      children: [
        Expanded(
          child: _SummaryCard(
            title: 'Gastado',
            value: 'Bs. ${_totalSpent.toStringAsFixed(1)}',
            subtitle: 'En pasajes',
            icon: Icons.payments_outlined,
            color: AppColors.salmon,
          ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.2),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _SummaryCard(
            title: 'Viajes',
            value: '$_totalTrips',
            subtitle: 'Realizados',
            icon: Icons.directions_bus_outlined,
            color: AppColors.primary,
          ).animate().fadeIn(duration: 400.ms, delay: 100.ms).slideY(begin: 0.2),
        ),
      ],
    );
  }

  Widget _buildMonthlyComparison() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.bgLightGray,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderLightGray),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Comparativa mensual',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15, color: AppColors.charcoal),
              ),
              Icon(
                _spentThisMonth <= _spentLastMonth ? Icons.trending_down : Icons.trending_up,
                color: _spentThisMonth <= _spentLastMonth ? AppColors.successGreen : AppColors.salmon,
                size: 20,
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _MonthlySpentItem(
                label: 'Este mes',
                amount: _spentThisMonth,
                color: AppColors.salmon,
                isCurrent: true,
              ),
              Container(width: 1, height: 40, color: AppColors.borderLightGray, margin: const EdgeInsets.symmetric(horizontal: 20)),
              _MonthlySpentItem(
                label: 'Mes anterior',
                amount: _spentLastMonth,
                color: AppColors.grayNeutral,
                isCurrent: false,
              ),
            ],
          ),
        ],
      ),
    ).animate().fadeIn(delay: 150.ms).slideX(begin: 0.1);
  }

  Widget _buildSpendingChart() {
    final months = _spendingByMonth.keys.toList().reversed.toList();
    if (months.isEmpty) return const SizedBox.shrink();

    final maxVal = _spendingByMonth.values.fold(0.0, (max, v) => v > max ? v : max);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Gasto mensual (Bs.)',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.charcoal),
        ),
        const SizedBox(height: 24),
        Container(
          height: 200,
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: months.map((m) {
              final val = _spendingByMonth[m] ?? 0;
              final heightFactor = maxVal > 0 ? (val / maxVal) : 0.0;
              
              return Column(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    val.toStringAsFixed(0),
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.grayNeutral),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: 32,
                    height: (140 * heightFactor).clamp(4, 140).toDouble(),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [AppColors.salmon, AppColors.salmon.withValues(alpha: 0.6)],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
                    ),
                  ).animate().scaleY(begin: 0, duration: 600.ms, curve: Curves.easeOutBack),
                  const SizedBox(height: 12),
                  Text(
                    m,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.charcoal),
                  ),
                ],
              );
            }).toList(),
          ),
        ),
      ],
    ).animate().fadeIn(delay: 200.ms);
  }

  Widget _buildHighlights() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Resumen de actividad',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.charcoal),
        ),
        const SizedBox(height: 20),
        _HighlightItem(
          icon: Icons.account_balance_wallet_outlined,
          color: AppColors.successGreen,
          label: 'Total Recargado',
          value: 'Bs. ${_totalRecharges.toStringAsFixed(2)}',
        ),
        const SizedBox(height: 16),
        _HighlightItem(
          icon: Icons.stars_rounded,
          color: Colors.amber,
          label: 'Ahorro Estimado',
          value: 'Bs. ${(_totalSpent * 0.05).toStringAsFixed(2)}',
        ),
        const SizedBox(height: 16),
        _HighlightItem(
          icon: Icons.timer_outlined,
          color: Colors.blueAccent,
          label: 'Viajes este mes',
          value: '${_trips.where((trip) {
            if (trip['status'] != 'completed') return false;
            final dateStr = trip['created_at'] ?? '';
            final date = DateTime.tryParse(dateStr);
            final now = DateTime.now();
            return date != null && date.month == now.month && date.year == now.year;
          }).length}',
        ),
      ],
    ).animate().fadeIn(delay: 300.ms);
  }
}

class _SummaryCard extends StatelessWidget {
  final String title;
  final String value;
  final String subtitle;
  final IconData icon;
  final Color color;

  const _SummaryCard({
    required this.title,
    required this.value,
    required this.subtitle,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.borderLightGray),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.05),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(fontSize: 14, color: AppColors.grayNeutral, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.charcoal),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: TextStyle(fontSize: 12, color: color, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}

class _HighlightItem extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String label;
  final String value;

  const _HighlightItem({
    required this.icon,
    required this.color,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.bgLightGray,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLightGray),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.charcoal),
            ),
          ),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.charcoal, fontSize: 16),
          ),
        ],
      ),
    );
  }
}

class _MonthlySpentItem extends StatelessWidget {
  final String label;
  final double amount;
  final Color color;
  final bool isCurrent;

  const _MonthlySpentItem({
    required this.label,
    required this.amount,
    required this.color,
    required this.isCurrent,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 12, color: AppColors.grayNeutral, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 4),
          Text(
            'Bs. ${amount.toStringAsFixed(2)}',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: isCurrent ? AppColors.charcoal : AppColors.grayNeutral,
            ),
          ),
        ],
      ),
    );
  }
}