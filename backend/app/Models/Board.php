<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Board extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function lists(): HasMany
    {
        return $this->hasMany(ListModel::class)->orderBy('position');
    }
}
