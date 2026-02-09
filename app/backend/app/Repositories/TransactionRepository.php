<?php

namespace App\Repositories;

use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class TransactionRepository
{
    public function getAll(int $userId): Collection
    {
        return Transaction::with('category')
            ->where('user_id', $userId)
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get filtered and paginated transactions.
     *
     * @param int $userId
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getFilteredPaginated(int $userId, array $filters, int $perPage = 10): LengthAwarePaginator
    {
        $query = Transaction::with('category')
            ->where('user_id', $userId)
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc');

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (! empty($filters['start_date'])) {
            $query->whereDate('date', '>=', $filters['start_date']);
        }

        if (! empty($filters['end_date'])) {
            $query->whereDate('date', '<=', $filters['end_date']);
        }

        if (isset($filters['min_amount'])) {
            $query->where('amount', '>=', $filters['min_amount']);
        }

        if (isset($filters['max_amount'])) {
            $query->where('amount', '<=', $filters['max_amount']);
        }

        return $query->paginate($perPage);
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

        if (! $transaction) {
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

        if (! $transaction) {
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

        // Calculate trends (Month over Month)
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        $endOfLastMonth = Carbon::now()->subMonth()->endOfMonth();

        $incomeThisMonth = (clone $query)->where('type', 'income')
            ->whereDate('date', '>=', $thisMonth)
            ->sum('amount');

        $incomeLastMonth = (clone $query)->where('type', 'income')
            ->whereDate('date', '>=', $lastMonth)
            ->whereDate('date', '<=', $endOfLastMonth)
            ->sum('amount');

        $expensesThisMonth = (clone $query)->where('type', 'expense')
            ->whereDate('date', '>=', $thisMonth)
            ->sum('amount');

        $expensesLastMonth = (clone $query)->where('type', 'expense')
            ->whereDate('date', '>=', $lastMonth)
            ->whereDate('date', '<=', $endOfLastMonth)
            ->sum('amount');

        $calculateTrend = function ($current, $previous) {
            if ($previous == 0) {
                return $current > 0 ? 100 : 0;
            }
            return (($current - $previous) / $previous) * 100;
        };

        $netBalanceThisMonth = $incomeThisMonth - $expensesThisMonth;
        $netBalanceLastMonth = $incomeLastMonth - $expensesLastMonth;

        return [
            'total_income' => (float) $income,
            'total_expenses' => (float) $expenses,
            'net_balance' => (float) ($income - $expenses),
            'transaction_count' => (clone $query)->count(),
            'income_this_month' => (float) $incomeThisMonth,
            'expenses_this_month' => (float) $expensesThisMonth,
            'net_balance_this_month' => (float) $netBalanceThisMonth,
            'income_trend' => (float) $calculateTrend($incomeThisMonth, $incomeLastMonth),
            'expense_trend' => (float) $calculateTrend($expensesThisMonth, $expensesLastMonth),
            'net_balance_trend' => (float) $calculateTrend($netBalanceThisMonth, $netBalanceLastMonth),
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

    /**
     * Get weekly aggregation data for rule evaluation.
     */
    public function getWeeklySummary(int $userId, string $startDate, string $endDate): array
    {
        $baseQuery = Transaction::where('transactions.user_id', $userId)
            ->whereDate('transactions.date', '>=', $startDate)
            ->whereDate('transactions.date', '<=', $endDate)
            ->where('transactions.type', 'expense');

        $totalExpenses = (clone $baseQuery)->sum('transactions.amount');
        $transactionCount = (clone $baseQuery)->count();
        $smallTransactionCount = (clone $baseQuery)->where('transactions.amount', '<', 10)->count();

        $categoryTotals = (clone $baseQuery)
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->select('categories.name as category_name', DB::raw('SUM(transactions.amount) as total'))
            ->groupBy('categories.name')
            ->get()
            ->pluck('total', 'category_name')
            ->map(fn($total) => (float) $total)
            ->toArray();

        // Also get total amount for small transactions as needed for Rule 3 metadata
        $smallTransactionTotal = (clone $baseQuery)->where('transactions.amount', '<', 10)->sum('transactions.amount');

        return [
            'total_expenses' => (float) $totalExpenses,
            'transaction_count' => $transactionCount,
            'small_transaction_count' => $smallTransactionCount,
            'small_transaction_total' => (float) $smallTransactionTotal,
            'category_totals' => $categoryTotals,
        ];
    }

    /**
     * Get the latest update timestamp for transactions in a date range.
     */
    public function getLastUpdateTimestamp(int $userId, string $startDate, string $endDate): ?string
    {
        return Transaction::where('user_id', $userId)
            ->whereDate('date', '>=', $startDate)
            ->whereDate('date', '<=', $endDate)
            ->max('updated_at');
    }
}
