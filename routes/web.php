<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use App\Models\Order;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    $featuredProducts = Product::with('categories')
        ->active()
        ->featured()
        ->limit(6)
        ->get();
    
    $categories = Category::active()
        ->orderBy('sort_order')
        ->limit(8)
        ->get();

    return Inertia::render('welcome', [
        'featuredProducts' => $featuredProducts,
        'categories' => $categories,
    ]);
})->name('home');

// Product routes
Route::controller(ProductController::class)->group(function () {
    Route::get('/products', 'index')->name('products.index');
    Route::get('/products/{slug}', 'show')->name('products.show');
});

// Cart routes
Route::controller(CartController::class)->group(function () {
    Route::get('/cart', 'index')->name('cart.index');
    Route::post('/cart', 'store')->name('cart.store');
    Route::patch('/cart/{product}', 'update')->name('cart.update');
    Route::delete('/cart/{product}', 'destroy')->name('cart.destroy');

});

// Checkout routes
Route::controller(CheckoutController::class)->group(function () {
    Route::get('/checkout', 'index')->name('checkout.index');
    Route::post('/checkout', 'store')->name('checkout.store');
    Route::get('/checkout/success/{orderNumber}', 'show')->name('checkout.success');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        
        // Get user's orders with proper relationship loading
        $orders = $user->orders()
            ->latest()
            ->limit(10)
            ->get();

        // Calculate order statistics
        $orderStats = [
            'total' => $user->orders()->count(),
            'pending' => $user->orders()->where('status', 'pending')->count(),
            'completed' => $user->orders()->where('status', 'completed')->count(),
            'totalSpent' => (float) $user->orders()->sum('total'),
        ];

        return Inertia::render('dashboard', [
            'orders' => $orders,
            'orderStats' => $orderStats,
        ]);
    })->name('dashboard');
});

// Admin routes - protected by admin middleware
Route::middleware(['auth', 'verified', \App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    // Admin Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Admin Product Management
    Route::resource('products', AdminProductController::class);
    
    // Admin Category Management  
    Route::resource('categories', AdminCategoryController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';