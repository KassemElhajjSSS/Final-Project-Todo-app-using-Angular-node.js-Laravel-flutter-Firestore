// services/auth_service.dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  // Initialize secure storage
  final FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  // Save token to secure storage
  Future<void> _saveToken(String token) async {
    await _secureStorage.write(key: 'auth_token', value: token);
  }

  // Retrieve token from secure storage
  Future<String?> _getToken() async {
    return await _secureStorage.read(key: 'auth_token');
  }

  // Delete token from secure storage
  Future<void> _deleteToken() async {
    await _secureStorage.delete(key: 'auth_token');
  }

  Future<bool> login(String name, String password) async {
    final response = await http.post(
      Uri.parse('http://192.168.100.74:8000/api/login'),
      body: jsonEncode({
        'name': name,
        'password': password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['status'] == 'ok') {
        String token = data['token'];
        // Save token in secure storage for future API calls
        await _saveToken(token);
        return true;
      } else {
        // Handle failed login
        print(data['message']);
        return false;
      }
    } else {
      // Handle error
      print('Error: ${response.statusCode}');
      return false;
    }
  }

  Future<bool> register(String name, String email, String password) async {
    final response = await http.post(
      Uri.parse('http://192.168.100.74:8000/api/register'),
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['status'] == 'ok') {
        String token = data['token'];
        // Save the token in secure storage for future API calls
        await _saveToken(token);
        return true;
      } else {
        // Handle failed registration
        print(data['message']);
        return false;
      }
    } else {
      // Handle error
      print('Error: ${response.statusCode}');
      return false;
    }
  }

  Future<bool> getAuthenticatedUser() async {
    // Retrieve token from secure storage
    String? token = await _getToken();
    if (token == null) {
      print('No token found');
      return false;
    }

    final response = await http.get(
      Uri.parse('http://192.168.100.74:8000/api/getAuth'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      // Handle the authenticated user data
      print('User data: $data');
      return true;
    } else {
      // Handle error
      print('Error: ${response.statusCode}');
      return false;
    }
  }

  Future<void> logout() async {
    // Retrieve token from secure storage
    String? token = await _getToken();
    if (token == null) {
      print('No token found');
      return;
    }

    final response = await http.post(
      Uri.parse('http://192.168.100.74:8000/api/logout'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      // Logout successful; delete token from secure storage
      await _deleteToken();
      print('Logout successful');
    } else {
      // Handle error
      print('Error: ${response.statusCode}');
    }
  }
}
