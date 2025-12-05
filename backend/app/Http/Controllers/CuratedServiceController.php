<?php

namespace App\Http\Controllers;

use App\Models\CuratedService;
use Illuminate\Http\Request;

class CuratedServiceController extends Controller
{
    /**
     * Get the curated services configuration
     */
    public function index()
    {
        $config = CuratedService::where('is_active', true)->first();
        
        if (!$config) {
            return response()->json([
                'section_title' => 'Curated Services',
                'section_description' => 'Expertly designed treatments using premium organic products.',
                'hair_studio_images' => [],
                'skin_features' => [],
                'skin_image' => null,
                'bridal_slides' => [],
            ]);
        }

        return response()->json($config);
    }

    /**
     * Store or update curated services configuration
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'section_title' => 'nullable|string|max:255',
            'section_description' => 'nullable|string',
            'hair_studio_images' => 'nullable|array',
            'skin_features' => 'nullable|array',
            'skin_image' => 'nullable|string',
            'bridal_slides' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $config = CuratedService::first();

        if ($config) {
            $config->update($validated);
        } else {
            $config = CuratedService::create($validated);
        }

        return response()->json($config);
    }

    /**
     * Update the curated services configuration
     */
    public function update(Request $request, CuratedService $curatedService)
    {
        $validated = $request->validate([
            'section_title' => 'string|max:255',
            'section_description' => 'nullable|string',
            'hair_studio_images' => 'nullable|array',
            'skin_features' => 'nullable|array',
            'skin_image' => 'nullable|string',
            'bridal_slides' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $curatedService->update($validated);

        return response()->json($curatedService);
    }
}
