import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Categories',
        href: '/admin/categories',
    },
];

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    products_count: number;
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
    categories: {
        data: Category[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    filters: {
        search?: string;
    };
    [key: string]: unknown;
}

export default function AdminCategoriesIndex({ categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get('/admin/categories', {
            search: search || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (categoryId: number) => {
        if (confirm('Are you sure you want to delete this category? All associated products will be unlinked.')) {
            router.delete(`/admin/categories/${categoryId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Categories" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            🏷️ Manage Categories
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Organize your products with categories
                        </p>
                    </div>
                    <Link
                        href="/admin/categories/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        ➕ Add Category
                    </Link>
                </div>

                {/* Search */}
                <Card>
                    <CardHeader>
                        <CardTitle>🔍 Search Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <Input
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch}>
                            Search
                        </Button>
                    </CardContent>
                </Card>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.data.map((category) => (
                        <Card key={category.id} className="overflow-hidden">
                            <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                                {category.image ? (
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-6xl">
                                        🏷️
                                    </div>
                                )}
                            </div>
                            
                            <CardContent className="p-4">
                                <div className="mb-3">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        {category.slug}
                                    </p>
                                </div>

                                {category.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                        {category.description}
                                    </p>
                                )}

                                <div className="mb-4">
                                    <Badge variant="outline">
                                        📦 {category.products_count} products
                                    </Badge>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                    >
                                        <Link href={`/admin/categories/${category.id}/edit`}>
                                            ✏️ Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(category.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        🗑️
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {categories.data.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <span className="text-6xl mb-4 block">🏷️</span>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No categories found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                {filters.search 
                                    ? "Try adjusting your search"
                                    : "Start by creating your first category"
                                }
                            </p>
                            <Link
                                href="/admin/categories/create"
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                ➕ Create Category
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {categories.meta.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {categories.links.map((link, index: number) => (
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