<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display admin dashboard.
     */
    public function index()
    {
        $stats = [
            'total_products' => Product::count(),
            'total_categories' => Category::count(),
            'total_orders' => Order::count(),
            'total_users' => User::where('role', '!=', 'admin')->count(),
            'total_revenue' => (float) Order::sum('total'),
            'recent_orders' => Order::with('user')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'user' => [
                            'name' => $order->user->name ?? 'Guest',
                            'email' => $order->user->email ?? '',
                        ],
                        'total_amount' => (float) $order->total,
                        'status' => $order->status,
                        'created_at' => $order->created_at->toISOString(),
                    ];
                }),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
        ]);
    }
}