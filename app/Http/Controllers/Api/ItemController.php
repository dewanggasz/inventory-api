<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with(['category', 'location', 'latestStatus']);
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")->orWhere('code', 'like', "%{$searchTerm}%");
            });
        }
        if ($request->has('category_id') && !empty($request->category_id)) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->has('location_id') && !empty($request->location_id)) {
            $query->where('location_id', $request->location_id);
        }
        if ($request->has('status') && !empty($request->status)) {
            $query->whereHas('latestStatus', function ($q) use ($request) {
                $q->where('status', $request->status);
            });
        }
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);
        $items = $query->paginate(15);
        return response()->json($items);
    }

    public function show($code)
    {
        $item = Item::with(['category', 'location', 'latestStatus.user'])->where('code', $code)->first();
        if (!$item) {
            return response()->json(['message' => 'Barang tidak ditemukan'], 404);
        }
        return response()->json($item);
    }

    public function scan($barcode)
    {
        $item = Item::with(['category', 'location', 'latestStatus.user'])->where('barcode_path', $barcode)->first();
        if (!$item) {
            return response()->json(['message' => 'Barcode tidak valid atau barang tidak ditemukan'], 404);
        }
        return response()->json($item);
    }

    public function history($code)
    {
        $item = Item::where('code', $code)->firstOrFail();
        $history = $item->statuses()->with('user')->get();
        return response()->json($history);
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|string|in:Baik,Rusak,Hilang,Perbaikan,Dipinjam,Rusak Total',
                'note' => 'nullable|string|max:255',
                'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'location_id' => 'nullable|exists:locations,id', // <-- Validasi baru
            ]);

            $item = Item::findOrFail($id);
            $photoPath = null;

            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('status_photos', 'public');
            }

            DB::transaction(function () use ($item, $validated, $photoPath, $request) {
                // Buat record status baru
                $item->statuses()->create([
                    'status' => $validated['status'],
                    'note' => $validated['note'] ?? null,
                    'user_id' => Auth::id(),
                    'photo_path' => $photoPath,
                ]);

                // -- LOGIKA BARU: Update lokasi jika ada --
                if ($request->filled('location_id')) {
                    $item->location_id = $validated['location_id'];
                    $item->save();
                }
            });

            $item->load(['category', 'location', 'latestStatus.user']);

            return response()->json([
                'message' => 'Status barang berhasil diperbarui',
                'data' => $item,
            ]);

        } catch (Throwable $e) {
            Log::error('Gagal update status: ' . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan di server: ' . $e->getMessage()], 500);
        }
    }
}