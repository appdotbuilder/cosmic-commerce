import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Products',
        href: '/admin/products',
    },
];

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price?: number;
    current_price: number;
    is_on_sale: boolean;
    stock_quantity: number;
    stock_status: string;
    status: string;
    featured: boolean;
    main_image?: string;
    categories: Category[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    products: {
        data: Product[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
    };
    [key: string]: unknown;
}

export default function AdminProductsIndex({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    const handleSearch = () => {
        router.get('/admin/products', {
            search: search || undefined,
            category: selectedCategory || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (productId: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/admin/products/${productId}`);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(price);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Products" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            📦 Manage Products
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Add, edit, and organize your product catalog
                        </p>
                    </div>
                    <Link
                        href="/admin/products/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        ➕ Add Product
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>🔍 Search & Filter</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <Input
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1"
                        />
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSearch}>
                            Search
                        </Button>
                    </CardContent>
                </Card>

                {/* Products Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.data.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                            <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                                {product.main_image ? (
                                    <img
                                        src={product.main_image}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-6xl">
                                        👕
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 flex gap-1">
                                    {product.featured && (
                                        <Badge variant="secondary">⭐ Featured</Badge>
                                    )}
                                    {product.is_on_sale && (
                                        <Badge variant="destructive">🏷️ Sale</Badge>
                                    )}
                                </div>
                                <div className="absolute top-2 right-2">
                                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                                        {product.status === 'active' ? '✅' : '❌'} {product.status}
                                    </Badge>
                                </div>
                            </div>
                            
                            <CardContent className="p-4">
                                <div className="mb-3">
                                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            {formatPrice(product.current_price)}
                                        </span>
                                        {product.is_on_sale && (
                                            <span className="text-sm text-gray-500 line-through">
                                                {formatPrice(product.price)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Stock: {product.stock_quantity} • {product.stock_status}
                                    </p>
                                    {product.categories.length > 0 && (
                                        <div className="flex gap-1 mt-2">
                                            {product.categories.map((category) => (
                                                <Badge key={category.id} variant="outline" className="text-xs">
                                                    {category.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                    >
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            ✏️ Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        🗑️
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {products.data.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <span className="text-6xl mb-4 block">📦</span>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No products found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                {filters.search || filters.category 
                                    ? "Try adjusting your search filters"
                                    : "Start by adding your first product"
                                }
                            </p>
                            <Link
                                href="/admin/products/create"
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                ➕ Add Product
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {products.meta.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {products.links.map((link, index: number) => (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}