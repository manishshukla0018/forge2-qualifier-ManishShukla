<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Models\ListModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BoardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Board::query()->latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $board = Board::create($data);

        foreach (['Todo', 'Doing', 'Done'] as $position => $name) {
            $board->lists()->create([
                'name' => $name,
                'position' => $position,
            ]);
        }

        return response()->json($this->loadBoard($board), 201);
    }

    public function show(Board $board): JsonResponse
    {
        return response()->json($this->loadBoard($board));
    }

    public function update(Request $request, Board $board): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $board->update($data);

        return response()->json($this->loadBoard($board));
    }

    public function destroy(Board $board): JsonResponse
    {
        $board->delete();

        return response()->json(null, 204);
    }

    public function storeList(Request $request, Board $board): JsonResponse
    {
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:80',
                Rule::unique('lists')->where('board_id', $board->id),
            ],
        ]);

        $list = $board->lists()->create([
            'name' => $data['name'],
            'position' => $board->lists()->count(),
        ]);

        return response()->json($list, 201);
    }

    private function loadBoard(Board $board): Board
    {
        return $board->load([
            'lists.cards' => fn ($query) => $query->with(['tags', 'member', 'list']),
        ]);
    }
}
