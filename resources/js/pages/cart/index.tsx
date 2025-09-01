import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface CartItem {
    product_id: number;
    quantity: number;
    price: number;
    name: string;
    image?: string;
    sku?: string;
}

interface Cart {
    id: number;
    items: CartItem[];
    subtotal: number;
    tax_amount: number;
    total: number;
    items_count: number;
}

interface Props {
    cart: Cart | null;
    [key: string]: unknown;
}

export default function CartIndex({ cart }: Props) {
    const { auth } = usePage<SharedData>().props;

    const updateQuantity = (productId: number, quantity: number) => {
        router.patch(route('cart.update', productId), {
            quantity: quantity,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const removeItem = (productId: number) => {
        router.delete(route('cart.destroy', productId), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(price);
    };

    const isEmpty = !cart || !cart.items || cart.items.length === 0;

    return (
        <>
            <Head title="Shopping Cart - CosmicClothes" />
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-[#0a0a0a]/80 dark:border-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                                🌟 CosmicClothes
                            </Link>
                            
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={route('login')}
                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Link href="/" className="hover:text-gray-900 dark:hover:text-white">Home</Link>
                            <span>→</span>
                            <span className="text-gray-900 dark:text-white">Shopping Cart</span>
                        </div>
                    </nav>

                    <h1 className="text-3xl font-bold text-gray-900 mb-8 dark:text-white">
                        Shopping Cart
                    </h1>

                    {isEmpty ? (
                        <div className="text-center py-12">
                            <div className="text-8xl mb-6">🛒</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">
                                Your cart is empty
                            </h2>
                            <p className="text-gray-600 mb-8 dark:text-gray-300">
                                Looks like you haven't added anything to your cart yet.
                            </p>
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-lg font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                            >
                                Start Shopping
                                <span>→</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="p-6">
                                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {cart.items.map((item) => (
                                                <div key={item.product_id} className="flex items-center gap-6 py-6 first:pt-0 last:pb-0">
                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="h-full w-full object-cover object-center"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-2xl">
                                                                👕
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                            {item.name}
                                                        </h3>
                                                        {item.sku && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                SKU: {item.sku}
                                                            </p>
                                                        )}
                                                        <p className="text-lg font-bold text-gray-900 mt-2 dark:text-white">
                                                            {formatPrice(item.price)}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                Qty:
                                                            </label>
                                                            <select
                                                                value={item.quantity}
                                                                onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value))}
                                                                className="rounded-lg border border-gray-300 px-3 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                            >
                                                                {Array.from({ length: 10 }, (_, i) => (
                                                                    <option key={i + 1} value={i + 1}>
                                                                        {i + 1}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <button
                                                            onClick={() => removeItem(item.product_id)}
                                                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Link
                                        href={route('products.index')}
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        ← Continue Shopping
                                    </Link>
                                </div>
                            </div>

                            {/* Cart Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                        Order Summary
                                    </h2>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 dark:text-gray-300">
                                                Subtotal ({cart.items_count} items)
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatPrice(cart.subtotal)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 dark:text-gray-300">
                                                Shipping
                                            </span>
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                Calculated at checkout
                                            </span>
                                        </div>

                                        {cart.tax_amount > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 dark:text-gray-300">Tax</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {formatPrice(cart.tax_amount)}
                                                </span>
                                            </div>
                                        )}

                                        <hr className="border-gray-200 dark:border-gray-700" />

                                        <div className="flex items-center justify-between text-lg font-bold">
                                            <span className="text-gray-900 dark:text-white">Total</span>
                                            <span className="text-gray-900 dark:text-white">
                                                {formatPrice(cart.total)}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        href={route('checkout.index')}
                                        className="mt-6 w-full rounded-lg bg-gray-900 px-6 py-3 text-lg font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 block text-center"
                                    >
                                        Proceed to Checkout
                                    </Link>

                                    <div className="mt-4 text-center">
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <span>🔒</span>
                                            <span>Secure checkout with SSL encryption</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="mt-6 bg-gray-50 rounded-lg p-6 dark:bg-gray-900/50">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3 dark:text-white">
                                        We Accept
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <span>💳</span>
                                            <span>QRIS</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>🏪</span>
                                            <span>Bank Transfer</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>₿</span>
                                            <span>Bitcoin</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>⟠</span>
                                            <span>Ethereum</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}