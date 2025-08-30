import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/app-shell';
import { AttendanceStatusSelect } from '@/components/attendance-status-select';
// Helper function to format dates
const formatDate = (date: string | Date, formatStr: string) => {
    const d = new Date(date);
    if (formatStr === 'yyyy-MM-dd') {
        return d.toISOString().split('T')[0];
    }
    if (formatStr === 'EEEE, MMMM do, yyyy') {
        return d.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    if (formatStr === 'MMM do, yyyy') {
        return d.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    return d.toLocaleDateString();
};

interface User {
    id: number;
    name: string;
    email: string;
    student_id?: string;
    attendance_records: AttendanceRecord[];
}

interface AttendanceRecord {
    id: number;
    date: string;
    status: string;
    notes?: string;
    marker?: {
        id: number;
        name: string;
    };
}

interface Props {
    students: User[];
    teacherAttendance: AttendanceRecord | null;
    selectedDate: string;
    [key: string]: unknown;
}

export default function TeacherDashboard({ students, teacherAttendance, selectedDate }: Props) {
    const [currentDate, setCurrentDate] = useState(selectedDate);
    const [isMarking, setIsMarking] = useState(false);

    const handleDateChange = (newDate: string) => {
        setCurrentDate(newDate);
        router.get(route('attendance.index'), { date: newDate }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const markAttendance = (userId: number, status: string, notes?: string) => {
        setIsMarking(true);
        router.post(route('attendance.store'), {
            user_id: userId,
            date: currentDate,
            status,
            notes: notes || null,
        }, {
            preserveState: true,
            onFinish: () => setIsMarking(false),
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            present: { label: 'Present', color: 'bg-green-100 text-green-800' },
            absent: { label: 'Absent', color: 'bg-red-100 text-red-800' },
            sick: { label: 'Sick', color: 'bg-orange-100 text-orange-800' },
            excused: { label: 'Excused', color: 'bg-blue-100 text-blue-800' },
            late: { label: 'Late', color: 'bg-yellow-100 text-yellow-800' },
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <Badge className={config?.color || 'bg-gray-100 text-gray-800'}>
                {config?.label || status}
            </Badge>
        );
    };

    const getStatusEmoji = (status: string) => {
        const emojis = {
            present: '✅',
            absent: '❌',
            sick: '🤒',
            excused: '📝',
            late: '⏰'
        };
        return emojis[status as keyof typeof emojis] || '❓';
    };

    return (
        <AppShell>
            <Head title="Teacher Dashboard - Attendance" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">👩‍🏫 Teacher Attendance Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage your attendance and track your students</p>
                    </div>

                    {/* Date selector */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <label htmlFor="date" className="text-sm font-medium">Select Date:</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={currentDate}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    max={formatDate(new Date(), 'yyyy-MM-dd')}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                <span className="text-sm text-gray-500">
                                    {formatDate(new Date(currentDate), 'EEEE, MMMM do, yyyy')}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Teacher's own attendance */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📋 Your Attendance for {formatDate(new Date(currentDate), 'MMM do, yyyy')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {teacherAttendance ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{getStatusEmoji(teacherAttendance.status)}</span>
                                            {getStatusBadge(teacherAttendance.status)}
                                            {teacherAttendance.notes && (
                                                <span className="text-sm text-gray-600">- {teacherAttendance.notes}</span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">No attendance marked</span>
                                    )}
                                </div>
                                <AttendanceStatusSelect
                                    currentStatus={teacherAttendance?.status}
                                    onStatusChange={(status) => markAttendance(0, status)} // 0 means self
                                    disabled={isMarking}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Students attendance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    🎒 Students Attendance ({students.length} students)
                                </span>
                                <div className="text-sm font-normal text-gray-500">
                                    Present: {students.filter(s => s.attendance_records[0]?.status === 'present').length} | 
                                    Absent: {students.filter(s => s.attendance_records[0]?.status === 'absent' || !s.attendance_records[0]).length}
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {students.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-4">👥</div>
                                    <p>No students assigned to you yet.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {students.map((student) => {
                                        const attendance = student.attendance_records[0];
                                        return (
                                            <div
                                                key={student.id}
                                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-800">
                                                                {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            {student.student_id} • {student.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-4">
                                                    {attendance && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl">{getStatusEmoji(attendance.status)}</span>
                                                            {getStatusBadge(attendance.status)}
                                                        </div>
                                                    )}
                                                    
                                                    <AttendanceStatusSelect
                                                        currentStatus={attendance?.status}
                                                        onStatusChange={(status) => markAttendance(student.id, status)}
                                                        disabled={isMarking}
                                                    />
                                                    
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.get(route('attendance.student.show', student.id))}
                                                    >
                                                        View History
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}