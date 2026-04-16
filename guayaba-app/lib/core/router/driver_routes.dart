import 'package:go_router/go_router.dart';

import '../../features/driver/dashboard/presentation/driver_home_screen.dart';
import '../../features/driver/activity/presentation/activity_screen.dart';
import '../../features/driver/generate_qr/presentation/generate_qr_screen.dart';
import '../../features/driver/payments/presentation/driver_payments_screen.dart';
import '../../features/driver/settings/presentation/driver_settings_screen.dart';
import '../../shared/widgets/driver_shell.dart';

final driverRoutes = <RouteBase>[
  // ─── Tabs ─────────────────────
  ShellRoute(
    builder: (_, __, child) => DriverShell(child: child),
    routes: [
      GoRoute(path: '/driver', builder: (_, __) => const DriverHomeScreen()),
      GoRoute(
        path: '/driver/activity',
        builder: (_, __) => const ActivityScreen(),
      ),
      GoRoute(
        path: '/driver/payments',
        builder: (_, __) => const DriverPaymentsScreen(),
      ),
      GoRoute(
        path: '/driver/settings',
        builder: (_, __) => const DriverSettingsScreen(),
      ),
    ],
  ),

  // ─── Full-screen ──────────────
  GoRoute(path: '/generate-qr', builder: (_, __) => const GenerateQrScreen()),
];
