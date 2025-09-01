<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Cart
 *
 * @property int $id
 * @property string|null $session_id
 * @property int|null $user_id
 * @property array $items
 * @property float $subtotal
 * @property float $tax_amount
 * @property float $total
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $user
 * @property-read int $items_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Cart newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Cart newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Cart query()
 * @method static \Illuminate\Database\Eloquent\Builder|Cart whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Cart whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Cart whereItems($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Cart whereSessionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Cart whereSubtotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Cart whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Cart whereTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Cart whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Cart whereUserId($value)
 * @method static \Database\Factories\CartFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Cart extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'session_id',
        'user_id',
        'items',
        'subtotal',
        'tax_amount',
        'total',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'items' => 'array',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    /**
     * Get the user that owns the cart.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the total number of items in the cart.
     *
     * @return int
     */
    public function getItemsCountAttribute(): int
    {
        return array_sum(array_column($this->items ?? [], 'quantity'));
    }

    /**
     * Add an item to the cart.
     *
     * @param  int  $productId
     * @param  int  $quantity
     * @param  array  $productData
     * @return void
     */
    public function addItem(int $productId, int $quantity, array $productData): void
    {
        $items = $this->items ?? [];
        $existingItemKey = null;

        // Check if item already exists
        foreach ($items as $key => $item) {
            if ($item['product_id'] === $productId) {
                $existingItemKey = $key;
                break;
            }
        }

        if ($existingItemKey !== null) {
            // Update existing item
            $items[$existingItemKey]['quantity'] += $quantity;
        } else {
            // Add new item
            $items[] = [
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $productData['price'],
                'name' => $productData['name'],
                'image' => $productData['image'] ?? null,
                'sku' => $productData['sku'] ?? null,
            ];
        }

        $this->items = $items;
        $this->calculateTotals();
        $this->save();
    }

    /**
     * Remove an item from the cart.
     *
     * @param  int  $productId
     * @return void
     */
    public function removeItem(int $productId): void
    {
        $items = $this->items ?? [];
        $items = array_filter($items, fn($item) => $item['product_id'] !== $productId);
        
        $this->items = array_values($items);
        $this->calculateTotals();
        $this->save();
    }

    /**
     * Update item quantity.
     *
     * @param  int  $productId
     * @param  int  $quantity
     * @return void
     */
    public function updateItemQuantity(int $productId, int $quantity): void
    {
        $items = $this->items ?? [];

        foreach ($items as &$item) {
            if ($item['product_id'] === $productId) {
                if ($quantity <= 0) {
                    $this->removeItem($productId);
                    return;
                }
                $item['quantity'] = $quantity;
                break;
            }
        }

        $this->items = $items;
        $this->calculateTotals();
        $this->save();
    }

    /**
     * Calculate cart totals.
     *
     * @return void
     */
    protected function calculateTotals(): void
    {
        $subtotal = 0;

        foreach ($this->items ?? [] as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        $this->subtotal = $subtotal;
        $this->tax_amount = 0; // Can be calculated based on tax rules
        $this->total = $subtotal + $this->tax_amount;
    }

    /**
     * Clear the cart.
     *
     * @return void
     */
    public function clear(): void
    {
        $this->items = [];
        $this->subtotal = 0;
        $this->tax_amount = 0;
        $this->total = 0;
        $this->save();
    }
}