<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cart>
 */
class CartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $items = [];
        $itemCount = fake()->numberBetween(1, 5);
        $subtotal = 0;

        for ($i = 0; $i < $itemCount; $i++) {
            $price = fake()->randomFloat(2, 10, 200);
            $quantity = fake()->numberBetween(1, 3);
            $items[] = [
                'product_id' => fake()->numberBetween(1, 50),
                'quantity' => $quantity,
                'price' => $price,
                'name' => fake()->words(3, true),
                'image' => fake()->imageUrl(200, 200, 'fashion'),
                'sku' => strtoupper(fake()->lexify('???-###')),
            ];
            $subtotal += $price * $quantity;
        }

        return [
            'session_id' => fake()->uuid(),
            'user_id' => fake()->boolean(70) ? User::factory() : null,
            'items' => $items,
            'subtotal' => $subtotal,
            'tax_amount' => 0,
            'total' => $subtotal,
        ];
    }

    /**
     * Indicate that the cart belongs to a guest (no user).
     */
    public function guest(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
            'session_id' => fake()->uuid(),
        ]);
    }

    /**
     * Indicate that the cart is empty.
     */
    public function empty(): static
    {
        return $this->state(fn (array $attributes) => [
            'items' => [],
            'subtotal' => 0,
            'tax_amount' => 0,
            'total' => 0,
        ]);
    }
}