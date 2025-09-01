<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
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

        $shippingAmount = fake()->randomFloat(2, 5, 25);
        $taxAmount = $subtotal * 0.1; // 10% tax
        $total = $subtotal + $shippingAmount + $taxAmount;

        $paymentMethod = fake()->randomElement(['qris', 'bank_transfer', 'bitcoin', 'ethereum']);
        $isCrypto = in_array($paymentMethod, ['bitcoin', 'ethereum']);

        return [
            'order_number' => Order::generateOrderNumber(),
            'user_id' => fake()->boolean(80) ? User::factory() : null,
            'status' => fake()->randomElement(['pending', 'processing', 'shipped', 'delivered']),
            'payment_status' => fake()->randomElement(['pending', 'paid', 'failed']),
            'payment_method' => $paymentMethod,
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'shipping_amount' => $shippingAmount,
            'total' => $total,
            'currency' => 'IDR',
            'crypto_amount' => $isCrypto ? fake()->randomFloat(8, 0.001, 1.0) : null,
            'crypto_currency' => $isCrypto ? strtoupper($paymentMethod) : null,
            'crypto_rate' => $isCrypto ? fake()->randomFloat(2, 500000, 1500000) : null,
            'billing_address' => [
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'email' => fake()->email(),
                'phone' => fake()->phoneNumber(),
                'address_line_1' => fake()->streetAddress(),
                'address_line_2' => fake()->streetSuffix(),
                'city' => fake()->city(),
                'state' => fake()->words(2, true),
                'postal_code' => fake()->postcode(),
                'country' => 'Indonesia',
            ],
            'shipping_address' => [
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'address_line_1' => fake()->streetAddress(),
                'address_line_2' => fake()->streetSuffix(),
                'city' => fake()->city(),
                'state' => fake()->words(2, true),
                'postal_code' => fake()->postcode(),
                'country' => 'Indonesia',
            ],
            'items' => $items,
            'payment_data' => $isCrypto ? [
                'wallet_address' => fake()->sha256(),
                'transaction_id' => fake()->sha256(),
            ] : null,
            'notes' => fake()->boolean(30) ? fake()->sentence() : null,
            'shipped_at' => fake()->boolean(50) ? fake()->dateTimeBetween('-1 month', 'now') : null,
            'delivered_at' => fake()->boolean(30) ? fake()->dateTimeBetween('-2 weeks', 'now') : null,
        ];
    }

    /**
     * Indicate that the order is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'payment_status' => 'pending',
            'shipped_at' => null,
            'delivered_at' => null,
        ]);
    }

    /**
     * Indicate that the order is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 'paid',
            'status' => 'processing',
        ]);
    }

    /**
     * Indicate that the order uses cryptocurrency payment.
     */
    public function cryptocurrency(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_method' => fake()->randomElement(['bitcoin', 'ethereum']),
            'crypto_amount' => fake()->randomFloat(8, 0.001, 1.0),
            'crypto_currency' => strtoupper(fake()->randomElement(['bitcoin', 'ethereum'])),
            'crypto_rate' => fake()->randomFloat(2, 500000, 1500000),
            'payment_data' => [
                'wallet_address' => fake()->sha256(),
                'transaction_id' => fake()->sha256(),
            ],
        ]);
    }

    /**
     * Indicate that the order is for a guest user.
     */
    public function guest(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
        ]);
    }
}