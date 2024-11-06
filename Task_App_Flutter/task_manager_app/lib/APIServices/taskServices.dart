import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  final String baseURL;

  ApiService(this.baseURL);

  final FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  Future<List<Map<String, dynamic>>> fetchTasks() async {
    final token = await _secureStorage.read(key: 'auth_token');
    final response = await http.get(
      Uri.parse('$baseURL/tasks'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer ${token}"
      },
    );

    if (response.statusCode == 200) {
      List<dynamic> jsonResponse = json
          .decode(response.body)['tasks']; // Assuming tasks come as an array
      return jsonResponse.map((task) {
        return {
          'id': task['id'], // Extract task ID
          'taskContent': task['taskContent'], // Extract task content
        };
      }).toList();
    } else {
      throw Exception('Failed to fetch tasks');
    }
  }

  Future<int> addTask(Map<String, dynamic> task) async {
    final token = await _secureStorage.read(key: 'auth_token');
    final taskContent = task['taskContent'];
    final response = await http.post(
      Uri.parse('$baseURL/tasks'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer ${token}"
      },
      body: json.encode({'taskContent': taskContent}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to add task');
    } else {
      int jsonResponse = json.decode(response.body)['taskId'];
      return jsonResponse;
    }
  }

  Future<void> removeTask(String id) async {
    final token = await _secureStorage.read(key: 'auth_token');
    final response = await http.delete(
      Uri.parse('${baseURL}/tasks/${id}'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer ${token}"
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to delete task');
    }
  }

  Future<void> updateTask(Map<String, dynamic> task) async {
    final token = await _secureStorage.read(key: 'auth_token');
    final response = await http.put(Uri.parse('${baseURL}/tasks/${task['id']}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer ${token}"
        },
        body: json.encode({'taskContent': '${task['taskContent']}'}));

    if (response.statusCode != 200) {
      throw Exception('Failed to update the task');
    }
  }
}
