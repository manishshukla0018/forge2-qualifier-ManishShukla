<?php

use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\TagController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json([
    'name' => 'Forge 2 Kanban API',
    'status' => 'ok',
    'endpoints' => [
        'health' => '/api/health',
        'boards' => '/api/boards',
        'members' => '/api/members',
        'tags' => '/api/tags',
    ],
]));

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

Route::fallback(fn () => response()->json([
    'message' => 'API route not found.',
    'try' => [
        '/api/health',
        '/api/boards',
        '/api/members',
        '/api/tags',
    ],
], 404));
