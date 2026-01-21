<?php

use App\Models\Category;
use App\Repositories\CategoryRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->repository = new CategoryRepository();
    
    Category::create(['name' => 'Salary', 'type' => 'income', 'is_default' => true]);
    Category::create(['name' => 'Food & Dining', 'type' => 'expense', 'is_default' => true]);
    Category::create(['name' => 'Transportation', 'type' => 'expense', 'is_default' => true]);
});

test('can get all categories', function () {
    $categories = $this->repository->getAll();
    
    expect($categories)->toHaveCount(3);
});

test('can get category by id', function () {
    $category = Category::first();
    $found = $this->repository->getById($category->id);
    
    expect($found)->not->toBeNull()
        ->and($found->id)->toBe($category->id)
        ->and($found->name)->toBe($category->name);
});

test('returns null for non-existent category', function () {
    $found = $this->repository->getById(999);
    
    expect($found)->toBeNull();
});

test('can get categories by type', function () {
    $incomeCategories = $this->repository->getByType('income');
    $expenseCategories = $this->repository->getByType('expense');
    
    expect($incomeCategories)->toHaveCount(1)
        ->and($expenseCategories)->toHaveCount(2);
});

test('can create category', function () {
    $data = [
        'name' => 'Entertainment',
        'type' => 'expense',
        'is_default' => false,
    ];
    
    $category = $this->repository->create($data);
    
    expect($category->name)->toBe('Entertainment')
        ->and($category->type)->toBe('expense')
        ->and(Category::count())->toBe(4);
});

test('can update category', function () {
    $category = Category::first();
    $updated = $this->repository->update($category->id, ['name' => 'Updated Name']);
    
    expect($updated)->toBeTrue()
        ->and($category->fresh()->name)->toBe('Updated Name');
});

test('can delete category without transactions', function () {
    $category = Category::first();
    $deleted = $this->repository->delete($category->id);
    
    expect($deleted)->toBeTrue()
        ->and(Category::count())->toBe(2);
});

test('cannot delete category with transactions', function () {
    $category = Category::first();
    $category->transactions()->create([
        'type' => 'income',
        'amount' => 100,
        'date' => now(),
    ]);
    
    $deleted = $this->repository->delete($category->id);
    
    expect($deleted)->toBeFalse()
        ->and(Category::count())->toBe(3);
});

test('can check if category has transactions', function () {
    $category = Category::first();
    
    expect($this->repository->hasTransactions($category->id))->toBeFalse();
    
    $category->transactions()->create([
        'type' => 'income',
        'amount' => 100,
        'date' => now(),
    ]);
    
    expect($this->repository->hasTransactions($category->id))->toBeTrue();
});
