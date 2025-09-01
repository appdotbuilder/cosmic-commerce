import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Products',
        href: '/admin/products',
    },
    {
        title: 'Create Product',
        href: '/admin/products/create',
    },
];

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    categories: Category[];
    [key: string]: unknown;
}

interface ProductFormData {
    name: string;
    slug: string;
    description: string;
    short_description: string;
    price: string;
    sale_price: string;
    sku: string;
    stock_quantity: string;
    stock_status: string;
    status: string;
    featured: boolean;
    main_image: string;
    category_ids: number[];
    [key: string]: string | boolean | number[];
}

export default function AdminProductsCreate({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm<ProductFormData>({
        name: '',
        slug: '',
        description: '',
        short_description: '',
        price: '',
        sale_price: '',
        sku: '',
        stock_quantity: '',
        stock_status: 'in_stock',
        status: 'active',
        featured: false,
        main_image: '',
        category_ids: [],
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

    const handleCategoryChange = (categoryId: number, checked: boolean) => {
        setData((prev) => ({
            ...prev,
            category_ids: checked
                ? [...prev.category_ids, categoryId]
                : prev.category_ids.filter(id => id !== categoryId),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/products');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        ➕ Create New Product
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Add a new product to your catalog
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>📝 Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        placeholder="Enter product name"
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
                                        placeholder="product-slug"
                                        required
                                    />
                                    <InputError message={errors.slug} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input
                                        id="sku"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                        placeholder="PROD-001"
                                        required
                                    />
                                    <InputError message={errors.sku} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="short_description">Short Description</Label>
                                    <Input
                                        id="short_description"
                                        value={data.short_description}
                                        onChange={(e) => setData('short_description', e.target.value)}
                                        placeholder="Brief product description"
                                    />
                                    <InputError message={errors.short_description} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Detailed product description"
                                        rows={4}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing & Inventory */}
                        <Card>
                            <CardHeader>
                                <CardTitle>💰 Pricing & Inventory</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="price">Regular Price (IDR)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="100000"
                                        min="0"
                                        step="1000"
                                        required
                                    />
                                    <InputError message={errors.price} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="sale_price">Sale Price (IDR)</Label>
                                    <Input
                                        id="sale_price"
                                        type="number"
                                        value={data.sale_price}
                                        onChange={(e) => setData('sale_price', e.target.value)}
                                        placeholder="80000"
                                        min="0"
                                        step="1000"
                                    />
                                    <InputError message={errors.sale_price} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                                    <Input
                                        id="stock_quantity"
                                        type="number"
                                        value={data.stock_quantity}
                                        onChange={(e) => setData('stock_quantity', e.target.value)}
                                        placeholder="50"
                                        min="0"
                                        required
                                    />
                                    <InputError message={errors.stock_quantity} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="stock_status">Stock Status</Label>
                                    <Select value={data.stock_status} onValueChange={(value) => setData('stock_status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select stock status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="in_stock">In Stock</SelectItem>
                                            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.stock_status} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="status">Product Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="featured"
                                        checked={data.featured}
                                        onCheckedChange={(checked) => setData('featured', Boolean(checked))}
                                    />
                                    <Label htmlFor="featured">Featured Product</Label>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Categories & Media */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>🏷️ Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {categories.map((category) => (
                                        <div key={category.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`category-${category.id}`}
                                                checked={data.category_ids.includes(category.id)}
                                                onCheckedChange={(checked) => handleCategoryChange(category.id, Boolean(checked))}
                                            />
                                            <Label htmlFor={`category-${category.id}`}>
                                                {category.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                <InputError message={errors.category_ids} className="mt-2" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>🖼️ Media</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <Label htmlFor="main_image">Main Image URL</Label>
                                    <Input
                                        id="main_image"
                                        value={data.main_image}
                                        onChange={(e) => setData('main_image', e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        type="url"
                                    />
                                    <InputError message={errors.main_image} className="mt-2" />
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        Enter a direct URL to the product image
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {processing ? 'Creating...' : '✅ Create Product'}
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
        </AppLayout>
    );
}