import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Simple counter provider that triggers trip list refreshes.
/// Increment this whenever a trip is created or completed.
final tripRefreshProvider = StateProvider<int>((ref) => 0);
