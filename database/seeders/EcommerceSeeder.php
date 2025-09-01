<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EcommerceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories
        $categories = [
            [
                'name' => 'T-Shirts',
                'slug' => 't-shirts',
                'description' => 'Comfortable and stylish t-shirts for everyday wear',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Hoodies',
                'slug' => 'hoodies',
                'description' => 'Cozy hoodies perfect for casual outings',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Complete your look with our accessories',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Footwear',
                'slug' => 'footwear',
                'description' => 'Stylish and comfortable shoes for every occasion',
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        $createdCategories = [];
        foreach ($categories as $categoryData) {
            $createdCategories[] = Category::create($categoryData);
        }

        // Create sample products
        $products = [
            [
                'name' => 'Premium Cotton T-Shirt',
                'slug' => 'premium-cotton-t-shirt',
                'description' => 'Made from 100% organic cotton, this t-shirt offers unparalleled comfort and style. The soft fabric feels great against the skin and maintains its shape wash after wash.',
                'short_description' => 'Comfortable 100% organic cotton t-shirt in classic fit',
                'price' => 299000,
                'sale_price' => 249000,
                'sku' => 'TSH-001',
                'stock_quantity' => 50,
                'featured' => true,
                'categories' => [$createdCategories[0]->id], // T-Shirts
            ],
            [
                'name' => 'Urban Streetwear Hoodie',
                'slug' => 'urban-streetwear-hoodie',
                'description' => 'Stay warm and stylish with our urban streetwear hoodie. Features a kangaroo pocket, adjustable drawstring hood, and premium fleece lining.',
                'short_description' => 'Urban style hoodie with fleece lining and kangaroo pocket',
                'price' => 599000,
                'sku' => 'HOD-001',
                'stock_quantity' => 30,
                'featured' => true,
                'categories' => [$createdCategories[1]->id], // Hoodies
            ],
            [
                'name' => 'Minimalist Canvas Sneakers',
                'slug' => 'minimalist-canvas-sneakers',
                'description' => 'Clean, minimalist design meets maximum comfort. These canvas sneakers are perfect for everyday wear with their durable construction and timeless style.',
                'short_description' => 'Comfortable canvas sneakers with minimalist design',
                'price' => 799000,
                'sale_price' => 699000,
                'sku' => 'SNK-001',
                'stock_quantity' => 25,
                'featured' => true,
                'categories' => [$createdCategories[3]->id], // Footwear
            ],
            [
                'name' => 'Classic Baseball Cap',
                'slug' => 'classic-baseball-cap',
                'description' => 'Complete your casual look with this classic baseball cap. Adjustable strap ensures a perfect fit for all head sizes.',
                'short_description' => 'Adjustable baseball cap in classic style',
                'price' => 199000,
                'sku' => 'CAP-001',
                'stock_quantity' => 40,
                'categories' => [$createdCategories[2]->id], // Accessories
            ],
            [
                'name' => 'Vintage Graphic Tee',
                'slug' => 'vintage-graphic-tee',
                'description' => 'Express your style with this vintage-inspired graphic tee. Soft-washed for that perfectly worn-in feel.',
                'short_description' => 'Soft vintage-inspired graphic t-shirt',
                'price' => 349000,
                'sku' => 'TSH-002',
                'stock_quantity' => 35,
                'categories' => [$createdCategories[0]->id], // T-Shirts
            ],
            [
                'name' => 'Tech Fleece Hoodie',
                'slug' => 'tech-fleece-hoodie',
                'description' => 'Innovation meets comfort in this tech fleece hoodie. Moisture-wicking fabric keeps you dry and comfortable during any activity.',
                'short_description' => 'High-tech fleece hoodie with moisture-wicking fabric',
                'price' => 899000,
                'sku' => 'HOD-002',
                'stock_quantity' => 20,
                'categories' => [$createdCategories[1]->id], // Hoodies
            ],
        ];

        foreach ($products as $productData) {
            $categoryIds = $productData['categories'];
            unset($productData['categories']);

            $productData['images'] = [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1503341338985-a071dd2c6a84?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=800&fit=crop',
            ];
            
            $productData['gallery'] = [
                'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=800&fit=crop',
            ];

            $productData['stock_status'] = 'in_stock';
            $productData['is_active'] = true;
            $productData['weight'] = 0.5;
            $productData['dimensions'] = [
                'length' => 30,
                'width' => 20,
                'height' => 5,
            ];
            $productData['meta_data'] = [
                'material' => 'Cotton',
                'color' => 'Multiple',
                'brand' => 'CosmicClothes',
            ];

            $product = Product::create($productData);
            $product->categories()->attach($categoryIds);
        }

        // Create test user
        User::firstOrCreate([
            'email' => 'test@example.com',
        ], [
            'name' => 'Test User',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
    }
}