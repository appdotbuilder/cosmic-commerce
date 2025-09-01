<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Models\Product;
use App\Models\Category;
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
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';