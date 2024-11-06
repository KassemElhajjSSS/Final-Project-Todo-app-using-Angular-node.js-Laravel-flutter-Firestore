<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Models\Task;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



//The name is added to be able to redirect between login and register

// Route::get('/login', [UserController::class, 'RedirectLogin'])->name('login');
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/getAuth', [UserController::class, 'getAuthenticatedUser'])->middleware('auth:sanctum');

// Route::get('/editTaskPage/{task}', [TaskController::class, 'editTaskPage'])->name('editTaskPage');
Route::get('/getTasks', [TaskController::class, 'getTasks'])->middleware('auth:sanctum');
Route::post('/addTask', [TaskController::class, 'addTask'])->middleware('auth:sanctum'); //We add this middleware whenever we need authorization
Route::put('/editTask/{task}', [TaskController::class, 'editTask'])->middleware('auth:sanctum');
Route::delete('/deleteTask/{task}', [TaskController::class, 'deleteTask'])->middleware('auth:sanctum');

