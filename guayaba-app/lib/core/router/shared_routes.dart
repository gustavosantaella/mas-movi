import 'package:go_router/go_router.dart';

import '../../features/shared/profile/presentation/profile_screen.dart';
import '../../features/shared/personal_info/presentation/personal_info_screen.dart';
import '../../features/shared/security/presentation/security_screen.dart';
import '../../features/shared/trip_history/presentation/trip_history_screen.dart';

final sharedRoutes = <RouteBase>[
  GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
  GoRoute(
    path: '/personal-info',
    builder: (_, __) => const PersonalInfoScreen(),
  ),
  GoRoute(path: '/security', builder: (_, __) => const SecurityScreen()),
  GoRoute(
    path: '/trip-history',
    builder: (_, __) => const TripHistoryScreen(),
  ),
];
