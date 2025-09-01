<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * App\Models\Product
 *
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property string|null $short_description
 * @property float $price
 * @property float|null $sale_price
 * @property string $sku
 * @property int $stock_quantity
 * @property bool $manage_stock
 * @property string $stock_status
 * @property float|null $weight
 * @property array|null $dimensions
 * @property array|null $images
 * @property array|null $gallery
 * @property bool $featured
 * @property bool $is_active
 * @property array|null $meta_data
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Category> $categories
 * @property-read int|null $categories_count
 * @property-read float $current_price
 * @property-read bool $is_on_sale
 * @property-read bool $is_in_stock
 * @property-read string|null $main_image
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Product newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product query()
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereDimensions($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereFeatured($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereGallery($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereImages($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereManageStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereMetaData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereSalePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereShortDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereSku($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereStockQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereStockStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereWeight($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product active()
 * @method static \Illuminate\Database\Eloquent\Builder|Product featured()
 * @method static \Illuminate\Database\Eloquent\Builder|Product inStock()
 * @method static \Database\Factories\ProductFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'price',
        'sale_price',
        'sku',
        'stock_quantity',
        'manage_stock',
        'stock_status',
        'weight',
        'dimensions',
        'images',
        'gallery',
        'featured',
        'is_active',
        'meta_data',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'weight' => 'decimal:2',
        'stock_quantity' => 'integer',
        'manage_stock' => 'boolean',
        'featured' => 'boolean',
        'is_active' => 'boolean',
        'dimensions' => 'array',
        'images' => 'array',
        'gallery' => 'array',
        'meta_data' => 'array',
    ];

    /**
     * Get the categories that belong to this product.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }

    /**
     * Get the current price (sale price if available, otherwise regular price).
     */
    protected function currentPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->sale_price ?? $this->price,
        );
    }

    /**
     * Check if the product is on sale.
     */
    protected function isOnSale(): Attribute
    {
        return Attribute::make(
            get: fn () => !is_null($this->sale_price) && $this->sale_price < $this->price,
        );
    }

    /**
     * Check if the product is in stock.
     */
    protected function isInStock(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->stock_status === 'in_stock' && (!$this->manage_stock || $this->stock_quantity > 0),
        );
    }

    /**
     * Get the main image URL.
     */
    protected function mainImage(): Attribute
    {
        return Attribute::make(
            get: fn () => is_array($this->images) && count($this->images) > 0 ? $this->images[0] : null,
        );
    }

    /**
     * Scope a query to only include active products.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include featured products.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    /**
     * Scope a query to only include products in stock.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeInStock($query)
    {
        return $query->where('stock_status', 'in_stock')
                    ->where(function ($q) {
                        $q->where('manage_stock', false)
                          ->orWhere('stock_quantity', '>', 0);
                    });
    }
}