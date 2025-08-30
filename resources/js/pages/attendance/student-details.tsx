import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/app-shell';
// Helper function to format dates
const formatDate = (date: string | Date, formatStr: string) => {
    const d = new Date(date);
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
// Simple arrow left icon
const ArrowLeft = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

interface User {
    id: number;
    name: string;
    email: string;
    student_id?: string;
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
    student: User;
    attendanceRecords: {
        data: AttendanceRecord[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    [key: string]: unknown;
}

export default function StudentDetails({ student, attendanceRecords }: Props) {
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

    // Calculate statistics
    const totalDays = attendanceRecords.data.length;
    const presentDays = attendanceRecords.data.filter(record => record.status === 'present').length;
    const absentDays = attendanceRecords.data.filter(record => record.status === 'absent').length;
    const sickDays = attendanceRecords.data.filter(record => record.status === 'sick').length;
    const lateDays = attendanceRecords.data.filter(record => record.status === 'late').length;
    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    return (
        <AppShell>
            <Head title={`${student.name} - Attendance Details`} />
            
            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Link href={route('attendance.index')}>
                            <Button variant="outline" className="mb-4">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-blue-800">
                                    {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                                <p className="text-gray-600">
                                    {student.student_id} • {student.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
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
                                        <p className="text-sm font-medium text-gray-600">Present</p>
                                        <p className="text-2xl font-bold text-green-600">{presentDays}</p>
                                    </div>
                                    <div className="text-3xl">✅</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Absent</p>
                                        <p className="text-2xl font-bold text-red-600">{absentDays}</p>
                                    </div>
                                    <div className="text-3xl">❌</div>
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

                    {/* Additional stats */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Sick Days</p>
                                        <p className="text-2xl font-bold text-orange-600">{sickDays}</p>
                                    </div>
                                    <div className="text-3xl">🤒</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Late Days</p>
                                        <p className="text-2xl font-bold text-yellow-600">{lateDays}</p>
                                    </div>
                                    <div className="text-3xl">⏰</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Attendance history */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📋 Detailed Attendance History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {attendanceRecords.data.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-4">📝</div>
                                    <p>No attendance records yet.</p>
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