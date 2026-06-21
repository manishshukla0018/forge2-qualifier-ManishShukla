<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BoardApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_board_creation_adds_default_lists(): void
    {
        $response = $this->postJson('/api/boards', [
            'name' => 'Release Board',
            'description' => 'Track launch tasks.',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('name', 'Release Board')
            ->assertJsonCount(3, 'lists')
            ->assertJsonPath('lists.0.name', 'Todo')
            ->assertJsonPath('lists.1.name', 'Doing')
            ->assertJsonPath('lists.2.name', 'Done');
    }

    public function test_card_can_be_created_in_a_list(): void
    {
        $board = $this->postJson('/api/boards', [
            'name' => 'Card Board',
        ])->json();

        $listId = $board['lists'][0]['id'];

        $response = $this->postJson("/api/lists/{$listId}/cards", [
            'title' => 'Write launch notes',
            'description' => 'Summarize scope and deployment plan.',
            'due_date' => now()->addDay()->toDateString(),
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('title', 'Write launch notes')
            ->assertJsonPath('list_id', $listId);
    }
}
