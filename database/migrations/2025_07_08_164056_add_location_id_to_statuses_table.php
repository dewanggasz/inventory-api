<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('statuses', function (Blueprint $table) {
            // Tambahkan foreign key ke lokasi, bisa null, dan ditempatkan setelah item_id
            $table->foreignId('location_id')->nullable()->after('item_id')->constrained('locations')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('statuses', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
            $table->dropColumn('location_id');
        });
    }
};
