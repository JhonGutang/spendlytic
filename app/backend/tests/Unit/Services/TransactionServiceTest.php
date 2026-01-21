<?php

use App\Models\Category;
use App\Models\Transaction;
use App\Services\TransactionService;
use App\Repositories\TransactionRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->repository = new TransactionRepository();
    $this->service = new TransactionService($this->repository);
    
    $this->category = Category::create(['name' => 'Food', 'type' => 'expense']);
    
    Transaction::create([
        'type' => 'expense',
        'amount' => 150,
        'date' => now(),
        'category_id' => $this->category->id,
    ]);
});

test('can get all transactions', function () {
    $transactions = $this->service->getAllTransactions();
    
    expect($transactions)->toHaveCount(1);
});

test('can create valid transaction', function () {
    $data = [
        'type' => 'expense',
        'amount' => 75.50,
        'date' => now()->format('Y-m-d'),
        'category_id' => $this->category->id,
        'description' => 'Test',
    ];
    
    $transaction = $this->service->createTransaction($data);
    
    expect($transaction->amount)->toBe('75.50')
        ->and(Transaction::count())->toBe(2);
});

test('validates transaction type is required', function () {
    expect(fn() => $this->service->createTransaction([
        'amount' => 100,
        'date' => now()->format('Y-m-d'),
        'category_id' => $this->category->id,
    ]))->toThrow(ValidationException::class);
});

test('validates transaction amount is required', function () {
    expect(fn() => $this->service->createTransaction([
        'type' => 'expense',
        'date' => now()->format('Y-m-d'),
        'category_id' => $this->category->id,
    ]))->toThrow(ValidationException::class);
});

test('validates transaction amount must be positive', function () {
    expect(fn() => $this->service->createTransaction([
        'type' => 'expense',
        'amount' => -100,
        'date' => now()->format('Y-m-d'),
        'category_id' => $this->category->id,
    ]))->toThrow(ValidationException::class);
});

test('validates transaction date is required', function () {
    expect(fn() => $this->service->createTransaction([
        'type' => 'expense',
        'amount' => 100,
        'category_id' => $this->category->id,
    ]))->toThrow(ValidationException::class);
});

test('validates transaction date cannot be in future', function () {
    expect(fn() => $this->service->createTransaction([
        'type' => 'expense',
        'amount' => 100,
        'date' => now()->addDay()->format('Y-m-d'),
        'category_id' => $this->category->id,
    ]))->toThrow(ValidationException::class);
});

test('validates category must exist', function () {
    expect(fn() => $this->service->createTransaction([
        'type' => 'expense',
        'amount' => 100,
        'date' => now()->format('Y-m-d'),
        'category_id' => 999,
    ]))->toThrow(ValidationException::class);
});

test('can get summary', function () {
    $summary = $this->service->getSummary();
    
    expect($summary)->toHaveKeys(['total_income', 'total_expenses', 'net_balance', 'transaction_count'])
        ->and($summary['total_expenses'])->toBe(150.0);
});

test('can update transaction', function () {
    $transaction = Transaction::first();
    $updated = $this->service->updateTransaction($transaction->id, ['amount' => 200]);
    
    expect($updated)->toBeTrue()
        ->and($transaction->fresh()->amount)->toBe('200.00');
});

test('can delete transaction', function () {
    $transaction = Transaction::first();
    $deleted = $this->service->deleteTransaction($transaction->id);
    
    expect($deleted)->toBeTrue()
        ->and(Transaction::count())->toBe(0);
});
