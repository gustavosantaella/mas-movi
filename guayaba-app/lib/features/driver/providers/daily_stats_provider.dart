import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../services/trip/trip_repository.dart';
import '../../shared/providers/trip_refresh_provider.dart';

class DailyStats {
  final double earnings;
  final int passengers;
  final int trips;

  DailyStats({this.earnings = 0.0, this.passengers = 0, this.trips = 0});
}

final dailyStatsProvider = FutureProvider<DailyStats>((ref) async {
  // Watch refresh trigger
  ref.watch(tripRefreshProvider);
  
  final repo = TripRepository();
  final tripsList = await repo.getRecentTrips(role: 'driver', limit: 50);
  
  double totalEarnings = 0.0;
  int totalPassengers = 0;
  int tripsToday = 0;
  
  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  
  for (final trip in tripsList) {
    final createdAtStr = trip['created_at'];
    if (createdAtStr == null) continue;
    
    try {
      final createdAt = DateTime.parse(createdAtStr).toLocal();
      final tripDate = DateTime(createdAt.year, createdAt.month, createdAt.day);
      
      if (tripDate.isAtSameMomentAs(today)) {
        tripsToday++;
        final amount = trip['amount'];
        if (amount != null) {
          totalEarnings += (amount is num ? amount.toDouble() : double.tryParse(amount.toString()) ?? 0.0);
        }
        
        final pCount = trip['passenger_count'];
        totalPassengers += (pCount is int ? pCount : int.tryParse(pCount?.toString() ?? '1') ?? 1);
      }
    } catch (_) {}
  }
  
  return DailyStats(
    earnings: totalEarnings,
    passengers: totalPassengers,
    trips: tripsToday,
  );
});
