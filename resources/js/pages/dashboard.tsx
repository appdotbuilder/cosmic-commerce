import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Order {
    id: number;
    total: number;
    status: string;
    created_at: string;
    items_count?: number;
}

interface Props {
    orders?: Order[];
    orderStats?: {
        total: number;
        pending: number;
        completed: number;
        totalSpent: number;
    };
    [key: string]: unknown;
}

export default function Dashboard({ orders = [], orderStats }: Props) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    // If user is admin, redirect to admin dashboard
    if (user?.role === 'admin') {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-6 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                👋 Welcome back, {user.name}!
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                You're logged in as an administrator
                            </p>
                        </div>
                        <Link
                            href="/admin/dashboard"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            🚀 Go to Admin Dashboard
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                                <span className="text-2xl">⚡</span>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link
                                    href="/admin/products"
                                    className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                >
                                    • Manage Products
                                </Link>
                                <Link
                                    href="/admin/categories"
                                    className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                >
                                    • Manage Categories
                                </Link>
                                <Link
                                    href="/products"
                                    className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                >
                                    • View Store
                                </Link>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Admin Tools</CardTitle>
                                <span className="text-2xl">🛠️</span>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Access all administrative functions from the admin dashboard
                                </p>
                                <Link
                                    href="/admin/dashboard"
                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                >
                                    Open Admin Panel →
                                </Link>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Store Status</CardTitle>
                                <span className="text-2xl">🏪</span>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Online & Active</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    CosmicClothes is running smoothly
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            👋 Welcome back, {user?.name}! ✨
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Here's your personal dashboard - track orders, manage your profile, and discover amazing fashion! 🎨
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        🛍️ Continue Shopping
                    </Link>
                </div>

                {/* Order Statistics */}
                {orderStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                                <span className="text-2xl">📦</span>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{orderStats.total}</div>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                    All time orders
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                                <span className="text-2xl">⏳</span>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{orderStats.pending}</div>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                    Awaiting processing
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                                <span className="text-2xl">✅</span>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{orderStats.completed}</div>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                    Successfully delivered
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                                <span className="text-2xl">💰</span>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatPrice(orderStats.totalSpent)}</div>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                    All time spending
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Recent Orders */}
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            📋 Recent Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <span className="text-6xl mb-4 block">🛍️</span>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Your shopping journey awaits! ✨
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Discover amazing fashion pieces and start your first order with CosmicClothes! 🌟
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    🛍️ Browse Products
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                                                <span className="text-xl">📦</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    Order #{order.id}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {formatDate(order.created_at)}
                                                    {order.items_count && (
                                                        <span> • {order.items_count} items</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant={getStatusBadgeVariant(order.status)}>
                                                {order.status}
                                            </Badge>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {formatPrice(order.total)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Account Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                👤 Account Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Name
                                </label>
                                <p className="text-gray-900 dark:text-white">{user?.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Email
                                </label>
                                <p className="text-gray-900 dark:text-white">{user?.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Account Type
                                </label>
                                <p className="text-gray-900 dark:text-white capitalize">{user?.role}</p>
                            </div>
                            <Link
                                href="/settings/profile"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                            >
                                Edit Profile →
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                ⚡ Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link
                                href="/products"
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                <span className="text-xl">🛍️</span>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        Browse Products
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Explore our latest collection
                                    </p>
                                </div>
                            </Link>
                            
                            <Link
                                href="/cart"
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                <span className="text-xl">🛒</span>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        View Cart
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Check your cart items
                                    </p>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}