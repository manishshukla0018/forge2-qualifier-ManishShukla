<?php

use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\TagController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json([
    'status' => 'ok',
    'service' => 'forge-2-kanban-api',
]));

Route::apiResource('boards', BoardController::class);
Route::post('/boards/{board}/lists', [BoardController::class, 'storeList']);
Route::post('/lists/{list}/cards', [CardController::class, 'store']);
Route::patch('/cards/{card}', [CardController::class, 'update']);
Route::patch('/cards/{card}/move', [CardController::class, 'move']);
Route::delete('/cards/{card}', [CardController::class, 'destroy']);
Route::apiResource('tags', TagController::class)->only(['index', 'store']);
Route::apiResource('members', MemberController::class)->only(['index', 'store']);
