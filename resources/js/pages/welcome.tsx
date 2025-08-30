import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-8">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        🎓 School Attendance System
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Streamline attendance tracking for teachers and students with our intuitive platform
                    </p>
                </div>

                {/* Feature highlights */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="text-4xl mb-4">👩‍🏫</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">For Teachers</h3>
                        <ul className="text-gray-600 space-y-2 text-left">
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Mark your own daily attendance
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Track student attendance easily
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                View comprehensive attendance reports
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Manage multiple attendance statuses
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="text-4xl mb-4">🎒</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">For Students</h3>
                        <ul className="text-gray-600 space-y-2 text-left">
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2">✓</span>
                                View your attendance history
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2">✓</span>
                                Check today's attendance status
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2">✓</span>
                                Mark your own attendance
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2">✓</span>
                                Track attendance patterns
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Status types */}
                <div className="bg-white rounded-xl p-6 shadow-lg mb-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Attendance Status Options</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full">✅ Present</span>
                        <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full">❌ Absent</span>
                        <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full">🤒 Sick</span>
                        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full">📝 Excused</span>
                        <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">⏰ Late</span>
                    </div>
                </div>

                {/* CTA buttons */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={route('login')}>
                            <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700">
                                🔑 Login to Your Account
                            </Button>
                        </Link>
                        <Link href={route('register')}>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-3 text-lg">
                                📝 Create New Account
                            </Button>
                        </Link>
                    </div>
                    
                    <div className="text-sm text-gray-500 mt-6">
                        <p className="mb-2">Demo Accounts:</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center text-xs">
                            <div className="bg-gray-50 p-3 rounded">
                                <strong>Teacher:</strong> teacher@example.com / password
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <strong>Student:</strong> student@example.com / password
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features showcase */}
                <div className="mt-16 grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-3xl mb-2">📅</div>
                        <h4 className="font-semibold text-gray-900">Daily Tracking</h4>
                        <p className="text-gray-600 text-sm">Mark and track attendance on a daily basis with ease</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl mb-2">📈</div>
                        <h4 className="font-semibold text-gray-900">Analytics</h4>
                        <p className="text-gray-600 text-sm">View attendance patterns and generate insightful reports</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl mb-2">🔒</div>
                        <h4 className="font-semibold text-gray-900">Secure Access</h4>
                        <p className="text-gray-600 text-sm">Role-based access ensures data privacy and security</p>
                    </div>
                </div>
            </div>
        </div>
    );
}