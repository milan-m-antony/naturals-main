<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Report;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Get revenue analytics dashboard
     */
    public function revenueAnalytics(Request $request)
    {
        $this->authorize('viewAny', Report::class);

        $validated = $request->validate([
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
            'branch_id' => 'nullable|exists:branches,id',
            'period' => 'nullable|in:daily,weekly,monthly,yearly',
        ]);

        $startDate = $validated['start_date'] ?? Carbon::now()->subMonths(3)->toDateString();
        $endDate = $validated['end_date'] ?? Carbon::now()->toDateString();
        $period = $validated['period'] ?? 'daily';

        $query = Appointment::where('status', 'completed')
            ->whereDate('appointment_date', '>=', $startDate)
            ->whereDate('appointment_date', '<=', $endDate);

        if ($request->has('branch_id')) {
            $query->where('branch_id', $validated['branch_id']);
        }

        // Get revenue data grouped by period
        $revenueByPeriod = $query->selectRaw("
            DATE_FORMAT(appointment_date, '%Y-%m-%d') as date,
            COUNT(*) as appointment_count,
            SUM(total_amount) as total_revenue,
            AVG(total_amount) as average_revenue
        ")
            ->groupByRaw("DATE_FORMAT(appointment_date, '%Y-%m-%d')")
            ->orderBy('date')
            ->get();

        // Total revenue metrics
        $totalRevenue = $query->sum('total_amount') ?? 0;
        $totalAppointments = $query->count();
        $averageRevenue = $query->avg('total_amount') ?? 0;

        // Payment method breakdown
        $paymentMethodBreakdown = $query->selectRaw('payment_method, COUNT(*) as count, SUM(total_amount) as amount')
            ->groupBy('payment_method')
            ->get();

        return response()->json([
            'date_range' => ['start' => $startDate, 'end' => $endDate],
            'metrics' => [
                'total_revenue' => $totalRevenue,
                'total_appointments' => $totalAppointments,
                'average_revenue' => $averageRevenue,
            ],
            'revenue_by_period' => $revenueByPeriod,
            'payment_method_breakdown' => $paymentMethodBreakdown,
        ]);
    }

    /**
     * Get staff performance analytics
     */
    public function staffPerformance(Request $request)
    {
        $this->authorize('viewAny', Report::class);

        $validated = $request->validate([
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
            'branch_id' => 'nullable|exists:branches,id',
            'staff_id' => 'nullable|exists:users,id',
        ]);

        $startDate = $validated['start_date'] ?? Carbon::now()->subMonths(1)->toDateString();
        $endDate = $validated['end_date'] ?? Carbon::now()->toDateString();

        $query = DB::table('appointments')
            ->join('users', 'appointments.staff_id', '=', 'users.id')
            ->where('appointments.status', 'completed')
            ->whereDate('appointments.appointment_date', '>=', $startDate)
            ->whereDate('appointments.appointment_date', '<=', $endDate)
            ->selectRaw(
                'users.id,
                users.name,
                COUNT(*) as appointments_completed,
                SUM(appointments.total_amount) as total_revenue,
                AVG(appointments.total_amount) as average_revenue,
                COUNT(CASE WHEN appointments.notes LIKE "%5 star%" THEN 1 END) as five_star_reviews,
                AVG(CASE WHEN appointments.rating IS NOT NULL THEN appointments.rating ELSE NULL END) as average_rating'
            );

        if ($request->has('branch_id')) {
            $query->where('appointments.branch_id', $validated['branch_id']);
        }

        if ($request->has('staff_id')) {
            $query->where('appointments.staff_id', $validated['staff_id']);
        }

        $staffPerformance = $query->groupBy('users.id', 'users.name')
            ->orderByDesc('total_revenue')
            ->get();

        return response()->json([
            'date_range' => ['start' => $startDate, 'end' => $endDate],
            'staff_performance' => $staffPerformance,
        ]);
    }

    /**
     * Get service popularity analytics
     */
    public function serviceAnalytics(Request $request)
    {
        $this->authorize('viewAny', Report::class);

        $validated = $request->validate([
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
            'branch_id' => 'nullable|exists:branches,id',
            'limit' => 'integer|min:1|max:100',
        ]);

        $startDate = $validated['start_date'] ?? Carbon::now()->subMonths(1)->toDateString();
        $endDate = $validated['end_date'] ?? Carbon::now()->toDateString();
        $limit = $validated['limit'] ?? 20;

        $query = DB::table('service_appointments')
            ->join('services', 'service_appointments.service_id', '=', 'services.id')
            ->join('appointments', 'service_appointments.appointment_id', '=', 'appointments.id')
            ->where('appointments.status', 'completed')
            ->whereDate('appointments.appointment_date', '>=', $startDate)
            ->whereDate('appointments.appointment_date', '<=', $endDate)
            ->selectRaw(
                'services.id,
                services.name,
                services.category,
                COUNT(*) as times_booked,
                SUM(service_appointments.price) as total_revenue,
                AVG(service_appointments.price) as average_price,
                SUM(CASE WHEN appointments.rating >= 4 THEN 1 ELSE 0 END) as highly_rated_bookings'
            );

        if ($request->has('branch_id')) {
            $query->where('appointments.branch_id', $validated['branch_id']);
        }

        $serviceAnalytics = $query->groupBy('services.id', 'services.name', 'services.category')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get();

        return response()->json([
            'date_range' => ['start' => $startDate, 'end' => $endDate],
            'service_analytics' => $serviceAnalytics,
        ]);
    }

    /**
     * Get customer insights
     */
    public function customerInsights(Request $request)
    {
        $this->authorize('viewAny', Report::class);

        $validated = $request->validate([
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
        ]);

        $startDate = $validated['start_date'] ?? Carbon::now()->subYear()->toDateString();
        $endDate = $validated['end_date'] ?? Carbon::now()->toDateString();

        // Total customers
        $totalCustomers = User::whereHas('roles', function ($q) {
            $q->where('name', 'customer');
        })->count();

        // New customers this period
        $newCustomers = User::whereHas('roles', function ($q) {
            $q->where('name', 'customer');
        })
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->count();

        // Repeat customers
        $repeatCustomers = DB::table('appointments')
            ->where('status', 'completed')
            ->whereDate('appointment_date', '>=', $startDate)
            ->whereDate('appointment_date', '<=', $endDate)
            ->selectRaw('user_id, COUNT(*) as appointment_count')
            ->groupBy('user_id')
            ->havingRaw('COUNT(*) > 1')
            ->count();

        // Customer lifetime value distribution
        $lifetimeValueDistribution = DB::table('appointments')
            ->where('status', 'completed')
            ->selectRaw(
                'user_id,
                SUM(total_amount) as lifetime_value,
                COUNT(*) as appointment_count'
            )
            ->groupBy('user_id')
            ->selectRaw("
                CASE
                    WHEN SUM(total_amount) < 1000 THEN 'Low (<₹1000)'
                    WHEN SUM(total_amount) < 5000 THEN 'Medium (₹1000-5000)'
                    WHEN SUM(total_amount) < 10000 THEN 'High (₹5000-10000)'
                    ELSE 'Premium (>₹10000)'
                END as segment,
                COUNT(DISTINCT user_id) as customer_count"
            )
            ->groupBy('segment')
            ->get();

        // Most active customers
        $topCustomers = DB::table('appointments')
            ->join('users', 'appointments.user_id', '=', 'users.id')
            ->where('appointments.status', 'completed')
            ->whereDate('appointments.appointment_date', '>=', $startDate)
            ->whereDate('appointments.appointment_date', '<=', $endDate)
            ->selectRaw(
                'users.id,
                users.name,
                COUNT(*) as appointment_count,
                SUM(appointments.total_amount) as total_spent'
            )
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total_spent')
            ->limit(10)
            ->get();

        return response()->json([
            'date_range' => ['start' => $startDate, 'end' => $endDate],
            'metrics' => [
                'total_customers' => $totalCustomers,
                'new_customers' => $newCustomers,
                'repeat_customers' => $repeatCustomers,
            ],
            'lifetime_value_distribution' => $lifetimeValueDistribution,
            'top_customers' => $topCustomers,
        ]);
    }

    /**
     * Get appointment analytics
     */
    public function appointmentAnalytics(Request $request)
    {
        $this->authorize('viewAny', Report::class);

        $validated = $request->validate([
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
        ]);

        $startDate = $validated['start_date'] ?? Carbon::now()->subMonths(1)->toDateString();
        $endDate = $validated['end_date'] ?? Carbon::now()->toDateString();

        // Appointment status breakdown
        $statusBreakdown = DB::table('appointments')
            ->whereDate('appointment_date', '>=', $startDate)
            ->whereDate('appointment_date', '<=', $endDate)
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        // Cancellation rate
        $totalAppointments = DB::table('appointments')
            ->whereDate('appointment_date', '>=', $startDate)
            ->whereDate('appointment_date', '<=', $endDate)
            ->count();

        $cancelledAppointments = DB::table('appointments')
            ->where('status', 'cancelled')
            ->whereDate('appointment_date', '>=', $startDate)
            ->whereDate('appointment_date', '<=', $endDate)
            ->count();

        $cancellationRate = $totalAppointments > 0 
            ? ($cancelledAppointments / $totalAppointments) * 100 
            : 0;

        // Average rating
        $averageRating = DB::table('appointments')
            ->where('status', 'completed')
            ->whereDate('appointment_date', '>=', $startDate)
            ->whereDate('appointment_date', '<=', $endDate)
            ->whereNotNull('rating')
            ->avg('rating') ?? 0;

        // Appointments per day (average)
        $appointmentsPerDay = DB::table('appointments')
            ->whereDate('appointment_date', '>=', $startDate)
            ->whereDate('appointment_date', '<=', $endDate)
            ->selectRaw('COUNT(*) as total')
            ->first();

        $daysDifference = (new Carbon($startDate))->diffInDays(new Carbon($endDate)) + 1;
        $avgPerDay = $appointmentsPerDay ? $appointmentsPerDay->total / $daysDifference : 0;

        return response()->json([
            'date_range' => ['start' => $startDate, 'end' => $endDate],
            'metrics' => [
                'total_appointments' => $totalAppointments,
                'completed_appointments' => $statusBreakdown->where('status', 'completed')->first()?->count ?? 0,
                'cancelled_appointments' => $cancelledAppointments,
                'no_show_rate' => $cancellationRate,
                'average_rating' => round($averageRating, 2),
                'appointments_per_day_avg' => round($avgPerDay, 2),
            ],
            'status_breakdown' => $statusBreakdown,
        ]);
    }

    /**
     * Generate and queue a report for export (PDF/Excel)
     */
    public function generateReport(Request $request)
    {
        $this->authorize('create', Report::class);

        $validated = $request->validate([
            'report_type' => 'required|in:revenue,staff_performance,service_analytics,customer_insights,appointments',
            'format' => 'required|in:pdf,excel,csv',
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
            'branch_id' => 'nullable|exists:branches,id',
            'name' => 'nullable|string|max:255',
        ]);

        $name = $validated['name'] ?? $validated['report_type'] . '_' . date('Y-m-d_H-i-s');

        $report = Report::create([
            'name' => $name,
            'report_type' => $validated['report_type'],
            'description' => null,
            'filters' => [
                'start_date' => $validated['start_date'] ?? null,
                'end_date' => $validated['end_date'] ?? null,
                'branch_id' => $validated['branch_id'] ?? null,
            ],
            'generated_by' => Auth::id(),
            'status' => 'pending',
            'exported_format' => $validated['format'],
        ]);

        // TODO: Queue job to generate report file
        // Dispatch(new GenerateReportJob($report));

        return response()->json([
            'message' => 'Report generation queued',
            'report' => $report,
        ], 201);
    }

    /**
     * Get report status and download link
     */
    public function getReport($reportId)
    {
        $report = Report::findOrFail($reportId);
        $this->authorize('view', $report);

        return response()->json($report);
    }

    /**
     * List generated reports
     */
    public function listReports(Request $request)
    {
        $this->authorize('viewAny', Report::class);

        $query = Report::where('generated_by', Auth::id())
            ->orWhereHas('generatedBy', function ($q) {
                $q->where('role', 'admin');
            });

        if ($request->has('type')) {
            $query->byType($request->get('type'));
        }

        if ($request->has('status')) {
            $query->byStatus($request->get('status'));
        }

        $reports = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($reports);
    }

    /**
     * Delete a report
     */
    public function deleteReport($reportId)
    {
        $report = Report::findOrFail($reportId);
        $this->authorize('delete', $report);

        if ($report->file_path && file_exists(storage_path($report->file_path))) {
            unlink(storage_path($report->file_path));
        }

        $report->delete();

        return response()->json(['message' => 'Report deleted successfully']);
    }

    /**
     * Get dashboard overview with key metrics
     */
    public function dashboardOverview(Request $request)
    {
        $this->authorize('viewAny', Report::class);

        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        // Today's revenue
        $todayRevenue = Appointment::where('status', 'completed')
            ->whereDate('appointment_date', $today)
            ->sum('total_amount') ?? 0;

        // This month's revenue
        $monthRevenue = Appointment::where('status', 'completed')
            ->whereDate('appointment_date', '>=', $thisMonth)
            ->sum('total_amount') ?? 0;

        // Today's appointments
        $todayAppointments = Appointment::whereDate('appointment_date', $today)->count();

        // Pending reschedule requests
        $pendingReschedules = DB::table('appointment_reschedules')
            ->where('status', 'pending')
            ->count();

        // Pending leave requests
        $pendingLeaves = DB::table('leave_requests')
            ->where('status', 'pending')
            ->count();

        return response()->json([
            'metrics' => [
                'today_revenue' => $todayRevenue,
                'month_revenue' => $monthRevenue,
                'today_appointments' => $todayAppointments,
                'pending_reschedules' => $pendingReschedules,
                'pending_leaves' => $pendingLeaves,
            ],
        ]);
    }
}
