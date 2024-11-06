// task_manager_app.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:task_manager_app/providers/taskProvider.dart';
import '../APIServices/authServices.dart';

class TaskManagerApp extends ConsumerWidget {
  final AuthService _authService = AuthService();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tasks = ref.watch(taskProvider);

    Future.microtask(() => ref.read(taskProvider.notifier).loadTasks());

    return Scaffold(
      appBar: AppBar(
        title: Text('Task Manager'),
        actions: [
          IconButton(
            icon: Icon(Icons.favorite),
            onPressed: () {
              Navigator.pushNamed(context, '/favorite');
            },
            tooltip: 'favorite',
          ),
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () async {
              await _authService.logout();
              Navigator.pushReplacementNamed(
                  context, '/login'); // Navigate to login page after logout
            },
            tooltip: 'Logout',
          ),
        ],
      ),
      body: tasks.isEmpty
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: tasks.length,
              itemBuilder: (context, index) {
                final task = Map<String, dynamic>.from(tasks[index]);
                return ListTile(
                  title: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          task['taskContent'],
                          style: Theme.of(context).textTheme.bodyText2,
                        ),
                      ),
                      SizedBox(width: 10),
                      Text(
                        'ID: ${task['id'].toString().length > 3 ? task['id'].toString().substring(0, 3) + '...' : task['id'].toString()}',
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: Icon(Icons.edit),
                        onPressed: () {
                          _displayAddTaskDialog(
                              context, ref, index, task['id']);
                        },
                        tooltip: 'Edit Task',
                      ),
                      IconButton(
                        icon: Icon(Icons.favorite),
                        onPressed: () {
                          // Add to favorite
                        },
                      ),
                      IconButton(
                        icon: Icon(Icons.delete),
                        onPressed: () {
                          ref.read(taskProvider.notifier).removeTask(task);
                        },
                        tooltip: 'Delete Task',
                      ),
                    ],
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _displayAddTaskDialog(context, ref, -1, 0);
        },
        child: Icon(Icons.add),
        tooltip: 'Add Task',
      ),
    );
  }

  Future<void> _displayAddTaskDialog(
      BuildContext context, WidgetRef ref, int index, var taskId) async {
    TextEditingController taskController = TextEditingController();

    return showDialog(
      context: context,
      builder: (context) {
        if (index >= 0) {
          taskController.text = ref.read(taskProvider)[index]['taskContent'];
        } else {
          taskController.clear();
        }

        return AlertDialog(
          title: Text(index >= 0 ? 'Edit task' : 'Add a new task'),
          content: TextField(
            controller: taskController,
            decoration: InputDecoration(hintText: "Enter task here"),
            autofocus: true,
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text(index >= 0 ? 'Update Task' : 'Add a new task'),
              onPressed: () {
                if (taskController.text.isNotEmpty) {
                  if (index >= 0) {
                    ref.read(taskProvider.notifier).updateTask(index,
                        {'taskContent': taskController.text, 'id': taskId});
                  } else {
                    ref
                        .read(taskProvider.notifier)
                        .addTask({'taskContent': taskController.text, 'id': 0});
                  }
                }
                taskController.clear();
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }
}
