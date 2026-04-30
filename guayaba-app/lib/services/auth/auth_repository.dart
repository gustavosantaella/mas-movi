import 'package:dio/dio.dart';
import 'package:flutter/rendering.dart';
import 'package:guayaba_app/core/network/api_client.dart';
import 'package:guayaba_app/features/user/data/models/user_profile.dart';

class AuthRepository {
  final _api = ApiClient();

  Future<String> login({
    required String identifier,
    required String password,
    bool rememberPassword = false,
  }) async {
    final response = await _api.dio.post(
      '/auth/login',
      data: {
        'email': identifier,
        'password': password,
        'rememberPassword': rememberPassword,
      },
    );
    debugPrint('Response URL: ${response.realUri}');
    final data = ApiClient.parseResponse(response);
    return data['data']['token'] as String;
  }

  Future<void> register({
    String? phoneNumber,
    String? email,
    required String password,
    required int userType,
    required String dni,
    String? firstName,
    String? lastName,
    String? dateOfBirth,
    String? sex,
  }) async {
    final response = await _api.dio.post(
      '/auth/register',
      data: {
        if (phoneNumber != null) 'phoneNumber': phoneNumber,
        'email': email,
        'password': password,
        'userType': userType,
        'dni': dni,
        if (firstName != null) 'firstName': firstName,
        if (lastName != null) 'lastName': lastName,
        if (dateOfBirth != null) 'dateOfBirth': dateOfBirth,
        if (sex != null) 'sex': sex,
      },
    );
    ApiClient.parseResponse(response);
  }

  Future<void> forgotPassword(String email) async {
    await _api.dio.post('/auth/forgot-password', data: {'email': email});
  }

  Future<void> resendConfirmationEmail(String token) async {
    await _api.dio.post(
      '/auth/resend-confirmation',
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );
  }

  Future<void> changePassword({
    required String token,
    required String currentPassword,
    required String newPassword,
  }) async {
    final response = await _api.dio.post(
      '/auth/change-password',
      data: {'currentPassword': currentPassword, 'newPassword': newPassword},
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );
    ApiClient.parseResponse(response);
  }

  Future<Map<String, dynamic>> verifyIdentity({
    required String selfiePath,
    required String documentPath,
  }) async {
    final formData = FormData.fromMap({
      'selfie': await MultipartFile.fromFile(
        selfiePath,
        filename: 'selfie.jpg',
      ),
      'document': await MultipartFile.fromFile(
        documentPath,
        filename: 'document.jpg',
      ),
    });
    final response = await _api.dio.post('/ocr/verify', data: formData);
    final data = ApiClient.parseResponse(response);
    return data['data'] as Map<String, dynamic>;
  }

  Future<UserProfile> getProfile(String token) async {
    final response = await _api.dio.get(
      '/user/me',
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );
    final data = ApiClient.parseResponse(response);
    return UserProfile.fromJson(data['data'] as Map<String, dynamic>);
  }

  Future<UserProfile> updateProfile(
    String token,
    Map<String, dynamic> fields,
  ) async {
    final response = await _api.dio.patch(
      '/user/me',
      data: fields,
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );
    final data = ApiClient.parseResponse(response);
    return UserProfile.fromJson(data['data'] as Map<String, dynamic>);
  }

  Future<void> confirmEntity(String token, Map<String, dynamic> ocrData) async {
    final response = await _api.dio.post(
      '/user/confirm-entity',
      data: ocrData,
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );
    ApiClient.parseResponse(response);
  }
}
