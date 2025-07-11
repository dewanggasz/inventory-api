<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Method yang dibutuhkan oleh FilamentUser untuk otorisasi akses panel.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        // Izinkan semua user dengan role 'admin' untuk mengakses panel
        return $this->role === 'admin';
    }

    /**
     * Relasi ke Status
     */
    public function statuses()
    {
        return $this->hasMany(Status::class);
    }

    /**
     * Relasi ke Log
     */
    public function logs()
    {
        return $this->hasMany(Log::class);
    }
}
