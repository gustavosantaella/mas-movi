import 'package:dio/dio.dart';
import '../constants.dart';

/// Dio HTTP client with JWT interceptor.
class ApiClient {
  static ApiClient? _instance;
  late final Dio dio;
  String? _token;
  static String get baseUrl => apiBaseUrl;

  ApiClient._() {
    dio = Dio(
      BaseOptions(
        baseUrl: apiBaseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          if (_token != null) {
            options.headers['Authorization'] = 'Bearer $_token';
          }
          handler.next(options);
        },
      ),
    );
  }

  factory ApiClient() => _instance ??= ApiClient._();

  void setToken(String? token) => _token = token;

  /// Generic API response parser
  static Map<String, dynamic> parseResponse(Response response) {
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) {
      throw ApiException(data['message'] as String? ?? 'Error desconocido');
    }
    return data;
  }
}

class ApiException implements Exception {
  final String message;
  const ApiException(this.message);

  @override
  String toString() => message;
}
