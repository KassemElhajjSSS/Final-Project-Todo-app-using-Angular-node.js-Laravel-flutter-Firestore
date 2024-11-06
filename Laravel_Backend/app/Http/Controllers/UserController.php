<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\Rule;

use Illuminate\Support\Facades\Auth; // To use auth in api (not needed when using web, check my first laravel project)
use Exception;

class UserController extends Controller
{

    // public function RedirectLogin() {
    //     return view('login');
    // }
    
    public function register(Request $request) {
        try{
            $incomingFields = $request->validate([
                'name' => ['required', 'min:3', 'max:20', Rule::unique('users', 'name')],
                'email' => ['required', 'email', Rule::unique('users', 'email')],
                'password' => ['required', 'min:8', 'max:150']
            ]);
        
            $incomingFields['password'] = bcrypt($incomingFields['password']);
            $user = User::create($incomingFields);
            
            // Create a token for the user
            $token = $user->createToken('YourAppName')->plainTextToken;
        
            return response()->json([
                'status' => 'ok',
                'message' => 'registered succeeded!',
                'token' => $token,
                'userId' => $user->id,
            ], 200);
        }catch(Exception $e){
            return response()->json([
                "status" => 'failed',
                "message" => 'Failed register: ' . $e->getMessage()
            ],201); //I put it 201 because if  I put it 500 or 501 it is considered as an error and I'm not able to get the message from the response then
        }
        
    } 

public function login(Request $request)
{
    try {
        // \Log::info('Login request:', $request->all());  //logs are in storage logs laravel.log
        $credentials = $request->validate([
            'name' => 'required',
            'password' => 'required|min:8',
        ]);

        // Find the user by name or email
        $user = User::where('name', $credentials['name'])->first();

        // If user exists and password is correct
        if ($user && \Hash::check($credentials['password'], $user->password)) {
            // Create token
            $token = $user->createToken('YourAppName')->plainTextToken;

            return response()->json([
                'status' => 'ok',
                'message' => 'login successful',
                'token' => $token, 
                'userId' => $user->id,

            ], 200);
        } else {
            return response()->json([
                "status" => 'failed',
                "message" => 'Invalid credentials',
            ], 200); //I put it 200 because if  I put it 500 or 501 it is considered as an error and I'm not able to get the message from the response then
        }
    } catch (Exception $e) {
        return response()->json([
            "status" => 'failed',
            "message" => 'Failed login: ' . $e->getMessage(),
        ], 500);
    }
}


public function logout(Request $request)
{
    try {
        // Revoke the token that was used for authentication
        // \Log::info('Logout request:', $request->all());  //logs are in storage logs laravel.log
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'ok',
            'message' => 'Logout succeeded!',
        ], 200);
    } catch (Exception $e) {
        return response()->json([
            "status" => 'failed',
            "message" => 'Failed logout: ' . $e->getMessage(),
        ], 500); 
    }
}

public function getAuthenticatedUser(Request $request) {
    return response()->json([
        'status' => 'ok',
        'user' => $request->user(),  // Returns authenticated user based on the Sanctum token
    ]);
}

}

    
