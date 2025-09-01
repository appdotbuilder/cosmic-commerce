<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(random_int(1, 2), true);
        
        return [
            'name' => ucwords($name),
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(),
            'image' => fake()->imageUrl(400, 300, 'fashion'),
            'sort_order' => fake()->numberBetween(0, 100),
            'is_active' => fake()->boolean(90),
        ];
    }

    /**
     * Indicate that the category is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the category is featured (high sort order).
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'sort_order' => fake()->numberBetween(90, 100),
            'is_active' => true,
        ]);
    }
}