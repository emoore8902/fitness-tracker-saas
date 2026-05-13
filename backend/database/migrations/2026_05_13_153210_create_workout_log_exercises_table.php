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
        Schema::create('workout_log_exercises', function (Blueprint $table) {
            $table->id();

            $table->foreignId('workout_log_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('exercise_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->unsignedInteger('sets')->nullable();

            $table->unsignedInteger('reps')->nullable();

            $table->decimal('weight', 6, 2)->nullable();

            $table->unsignedInteger('duration_minutes')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workout_log_exercises');
    }
};
