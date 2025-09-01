import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface OrderItem {
    product_id: number;
    quantity: number;
    price: number;
    name: string;
    image?: string;
    sku?: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    payment_method: string;
    subtotal: number;
    tax_amount: number;
    shipping_amount: number;
    total: number;
    currency: string;
    crypto_amount?: number;
    crypto_currency?: string;
    crypto_rate?: number;
    billing_address: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        address_line_1: string;
        address_line_2?: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
    shipping_address: {
        first_name: string;
        last_name: string;
        address_line_1: string;
        address_line_2?: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
    items: OrderItem[];
    notes?: string;
    created_at: string;
}

interface Props {
    order: Order;
    [key: string]: unknown;
}

export default function CheckoutSuccess({ order }: Props) {
    const { auth } = usePage<SharedData>().props;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(price);
    };

    const getPaymentMethodName = (method: string) => {
        const methods = {
            qris: '💳 QRIS',
            bank_transfer: '🏪 Bank Transfer',
            bitcoin: '₿ Bitcoin',
            ethereum: '⟠ Ethereum',
        };
        return methods[method as keyof typeof methods] || method;
    };

    const getPaymentInstructions = () => {
        switch (order.payment_method) {
            case 'qris':
                return (
                    <div className="bg-blue-50 rounded-lg p-4 dark:bg-blue-900/20">
                        <h3 className="font-semibold text-blue-900 mb-2 dark:text-blue-300">QRIS Payment Instructions</h3>
                        <ol className="text-sm text-blue-800 space-y-1 dark:text-blue-400">
                            <li>1. Open your mobile banking or e-wallet app</li>
                            <li>2. Select "Scan QR" or "QRIS"</li>
                            <li>3. Scan the QR code that will be sent to your email</li>
                            <li>4. Confirm the payment amount and complete the transaction</li>
                        </ol>
                    </div>
                );
            case 'bank_transfer':
                return (
                    <div className="bg-green-50 rounded-lg p-4 dark:bg-green-900/20">
                        <h3 className="font-semibold text-green-900 mb-2 dark:text-green-300">Bank Transfer Instructions</h3>
                        <div className="text-sm text-green-800 space-y-2 dark:text-green-400">
                            <p><strong>Bank:</strong> Bank Central Asia (BCA)</p>
                            <p><strong>Account Number:</strong> 1234567890</p>
                            <p><strong>Account Name:</strong> CosmicClothes Indonesia</p>
                            <p><strong>Amount:</strong> {formatPrice(order.total)}</p>
                            <p><strong>Reference:</strong> {order.order_number}</p>
                            <p className="text-xs mt-2">Please include the order number as the transfer reference.</p>
                        </div>
                    </div>
                );
            case 'bitcoin':
            case 'ethereum':
                return (
                    <div className="bg-orange-50 rounded-lg p-4 dark:bg-orange-900/20">
                        <h3 className="font-semibold text-orange-900 mb-2 dark:text-orange-300">
                            {order.crypto_currency} Payment Instructions
                        </h3>
                        <div className="text-sm text-orange-800 space-y-2 dark:text-orange-400">
                            <p><strong>Amount:</strong> {order.crypto_amount?.toFixed(8)} {order.crypto_currency}</p>
                            <p><strong>Rate:</strong> {order.crypto_rate ? formatPrice(order.crypto_rate) : 'N/A'} per {order.crypto_currency}</p>
                            <p><strong>Wallet Address:</strong></p>
                            <code className="bg-orange-100 px-2 py-1 rounded text-xs break-all dark:bg-orange-800">
                                {order.crypto_currency === 'BTC' ? '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' : '0x742d35Cc6639C43B5EE1b8d9aA6D8B7C1Ae9E5Ac'}
                            </code>
                            <p className="text-xs mt-2">Send the exact amount to the wallet address above. Payment will be confirmed within 1-6 confirmations.</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Head title={`Order Confirmation - ${order.order_number}`} />
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 dark:bg-[#0a0a0a] dark:border-gray-800">
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

                <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                    {/* Success Message */}
                    <div className="text-center mb-12">
                        <div className="text-8xl mb-6">✅</div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">
                            Order Placed Successfully!
                        </h1>
                        <p className="text-lg text-gray-600 mb-2 dark:text-gray-300">
                            Thank you for your order. Your order number is:
                        </p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {order.order_number}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Order Details */}
                        <div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                    Order Details
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Order Number:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{order.order_number}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Order Date:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Payment Method:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {getPaymentMethodName(order.payment_method)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Status:</span>
                                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Payment Status:</span>
                                        <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Instructions */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                    Payment Instructions
                                </h2>
                                {getPaymentInstructions()}
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                    Shipping Address
                                </h2>
                                <div className="text-gray-600 dark:text-gray-300">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {order.shipping_address.first_name} {order.shipping_address.last_name}
                                    </p>
                                    <p>{order.shipping_address.address_line_1}</p>
                                    {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
                                    <p>
                                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                                    </p>
                                    <p>{order.shipping_address.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                    Order Items
                                </h2>
                                <div className="space-y-4 mb-6">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
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
                                                <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Qty: {item.quantity} × {formatPrice(item.price)}
                                                </p>
                                                {item.sku && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                                        SKU: {item.sku}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4 space-y-2 dark:border-gray-700">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {formatPrice(order.subtotal)}
                                        </span>
                                    </div>
                                    {order.shipping_amount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatPrice(order.shipping_amount)}
                                            </span>
                                        </div>
                                    )}
                                    {order.tax_amount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-300">Tax</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatPrice(order.tax_amount)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-900 dark:text-white">Total</span>
                                        <span className="text-gray-900 dark:text-white">
                                            {formatPrice(order.total)}
                                        </span>
                                    </div>
                                    
                                    {order.crypto_amount && order.crypto_currency && (
                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-300">Crypto Amount</span>
                                                <span className="font-mono text-gray-900 dark:text-white">
                                                    {order.crypto_amount.toFixed(8)} {order.crypto_currency}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="text-center mt-12 space-y-4">
                        <p className="text-gray-600 dark:text-gray-300">
                            A confirmation email has been sent to {order.billing_address.email}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={route('products.index')}
                                className="rounded-lg bg-gray-900 px-8 py-3 text-lg font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                            >
                                Continue Shopping
                            </Link>
                            {auth.user && (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg border border-gray-300 px-8 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    View Order History
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}