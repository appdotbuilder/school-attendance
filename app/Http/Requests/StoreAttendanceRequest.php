<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'nullable|exists:users,id',
            'date' => 'required|date|before_or_equal:today',
            'status' => 'required|in:present,absent,sick,excused,late',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'date.required' => 'Date is required.',
            'date.date' => 'Please provide a valid date.',
            'date.before_or_equal' => 'Cannot mark attendance for future dates.',
            'status.required' => 'Attendance status is required.',
            'status.in' => 'Please select a valid attendance status.',
            'user_id.exists' => 'Selected user does not exist.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
        ];
    }
}