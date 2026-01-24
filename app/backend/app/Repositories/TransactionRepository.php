<?php

namespace App\Repositories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class TransactionRepository
{
    /**
     * Get all transactions with category relationship.
     */
    public function getAll(int $userId): Collection
    {
        return Transaction::with('category')
            ->where('user_id', $userId)
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get a transaction by ID.
     */
    public function getById(int $id, int $userId): ?Transaction
    {
        return Transaction::with('category')
            ->where('user_id', $userId)
            ->where('id', $id)
            ->first();
    }

    /**
     * Get transactions by date range.
     */
    public function getByDateRange(string $startDate, string $endDate, int $userId): Collection
    {
        return Transaction::with('category')
            ->where('user_id', $userId)
            ->whereDate('date', '>=', $startDate)
            ->whereDate('date', '<=', $endDate)
            ->orderBy('date', 'desc')
            ->get();
    }

    /**
     * Get transactions by category.
     */
    public function getByCategory(int $categoryId, int $userId): Collection
    {
        return Transaction::with('category')
            ->where('user_id', $userId)
            ->where('category_id', $categoryId)
            ->orderBy('date', 'desc')
            ->get();
    }

    /**
     * Get transactions by type (income or expense).
     */
    public function getByType(string $type, int $userId): Collection
    {
        return Transaction::with('category')
            ->where('user_id', $userId)
            ->where('type', $type)
            ->orderBy('date', 'desc')
            ->get();
    }

    /**
     * Create a new transaction.
     */
    public function create(array $data): Transaction
    {
        return Transaction::create($data);
    }

    /**
     * Update a transaction.
     */
    public function update(int $id, int $userId, array $data): bool
    {
        $transaction = $this->getById($id, $userId);
        
        if (!$transaction) {
            return false;
        }

        return $transaction->update($data);
    }

    /**
     * Delete a transaction.
     */
    public function delete(int $id, int $userId): bool
    {
        $transaction = $this->getById($id, $userId);
        
        if (!$transaction) {
            return false;
        }

        return $transaction->delete();
    }

    /**
     * Get summary statistics.
     */
    public function getSummary(int $userId): array
    {
        $query = Transaction::where('user_id', $userId);
        
        $income = (clone $query)->where('type', 'income')->sum('amount');
        $expenses = (clone $query)->where('type', 'expense')->sum('amount');

        return [
            'total_income' => (float) $income,
            'total_expenses' => (float) $expenses,
            'net_balance' => (float) ($income - $expenses),
            'transaction_count' => (clone $query)->count(),
        ];
    }

    /**
     * Get expense breakdown by category.
     */
    public function getExpensesByCategory(int $userId): Collection
    {
        return Transaction::select('category_id', DB::raw('SUM(amount) as total'))
            ->with('category')
            ->where('user_id', $userId)
            ->where('type', 'expense')
            ->groupBy('category_id')
            ->orderBy('total', 'desc')
            ->get();
    }
}
