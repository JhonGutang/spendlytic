<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProgress extends Model
{
    use HasFactory;

    protected $table = 'user_progress';

    protected $fillable = [
        'user_id',
        'week_start',
        'week_end',
        'rules_triggered',
        'rules_not_triggered',
        'improvement_score',
    ];

    protected $casts = [
        'rules_triggered' => 'array',
        'rules_not_triggered' => 'array',
        'week_start' => 'date:Y-m-d',
        'week_end' => 'date:Y-m-d',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
