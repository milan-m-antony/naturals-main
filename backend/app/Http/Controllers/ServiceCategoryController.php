<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceCategoryController extends Controller
{
    /**
     * Display a listing of service categories
     */
    public function index()
    {
        $categories = ServiceCategory::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json($categories);
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $category = ServiceCategory::create($validated);

        return response()->json($category, 201);
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, ServiceCategory $category)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'image' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    /**
     * Remove the specified category
     */
    public function destroy(ServiceCategory $category)
    {
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
