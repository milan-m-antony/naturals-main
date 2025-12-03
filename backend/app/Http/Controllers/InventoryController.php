<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Inventory::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $inventory = $query->get();

        return response()->json($inventory);
    }

    public function show($id)
    {
        $item = Inventory::find($id);

        if (!$item) {
            return response()->json(['message' => 'Inventory item not found'], 404);
        }

        return response()->json($item);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string',
            'threshold' => 'sometimes|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $item = Inventory::create($request->all());

        return response()->json([
            'message' => 'Inventory item created successfully',
            'item' => $item,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $item = Inventory::find($id);

        if (!$item) {
            return response()->json(['message' => 'Inventory item not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'stock' => 'sometimes|integer|min:0',
            'threshold' => 'sometimes|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $item->update($request->all());

        return response()->json([
            'message' => 'Inventory item updated successfully',
            'item' => $item,
        ]);
    }

    public function destroy($id)
    {
        $item = Inventory::find($id);

        if (!$item) {
            return response()->json(['message' => 'Inventory item not found'], 404);
        }

        $item->delete();

        return response()->json(['message' => 'Inventory item deleted successfully']);
    }
}
