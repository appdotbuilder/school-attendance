import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// Simple chevron down icon
const ChevronDown = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

interface AttendanceStatusSelectProps {
    currentStatus?: string;
    onStatusChange: (status: string, notes?: string) => void;
    disabled?: boolean;
}

const statusOptions = [
    { value: 'present', label: 'Present', emoji: '✅', color: 'text-green-600' },
    { value: 'absent', label: 'Absent', emoji: '❌', color: 'text-red-600' },
    { value: 'sick', label: 'Sick', emoji: '🤒', color: 'text-orange-600' },
    { value: 'excused', label: 'Excused', emoji: '📝', color: 'text-blue-600' },
    { value: 'late', label: 'Late', emoji: '⏰', color: 'text-yellow-600' },
];

export function AttendanceStatusSelect({ 
    currentStatus, 
    onStatusChange, 
    disabled = false 
}: AttendanceStatusSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const currentOption = statusOptions.find(option => option.value === currentStatus);

    const handleStatusChange = (status: string) => {
        onStatusChange(status);
        setIsOpen(false);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={currentStatus ? 'outline' : 'default'}
                    className="min-w-[120px] justify-between"
                    disabled={disabled}
                >
                    <span className="flex items-center gap-2">
                        {currentOption ? (
                            <>
                                <span>{currentOption.emoji}</span>
                                <span className={currentOption.color}>{currentOption.label}</span>
                            </>
                        ) : (
                            'Mark Attendance'
                        )}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {statusOptions.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <span className="text-lg">{option.emoji}</span>
                        <span className={option.color}>{option.label}</span>
                        {currentStatus === option.value && (
                            <span className="ml-auto text-blue-500">✓</span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}