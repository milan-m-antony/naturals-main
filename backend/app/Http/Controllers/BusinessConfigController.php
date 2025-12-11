<?php

namespace App\Http\Controllers;

use App\Models\BusinessHours;
use App\Models\Holiday;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class BusinessConfigController extends Controller
{
    // Get business hours for a branch
    public function getBusinessHours($branchId)
    {
        $hours = BusinessHours::where('branch_id', $branchId)
            ->orderByRaw("FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')")
            ->get();

        if ($hours->isEmpty()) {
            return response()->json(['message' => 'No business hours configured'], 404);
        }

        return response()->json($hours);
    }

    // Set business hours for a day
    public function setBusinessHours(Request $request, $branchId)
    {
        $validator = Validator::make($request->all(), [
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'opening_time' => 'required|date_format:H:i',
            'closing_time' => 'required|date_format:H:i|after:opening_time',
            'is_closed' => 'boolean',
            'lunch_start' => 'nullable|date_format:H:i',
            'lunch_end' => 'nullable|date_format:H:i|after:lunch_start',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $hours = BusinessHours::updateOrCreate(
            [
                'branch_id' => $branchId,
                'day_of_week' => $request->day_of_week,
            ],
            [
                'opening_time' => $request->opening_time,
                'closing_time' => $request->closing_time,
                'is_closed' => $request->boolean('is_closed'),
                'lunch_start' => $request->lunch_start,
                'lunch_end' => $request->lunch_end,
            ]
        );

        return response()->json([
            'message' => 'Business hours updated',
            'business_hours' => $hours,
        ]);
    }

    // Get holidays for a branch
    public function getHolidays($branchId, Request $request)
    {
        $query = Holiday::where('branch_id', $branchId);

        if ($request->has('year') && $request->has('month')) {
            $holidays = Holiday::getMonthHolidays(
                $branchId,
                $request->year,
                $request->month
            );
            return response()->json($holidays);
        }

        $holidays = $query->orderBy('date')->get();
        return response()->json($holidays);
    }

    // Add holiday
    public function addHoliday(Request $request, $branchId)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'date' => 'required|date|after_or_equal:today',
            'description' => 'nullable|string',
            'is_optional' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $holiday = Holiday::create([
            'branch_id' => $branchId,
            'name' => $request->name,
            'date' => $request->date,
            'description' => $request->description,
            'is_optional' => $request->boolean('is_optional'),
        ]);

        return response()->json([
            'message' => 'Holiday added',
            'holiday' => $holiday,
        ], 201);
    }

    // Delete holiday
    public function deleteHoliday($branchId, $holidayId)
    {
        $holiday = Holiday::where('branch_id', $branchId)->find($holidayId);

        if (!$holiday) {
            return response()->json(['message' => 'Holiday not found'], 404);
        }

        $holiday->delete();

        return response()->json(['message' => 'Holiday deleted']);
    }

    // Check if date is available for booking
    public function checkAvailability($branchId, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date|after_or_equal:today',
            'time' => 'nullable|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $date = Carbon::parse($request->date);

        // Check if closed on this day
        if (!BusinessHours::isOpenOnDate($branchId, $date)) {
            return response()->json([
                'available' => false,
                'reason' => 'Salon is closed on this day',
            ]);
        }

        // Check if holiday
        if (Holiday::isHoliday($branchId, $date)) {
            return response()->json([
                'available' => false,
                'reason' => 'Salon is closed on this holiday',
            ]);
        }

        // Check time
        if ($request->has('time')) {
            $opening = BusinessHours::getOpeningTime($branchId, $date);
            $closing = BusinessHours::getClosingTime($branchId, $date);

            if ($opening && $closing) {
                if ($request->time < $opening || $request->time > $closing) {
                    return response()->json([
                        'available' => false,
                        'reason' => "Salon is open from {$opening} to {$closing}",
                        'opening_time' => $opening,
                        'closing_time' => $closing,
                    ]);
                }
            }
        }

        return response()->json([
            'available' => true,
            'opening_time' => BusinessHours::getOpeningTime($branchId, $date),
            'closing_time' => BusinessHours::getClosingTime($branchId, $date),
        ]);
    }
}
