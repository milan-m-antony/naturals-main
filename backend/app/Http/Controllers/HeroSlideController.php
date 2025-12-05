<?php

namespace App\Http\Controllers;

use App\Models\HeroSlide;
use Illuminate\Http\Request;

class HeroSlideController extends Controller
{
    /**
     * Display a listing of hero slides
     */
    public function index()
    {
        $slides = HeroSlide::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json($slides);
    }

    /**
     * Store a newly created hero slide
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'accent_color' => 'nullable|string|max:7',
            'badge' => 'nullable|string|max:255',
            'price' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $slide = HeroSlide::create($validated);

        return response()->json($slide, 201);
    }

    /**
     * Update the specified hero slide
     */
    public function update(Request $request, HeroSlide $slide)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'accent_color' => 'nullable|string|max:7',
            'badge' => 'nullable|string|max:255',
            'price' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $slide->update($validated);

        return response()->json($slide);
    }

    /**
     * Remove the specified hero slide
     */
    public function destroy(HeroSlide $slide)
    {
        $slide->delete();

        return response()->json(['message' => 'Hero slide deleted successfully']);
    }
}
