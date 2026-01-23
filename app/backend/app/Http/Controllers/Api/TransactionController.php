<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TransactionService;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    public function __construct(
        private TransactionService $transactionService,
        private AnalyticsService $analyticsService
    ) {}

    /**
     * Display a listing of transactions.
     */
    public function index(Request $request): JsonResponse
    {
        $type = $request->query('type');
        $categoryId = $request->query('category_id');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        if ($startDate && $endDate) {
            $transactions = $this->transactionService->getTransactionsByDateRange($startDate, $endDate);
        } elseif ($categoryId) {
            $transactions = $this->transactionService->getTransactionsByCategory($categoryId);
        } elseif ($type) {
            $transactions = $this->transactionService->getTransactionsByType($type);
        } else {
            $transactions = $this->transactionService->getAllTransactions();
        }

        return response()->json([
            'success' => true,
            'data' => $transactions,
        ]);
    }

    /**
     * Store a newly created transaction.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $transaction = $this->transactionService->createTransaction($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Transaction created successfully',
                'data' => $transaction->load('category'),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Display the specified transaction.
     */
    public function show(int $id): JsonResponse
    {
        $transaction = $this->transactionService->getTransactionById($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $transaction,
        ]);
    }

    /**
     * Update the specified transaction.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $updated = $this->transactionService->updateTransaction($id, $request->all());

            if (!$updated) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaction not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Transaction updated successfully',
                'data' => $this->transactionService->getTransactionById($id),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Remove the specified transaction.
     */
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->transactionService->deleteTransaction($id);

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaction deleted successfully',
        ]);
    }

    /**
     * Get financial summary.
     */
    public function summary(): JsonResponse
    {
        $summary = $this->transactionService->getSummary();
        $expensesByCategory = $this->transactionService->getExpensesByCategory();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => $summary,
                'expenses_by_category' => $expensesByCategory,
            ],
        ]);
    }

    /**
     * Get daily analytics data.
     */
    public function dailyAnalytics(Request $request): JsonResponse
    {
        $days = $request->query('days', 30);
        $data = $this->analyticsService->getDailyFlow((int) $days);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Get monthly analytics data.
     */
    public function monthlyAnalytics(Request $request): JsonResponse
    {
        $months = $request->query('months', 12);
        $data = $this->analyticsService->getMonthlyFlow((int) $months);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Get yearly analytics data.
     */
    public function yearlyAnalytics(): JsonResponse
    {
        $data = $this->analyticsService->getYearlyFlow();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
