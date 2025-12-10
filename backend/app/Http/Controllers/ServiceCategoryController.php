<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use Illuminate\Http\Request;

class ServiceCategoryController extends Controller
{
    /**
     * Display a listing of service categories with optional filters
     */
    public function index(Request $request)
    {
        $query = ServiceCategory::query();

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        // Search by name or description
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Ordering
        $categories = $query->ordered()->get();

        return response()->json($categories);
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:service_categories',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $category = ServiceCategory::create($validated);

        return response()->json($category, 201);
    }

    /**
     * Display the specified category with service count
     */
    public function show(ServiceCategory $category)
    {
        $category->updateServiceCount();
        return response()->json($category);
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, ServiceCategory $category)
    {
        $validated = $request->validate([
            'name' => 'string|max:255|unique:service_categories,name,' . $category->id,
            'description' => 'nullable|string',
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

    /**
     * Bulk update categories status
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer',
            'is_active' => 'required|boolean',
        ]);

        ServiceCategory::whereIn('id', $validated['ids'])
            ->update(['is_active' => $validated['is_active']]);

        return response()->json(['message' => 'Categories updated successfully']);
    }

    /**
     * Reorder categories
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|integer',
            'categories.*.sort_order' => 'required|integer',
        ]);

        foreach ($validated['categories'] as $category) {
            ServiceCategory::where('id', $category['id'])
                ->update(['sort_order' => $category['sort_order']]);
        }

        return response()->json(['message' => 'Categories reordered successfully']);
    }
}

