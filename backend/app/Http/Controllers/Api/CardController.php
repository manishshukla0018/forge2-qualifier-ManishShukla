<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\ListModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CardController extends Controller
{
    public function store(Request $request, ListModel $list): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:160'],
            'description' => ['nullable', 'string'],
            'member_id' => ['nullable', 'exists:members,id'],
            'due_date' => ['nullable', 'date_format:Y-m-d'],
            'tag_ids' => ['array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ]);

        $tagIds = $data['tag_ids'] ?? [];
        unset($data['tag_ids']);

        $card = $list->cards()->create([
            ...$data,
            'position' => $list->cards()->count(),
        ]);

        $card->tags()->sync($tagIds);

        return response()->json($this->loadCard($card), 201);
    }

    public function update(Request $request, Card $card): JsonResponse
    {
        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:160'],
            'description' => ['nullable', 'string'],
            'member_id' => ['nullable', 'exists:members,id'],
            'due_date' => ['nullable', 'date_format:Y-m-d'],
            'tag_ids' => ['array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
            'list_id' => ['sometimes', 'required', 'exists:lists,id'],
            'position' => ['sometimes', 'integer', 'min:0'],
        ]);

        $tagIds = $data['tag_ids'] ?? null;
        unset($data['tag_ids']);

        $card->update($data);

        if ($tagIds !== null) {
            $card->tags()->sync($tagIds);
        }

        return response()->json($this->loadCard($card));
    }

    public function move(Request $request, Card $card): JsonResponse
    {
        $data = $request->validate([
            'list_id' => ['required', 'exists:lists,id'],
            'position' => ['nullable', 'integer', 'min:0'],
        ]);

        $targetList = ListModel::findOrFail($data['list_id']);
        $position = $data['position'] ?? $targetList->cards()->count();

        $card->update([
            'list_id' => $targetList->id,
            'position' => $position,
        ]);

        return response()->json($this->loadCard($card));
    }

    public function destroy(Card $card): JsonResponse
    {
        $card->delete();

        return response()->json(null, 204);
    }

    private function loadCard(Card $card): Card
    {
        return $card->load(['tags', 'member', 'list']);
    }
}
