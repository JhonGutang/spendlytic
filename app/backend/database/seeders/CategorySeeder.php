<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Income categories
            ['name' => 'Salary', 'type' => 'income', 'is_default' => true],
            ['name' => 'Freelance', 'type' => 'income', 'is_default' => true],
            ['name' => 'Investment', 'type' => 'income', 'is_default' => true],
            ['name' => 'Gift', 'type' => 'income', 'is_default' => true],
            ['name' => 'Other Income', 'type' => 'income', 'is_default' => true],

            // Expense categories
            ['name' => 'Food & Dining', 'type' => 'expense', 'is_default' => true],
            ['name' => 'Transportation', 'type' => 'expense', 'is_default' => true],
            ['name' => 'Shopping', 'type' => 'expense', 'is_default' => true],
            ['name' => 'Bills & Utilities', 'type' => 'expense', 'is_default' => true],
            ['name' => 'Entertainment', 'type' => 'expense', 'is_default' => true],
            ['name' => 'Healthcare', 'type' => 'expense', 'is_default' => true],
            ['name' => 'Education', 'type' => 'expense', 'is_default' => true],
            ['name' => 'Other Expense', 'type' => 'expense', 'is_default' => true],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
