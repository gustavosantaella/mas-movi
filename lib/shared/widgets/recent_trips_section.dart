import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/colors.dart';
import '../../../services/database/trip_service.dart';

/// Reusable widget that shows recent trips from SQLite.
class RecentTripsSection extends StatefulWidget {
  const RecentTripsSection({super.key});

  @override
  State<RecentTripsSection> createState() => _RecentTripsSectionState();
}

class _RecentTripsSectionState extends State<RecentTripsSection> {
  List<Map<String, dynamic>> _trips = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadTrips();
  }

  Future<void> _loadTrips() async {
    final trips = await TripService.getTrips(limit: 10);
    if (mounted) setState(() { _trips = trips; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Actividad reciente',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.charcoal)),
        const SizedBox(height: 14),
        if (_loading)
          const Center(child: CircularProgressIndicator(color: AppColors.salmon))
        else if (_trips.isEmpty)
          _buildEmptyState()
        else
          ..._trips.map(_buildTripCard),
      ],
    );
  }

  Widget _buildEmptyState() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 40),
      decoration: BoxDecoration(
        color: AppColors.bgLightGray,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLightGray),
      ),
      child: const Column(
        children: [
          Icon(Icons.receipt_long, size: 40, color: AppColors.grayNeutral),
          SizedBox(height: 12),
          Text('No hay viajes aún',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.charcoal)),
          SizedBox(height: 4),
          Text('Tus viajes aparecerán aquí',
              style: TextStyle(fontSize: 13, color: AppColors.grayNeutral)),
        ],
      ),
    );
  }

  Widget _buildTripCard(Map<String, dynamic> trip) {
    final status = trip['status'] as String? ?? 'active';
    final isCompleted = status == 'completed';
    final from = trip['direction_from'] as String? ?? 'Ubicación desconocida';
    final to = trip['direction_to'] as String?;
    final amount = trip['amount'];
    final boardedAt = trip['boarded_at'] as String?;
    final landedAt = trip['landed_at'] as String?;

    String timeText = '';
    if (boardedAt != null) {
      try {
        final dt = DateTime.parse(boardedAt);
        timeText = DateFormat('dd/MM · HH:mm').format(dt);
      } catch (_) {}
    }

    String durationText = '';
    if (boardedAt != null && landedAt != null) {
      try {
        final start = DateTime.parse(boardedAt);
        final end = DateTime.parse(landedAt);
        final diff = end.difference(start);
        if (diff.inMinutes < 1) {
          durationText = '${diff.inSeconds}s';
        } else {
          durationText = '${diff.inMinutes} min';
        }
      } catch (_) {}
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLightGray),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Status icon
          Container(
            width: 40, height: 40,
            decoration: BoxDecoration(
              color: isCompleted
                  ? AppColors.successGreen.withValues(alpha: 0.1)
                  : AppColors.salmon.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              isCompleted ? Icons.check_circle : Icons.directions_bus,
              size: 20,
              color: isCompleted ? AppColors.successGreen : AppColors.salmon,
            ),
          ),
          const SizedBox(width: 12),

          // Trip details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  from,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.charcoal,
                  ),
                ),
                if (to != null) ...[
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      const Icon(Icons.arrow_forward, size: 12, color: AppColors.grayNeutral),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          to,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 12, color: AppColors.grayNeutral),
                        ),
                      ),
                    ],
                  ),
                ],
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      timeText,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                        color: AppColors.grayNeutral.withValues(alpha: 0.8),
                      ),
                    ),
                    if (durationText.isNotEmpty) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.charcoal.withValues(alpha: 0.06),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          durationText,
                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.charcoal),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),

          // Amount + status
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              if (amount != null)
                Text(
                  'Bs. ${(amount as num).toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    color: AppColors.charcoal,
                  ),
                ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isCompleted
                      ? AppColors.successGreen.withValues(alpha: 0.1)
                      : AppColors.salmon.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  isCompleted ? 'Completado' : 'En viaje',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: isCompleted ? AppColors.successGreen : AppColors.salmon,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
