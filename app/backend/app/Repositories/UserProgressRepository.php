<?php

namespace App\Repositories;

use App\Models\UserProgress;
use Illuminate\Database\Eloquent\Collection;

class UserProgressRepository
{
    /**
     * Get the most recent progress records for a user.
     */
    public function getRecent(int $userId, int $limit = 4): Collection
    {
        return UserProgress::where('user_id', $userId)
            ->orderBy('week_start', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get progress for a specific week.
     */
    public function getByWeek(int $userId, string $startDate): ?UserProgress
    {
        return UserProgress::where('user_id', $userId)
            ->where('week_start', $startDate)
            ->first();
    }

    /**
     * Create or update a progress record.
     */
    public function updateOrCreate(array $attributes, array $values): UserProgress
    {
        return UserProgress::updateOrCreate($attributes, $values);
    }
}
