import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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

interface CryptoRates {
    BTC: number;
    ETH: number;
}

interface Props {
    cart: Cart;
    cryptoRates: CryptoRates;
    [key: string]: unknown;
}

type CheckoutFormData = {
    payment_method: string;
    billing_address: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        address_line_1: string;
        address_line_2: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
    shipping_address: {
        first_name: string;
        last_name: string;
        address_line_1: string;
        address_line_2: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
    notes: string;
}

export default function CheckoutIndex({ cart, cryptoRates }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [sameAsBilling, setSameAsBilling] = useState(true);

    const { data, setData, post, processing, errors } = useForm<CheckoutFormData>({
        payment_method: 'qris',
        billing_address: {
            first_name: auth.user?.name?.split(' ')[0] || '',
            last_name: auth.user?.name?.split(' ').slice(1).join(' ') || '',
            email: auth.user?.email || '',
            phone: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'Indonesia',
        },
        shipping_address: {
            first_name: auth.user?.name?.split(' ')[0] || '',
            last_name: auth.user?.name?.split(' ').slice(1).join(' ') || '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'Indonesia',
        },
        notes: '',
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(price);
    };

    const formatCryptoAmount = (idrAmount: number, currency: 'BTC' | 'ETH') => {
        const rate = cryptoRates[currency];
        const cryptoAmount = idrAmount / rate;
        return {
            amount: cryptoAmount,
            formatted: `${cryptoAmount.toFixed(8)} ${currency}`,
        };
    };

    const shippingCost = 15; // Fixed shipping cost in USD equivalent
    const totalWithShipping = cart.total + cart.tax_amount + (shippingCost * 15000); // Convert to IDR

    const handleBillingAddressChange = (field: keyof CheckoutFormData['billing_address'], value: string) => {
        setData('billing_address', { ...data.billing_address, [field]: value });
        
        if (sameAsBilling && field !== 'email' && field !== 'phone') {
            setData('shipping_address', { ...data.shipping_address, [field]: value });
        }
    };

    const handleSameAsBillingChange = (checked: boolean) => {
        setSameAsBilling(checked);
        if (checked) {
            setData('shipping_address', {
                first_name: data.billing_address.first_name,
                last_name: data.billing_address.last_name,
                address_line_1: data.billing_address.address_line_1,
                address_line_2: data.billing_address.address_line_2,
                city: data.billing_address.city,
                state: data.billing_address.state,
                postal_code: data.billing_address.postal_code,
                country: data.billing_address.country,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('checkout.store'));
    };

    return (
        <>
            <Head title="Checkout - CosmicClothes" />
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-[#0a0a0a]/80 dark:border-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                                🌟 CosmicClothes
                            </Link>
                            
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                🔒 Secure Checkout
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
                            <Link href={route('cart.index')} className="hover:text-gray-900 dark:hover:text-white">Cart</Link>
                            <span>→</span>
                            <span className="text-gray-900 dark:text-white">Checkout</span>
                        </div>
                    </nav>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Checkout Form */}
                        <div>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Payment Method */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                        Payment Method
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="qris"
                                                checked={data.payment_method === 'qris'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${data.payment_method === 'qris' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                                {data.payment_method === 'qris' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">💳 QRIS</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Quick Response Indonesian Standard</div>
                                            </div>
                                        </label>

                                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="bank_transfer"
                                                checked={data.payment_method === 'bank_transfer'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${data.payment_method === 'bank_transfer' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                                {data.payment_method === 'bank_transfer' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">🏪 Bank Transfer</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Transfer to bank account</div>
                                            </div>
                                        </label>

                                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="bitcoin"
                                                checked={data.payment_method === 'bitcoin'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${data.payment_method === 'bitcoin' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                                {data.payment_method === 'bitcoin' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">₿ Bitcoin</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    ~{formatCryptoAmount(totalWithShipping, 'BTC').formatted}
                                                </div>
                                            </div>
                                        </label>

                                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="ethereum"
                                                checked={data.payment_method === 'ethereum'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${data.payment_method === 'ethereum' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                                {data.payment_method === 'ethereum' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">⟠ Ethereum</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    ~{formatCryptoAmount(totalWithShipping, 'ETH').formatted}
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    {errors.payment_method && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.payment_method}</p>
                                    )}
                                </div>

                                {/* Billing Address */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                        Billing Address
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={data.billing_address.first_name}
                                                onChange={(e) => handleBillingAddressChange('first_name', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {(errors as Record<string, string>)['billing_address.first_name'] && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{(errors as Record<string, string>)['billing_address.first_name']}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={data.billing_address.last_name}
                                                onChange={(e) => handleBillingAddressChange('last_name', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {(errors as Record<string, string>)['billing_address.last_name'] && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{(errors as Record<string, string>)['billing_address.last_name']}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={data.billing_address.email}
                                                onChange={(e) => handleBillingAddressChange('email', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {(errors as Record<string, string>)['billing_address.email'] && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{(errors as Record<string, string>)['billing_address.email']}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.billing_address.phone}
                                                onChange={(e) => handleBillingAddressChange('phone', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {(errors as Record<string, string>)['billing_address.phone'] && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{(errors as Record<string, string>)['billing_address.phone']}</p>
                                            )}
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                                                Address Line 1
                                            </label>
                                            <input
                                                type="text"
                                                value={data.billing_address.address_line_1}
                                                onChange={(e) => handleBillingAddressChange('address_line_1', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {(errors as Record<string, string>)['billing_address.address_line_1'] && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{(errors as Record<string, string>)['billing_address.address_line_1']}</p>
                                            )}
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                                                Address Line 2 (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={data.billing_address.address_line_2}
                                                onChange={(e) => handleBillingAddressChange('address_line_2', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                value={data.billing_address.city}
                                                onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {(errors as Record<string, string>)['billing_address.city'] && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{(errors as Record<string, string>)['billing_address.city']}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                                                State/Province
                                            </label>
                                            <input
                                                type="text"
                                                value={data.billing_address.state}
                                                onChange={(e) => handleBillingAddressChange('state', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {(errors as Record<string, string>)['billing_address.state'] && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{(errors as Record<string, string>)['billing_address.state']}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                value={data.billing_address.postal_code}
                                                onChange={(e) => handleBillingAddressChange('postal_code', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {(errors as Record<string, string>)['billing_address.postal_code'] && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{(errors as Record<string, string>)['billing_address.postal_code']}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                                                Country
                                            </label>
                                            <select
                                                value={data.billing_address.country}
                                                onChange={(e) => handleBillingAddressChange('country', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                required
                                            >
                                                <option value="Indonesia">Indonesia</option>
                                                <option value="Malaysia">Malaysia</option>
                                                <option value="Singapore">Singapore</option>
                                                <option value="Thailand">Thailand</option>
                                                <option value="Philippines">Philippines</option>
                                            </select>
                                            {(errors as Record<string, string>)['billing_address.country'] && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{(errors as Record<string, string>)['billing_address.country']}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Shipping Address
                                        </h2>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={sameAsBilling}
                                                onChange={(e) => handleSameAsBillingChange(e.target.checked)}
                                                className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                            />
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                Same as billing address
                                            </span>
                                        </label>
                                    </div>

                                    {!sameAsBilling && (
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            {/* Similar fields as billing address but for shipping */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.shipping_address.first_name}
                                                    onChange={(e) => setData('shipping_address', { ...data.shipping_address, first_name: e.target.value })}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    required
                                                />
                                            </div>
                                            {/* Add other shipping address fields here */}
                                        </div>
                                    )}
                                </div>

                                {/* Order Notes */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                        Order Notes (Optional)
                                    </h2>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="Special instructions for delivery..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-gray-900 px-8 py-4 text-lg font-medium text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                >
                                    {processing ? 'Processing...' : 'Place Order'}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24 dark:bg-gray-800 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6">
                                    {cart.items.map((item) => (
                                        <div key={item.product_id} className="flex items-center gap-4">
                                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-xl">
                                                        👕
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {formatPrice(cart.subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {formatPrice(shippingCost * 15000)}
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
                                            {formatPrice(totalWithShipping)}
                                        </span>
                                    </div>

                                    {(data.payment_method === 'bitcoin' || data.payment_method === 'ethereum') && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                                            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                                                Cryptocurrency Amount:
                                            </p>
                                            <p className="text-lg font-bold text-blue-900 dark:text-blue-300">
                                                {formatCryptoAmount(totalWithShipping, data.payment_method.toUpperCase() as 'BTC' | 'ETH').formatted}
                                            </p>
                                            <p className="text-xs text-blue-700 mt-1 dark:text-blue-400">
                                                Rate updated in real-time
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}