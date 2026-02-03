<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('feedback_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('week_start');
            $table->date('week_end');
            $table->string('rule_id');
            $table->string('category_name')->nullable();
            $table->string('template_id');
            $table->enum('level', ['basic', 'advanced']);
            $table->text('explanation');
            $table->text('suggestion');
            $table->json('data');
            $table->boolean('displayed')->default(false);
            $table->boolean('user_acknowledged')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'week_start']);
            $table->index('rule_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback_histories');
    }
};
