<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\AttendanceRecord;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display the attendance dashboard.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $date = $request->get('date', today()->format('Y-m-d'));

        if ($user->isTeacher()) {
            // Teacher dashboard: show their students' attendance
            $students = $user->students()
                ->with(['attendanceRecords' => function ($query) use ($date) {
                    $query->where('date', $date);
                }])
                ->orderBy('name')
                ->get();

            // Get teacher's own attendance for the selected date
            $teacherAttendance = $user->attendanceRecords()
                ->where('date', $date)
                ->first();

            return Inertia::render('attendance/teacher-dashboard', [
                'students' => $students,
                'teacherAttendance' => $teacherAttendance,
                'selectedDate' => $date,
            ]);
        } else {
            // Student view: show their own attendance history
            $attendanceRecords = $user->attendanceRecords()
                ->with('marker:id,name')
                ->orderBy('date', 'desc')
                ->paginate(10);

            $todayAttendance = $user->attendanceRecords()
                ->where('date', today())
                ->first();

            return Inertia::render('attendance/student-dashboard', [
                'attendanceRecords' => $attendanceRecords,
                'todayAttendance' => $todayAttendance,
            ]);
        }
    }

    /**
     * Store attendance record.
     */
    public function store(StoreAttendanceRequest $request)
    {
        $validated = $request->validated();
        $user = auth()->user();

        // Set marked_by to current user
        $validated['marked_by'] = $user->id;

        // If no user_id specified, assume it's for the current user (self-marking)
        if (!isset($validated['user_id'])) {
            $validated['user_id'] = $user->id;
        }

        // Verify teacher can only mark attendance for their students or themselves
        if ($user->isTeacher() && $validated['user_id'] !== $user->id) {
            $student = User::find($validated['user_id']);
            if (!$student || $student->teacher_id !== $user->id) {
                abort(403, 'You can only mark attendance for your assigned students.');
            }
        }

        // Students can only mark their own attendance
        if ($user->isStudent() && $validated['user_id'] !== $user->id) {
            abort(403, 'Students can only mark their own attendance.');
        }

        // Create or update attendance record
        $attendance = AttendanceRecord::where('user_id', $validated['user_id'])
            ->whereDate('date', $validated['date'])
            ->first();

        if ($attendance) {
            // Update existing record
            $attendance->update([
                'status' => $validated['status'],
                'notes' => $validated['notes'] ?? null,
                'marked_by' => $validated['marked_by'],
            ]);
        } else {
            // Create new record
            $attendance = AttendanceRecord::create([
                'user_id' => $validated['user_id'],
                'date' => $validated['date'],
                'status' => $validated['status'],
                'notes' => $validated['notes'] ?? null,
                'marked_by' => $validated['marked_by'],
            ]);
        }

        return redirect()->back()->with('success', 'Attendance marked successfully.');
    }

    /**
     * Update attendance record.
     */
    public function update(UpdateAttendanceRequest $request, AttendanceRecord $attendanceRecord)
    {
        $validated = $request->validated();
        $user = auth()->user();

        // Verify permissions
        if ($user->isTeacher()) {
            // Teachers can update their own attendance or their students' attendance
            if ($attendanceRecord->user_id !== $user->id && $attendanceRecord->user->teacher_id !== $user->id) {
                abort(403, 'You can only update attendance for yourself or your assigned students.');
            }
        } else {
            // Students can only update their own attendance
            if ($attendanceRecord->user_id !== $user->id) {
                abort(403, 'You can only update your own attendance.');
            }
        }

        $validated['marked_by'] = $user->id;
        $attendanceRecord->update($validated);

        return redirect()->back()->with('success', 'Attendance updated successfully.');
    }

    /**
     * Remove attendance record.
     */
    public function destroy(AttendanceRecord $attendanceRecord)
    {
        $user = auth()->user();

        // Verify permissions
        if ($user->isTeacher()) {
            // Teachers can delete their own attendance or their students' attendance
            if ($attendanceRecord->user_id !== $user->id && $attendanceRecord->user->teacher_id !== $user->id) {
                abort(403, 'You can only delete attendance for yourself or your assigned students.');
            }
        } else {
            // Students can only delete their own attendance
            if ($attendanceRecord->user_id !== $user->id) {
                abort(403, 'You can only delete your own attendance.');
            }
        }

        $attendanceRecord->delete();

        return redirect()->back()->with('success', 'Attendance record deleted successfully.');
    }

    /**
     * Show student attendance history for teachers.
     */
    public function show(User $user)
    {
        $currentUser = auth()->user();

        // Only teachers can view detailed student attendance
        if (!$currentUser->isTeacher()) {
            abort(403, 'Only teachers can view detailed student attendance.');
        }

        // Verify the student belongs to this teacher
        if ($user->teacher_id !== $currentUser->id) {
            abort(403, 'You can only view attendance for your assigned students.');
        }

        $attendanceRecords = $user->attendanceRecords()
            ->with('marker:id,name')
            ->orderBy('date', 'desc')
            ->paginate(20);

        return Inertia::render('attendance/student-details', [
            'student' => $user,
            'attendanceRecords' => $attendanceRecords,
        ]);
    }
}