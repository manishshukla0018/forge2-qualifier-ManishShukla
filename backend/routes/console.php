<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('forge:about', function (): void {
    $this->info('Forge 2 Kanban API');
});
