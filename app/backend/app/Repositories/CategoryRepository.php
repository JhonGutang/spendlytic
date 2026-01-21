<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository
{
    /**
     * Get all categories.
     */
    public function getAll(): Collection
    {
        return Category::orderBy('type')->orderBy('name')->get();
    }

    /**
     * Get a category by ID.
     */
    public function getById(int $id): ?Category
    {
        return Category::find($id);
    }

    /**
     * Get categories by type (income or expense).
     */
    public function getByType(string $type): Collection
    {
        return Category::where('type', $type)->orderBy('name')->get();
    }

    /**
     * Create a new category.
     */
    public function create(array $data): Category
    {
        return Category::create($data);
    }

    /**
     * Update a category.
     */
    public function update(int $id, array $data): bool
    {
        $category = $this->getById($id);
        
        if (!$category) {
            return false;
        }

        return $category->update($data);
    }

    /**
     * Delete a category.
     */
    public function delete(int $id): bool
    {
        $category = $this->getById($id);
        
        if (!$category) {
            return false;
        }

        // Check if category has transactions
        if ($category->transactions()->count() > 0) {
            return false;
        }

        return $category->delete();
    }

    /**
     * Check if a category has transactions.
     */
    public function hasTransactions(int $id): bool
    {
        $category = $this->getById($id);
        
        if (!$category) {
            return false;
        }

        return $category->transactions()->count() > 0;
    }
}
