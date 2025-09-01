import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
}

interface Props {
    category: Category;
    [key: string]: unknown;
}

interface CategoryFormData {
    name: string;
    slug: string;
    description: string;
    image: string;
    [key: string]: string;
}

export default function AdminCategoriesEdit({ category }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Categories',
            href: '/admin/categories',
        },
        {
            title: `Edit ${category.name}`,
            href: `/admin/categories/${category.id}/edit`,
        },
    ];

    const { data, setData, patch, processing, errors } = useForm<CategoryFormData>({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image || '',
    });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setData((prev) => ({
            ...prev,
            name,
            slug: generateSlug(name),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/categories/${category.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${category.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        ✏️ Edit Category
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Update category information
                    </p>
                </div>

                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>🏷️ Category Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Category Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        placeholder="Enter category name"
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="category-slug"
                                        required
                                    />
                                    <InputError message={errors.slug} className="mt-2" />
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        Used in URLs, will be auto-generated from name
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Brief description of this category"
                                        rows={4}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="image">Category Image URL</Label>
                                    <Input
                                        id="image"
                                        value={data.image}
                                        onChange={(e) => setData('image', e.target.value)}
                                        placeholder="https://example.com/category-image.jpg"
                                        type="url"
                                    />
                                    <InputError message={errors.image} className="mt-2" />
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        Enter a direct URL to the category image (optional)
                                    </p>
                                </div>

                                {data.image && (
                                    <div>
                                        <Label>Current Image</Label>
                                        <div className="mt-2 aspect-video w-48 overflow-hidden rounded-lg border">
                                            <img
                                                src={data.image}
                                                alt={data.name}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {processing ? 'Updating...' : '✅ Update Category'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                ❌ Cancel
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Preview */}
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>👁️ Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-4">
                            {data.image ? (
                                <img
                                    src={data.image}
                                    alt={data.name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-4xl">
                                    🏷️
                                </div>
                            )}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {data.name || 'Category Name'}
                        </h3>
                        {data.slug && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                /{data.slug}
                            </p>
                        )}
                        {data.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                {data.description}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}