<?php

namespace Database\Seeders;

use App\Models\AttendanceRecord;
use App\Models\User;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create teachers
        $teachers = User::factory()->teacher()->count(3)->create();

        foreach ($teachers as $teacher) {
            // Create 5-10 students for each teacher
            $students = User::factory()
                ->student()
                ->count(random_int(5, 10))
                ->create(['teacher_id' => $teacher->id]);

            // Create attendance records for the last 30 days
            for ($i = 0; $i < 30; $i++) {
                $date = now()->subDays($i)->format('Y-m-d');

                // Teacher marks their own attendance (80% chance)
                if (fake()->boolean(80)) {
                    AttendanceRecord::factory()->create([
                        'user_id' => $teacher->id,
                        'marked_by' => $teacher->id,
                        'date' => $date,
                        'status' => fake()->randomElement(['present', 'absent', 'sick', 'late']),
                    ]);
                }

                // Mark attendance for each student (85% chance per student per day)
                foreach ($students as $student) {
                    if (fake()->boolean(85)) {
                        AttendanceRecord::factory()->create([
                            'user_id' => $student->id,
                            'marked_by' => $teacher->id,
                            'date' => $date,
                            'status' => fake()->randomElement([
                                'present', 'present', 'present', 'present', // Higher chance of present
                                'absent', 'sick', 'excused', 'late'
                            ]),
                        ]);
                    }
                }
            }
        }

        // Create some students without teachers (unassigned)
        $unassignedStudents = User::factory()
            ->student()
            ->count(5)
            ->create(['teacher_id' => null]);

        // Create some attendance records for unassigned students (self-marked)
        foreach ($unassignedStudents as $student) {
            for ($i = 0; $i < 15; $i++) {
                $date = now()->subDays($i)->format('Y-m-d');
                if (fake()->boolean(70)) {
                    AttendanceRecord::factory()->create([
                        'user_id' => $student->id,
                        'marked_by' => $student->id,
                        'date' => $date,
                    ]);
                }
            }
        }
    }
}