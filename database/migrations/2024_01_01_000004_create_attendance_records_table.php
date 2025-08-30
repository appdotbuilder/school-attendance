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
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('marked_by')->nullable()->constrained('users')->onDelete('set null');
            $table->date('date');
            $table->enum('status', ['present', 'absent', 'sick', 'excused', 'late']);
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'date']);
            $table->index(['date', 'status']);
            $table->index('marked_by');
            
            // Unique constraint to prevent duplicate entries for same user on same date
            $table->unique(['user_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};