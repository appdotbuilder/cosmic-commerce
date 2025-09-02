import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

interface Order {
    id: number;
    user: {
        name: string;
        email: string;
    };
    total_amount: number;
    status: string;
    created_at: string;
}

interface Stats {
    total_products: number;
    total_categories: number;
    total_orders: number;
    total_users: number;
    total_revenue: number;
    recent_orders: Order[];
}

interface Props {
    stats: Stats;
    [key: string]: unknown;
}

export default function AdminDashboard({ stats }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            🚀 Admin Dashboard - CosmicClothes
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Welcome to your admin panel! Manage products, categories, orders, and grow your fashion empire! ✨
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        👁️ View Store
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Products</CardTitle>
                            <span className="text-2xl">📦</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_products}</div>
                            <Link
                                href="/admin/products"
                                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                            >
                                Manage Products →
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Categories</CardTitle>
                            <span className="text-2xl">🏷️</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_categories}</div>
                            <Link
                                href="/admin/categories"
                                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                            >
                                Manage Categories →
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Orders</CardTitle>
                            <span className="text-2xl">📋</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_orders}</div>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                Total orders placed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Users</CardTitle>
                            <span className="text-2xl">👥</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                Registered customers
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                            <span className="text-2xl">💰</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatPrice(stats.total_revenue)}</div>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                Total revenue
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📦 Product Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link
                                href="/admin/products/create"
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                <span className="text-xl">➕</span>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        Add New Product
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Create a new product listing
                                    </p>
                                </div>
                            </Link>
                            
                            <Link
                                href="/admin/products"
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                <span className="text-xl">📋</span>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        Manage Products
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Edit, delete, and organize
                                    </p>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                🏷️ Category Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link
                                href="/admin/categories/create"
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                <span className="text-xl">➕</span>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        Add New Category
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Create a new product category
                                    </p>
                                </div>
                            </Link>
                            
                            <Link
                                href="/admin/categories"
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                <span className="text-xl">📋</span>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        Manage Categories
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Edit and organize categories
                                    </p>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                ⚡ Quick Tools
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                <span className="text-xl">👤</span>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        User Dashboard
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Switch to user view
                                    </p>
                                </div>
                            </Link>
                            
                            <Link
                                href="/products"
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                <span className="text-xl">🛍️</span>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        Browse Store
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        View as customer
                                    </p>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders */}
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            📋 Recent Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.recent_orders.length === 0 ? (
                            <div className="text-center py-8">
                                <span className="text-4xl mb-4 block">📦</span>
                                <p className="text-gray-600 dark:text-gray-300">
                                    No orders yet
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stats.recent_orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                                                <span className="text-lg">📦</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    Order #{order.id}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {order.user.name} • {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {formatPrice(order.total_amount)}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                                                {order.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}