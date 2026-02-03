<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedbackHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'week_start',
        'week_end',
        'rule_id',
        'category_name',
        'template_id',
        'level',
        'explanation',
        'suggestion',
        'data',
        'displayed',
        'user_acknowledged',
    ];

    protected $casts = [
        'data' => 'array',
        'displayed' => 'boolean',
        'user_acknowledged' => 'boolean',
        'week_start' => 'date:Y-m-d',
        'week_end' => 'date:Y-m-d',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
