<?php

namespace App\Http\Controllers;

use App\Models\Feature;
use Illuminate\Http\Request;

class FeatureController extends Controller
{
    // Get all features
    public function index(Request $request)
    {
        $query = Feature::orderBy('sort_order');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $features = $query->get();
        return response()->json($features);
    }

    // Get single feature
    public function show(Feature $feature)
    {
        return response()->json($feature);
    }

    // Create feature (admin only)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'category' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        $feature = Feature::create($validated);
        return response()->json(['message' => 'Feature created successfully', 'data' => $feature], 201);
    }

    // Update feature (admin only)
    public function update(Request $request, Feature $feature)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'category' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        $feature->update($validated);
        return response()->json(['message' => 'Feature updated successfully', 'data' => $feature]);
    }

    // Delete feature (admin only)
    public function destroy(Feature $feature)
    {
        $feature->delete();
        return response()->json(['message' => 'Feature deleted successfully']);
    }

    // Bulk update status
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'feature_ids' => 'required|array',
            'is_active' => 'required|boolean'
        ]);

        Feature::whereIn('id', $validated['feature_ids'])->update(['is_active' => $validated['is_active']]);
        return response()->json(['message' => 'Features updated successfully']);
    }

    // Reorder features
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'features' => 'required|array',
            'features.*.id' => 'required|integer',
            'features.*.sort_order' => 'required|integer'
        ]);

        foreach ($validated['features'] as $feature) {
            Feature::findOrFail($feature['id'])->update(['sort_order' => $feature['sort_order']]);
        }

        return response()->json(['message' => 'Features reordered successfully']);
    }
}
