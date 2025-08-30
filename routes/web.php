<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        // Redirect to attendance dashboard based on user role
        return redirect()->route('attendance.index');
    })->name('dashboard');

    // Attendance routes
    Route::controller(App\Http\Controllers\AttendanceController::class)->group(function () {
        Route::get('/attendance', 'index')->name('attendance.index');
        Route::post('/attendance', 'store')->name('attendance.store');
        Route::patch('/attendance/{attendanceRecord}', 'update')->name('attendance.update');
        Route::delete('/attendance/{attendanceRecord}', 'destroy')->name('attendance.destroy');
        Route::get('/attendance/student/{user}', 'show')->name('attendance.student.show');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
