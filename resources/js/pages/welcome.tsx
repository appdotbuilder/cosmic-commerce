import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price?: number;
    current_price: number;
    is_on_sale: boolean;
    main_image?: string;
    short_description?: string;
    stock_status: string;
    is_in_stock: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
}

interface Props {
    featuredProducts: Product[];
    categories: Category[];
    [key: string]: unknown;
}

export default function Welcome({ featuredProducts, categories }: Props) {
    const { auth } = usePage<SharedData>().props;

    const addToCart = (productId: number) => {
        router.post(route('cart.store'), {
            product_id: productId,
            quantity: 1,
        }, {
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

    return (
        <>
            <Head title="CosmicClothes - Modern Fashion for Everyone">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-[#0a0a0a]/80 dark:border-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-8">
                                <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                                    🌟 CosmicClothes
                                </Link>
                                <nav className="hidden md:flex items-center gap-6">
                                    <Link href={route('products.index')} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                        All Products
                                    </Link>
                                    {categories.slice(0, 4).map((category) => (
                                        <Link
                                            key={category.id}
                                            href={route('products.index', { category: category.slug })}
                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route('cart.index')}
                                    className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                >
                                    🛒
                                </Link>
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

                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-20 dark:from-gray-900 dark:to-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                                Modern Fashion
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                    Redefined
                                </span>
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
                                Discover our curated collection of premium clothing designed for the modern individual. 
                                Clean aesthetics, quality materials, and timeless style.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-6">
                                <Link
                                    href={route('products.index')}
                                    className="rounded-lg bg-gray-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                >
                                    Shop Now
                                </Link>
                                <Link
                                    href="#featured"
                                    className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                                >
                                    View Featured <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Shop by Category
                            </h2>
                            <p className="mt-4 text-gray-600 dark:text-gray-300">
                                Find exactly what you're looking for
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={route('products.index', { category: category.slug })}
                                    className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square hover:shadow-lg transition-shadow dark:bg-gray-800"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="text-lg font-semibold">{category.name}</h3>
                                        <p className="text-sm opacity-90">{category.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products Section */}
                <section id="featured" className="py-16 bg-gray-50 dark:bg-gray-900/50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Featured Products
                            </h2>
                            <p className="mt-4 text-gray-600 dark:text-gray-300">
                                Hand-picked favorites from our collection
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow dark:bg-gray-800">
                                    <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-700">
                                        {product.main_image ? (
                                            <img
                                                src={product.main_image}
                                                alt={product.name}
                                                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-4xl">
                                                👕
                                            </div>
                                        )}
                                        {product.is_on_sale && (
                                            <div className="absolute top-4 left-4 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                                                Sale
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <Link
                                            href={route('products.show', product.slug)}
                                            className="text-lg font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                                        >
                                            {product.name}
                                        </Link>
                                        {product.short_description && (
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                {product.short_description}
                                            </p>
                                        )}
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {formatPrice(product.current_price)}
                                                </span>
                                                {product.is_on_sale && product.sale_price && (
                                                    <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => addToCart(product.id)}
                                                disabled={!product.is_in_stock}
                                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:disabled:bg-gray-600"
                                            >
                                                {product.is_in_stock ? 'Add to Cart' : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 text-center">
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                View All Products
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="text-center">
                                <div className="text-4xl mb-4">🚚</div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Free Shipping</h3>
                                <p className="text-gray-600 dark:text-gray-300">On orders over Rp 500.000</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-4">🔄</div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Easy Returns</h3>
                                <p className="text-gray-600 dark:text-gray-300">30-day return policy</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-4">💳</div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Secure Payment</h3>
                                <p className="text-gray-600 dark:text-gray-300">QRIS, Bank Transfer & Crypto</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-4">⭐</div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Premium Quality</h3>
                                <p className="text-gray-600 dark:text-gray-300">Carefully curated materials</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Shop</h3>
                                <ul className="mt-4 space-y-2">
                                    {categories.slice(0, 4).map((category) => (
                                        <li key={category.id}>
                                            <Link
                                                href={route('products.index', { category: category.slug })}
                                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                            >
                                                {category.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Support</h3>
                                <ul className="mt-4 space-y-2">
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Contact</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Size Guide</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Shipping</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Returns</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Company</h3>
                                <ul className="mt-4 space-y-2">
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">About</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Careers</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Press</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Blog</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Connect</h3>
                                <ul className="mt-4 space-y-2">
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Instagram</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Twitter</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Facebook</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">TikTok</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-gray-200 pt-8 text-center dark:border-gray-700">
                            <p className="text-gray-600 dark:text-gray-300">
                                © 2024 CosmicClothes. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}