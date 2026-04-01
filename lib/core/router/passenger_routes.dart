import 'package:go_router/go_router.dart';

import '../../features/passenger/home/presentation/home_screen.dart';
import '../../features/passenger/payments/presentation/payment_screen.dart';
import '../../features/passenger/pay_fare/presentation/pay_fare_screen.dart';
import '../../features/passenger/ai_route/presentation/ai_route_screen.dart';
import '../../features/passenger/payments/presentation/affiliates_screen.dart';
import '../../features/passenger/rewards/presentation/rewards_screen.dart';
import '../../shared/widgets/passenger_shell.dart';

final passengerRoutes = <RouteBase>[
  // ─── Tabs ─────────────────────
  ShellRoute(
    builder: (_, __, child) => PassengerShell(child: child),
    routes: [
      GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
      GoRoute(path: '/payments', builder: (_, __) => const PaymentScreen()),
      GoRoute(path: '/affiliates', builder: (_, __) => const AffiliatesScreen()),
      GoRoute(path: '/ai-route', builder: (_, __) => const AiRouteScreen()),
      GoRoute(path: '/rewards', builder: (_, __) => const RewardsScreen()),
    ],
  ),

  // ─── Full-screen ──────────────
  GoRoute(path: '/pay-fare', builder: (_, __) => const PayFareScreen()),
];
