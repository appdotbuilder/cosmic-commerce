import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
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
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url?: string;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    products: PaginatedProducts;
    categories: Category[];
    filters: {
        category?: string;
        search?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
    };
    [key: string]: unknown;
}

export default function ProductIndex({ products, categories, filters }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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

    const handleFilterChange = (key: string, value: string) => {
        const newFilters: Record<string, string> = { ...filters };
        if (value) {
            newFilters[key] = value;
        } else {
            delete newFilters[key];
        }
        router.get(route('products.index'), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(route('products.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="All Products - CosmicClothes" />
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-[#0a0a0a]/80 dark:border-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                                🌟 CosmicClothes
                            </Link>
                            
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

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                All Products
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                {products.total} products found
                            </p>
                        </div>
                        
                        <button
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className="md:hidden rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                            Filters
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <div className={`w-full md:w-64 space-y-6 ${isFiltersOpen ? 'block' : 'hidden md:block'}`}>
                            <div className="bg-gray-50 rounded-lg p-6 dark:bg-gray-900/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                {/* Search */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        defaultValue={filters.search || ''}
                                        onChange={(e) => {
                                            const timer = setTimeout(() => {
                                                handleFilterChange('search', e.target.value);
                                            }, 500);
                                            return () => clearTimeout(timer);
                                        }}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                        Category
                                    </label>
                                    <select
                                        value={filters.category || ''}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.slug}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                        Price Range
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            defaultValue={filters.min_price || ''}
                                            onChange={(e) => handleFilterChange('min_price', e.target.value)}
                                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            defaultValue={filters.max_price || ''}
                                            onChange={(e) => handleFilterChange('max_price', e.target.value)}
                                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                        Sort By
                                    </label>
                                    <select
                                        value={filters.sort || 'newest'}
                                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="price_low">Price: Low to High</option>
                                        <option value="price_high">Price: High to Low</option>
                                        <option value="name">Name: A to Z</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="flex-1">
                            {products.data.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                        {products.data.map((product) => (
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

                                    {/* Pagination */}
                                    {products.last_page > 1 && (
                                        <div className="mt-12 flex items-center justify-center">
                                            <div className="flex items-center gap-1">
                                                {products.links.map((link, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            if (link.url) {
                                                                router.get(link.url, {}, {
                                                                    preserveState: true,
                                                                    replace: true,
                                                                });
                                                            }
                                                        }}
                                                        disabled={!link.url}
                                                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                                            link.active
                                                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800'
                                                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">No products found</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        Try adjusting your search or filter criteria
                                    </p>
                                    <button
                                        onClick={clearFilters}
                                        className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}