import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/providers/auth_provider.dart';
import 'auth_routes.dart';
import 'passenger_routes.dart';
import 'driver_routes.dart';
import 'shared_routes.dart';

/// Riverpod provider that creates the GoRouter ONCE
/// and listens to auth changes via refreshListenable.
final routerProvider = Provider<GoRouter>((ref) {
  final auth = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/login',
    refreshListenable: auth,
    redirect: (context, state) {
      final isLoading = auth.state.isLoading;
      final isAuth = auth.state.isAuthenticated;
      final isDriver = auth.state.isDriver;
      final location = state.matchedLocation;

      if (isLoading) return null;

      final isOnAuth =
          location.startsWith('/login') ||
          location.startsWith('/register') ||
          location.startsWith('/forgot-password');

      if (!isAuth && !isOnAuth) return '/login';
      if (isAuth && isOnAuth) return isDriver ? '/driver' : '/home';
      if (isAuth && isDriver && location.startsWith('/home')) return '/driver';
      if (isAuth && !isDriver && location.startsWith('/driver')) return '/home';

      return null;
    },
    routes: [
      ...authRoutes,
      ...passengerRoutes,
      ...driverRoutes,
      ...sharedRoutes,
    ],
  );
});
