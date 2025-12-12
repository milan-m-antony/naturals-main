<?php

/**
 * copilot:follow
 * This module is MARKED AS DONE.
 * It is protected. Do NOT modify unless the user explicitly asks.
 */

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    /**
     * Display all active announcements
     */
    public function index()
    {
        $announcements = Announcement::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json($announcements);
    }

    /**
     * Store a newly created announcement
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|string|max:500',
            'icon' => 'nullable|string|max:50',
            'action' => 'nullable|string|max:100',
            'link_target' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $announcement = Announcement::create($validated);

        return response()->json($announcement, 201);
    }

    /**
     * Display the specified announcement
     */
    public function show(Announcement $announcement)
    {
        return response()->json($announcement);
    }

    /**
     * Update the specified announcement
     */
    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'text' => 'string|max:500',
            'icon' => 'nullable|string|max:50',
            'action' => 'nullable|string|max:100',
            'link_target' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $announcement->update($validated);

        return response()->json($announcement);
    }

    /**
     * Remove the specified announcement
     */
    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return response()->json(['message' => 'Announcement deleted successfully']);
    }
}
