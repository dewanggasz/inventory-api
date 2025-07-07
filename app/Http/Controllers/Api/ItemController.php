<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ItemController extends Controller
{
    /**
     * Display the specified item by its unique code.
     * GET /api/items/{kode}
     */

     public function index(Request $request)
    {
        $query = Item::with(['category', 'location', 'latestStatus']);

        // Fitur Pencarian
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('code', 'like', "%{$searchTerm}%");
            });
        }

        // Fitur Pengurutan
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        // Paginasi
        $items = $query->paginate(15); // Tampilkan 15 item per halaman

        return response()->json($items);
    }
    
    public function show($code)
    {
        $item = Item::with(['category', 'location', 'latestStatus.user'])
                    ->where('code', $code)
                    ->first();

        if (!$item) {
            return response()->json(['message' => 'Barang tidak ditemukan'], 404);
        }

        return response()->json($item);
    }

    /**
     * Display the specified item by its barcode.
     * GET /api/items/scan/{barcode}
     */
    public function scan($barcode)
    {
        $item = Item::with(['category', 'location', 'latestStatus.user'])
                    ->where('barcode_path', $barcode)
                    ->first();

        if (!$item) {
            return response()->json(['message' => 'Barcode tidak valid atau barang tidak ditemukan'], 404);
        }

        return response()->json($item);
    }

    /**
     * Display the status history for a specific item.
     * GET /api/items/{kode}/history
     */
    public function history($code)
    {
        $item = Item::where('code', $code)->firstOrFail();
        $history = $item->statuses()->with('user')->get();

        return response()->json($history);
    }

    /**
     * Update the status of a specific item.
     * PATCH /api/items/{id}/status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:Baik,Rusak,Hilang,Perbaikan,Dipinjam,Rusak Total',
            'note' => 'nullable|string|max:255',
        ]);

        $item = Item::findOrFail($id);

        $newStatus = Status::create([
            'item_id' => $item->id,
            'status' => $request->status,
            'note' => $request->note,
            'user_id' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Status barang berhasil diperbarui',
            'data' => $newStatus->load('user'),
        ]);
    }
}
