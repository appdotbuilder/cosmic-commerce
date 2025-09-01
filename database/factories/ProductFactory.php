<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(random_int(2, 4), true);
        $price = fake()->randomFloat(2, 10, 500);
        $isOnSale = fake()->boolean(30);
        
        return [
            'name' => ucwords($name),
            'slug' => Str::slug($name),
            'description' => fake()->paragraphs(random_int(2, 4), true),
            'short_description' => fake()->sentence(random_int(10, 20)),
            'price' => $price,
            'sale_price' => $isOnSale ? fake()->randomFloat(2, 5, $price - 1) : null,
            'sku' => strtoupper(fake()->unique()->lexify('???-###')),
            'stock_quantity' => fake()->numberBetween(0, 100),
            'manage_stock' => fake()->boolean(80),
            'stock_status' => fake()->randomElement(['in_stock', 'out_of_stock', 'on_backorder']),
            'weight' => fake()->randomFloat(2, 0.1, 5.0),
            'dimensions' => [
                'length' => fake()->randomFloat(2, 5, 50),
                'width' => fake()->randomFloat(2, 5, 50),
                'height' => fake()->randomFloat(2, 1, 20),
            ],
            'images' => [
                fake()->imageUrl(800, 800, 'fashion'),
                fake()->imageUrl(800, 800, 'fashion'),
                fake()->imageUrl(800, 800, 'fashion'),
            ],
            'gallery' => [
                fake()->imageUrl(800, 800, 'fashion'),
                fake()->imageUrl(800, 800, 'fashion'),
            ],
            'featured' => fake()->boolean(20),
            'is_active' => fake()->boolean(95),
            'meta_data' => [
                'seo_title' => fake()->sentence(6),
                'seo_description' => fake()->sentence(15),
                'material' => fake()->randomElement(['Cotton', 'Polyester', 'Wool', 'Silk', 'Linen']),
                'color' => fake()->colorName(),
                'brand' => fake()->company(),
            ],
        ];
    }

    /**
     * Indicate that the product is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'featured' => true,
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the product is on sale.
     */
    public function onSale(): static
    {
        return $this->state(fn (array $attributes) => [
            'sale_price' => fake()->randomFloat(2, 5, $attributes['price'] - 1),
        ]);
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_status' => 'out_of_stock',
            'stock_quantity' => 0,
        ]);
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}