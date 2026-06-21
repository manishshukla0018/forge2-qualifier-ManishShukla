<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\Member;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $members = collect([
            ['name' => 'Maya Chen', 'email' => 'maya@example.com', 'avatar_color' => '#2563eb'],
            ['name' => 'Sam Rivera', 'email' => 'sam@example.com', 'avatar_color' => '#059669'],
            ['name' => 'Avery Singh', 'email' => 'avery@example.com', 'avatar_color' => '#dc2626'],
        ])->map(fn (array $member) => Member::firstOrCreate(
            ['email' => $member['email']],
            $member,
        ));

        $tags = collect([
            ['name' => 'Feature', 'color' => '#2563eb'],
            ['name' => 'Bug', 'color' => '#dc2626'],
            ['name' => 'Design', 'color' => '#9333ea'],
            ['name' => 'Ops', 'color' => '#f59e0b'],
        ])->map(fn (array $tag) => Tag::firstOrCreate(
            ['name' => $tag['name']],
            $tag,
        ));

        $board = Board::firstOrCreate(
            ['name' => 'Forge 2 Launch Board'],
            ['description' => 'Demo Kanban board for planning and tracking product work.'],
        );

        $lists = collect(['Todo', 'Doing', 'Done'])->mapWithKeys(function (string $name, int $position) use ($board) {
            $list = $board->lists()->firstOrCreate(
                ['name' => $name],
                ['position' => $position],
            );

            return [$name => $list];
        });

        $cards = [
            [
                'list' => 'Todo',
                'title' => 'Finalize production deployment checklist',
                'description' => 'Confirm Render/Railway env vars, Vercel API URL, and health checks before launch.',
                'member' => 0,
                'due_date' => Carbon::today()->subDay()->toDateString(),
                'tags' => ['Ops'],
            ],
            [
                'list' => 'Todo',
                'title' => 'Polish card editing workflow',
                'description' => 'Make title, description, due date, member, and labels editable in one modal.',
                'member' => 1,
                'due_date' => Carbon::today()->addDays(3)->toDateString(),
                'tags' => ['Feature', 'Design'],
            ],
            [
                'list' => 'Doing',
                'title' => 'Implement API integration',
                'description' => 'Wire board loading and card mutations to the Laravel API.',
                'member' => 2,
                'due_date' => Carbon::today()->addDay()->toDateString(),
                'tags' => ['Feature'],
            ],
            [
                'list' => 'Done',
                'title' => 'Create initial board schema',
                'description' => 'Boards, lists, cards, tags, and members are modeled with relationships.',
                'member' => 0,
                'due_date' => Carbon::today()->subDays(2)->toDateString(),
                'tags' => ['Feature'],
            ],
        ];

        foreach ($cards as $position => $cardData) {
            $card = $lists[$cardData['list']]->cards()->firstOrCreate(
                ['title' => $cardData['title']],
                [
                    'description' => $cardData['description'],
                    'member_id' => $members[$cardData['member']]->id,
                    'due_date' => $cardData['due_date'],
                    'position' => $position,
                ],
            );

            $card->tags()->sync(
                $tags->whereIn('name', $cardData['tags'])->pluck('id')->all(),
            );
        }
    }
}
