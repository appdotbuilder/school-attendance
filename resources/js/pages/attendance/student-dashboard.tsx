import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
// Button import removed as it's not used
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
    if (formatStr === 'MMM do') {
        return d.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }
    return d.toLocaleDateString();
};

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

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    total: number;
    per_page: number;
}

interface Props {
    attendanceRecords: {
        data: AttendanceRecord[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    todayAttendance: AttendanceRecord | null;
    [key: string]: unknown;
}

export default function StudentDashboard({ attendanceRecords, todayAttendance }: Props) {
    const [isMarking, setIsMarking] = useState(false);

    const markTodayAttendance = (status: string, notes?: string) => {
        setIsMarking(true);
        router.post(route('attendance.store'), {
            date: formatDate(new Date(), 'yyyy-MM-dd'),
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

    // Calculate attendance statistics
    const totalDays = attendanceRecords.data.length;
    const presentDays = attendanceRecords.data.filter(record => record.status === 'present').length;
    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    return (
        <AppShell>
            <Head title="Student Dashboard - Attendance" />
            
            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">🎒 Your Attendance Dashboard</h1>
                        <p className="text-gray-600 mt-2">Track your attendance history and current status</p>
                    </div>

                    {/* Today's attendance */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📅 Today's Attendance - {formatDate(new Date(), 'EEEE, MMMM do, yyyy')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {todayAttendance ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{getStatusEmoji(todayAttendance.status)}</span>
                                            {getStatusBadge(todayAttendance.status)}
                                            {todayAttendance.notes && (
                                                <span className="text-sm text-gray-600">- {todayAttendance.notes}</span>
                                            )}
                                            {todayAttendance.marker && (
                                                <span className="text-sm text-gray-500">
                                                    Marked by: {todayAttendance.marker.name}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">No attendance marked for today</span>
                                    )}
                                </div>
                                <AttendanceStatusSelect
                                    currentStatus={todayAttendance?.status}
                                    onStatusChange={markTodayAttendance}
                                    disabled={isMarking}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendance statistics */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                                        <p className="text-2xl font-bold text-green-600">{attendanceRate}%</p>
                                    </div>
                                    <div className="text-3xl">📈</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Present Days</p>
                                        <p className="text-2xl font-bold text-blue-600">{presentDays}</p>
                                    </div>
                                    <div className="text-3xl">✅</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Days</p>
                                        <p className="text-2xl font-bold text-gray-600">{totalDays}</p>
                                    </div>
                                    <div className="text-3xl">📊</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Attendance history */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📋 Attendance History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {attendanceRecords.data.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-4">📝</div>
                                    <p>No attendance records yet.</p>
                                    <p className="text-sm">Mark your attendance to get started!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {attendanceRecords.data.map((record) => (
                                        <div
                                            key={record.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl">{getStatusEmoji(record.status)}</span>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {formatDate(new Date(record.date), 'EEEE, MMMM do, yyyy')}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {record.marker ? `Marked by: ${record.marker.name}` : 'Self-marked'}
                                                    </p>
                                                    {record.notes && (
                                                        <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(record.status)}
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(new Date(record.date), 'MMM do')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {attendanceRecords.links && attendanceRecords.links.length > 3 && (
                                <div className="mt-6 flex justify-center space-x-2">
                                    {attendanceRecords.links.map((link, index) => {
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 text-gray-400 cursor-not-allowed"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }

                                        return (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 rounded ${
                                                    link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
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