<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;


class TaskController extends Controller
{

public function getTasks(){
    try{
        if (!auth()->check()) {
            throw new Exception("No token found, you can't add any task.");
        }
        return response()->json([
            "status:" => "ok",
            "message:" => "all tasks fetched successfuly",
            "tasks:" => auth()->user()->userTasks()->latest()->get()
        ]);
    }catch(Exception $e){
        return response()->json([
            "status:" => "failed",
            "message:" => "failed to get tasks " . $e->getMessage()
        ]);
    }
}

public function addTask(Request $request)
{
    try {
        if (!auth()->check()) {
            throw new Exception("No token found, you can't add any task.");
        }

        $incomingFields = $request->validate([
            'task' => 'required'
        ]);

        $incomingFields['task'] = strip_tags($incomingFields['task']);

        $incomingFields['user_id'] = auth()->id(); // Assuming you have an authenticated user

        Task::create($incomingFields);

        return response()->json([
            'status' => 'ok',
            'message' => 'Task added successfully'
        ], 200);

    } catch (Exception $e) {
        \Log::error('Task addition failed: ' . $e->getMessage());

        return response()->json([
            'status' => 'failed',
            'message' => 'Failed to add task: ' . $e->getMessage()
        ], 500); 
    }
}

    
    public function deleteTask(Task $task){
        try{
            if (!auth()->check()) {
                throw new Exception("No token found, you can't add any task.");
            }
            if (auth()->user()->id === $task['user_id']){
                $task->delete();
            }
            return response()->json([
                "status:" => "ok",
                "message:" => "task deleted successfuly!"
            ], 200);
        }catch(Exception $e){
            return response()->json([
                "status:" => "failed",
                "message:" => "failed to delete: " . $e->getMessage()
            ], 500);
        }
        
    }

    // public function editTaskPage(Task $task){
    //     if (auth()->user()->id === $task['user_id']){
    //         return view('editTask', ['task' => $task]);
    //     }
    //     return redirect('/');
    // }

    public function editTask(Task $task, Request $request){
        try{
            if (!auth()->check()) {
                throw new Exception("No token found, you can't add any task.");
            }

            if (auth()->user()->id !== $task['user_id']) {
                return redirect('/');
            }
    
            $incomingFields = $request->validate([
                'task' => 'required'
            ]);
    
            $taskValue = strip_tags($incomingFields['task']);
    
            $task->update($incomingFields);

            return response()->json([
                "status:" => "ok",
                "message:" => "task edited successfuly!"
            ]);
        }catch(Exception $e){
            return response()->json([
                "status:" => "failed",
                "message:" => "failed to edit task " . $e.getMessage()
            ]);
        }
        
    }

}
