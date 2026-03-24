import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/colors.dart';
import '../../../features/shared/providers/trip_refresh_provider.dart';
import '../../../services/database/trip_service.dart';
import '../../../services/location/location_helper.dart';
import '../../../services/socket/payment_socket_service.dart';
import 'app_bottom_sheet.dart';
import 'gradient_button.dart';

/// Reusable widget that shows recent trips from SQLite.
/// Active trips are tappable → opens a payment bottom sheet.
class RecentTripsSection extends ConsumerStatefulWidget {
  const RecentTripsSection({super.key});

  @override
  ConsumerState<RecentTripsSection> createState() => RecentTripsSectionState();
}

class RecentTripsSectionState extends ConsumerState<RecentTripsSection> {
  List<Map<String, dynamic>> _trips = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadTrips();
  }

  /// Public method for pull-to-refresh from parent screens.
  Future<void> refresh() => _loadTrips();

  Future<void> _loadTrips() async {
    final trips = await TripService.getTrips(limit: 10);
    if (mounted) setState(() { _trips = trips; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    // Watch the refresh trigger — reload when it changes
    ref.listen<int>(tripRefreshProvider, (_, __) => _loadTrips());

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

  void _showPaymentSheet(Map<String, dynamic> trip) {
    final tripId = trip['id'] as int;
    final from = trip['direction_from'] as String? ?? 'Ubicación desconocida';
    final driverId = trip['driver_id'];
    final sessionId = trip['session_id'] as String? ?? '';
    final passengerId = trip['passenger_id'] as int? ?? 0;

    showAppBottomSheet(
      context: context,
      initialSize: 0.42,
      minSize: 0.3,
      maxSize: 0.5,
      child: _TripPaymentSheet(
        tripId: tripId,
        from: from,
        driverId: driverId?.toString() ?? '—',
        sessionId: sessionId,
        passengerId: passengerId,
        onPaid: () {
          ref.read(tripRefreshProvider.notifier).state++;
          _loadTrips();
        },
      ),
    );
  }

  void _showTripInfoSheet(Map<String, dynamic> trip) {
    showAppBottomSheet(
      context: context,
      initialSize: 0.45,
      minSize: 0.3,
      maxSize: 0.55,
      child: _TripInfoSheet(trip: trip),
    );
  }

  Widget _buildTripCard(Map<String, dynamic> trip) {
    final status = trip['status'] as String? ?? 'active';
    final isCompleted = status == 'completed';
    final isActive = status == 'active';
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

    final card = Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isActive ? AppColors.salmon.withValues(alpha: 0.4) : AppColors.borderLightGray,
        ),
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
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      isCompleted ? 'Completado' : 'En viaje',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: isCompleted ? AppColors.successGreen : AppColors.salmon,
                      ),
                    ),
                    if (isActive) ...[
                      const SizedBox(width: 4),
                      Icon(Icons.touch_app, size: 12, color: AppColors.salmon.withValues(alpha: 0.7)),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );

    return GestureDetector(
      onTap: () {
        if (isActive) {
          _showPaymentSheet(trip);
        } else {
          _showTripInfoSheet(trip);
        }
      },
      child: card,
    );
  }
}

// ─── Payment Sheet for Active Trip (from history) ──────
class _TripPaymentSheet extends StatefulWidget {
  final int tripId;
  final String from;
  final String driverId;
  final String sessionId;
  final int passengerId;
  final VoidCallback onPaid;

  const _TripPaymentSheet({
    required this.tripId,
    required this.from,
    required this.driverId,
    required this.sessionId,
    required this.passengerId,
    required this.onPaid,
  });

  @override
  State<_TripPaymentSheet> createState() => _TripPaymentSheetState();
}

class _TripPaymentSheetState extends State<_TripPaymentSheet> {
  bool _loading = false;
  static const _fare = 1.50;

  Future<void> _handlePay() async {
    setState(() => _loading = true);
    try {
      final position = await LocationHelper.getCurrentPosition();
      final landingLat = position?.latitude ?? 0.0;
      final landingLong = position?.longitude ?? 0.0;
      String? directionTo;
      if (landingLat != 0.0 && landingLong != 0.0) {
        directionTo = await LocationHelper.getAddress(landingLat, landingLong);
      }

      final socketService = PaymentSocketService();
      socketService.connect();
      await Future.delayed(const Duration(milliseconds: 500));
      socketService.passengerPay(
        sessionId: widget.sessionId,
        passengerId: widget.passengerId,
        amount: _fare,
        lat: landingLat,
        lng: landingLong,
      );

      await TripService.completeTrip(
        tripId: widget.tripId,
        landingLat: landingLat,
        landingLong: landingLong,
        amount: _fare,
        directionTo: directionTo,
      );

      await Future.delayed(const Duration(milliseconds: 300));
      socketService.dispose();

      if (mounted) {
        Navigator.of(context).pop();
        widget.onPaid();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Row(
              children: [
                Icon(Icons.check_circle, color: Colors.white, size: 20),
                SizedBox(width: 8),
                Text('¡Pago realizado con éxito!',
                    style: TextStyle(fontWeight: FontWeight.w600)),
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
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: const Color(0xFFE53935)),
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
            width: 64, height: 64,
            decoration: BoxDecoration(
              color: AppColors.successGreen.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.directions_bus, size: 32, color: AppColors.successGreen),
          ),
          const SizedBox(height: 16),
          const Text('Viaje en curso',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.charcoal)),
          const SizedBox(height: 6),
          Text(widget.from,
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 14, color: AppColors.grayNeutral)),
          const SizedBox(height: 16),
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
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Pasaje', style: TextStyle(fontSize: 13, color: AppColors.grayNeutral)),
                    const SizedBox(height: 2),
                    Text('Conductor #${widget.driverId}',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.charcoal)),
                  ],
                ),
                Text('Bs. ${_fare.toStringAsFixed(2)}',
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.charcoal)),
              ],
            ),
          ),
          const SizedBox(height: 20),
          GradientButton(label: 'Pagar pasaje', onPressed: _handlePay, loading: _loading),
          const SizedBox(height: 6),
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Continuar viaje',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.grayNeutral)),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}

// ─── Info Sheet for Completed Trips ──────────────────
class _TripInfoSheet extends StatelessWidget {
  final Map<String, dynamic> trip;
  const _TripInfoSheet({required this.trip});

  @override
  Widget build(BuildContext context) {
    final from = trip['direction_from'] as String? ?? 'Ubicación desconocida';
    final to = trip['direction_to'] as String? ?? '—';
    final amount = trip['amount'];
    final driverId = trip['driver_id'];
    final boardedAt = trip['boarded_at'] as String?;
    final landedAt = trip['landed_at'] as String?;
    final status = trip['status'] as String? ?? 'active';
    final isCompleted = status == 'completed';

    String boardedText = '—';
    String landedText = '—';
    String durationText = '—';

    if (boardedAt != null) {
      try {
        final dt = DateTime.parse(boardedAt);
        boardedText = '${dt.day}/${dt.month}/${dt.year} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
      } catch (_) {}
    }
    if (landedAt != null) {
      try {
        final dt = DateTime.parse(landedAt);
        landedText = '${dt.day}/${dt.month}/${dt.year} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
      } catch (_) {}
    }
    if (boardedAt != null && landedAt != null) {
      try {
        final diff = DateTime.parse(landedAt).difference(DateTime.parse(boardedAt));
        durationText = diff.inMinutes < 1 ? '${diff.inSeconds}s' : '${diff.inMinutes} min';
      } catch (_) {}
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 8),
          Container(
            width: 64, height: 64,
            decoration: BoxDecoration(
              color: (isCompleted ? AppColors.successGreen : AppColors.salmon).withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              isCompleted ? Icons.check_circle : Icons.directions_bus,
              size: 32,
              color: isCompleted ? AppColors.successGreen : AppColors.salmon,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            isCompleted ? 'Viaje completado' : 'Viaje en curso',
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.charcoal),
          ),
          const SizedBox(height: 16),

          // Trip details card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.bgLightGray,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.borderLightGray),
            ),
            child: Column(
              children: [
                _infoRow(Icons.trip_origin, 'Origen', from, AppColors.salmon),
                const Divider(height: 20),
                _infoRow(Icons.place, 'Destino', to, AppColors.successGreen),
                const Divider(height: 20),
                _infoRow(Icons.login, 'Abordaje', boardedText, AppColors.charcoal),
                if (isCompleted) ...[
                  const Divider(height: 20),
                  _infoRow(Icons.logout, 'Desembarque', landedText, AppColors.charcoal),
                  const Divider(height: 20),
                  _infoRow(Icons.timer, 'Duración', durationText, AppColors.charcoal),
                ],
                if (driverId != null) ...[
                  const Divider(height: 20),
                  _infoRow(Icons.person, 'Conductor', '#$driverId', AppColors.charcoal),
                ],
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Amount
          if (amount != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.successGreen.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.successGreen.withValues(alpha: 0.2)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Monto pagado',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.charcoal)),
                  Text('Bs. ${(amount as num).toStringAsFixed(2)}',
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.successGreen)),
                ],
              ),
            ),
          const SizedBox(height: 16),

          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cerrar',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.grayNeutral)),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value, Color iconColor) {
    return Row(
      children: [
        Icon(icon, size: 18, color: iconColor),
        const SizedBox(width: 10),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: TextStyle(fontSize: 11, color: AppColors.grayNeutral.withValues(alpha: 0.8))),
            const SizedBox(height: 1),
            Text(value,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.charcoal)),
          ],
        ),
      ],
    );
  }
}
