<?php

use App\Models\AttendanceRecord;
use App\Models\User;

test('teacher can access attendance dashboard', function () {
    $teacher = User::factory()->teacher()->create();

    $response = $this->actingAs($teacher)
        ->get(route('attendance.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($assert) => $assert
        ->component('attendance/teacher-dashboard')
        ->has('students')
        ->has('selectedDate')
    );
});

test('student can access attendance dashboard', function () {
    $student = User::factory()->student()->create();

    $response = $this->actingAs($student)
        ->get(route('attendance.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($assert) => $assert
        ->component('attendance/student-dashboard')
        ->has('attendanceRecords')
    );
});

test('teacher can mark student attendance', function () {
    $teacher = User::factory()->teacher()->create();
    $student = User::factory()->student()->create(['teacher_id' => $teacher->id]);

    $response = $this->actingAs($teacher)
        ->post(route('attendance.store'), [
            'user_id' => $student->id,
            'date' => today()->toDateString(),
            'status' => 'present',
            'notes' => 'Test attendance',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('attendance_records', [
        'user_id' => $student->id,
        'marked_by' => $teacher->id,
        'status' => 'present',
        'notes' => 'Test attendance',
    ]);
});

test('teacher can mark own attendance', function () {
    $teacher = User::factory()->teacher()->create();

    $response = $this->actingAs($teacher)
        ->post(route('attendance.store'), [
            'date' => today()->toDateString(),
            'status' => 'present',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('attendance_records', [
        'user_id' => $teacher->id,
        'marked_by' => $teacher->id,
        'status' => 'present',
    ]);
});

test('student can mark own attendance', function () {
    $student = User::factory()->student()->create();

    $response = $this->actingAs($student)
        ->post(route('attendance.store'), [
            'date' => today()->toDateString(),
            'status' => 'present',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('attendance_records', [
        'user_id' => $student->id,
        'marked_by' => $student->id,
        'status' => 'present',
    ]);
});

test('student cannot mark other student attendance', function () {
    $student1 = User::factory()->student()->create();
    $student2 = User::factory()->student()->create();

    $response = $this->actingAs($student1)
        ->post(route('attendance.store'), [
            'user_id' => $student2->id,
            'date' => today()->toDateString(),
            'status' => 'present',
        ]);

    $response->assertStatus(403);
});

test('teacher cannot mark attendance for unassigned student', function () {
    $teacher = User::factory()->teacher()->create();
    $student = User::factory()->student()->create(); // No teacher assigned

    $response = $this->actingAs($teacher)
        ->post(route('attendance.store'), [
            'user_id' => $student->id,
            'date' => today()->toDateString(),
            'status' => 'present',
        ]);

    $response->assertStatus(403);
});

test('attendance record updates existing record for same date', function () {
    $teacher = User::factory()->teacher()->create();
    $date = '2024-01-15'; // Use a fixed date to avoid any date formatting issues
    
    // Create first attendance record
    $response1 = $this->actingAs($teacher)
        ->post(route('attendance.store'), [
            'date' => $date,
            'status' => 'present',
        ]);
    
    $response1->assertRedirect();
    $response1->assertSessionHas('success');

    // Verify first record was created
    $this->assertDatabaseCount('attendance_records', 1);

    // Try to create duplicate record - should update existing
    $response2 = $this->actingAs($teacher)
        ->post(route('attendance.store'), [
            'date' => $date,
            'status' => 'late',
            'notes' => 'Updated status',
        ]);

    $response2->assertRedirect();
    $response2->assertSessionHas('success');

    // Should still only have one record
    $this->assertDatabaseCount('attendance_records', 1);

    // Should be updated with new status
    $this->assertDatabaseHas('attendance_records', [
        'user_id' => $teacher->id,
        'status' => 'late',
        'notes' => 'Updated status',
    ]);
});