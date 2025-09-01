import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description?: string;
    price: number;
    sale_price?: number;
    current_price: number;
    is_on_sale: boolean;
    sku: string;
    stock_quantity: number;
    stock_status: string;
    is_in_stock: boolean;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    images?: string[];
    gallery?: string[];
    meta_data?: {
        material?: string;
        color?: string;
        brand?: string;
    };
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

interface Props {
    product: Product;
    relatedProducts: Product[];
    [key: string]: unknown;
}

export default function ProductShow({ product, relatedProducts }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const addToCart = () => {
        router.post(route('cart.store'), {
            product_id: product.id,
            quantity: quantity,
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

    const allImages = [...(product.images || []), ...(product.gallery || [])];
    const displayImages = allImages.length > 0 ? allImages : [''];

    return (
        <>
            <Head title={`${product.name} - CosmicClothes`}>
                <meta name="description" content={product.short_description || product.description.substring(0, 160)} />
            </Head>
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
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Link href="/" className="hover:text-gray-900 dark:hover:text-white">Home</Link>
                            <span>→</span>
                            <Link href={route('products.index')} className="hover:text-gray-900 dark:hover:text-white">Products</Link>
                            {product.categories[0] && (
                                <>
                                    <span>→</span>
                                    <Link 
                                        href={route('products.index', { category: product.categories[0].slug })}
                                        className="hover:text-gray-900 dark:hover:text-white"
                                    >
                                        {product.categories[0].name}
                                    </Link>
                                </>
                            )}
                            <span>→</span>
                            <span className="text-gray-900 dark:text-white">{product.name}</span>
                        </div>
                    </nav>

                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                {displayImages[selectedImage] ? (
                                    <img
                                        src={displayImages[selectedImage]}
                                        alt={product.name}
                                        className="h-full w-full object-cover object-center"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-8xl">
                                        👕
                                    </div>
                                )}
                            </div>
                            
                            {displayImages.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {displayImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 ${
                                                selectedImage === index ? 'ring-2 ring-gray-900 dark:ring-white' : ''
                                            }`}
                                        >
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={`${product.name} ${index + 1}`}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-2xl">
                                                    👕
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {product.categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={route('products.index', { category: category.slug })}
                                            className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                                
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {product.name}
                                </h1>
                                
                                {product.short_description && (
                                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                                        {product.short_description}
                                    </p>
                                )}
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {formatPrice(product.current_price)}
                                </span>
                                {product.is_on_sale && product.sale_price && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through dark:text-gray-400">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                                            {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full ${product.is_in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className={`font-medium ${product.is_in_stock ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                    {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
                                </span>
                                {product.is_in_stock && product.stock_quantity <= 10 && (
                                    <span className="text-sm text-orange-600 dark:text-orange-400">
                                        (Only {product.stock_quantity} left)
                                    </span>
                                )}
                            </div>

                            {/* Add to Cart */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Quantity:
                                    </label>
                                    <select
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        disabled={!product.is_in_stock}
                                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {Array.from({ length: Math.min(10, product.stock_quantity) }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <button
                                    onClick={addToCart}
                                    disabled={!product.is_in_stock}
                                    className="w-full rounded-lg bg-gray-900 px-8 py-3 text-lg font-medium text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:disabled:bg-gray-600"
                                >
                                    {product.is_in_stock ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>

                            {/* Product Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Product Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">SKU:</span>
                                        <span className="ml-2 text-gray-600 dark:text-gray-400">{product.sku}</span>
                                    </div>
                                    {product.meta_data?.brand && (
                                        <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Brand:</span>
                                            <span className="ml-2 text-gray-600 dark:text-gray-400">{product.meta_data.brand}</span>
                                        </div>
                                    )}
                                    {product.meta_data?.material && (
                                        <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Material:</span>
                                            <span className="ml-2 text-gray-600 dark:text-gray-400">{product.meta_data.material}</span>
                                        </div>
                                    )}
                                    {product.weight && (
                                        <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Weight:</span>
                                            <span className="ml-2 text-gray-600 dark:text-gray-400">{product.weight} kg</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Description
                                </h3>
                                <div className="prose prose-sm text-gray-600 dark:text-gray-300 dark:prose-invert">
                                    {product.description.split('\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <section className="mt-20">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 dark:text-white">
                                Related Products
                            </h2>
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {relatedProducts.map((relatedProduct) => (
                                    <div key={relatedProduct.id} className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow dark:bg-gray-800">
                                        <Link href={route('products.show', relatedProduct.slug)}>
                                            <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-700">
                                                {relatedProduct.images?.[0] ? (
                                                    <img
                                                        src={relatedProduct.images[0]}
                                                        alt={relatedProduct.name}
                                                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-4xl">
                                                        👕
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                    {relatedProduct.name}
                                                </h3>
                                                <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                                                    {formatPrice(relatedProduct.current_price)}
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
}