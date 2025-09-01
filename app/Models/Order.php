<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Order
 *
 * @property int $id
 * @property string $order_number
 * @property int|null $user_id
 * @property string $status
 * @property string $payment_status
 * @property string|null $payment_method
 * @property float $subtotal
 * @property float $tax_amount
 * @property float $shipping_amount
 * @property float $total
 * @property string $currency
 * @property float|null $crypto_amount
 * @property string|null $crypto_currency
 * @property float|null $crypto_rate
 * @property array $billing_address
 * @property array $shipping_address
 * @property array $items
 * @property array|null $payment_data
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $shipped_at
 * @property \Illuminate\Support\Carbon|null $delivered_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $user
 * @property-read int $items_count
 * @property-read bool $is_paid
 * @property-read bool $can_be_cancelled
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Order newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Order newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Order query()
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereBillingAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereCryptoAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereCryptoCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereCryptoRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereDeliveredAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereItems($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereOrderNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order wherePaymentData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order wherePaymentStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereShippedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereShippingAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereShippingAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereSubtotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereUserId($value)
 * @method static \Database\Factories\OrderFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'payment_status',
        'payment_method',
        'subtotal',
        'tax_amount',
        'shipping_amount',
        'total',
        'currency',
        'crypto_amount',
        'crypto_currency',
        'crypto_rate',
        'billing_address',
        'shipping_address',
        'items',
        'payment_data',
        'notes',
        'shipped_at',
        'delivered_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'crypto_amount' => 'decimal:8',
        'crypto_rate' => 'decimal:2',
        'billing_address' => 'array',
        'shipping_address' => 'array',
        'items' => 'array',
        'payment_data' => 'array',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    /**
     * Get the user that owns the order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the total number of items in the order.
     *
     * @return int
     */
    public function getItemsCountAttribute(): int
    {
        return array_sum(array_column($this->items ?? [], 'quantity'));
    }

    /**
     * Check if the order is paid.
     *
     * @return bool
     */
    public function getIsPaidAttribute(): bool
    {
        return $this->payment_status === 'paid';
    }

    /**
     * Check if the order can be cancelled.
     *
     * @return bool
     */
    public function getCanBeCancelledAttribute(): bool
    {
        return in_array($this->status, ['pending', 'processing']) && 
               $this->payment_status !== 'paid';
    }

    /**
     * Generate a unique order number.
     *
     * @return string
     */
    public static function generateOrderNumber(): string
    {
        do {
            $orderNumber = 'ORD-' . strtoupper(uniqid());
        } while (self::where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }
}