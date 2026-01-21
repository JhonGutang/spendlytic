<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TransactionController;

// Health check routes
Route::get('/health', [HealthController::class, 'health']);
Route::get('/message', [HealthController::class, 'message']);

// Category routes
Route::apiResource('categories', CategoryController::class);

// Transaction routes
Route::get('/transactions/summary', [TransactionController::class, 'summary']);
Route::apiResource('transactions', TransactionController::class);
