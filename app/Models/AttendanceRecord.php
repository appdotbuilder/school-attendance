<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\AttendanceRecord
 *
 * @property int $id
 * @property int $user_id
 * @property int|null $marked_by
 * @property \Illuminate\Support\Carbon $date
 * @property string $status
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\User|null $marker
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord query()
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereMarkedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord forDate($date)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord forUser($userId)
 * @method static \Database\Factories\AttendanceRecordFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class AttendanceRecord extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'marked_by',
        'date',
        'status',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user whose attendance is recorded.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user who marked the attendance.
     */
    public function marker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'marked_by');
    }

    /**
     * Scope a query to filter by date.
     */
    public function scopeForDate($query, $date)
    {
        return $query->where('date', $date);
    }

    /**
     * Scope a query to filter by user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Get the status display label.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'present' => 'Present',
            'absent' => 'Absent',
            'sick' => 'Sick',
            'excused' => 'Excused',
            'late' => 'Late',
            default => ucfirst($this->status),
        };
    }

    /**
     * Get the status color for display.
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'present' => 'green',
            'absent' => 'red',
            'sick' => 'orange',
            'excused' => 'blue',
            'late' => 'yellow',
            default => 'gray',
        };
    }
}