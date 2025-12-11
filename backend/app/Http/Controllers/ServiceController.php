<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::where('is_active', true);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $services = $query->get();

        return response()->json($services);
    }

    public function show($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        return response()->json($service);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'description' => 'required|string',
            'sub_category' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'slots' => 'nullable|integer|min:0',
            'discount' => 'nullable|integer|min:0|max:100',
            'includes' => 'nullable|array',
            'offer_valid_until' => 'nullable|date',
            'is_members_only' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // Apply safe defaults for optional fields to avoid DB errors
        $service = Service::create([
            'name' => $data['name'],
            'category' => $data['category'],
            'sub_category' => $data['sub_category'] ?? null,
            'price' => $data['price'],
            'duration' => $data['duration'],
            'description' => $data['description'],
            'image' => $data['image'] ?? null,
            'slots' => $data['slots'] ?? 10,
            'discount' => $data['discount'] ?? 0,
            'includes' => $data['includes'] ?? null,
            'is_members_only' => $data['is_members_only'] ?? false,
            'offer_valid_until' => $data['offer_valid_until'] ?? null,
            'rating' => 0,
            'reviews_count' => 0,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Service created successfully',
            'service' => $service,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string',
            'sub_category' => 'sometimes|nullable|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'duration' => 'sometimes|integer|min:1',
            'description' => 'sometimes|string',
            'image' => 'sometimes|nullable|string',
            'slots' => 'sometimes|integer|min:0',
            'discount' => 'sometimes|integer|min:0|max:100',
            'includes' => 'sometimes|array|nullable',
            'offer_valid_until' => 'sometimes|date|nullable',
            'is_members_only' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $service->update($validator->validated());

        return response()->json([
            'message' => 'Service updated successfully',
            'service' => $service,
        ]);
    }

    public function destroy($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        $service->delete();

        return response()->json(['message' => 'Service deleted successfully']);
    }
}
