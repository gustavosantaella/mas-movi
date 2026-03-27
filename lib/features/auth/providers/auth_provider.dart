import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guayaba_app/core/network/api_client.dart';
import 'package:guayaba_app/services/storage/secure_storage.dart';
import 'package:guayaba_app/services/auth/auth_repository.dart';
import 'package:guayaba_app/features/user/data/models/user_profile.dart';

/// Auth state
class AuthState {
  final String? token;
  final UserProfile? user;
  final bool isLoading;

  const AuthState({this.token, this.user, this.isLoading = true});

  bool get isAuthenticated => token != null;
  bool get isDriver => user?.isDriver ?? false;

  AuthState copyWith({String? token, UserProfile? user, bool? isLoading}) =>
      AuthState(
        token: token ?? this.token,
        user: user ?? this.user,
        isLoading: isLoading ?? this.isLoading,
      );
}

/// Auth notifier
class AuthNotifier extends ChangeNotifier {
  final _repo = AuthRepository();
  AuthState _state = const AuthState();

  AuthState get state => _state;

  AuthNotifier() {
    _restoreSession();
  }

  Future<void> _restoreSession() async {
    try {
      final token = await SecureStorage.getToken();
      if (token != null) {
        ApiClient().setToken(token);
        final cached = await SecureStorage.getCachedProfile();
        UserProfile? profile;
        if (cached != null) {
          profile = UserProfile.fromJson(cached);
        }
        _state = AuthState(token: token, user: profile, isLoading: false);
      } else {
        _state = const AuthState(isLoading: false);
      }
    } catch (_) {
      _state = const AuthState(isLoading: false);
    }
    notifyListeners();
  }

  Future<void> signIn(String token) async {
    ApiClient().setToken(token);
    await SecureStorage.setToken(token);

    UserProfile? profile;
    try {
      profile = await _repo.getProfile(token);
      await SecureStorage.setCachedProfile(profile.toJson());
    } catch (_) {}

    _state = AuthState(token: token, user: profile, isLoading: false);
    notifyListeners();
  }

  Future<void> signOut() async {
    ApiClient().setToken(null);
    await SecureStorage.deleteToken();
    await SecureStorage.clearCachedProfile();
    _state = const AuthState(isLoading: false);
    notifyListeners();
  }

  void updateUser(UserProfile user) {
    _state = _state.copyWith(user: user);
    SecureStorage.setCachedProfile(user.toJson());
    notifyListeners();
  }

  Future<void> refreshProfile() async {
    if (_state.token == null) return;
    try {
      final profile = await _repo.getProfile(_state.token!);
      updateUser(profile);
    } catch (_) {}
  }
}

final authProvider = ChangeNotifierProvider<AuthNotifier>((ref) {
  return AuthNotifier();
});
