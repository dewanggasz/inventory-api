# Aplikasi Inventory Barang 🚀
Aplikasi web modern untuk melacak dan mengelola aset atau barang dalam sebuah organisasi. Sistem ini memungkinkan pelacakan status setiap barang (misalnya Baik, Rusak, Dipinjam) secara real-time melalui kode unik dan pemindaian barcode.

## ✨ Fitur Utama
Aplikasi ini terdiri dari dua bagian utama dengan fungsionalitas yang berbeda:

### 📱 Aplikasi Pengguna (Frontend - React)
Diakses oleh staf operasional di lapangan.

    - Otentikasi Aman: Login menggunakan token Laravel Sanctum.
    - Pencarian Cepat: Cari barang dengan mengetik kode manual, memindai barcode via kamera, atau unggah gambar.
    - Daftar Barang Interaktif: Tampilan data dalam bentuk tabel (desktop) dan kartu (mobile) yang responsif.
    - Filter & Urutkan Data: Cari, filter per kategori/lokasi/status, dan urutkan data dengan mudah.
    - Update Status: Ubah status barang, tambahkan catatan, dan unggah foto bukti melalui modal interaktif.
    - Riwayat Lengkap: Lihat seluruh riwayat perubahan status untuk setiap barang.

### 🖥️ Panel Admin (Backend - Filament)
Diakses oleh administrator untuk manajemen data menyeluruh.

    - Dashboard Informatif:
        - Statistik jumlah barang berdasarkan status dengan filter per periode (tahun/bulan).
        - Diagram garis untuk tren perubahan status barang.
        - Diagram batang untuk pertumbuhan total aset aktif.

    - Manajemen Data (CRUD): Kelola data master untuk Barang, Kategori, Lokasi, dan Pengguna.

    - Generate Otomatis: Kode unik dan barcode di-generate secara otomatis saat membuat barang baru.

    - Manajemen Pengguna: Atur peran pengguna (admin/user) dan reset password.

    - Fitur Ekstra:

        - Cetak Label Barcode dalam format PDF (satu per satu atau massal).

        - Unduh QR Code sebagai gambar PNG.

        - Ekspor Data barang ke format Excel.

### 💻 Teknologi yang Digunakan
Arsitektur aplikasi memisahkan frontend dan backend yang berkomunikasi melalui API.

#### Frontend (Aplikasi Pengguna)

- Framework: ```React.js```

- Build Tool: ```Vite```

- Styling: ```Tailwind CSS``` & ```CSS Native```

- HTTP Client: ```Axios```

- Routing: ```React Router DOM```

- State Management: ```React Context``` & ```Hooks```

#### Backend (API & Panel Admin)

- Framework: ```Laravel 12```

- Panel Admin: ```Filament 3.x```

- Otentikasi API: ```Laravel Sanctum```

- Database: ```MySQL```

## ⚙️ Instalasi & Menjalankan Lokal
Berikut adalah panduan untuk menjalankan aplikasi ini di lingkungan lokal.

#### 1. Backend (Laravel)
Clone repositori dan masuk ke direktori proyek.

```bash
    # Clone repositori
    git clone https://github.com/username/repo-name.git
    cd repo-name

    # Install dependensi PHP
    composer install

    # Setup file environment
    cp .env.example .env
    # --- (Konfigurasi koneksi database di file .env) ---

    # Generate application key
    php artisan key:generate

    # Migrasi database dan jalankan seeder
    php artisan migrate --seed

    # Buat symbolic link untuk storage
    php artisan storage:link
```

#### 2. Frontend (React)
Masuk ke direktori aplikasi React.

```bash
# Masuk ke direktori frontend
cd client-app

# Install dependensi JavaScript
npm install

# Buat file environment dan isi URL API backend
cp .env.example .env
# --- (Isi VITE_API_BASE_URL=http://127.0.0.1:8000 di file .env) ---
```

#### 3. Menjalankan Server
Jalankan kedua server secara bersamaan di terminal yang berbeda.

- Jalankan Backend Laravel:

    ```php artisan serve```

- Jalankan Frontend React:

    ```npm run dev```

Aplikasi pengguna akan tersedia di ```http://localhost:5173``` (atau port lain yang ditampilkan) dan panel admin di ```http://127.0.0.1:8000/admin```.