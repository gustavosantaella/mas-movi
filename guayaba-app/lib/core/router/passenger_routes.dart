import 'package:go_router/go_router.dart';

import '../../features/passenger/home/presentation/home_screen.dart';
import '../../features/passenger/payments/presentation/payment_screen.dart';
import '../../features/passenger/pay_fare/presentation/pay_fare_screen.dart';
import '../../features/passenger/ai_route/presentation/ai_route_screen.dart';
import '../../features/passenger/payments/presentation/affiliates_screen.dart';
import '../../features/passenger/payments/presentation/send_fare_screen.dart';
import '../../features/passenger/payments/presentation/transactions_history_screen.dart';
import '../../features/passenger/payments/presentation/recharge_screen.dart';
import '../../features/passenger/payments/presentation/recharge_detail_screen.dart';
import '../../features/passenger/payments/presentation/recharge_reference_screen.dart';
import '../../features/passenger/rewards/presentation/rewards_screen.dart';
import '../../features/passenger/stats/presentation/passenger_stats_screen.dart';
import '../../shared/widgets/passenger_shell.dart';

final passengerRoutes = <RouteBase>[
  // ─── Tabs ─────────────────────
  ShellRoute(
    builder: (_, __, child) => PassengerShell(child: child),
    routes: [
      GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
      GoRoute(path: '/payments', builder: (_, __) => const PaymentScreen(), routes: [
        GoRoute(path: 'history', builder: (_, __) => const TransactionsHistoryScreen()),
        GoRoute(path: 'recharge', builder: (_, __) => const RechargeScreen(), routes: [
            GoRoute(
              path: 'detail',
              builder: (context, state) {
                final methodStr = state.uri.queryParameters['method'] ?? 'transfer';
                final method = RechargeMethod.values.firstWhere(
                  (e) => e.name == methodStr,
                  orElse: () => RechargeMethod.transfer,
                );
                return RechargeDetailScreen(method: method);
              },
            ),
            GoRoute(
              path: 'reference',
              builder: (context, state) => const RechargeReferenceScreen(),
            ),
        ]),
      ]),
      GoRoute(path: '/affiliates', builder: (_, __) => const AffiliatesScreen()),
      GoRoute(path: '/ai-route', builder: (_, __) => const AiRouteScreen()),
      GoRoute(path: '/rewards', builder: (_, __) => const RewardsScreen()),
    ],
  ),

  // ─── Full-screen ──────────────
  GoRoute(path: '/pay-fare', builder: (_, __) => const PayFareScreen()),
  GoRoute(path: '/send-fare', builder: (_, __) => const SendFareScreen()),
  GoRoute(path: '/stats', builder: (_, __) => const PassengerStatsScreen()),
];
